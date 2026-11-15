-- Repair migration: completes the order lifecycle needed by 004_order_retention.
-- Adds the terminal-status clock trigger, the identifiers-present-until-redacted
-- invariant, and the bounded-cleanup index. Additive and idempotent; deletes no
-- data and rewrites no applied migration. Verified beforehand inside a rolled-back
-- transaction on this project, and on a fresh 001..006 chain under PGlite.

alter table rawaa_store.orders
  add column if not exists closed_at timestamptz;

comment on column rawaa_store.orders.closed_at is
  'Set when an order reaches a terminal status (cancelled/fulfilled); null while open. Retention is measured from here.';

update rawaa_store.orders
set closed_at = now()
where closed_at is null
  and order_status in ('cancelled', 'fulfilled');

create or replace function rawaa_store.set_order_closed_at()
returns trigger
language plpgsql
set search_path to pg_catalog, rawaa_store
as $function$
begin
  if new.order_status in ('cancelled', 'fulfilled') then
    if tg_op = 'INSERT' or old.order_status is distinct from new.order_status then
      new.closed_at := now();
    end if;
  else
    new.closed_at := null;
  end if;
  return new;
end;
$function$;

drop trigger if exists orders_set_closed_at on rawaa_store.orders;
create trigger orders_set_closed_at
before insert or update of order_status on rawaa_store.orders
for each row execute function rawaa_store.set_order_closed_at();

revoke all on function rawaa_store.set_order_closed_at() from public, anon, authenticated;

alter table rawaa_store.orders
  alter column request_hash drop not null,
  alter column idempotency_key drop not null;

do $do$
begin
  if not exists (
    select 1 from pg_constraint
    where conrelid = 'rawaa_store.orders'::regclass
      and conname = 'orders_identifiers_present_until_redacted'
  ) then
    alter table rawaa_store.orders
      add constraint orders_identifiers_present_until_redacted
      check (
        (request_hash is not null and idempotency_key is not null)
        or (closed_at is not null and not (details ?| array['name', 'phone', 'address']))
      );
  end if;
end;
$do$;

create index if not exists orders_closed_at_idx
  on rawaa_store.orders (closed_at, id)
  where closed_at is not null;
