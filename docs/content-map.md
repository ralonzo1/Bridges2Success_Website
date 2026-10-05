# Website content map

Paths are relative to this repository.

| Page / route | Edit |
| --- | --- |
| Home `/` | `frontend/src/pages/Home.js` |
| Locations `/location` | `frontend/src/pages/Location.js` |
| Fees `/fees` | `frontend/src/pages/Fees.js` |
| Survivor information `/survivors` | `frontend/src/pages/Survivors.js` |
| Contact `/contact` | `frontend/src/pages/Contact.js` |
| Grievance `/grievance` | `frontend/src/pages/Grievance.js` |
| Attendance `/attendance` | `frontend/src/pages/Attendance.js` |
| Registration `/registration` | `frontend/src/pages/Registration.js` |
| Program portal `/portal` | `frontend/src/pages/portal.js` |
| Videos `/videos` | `frontend/src/pages/videos.js` (titles/thumbs come from Vimeo) |
| Navigation | `frontend/src/layout/Header.js` (mobile and desktop markup) |
| Footer | `frontend/src/layout/Footer.js` |
| Global styles | `frontend/src/index.css`, `frontend/tailwind.config.js` |
| Images | `frontend/public/images/` |

Page files also contain local styling. Wording changes require a frontend build and
publication through the verified release process. Preserve input `name` attributes
and option values when editing labels; those are API contracts.

Active registration mail reads `tblWebsiteSettings.ClientEmail` and `SubjectLine`
through `backend/app/Http/Controllers/UploadClientController.php`. The settings editor
is not supplied here. The old registration Blade template is not the active path.
Contact mail bodies are under `backend/resources/views/emails/`.

Registration field changes cross `frontend/src/pages/Registration.js`,
`backend/app/Http/Requests/StoreUploadClient.php`, the upload controller, and
`backend/app/Models/UploadClient.php`. CPO schema changes require separate coordination.
