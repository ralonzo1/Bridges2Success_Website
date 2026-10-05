# Deployment and rollback

## Current consolidation

Only root documentation and verification tooling are new. Imported application Git
trees must exactly match the source trees in provenance.json. No application file,
environment value, compiled production artifact, API contract, framework version,
web-server setting, database, or credential was changed.

Existing commands now run from `frontend/` and `backend/` respectively. No CI/CD
workflow was supplied by either original repository, so no external pipeline could
be safely updated or verified. Frontend and backend may continue to build and deploy
independently. A repository move is not an application or hosting merge.

## Before a production cutover

1. Identify the actual production frontend asset hashes, backend revision, web root,
   dependency versions, and release operator/pipeline.
2. Resolve the mismatch between frontend source and checked-in backend public assets.
   Do not automatically replace `backend/public` as part of a directory migration.
3. Recover the deployed backend composer.lock (absent here). Do not use Composer
   update to guess production versions during consolidation.
4. Configure an isolated test database, mail capture, private photo directory, and
   nonproduction CAPTCHA values. Do not reuse live CPO credentials.
5. Verify registration validation, photo writes, field mapping, duplicate handling,
   persistence followed by email failure, contact mail and error responses against
   that environment. Browser mocks alone cannot verify backend integration.
6. Map any external build jobs to frontend/backend working directories. Keep existing
   web root, domains, permissions, environment and artifact assembly behavior until
   independently validated.
7. Retain a restorable release artifact and deployment configuration, then obtain
   an explicit production publication instruction.

## Hosting notes

The imported IIS `backend/public/web.config` routes `/api/*` to Laravel and page paths
to the React index. The Apache scaffold and Docker artisan server are not equivalent
deep-link configurations. Backend Vite is not the frontend React build. The frontend
build output must never cause the repository root or backend source to become a
public document root.

The Docker configuration contains development credentials and publishes SQL Server
port 1433. It has not been started. User indicates the credentials may be temporary;
active use and reuse remain unverified. Existing env() calls outside config can be
sensitive to Laravel config caching. Do not add caching or rotate credentials as an
unreviewed side effect of moving directories.

## Rollback / recovery

There has been no production cutover, so rollback currently means continuing to use
the untouched original repositories. No remote or webhook points to this new repo.
Verified bundles in the sibling repository-backups directory can restore original
commit objects and refs into a new repository. The manifest records SHA-256 hashes.
Preserve all original branches/tags/archive refs if publishing a combined repository;
standard push of main does not copy custom refs/archive references.
