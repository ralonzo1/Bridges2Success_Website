# Bridges 2 Success Public Portal

One product repository containing the existing React website and Laravel backend.
Both applications and their original Git histories are preserved without a framework,
API, credential, database, or deployment change.

| Directory | Purpose | Commands from that directory |
| --- | --- | --- |
| `frontend/` | React website, registration, portal and videos | `npm ci`, `npm run build`, `npm test -- --watchAll=false --runInBand` |
| `backend/` | Laravel API, validation, database mapping, mail | Composer/PHP commands after recovering the deployed dependency lock and configuring an isolated environment |
| `docs/` | Provenance, content map, release notes and validation | Read before configuring a deployment |
| `scripts/` | Repository-preservation verification | `pwsh -File scripts/verify-consolidation.ps1` |

## Status

This is a **local consolidation**, not a production cutover. No remote is configured.
The original repositories are unchanged. Read [validation](docs/validation.md) for
completed checks and remaining release gates.

## Find and change website content

See [the content map](docs/content-map.md). Most wording is in `frontend/src/pages/`.
Active registration email wording is in database settings, not the legacy Blade template.

## Build and deployment boundaries

Run existing commands from their application directories. There is deliberately no
root command that automatically starts databases, sends mail, or publishes assets.
Frontend `npm run build` produces `frontend/build/`. The backend Vite command builds
its own scaffold assets, not the React website.

The imported `backend/public` contains the original compiled React artifact, which
differs from current frontend source. It has been retained exactly. Do not assume
that artifact or local frontend HEAD is the production baseline. See
[deployment and rollback](docs/deployment.md).

The tracked frontend `.env` contains a non-loopback API target. Use explicit local
environment overrides and mocked APIs for isolated tests. Existing development
database credentials in Compose are preserved for this structural migration; their
active use is unverified. Do not publish this repository or its history as public.

## History and backups

[provenance.json](docs/provenance.json) records original HEADs, tree IDs, all locally
available refs, and backup hashes. Non-squashed two-parent import commits keep both
original histories reachable. Additional refs are retained under
`refs/archive/frontend/*` and `refs/archive/backend/*`; frontend's alternate develop
history is preserved there even where it is not an ancestor of the imported main tip.

The sibling `repository-backups/` directory contains verified full local-history
bundles. These preserve the refs available on this machine; no remote fetch was
performed. Do not delete original checkouts until a separately approved cutover and
retention decision.

For full historical browsing, use `git log --all --graph --oneline`. Original commits
retain original paths and IDs; path-filtered history under the new directory prefixes
does not by itself show every pre-import change. Standard `git push` does not publish
custom archive refs; migration of those refs must be planned explicitly.
