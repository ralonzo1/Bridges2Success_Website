# Post-consolidation security review

This structural migration deliberately preserves application behavior. Findings below
were present before consolidation and remain unresolved. No production penetration
test or database login was performed. Runtime findings need isolated integration tests.

| Finding | Source | Status |
| --- | --- | --- |
| Development DB credentials tracked in Compose/history; sa login and published SQL port | backend/docker-compose.yml | Existing; user believes temporary dev use; current validity/reuse unknown |
| Portal/video content controlled by browser sessionStorage, not server authorization | frontend/src/pages/portal.js, videos.js; backend/routes/api.php | Existing |
| Full registration fields logged and included in failure emails | backend/app/Http/Controllers/UploadClientController.php | Existing |
| Non-OK registration response displays receipt-like text | frontend/src/pages/Registration.js | Existing |
| DB insert precedes mail; retries can duplicate absent external constraints | backend upload controller | Existing; DB schema constraints unknown |
| v2 CAPTCHA checked only in browser; stale v3 state submitted; backend only tests success | frontend form pages; backend VerifyRecaptcha | Existing |
| note is persisted but additionalNotes is the validated name; missing length/enum rules | backend StoreUploadClient and upload controller | Existing |
| Timestamp upload names, unchecked storage result, no explicit application file-size limit | backend upload controller/request | Existing |
| Unescaped values substituted into registration/admin HTML mail | backend upload controller and RegistrationFromSettingsEmail | Existing |
| Direct env calls outside config; literal portal/video password defaults | backend controllers, routes, middleware | Existing; deployment cache behavior unknown |
| Compiled frontend differs from source; source maps and old bundles under public | backend/public | Existing |

Migration-specific checks: exact tree preservation prevents accidental edits to CORS,
CSRF, rate limits, validation, secrets, routes, DB mapping, filesystem settings and web
server rules. Root tooling does not create deployment jobs, start Compose, send mail,
or publish files. A production security review must still confirm document root,
permissions, backend environment, network exposure, and repository access.

No credential values are recorded in this document. Backups contain original history
and must retain appropriate private access. Do not remove historical credentials by
rewriting original remotes as part of this consolidation.
