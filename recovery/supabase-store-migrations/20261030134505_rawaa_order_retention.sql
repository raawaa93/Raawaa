-- Owner-selected operational retention: redact contact fields 365 days after an order is fulfilled or cancelled.
-- Keep order reference, lifecycle, product/price snapshot, and outbox for audit/recovery.
alter table rawaa_store.orders
  add column closed_at timestamptz,
  alter column idempotency_key drop not null,
  alter column request_hash drop not null;

create function rawaa_store.track_order_closure()
returns trigger
language plpgsql
set search_path = pg_catalog, rawaa_store
as $$
begin
  if new.order_status in ('cancelled', 'fulfilled') then
    if tg_op = 'INSERT' then
      new.closed_at := coalesce(new.closed_at, now());
    elsif old.order_status is distinct from new.order_status then
      new.closed_at := now();
    else
      new.closed_at := coalesce(new.closed_at, old.closed_at, now());
    end if;
  else
    new.closed_at := null;
  end if;
  return new;
end;
$$;

create trigger orders_track_closure
before insert or update of order_status on rawaa_store.orders
for each row execute function rawaa_store.track_order_closure();

create function rawaa_store.redact_expired_order_contacts(batch_limit integer default 100)
returns integer
language plpgsql
security invoker
set search_path = pg_catalog, rawaa_store
as $$
declare
  redacted integer;
begin
  if batch_limit is null or batch_limit < 1 or batch_limit > 500 then
    raise exception 'INVALID_BATCH_LIMIT';
  end if;

  with expired as (
    select id
    from rawaa_store.orders
    where closed_at < now() - interval '365 days'
      and (details ?| array['name', 'phone', 'address'] or request_hash is not null or idempotency_key is not null)
    order by closed_at, id
    limit batch_limit
    for update skip locked
  )
  update rawaa_store.orders as orders
  set details = orders.details - array['name', 'phone', 'address'],
      request_hash = null,
      idempotency_key = null
  from expired
  where orders.id = expired.id;

  get diagnostics redacted = row_count;
  return redacted;
end;
$$;

revoke all on function rawaa_store.track_order_closure() from public, anon, authenticated;
revoke all on function rawaa_store.redact_expired_order_contacts(integer) from public, anon, authenticated;
grant execute on function rawaa_store.track_order_closure() to service_role;
grant execute on function rawaa_store.redact_expired_order_contacts(integer) to service_role;
create index orders_retention_idx on rawaa_store.orders (closed_at, id)
  where closed_at is not null;
