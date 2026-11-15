# Archived branch recovery index

The branch hygiene workflow preserves reviewed inactive branch tips as annotated Git tags before removing their branch refs.

## Tag format

`archive/branches/YYYY-MM-DD/<original-branch-name>`

Each tag points to the exact commit SHA recorded in `scripts/branch-archive-policy.cjs`. The workflow verifies that the tag resolves to the expected commit and re-reads the live branch head immediately before deleting the branch ref.

## Restore a branch

```bash
git fetch origin --tags
git switch -c <original-branch-name> <archive-tag>
git push -u origin <original-branch-name>
```

To inspect available archives:

```bash
git tag --list 'archive/branches/*'
```

Do not delete archive tags as part of routine branch cleanup. They preserve the original commits, including work from closed-unmerged PRs. The workflow run summary is the authoritative record of which refs were archived and which refs were retained.

## First archive run

**Status:** Pending

The initial reviewed archive batch is pinned to 29 explicit branch-head SHAs. Branches with open PRs, protected namespaces, changed heads, or missing tags are retained. Append the successful workflow run URL and exact archived tag list here after the first run; never mark a branch archived based on the workflow definition alone.
