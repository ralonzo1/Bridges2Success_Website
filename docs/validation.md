# Consolidation validation

Completed 2026-10-05. **Local consolidation verified; production cutover not approved.**

## Results

| Check | Result |
| --- | --- |
| Source backups | Two full local-ref bundles verified by Git and SHA-256 |
| History | Original HEADs are ancestors; all 8 original local/remote-tracking refs preserved under refs/archive |
| Frontend history coverage | 33 commits reachable across all original refs (31 on imported master, 2 additional commits retained via archive refs) |
| Backend history coverage | 35 commits reachable across all original refs |
| Imported source | frontend/ and backend/ Git tree IDs exactly equal their original repository trees |
| Original repositories | HEADs, refs, remotes and clean working trees unchanged |
| Git object integrity | git fsck --full passes |
| Frontend dependency installation | npm ci from the existing package-lock, lifecycle scripts disabled; lock and manifest unchanged |
| Original-source frontend build | PASS, from an isolated git-archive copy |
| Consolidated frontend build | PASS, with existing lint/accessibility/dependency warnings |
| Build content comparison | 438 embedded main-bundle source entries on each side; 437 match after path and line-ending normalization; only generated webpack chunk-filename runtime differs |
| New isolated regression suite, original source | 21/21 PASS |
| New isolated regression suite, consolidated source | 21/21 PASS |
| Inherited frontend App.test.js | FAIL on both original archive and consolidated copy before assertion: Worker is not defined in heic2any; canvas API also unsupported by its default JSDOM setup |
| Backend PHP syntax | 63/63 files pass with portable PHP 8.1.34 |
| PHP diagnostic | Existing optional-before-required parameter deprecation in RegistrationFromSettingsEmail constructor |
| Actual Chromium browser run | BLOCKED: OS isolation denied Chrome process/IPC startup; no full browser results claimed |
| Backend dependency/runtime suite | NOT RUN: no composer.lock/vendor or configured isolated CPO environment supplied |
| Production DB/mail/photos/CAPTCHA | NOT CONTACTED; integration remains unverified |

## Regression coverage and limits

The new suite is separate from application directories so both imported trees remain
unchanged. It tests all ten App routes, missing required registration fields, successful
multipart field construction and date formatting, HTTP 403/422/429/500 behavior,
network-failure display, contact submission, portal password-response behavior, and
the existing browser-state portal/video gate. Requests are mocks; no CPO, mail,
CAPTCHA or Vimeo requests are sent.

The suite uses React Testing Library/JSDOM. HEIC conversion and CAPTCHA widgets are
mocked, and Header/Footer are stubbed to isolate page behavior. It does **not** verify
actual browser rendering, menu interactions, image crop/HEIC conversion, server-side
validation, photo persistence, database mapping execution, email delivery, idempotency,
or production hosting. These remain explicit release gates.

Some passing tests intentionally characterize existing defects: reassuring text on
failed registration responses and client-only portal/video access. A passing
characterization test does not mean those behaviors are secure or desirable.

The builds each emit 24 files. Their full file bytes are not identical: the original
archive shares the installed dependency directory through a local junction, so Webpack
assigns different module/chunk identities and source-map paths. Normalized embedded
application/dependency source content matches; the differing generated runtime contains
the different lazy chunk filename. CSS payload is unchanged. Do not equate the test
builds to deployed production artifacts: both use explicit localhost API/test CAPTCHA
settings and are stored outside the repository's backend public directory.

Node 24.19.0 and npm 10.9.4 were used for this local verification. Production Node
version is unknown. A portable PHP 8.1.34 executable was used only for syntax checks;
it was not installed globally and is not evidence of production's PHP version.

## Run the checks again

From the repository root in PowerShell, with frontend dependencies installed:

```powershell
./scripts/verify-consolidation.ps1 -CheckOriginals -CheckBackups
$env:NODE_ENV = 'test'
$env:BABEL_ENV = 'test'
node frontend/node_modules/jest/bin/jest.js --config scripts/jest.config.cjs --runInBand
```

The optional BASELINE_FRONTEND environment variable points the same suite at an
isolated original-source copy. Omit it for normal consolidated-source testing.
CheckOriginals and CheckBackups use machine-specific paths in provenance.json; omit
those switches when working on another machine. The source-tree verifier is intended
for this consolidation baseline and will intentionally reject later application edits.

To build an isolated frontend test artifact, run from frontend/ after setting
REACT_APP_API_URL to an isolated local endpoint, REACT_APP_API_PREFIX to api, and
both CAPTCHA site key variables to test values. Use BUILD_PATH for a scratch output
location. Do not copy that test artifact into backend/public or production.

## Security disposition

See security-review.md. Imported security-sensitive files are unchanged at the Git
object level. No new credential, network listener, production endpoint, deployment
job, remote, or service permission was added. Committed development credentials and
other existing findings are retained and documented, not resolved by moving folders.

The remaining release gates are the production/source baseline mismatch, the missing
backend dependency lock and isolated integration environment, inherited test failure,
actual browser verification, and explicit production cutover authorization.
