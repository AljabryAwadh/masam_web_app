# MASAM Web App - DWS Form

## Project Snapshot

Last updated: 2026-06-11

- Workspace: `D:\Masam files\Masam_Ops_Room_PC\google sheets project\DWS_Form`
- Project memory folder: `D:\Awadh_AI_Vault\01_Projects`
- App type: Google Apps Script web app with HTML frontend forms.
- Local simulator: Node local server via `npm run dev`.
- Deployment tool: `clasp`.
- Current GitHub commit: `b6ce82c Allow public anonymous web app access`
- Current GAS deployment: `@28 - Masam v10 current app deployment`
- Current GAS URL: `https://script.google.com/macros/s/AKfycbzzs3-h6j0zA7YBrhnroj7wqzcwu53pXv4YTWc8MvgkdmDJAW169r2Z2lho_bDlGAqV1A/exec`

## Active Forms

- Dashboard / Index: `Index.html`
- DWS form: `DWS.html`
- OHC form: `OHC.html`
- TJET Registry form: `TJET_Registry.html`
- TJET Receipt & Expenditure form: `TJET_Receipt_and_Expenditure.html`

## Important Source Files

- Backend Apps Script: `Code.gs`
- Local simulator backend: `mock.js`
- Shared layout/scripts/styles: `SharedHeader.html`, `SharedScripts.html`, `SharedStyles.html`
- Local server: `local-server.js`
- Existing in-repo plan: `TODO_PLAN.md`
- Apps Script manifest: `appsscript.json`

## Current Working Tree State

As of 2026-06-11:

- Tracked source files are clean and pushed to GitHub.
- Untracked local artifacts remain: `files/`, `project/`, and `sheets`.
- These untracked artifacts appear accidental/empty and were intentionally not committed.

## Current Deployment State

Current deployment:

- Deployment ID: `AKfycbzzs3-h6j0zA7YBrhnroj7wqzcwu53pXv4YTWc8MvgkdmDJAW169r2Z2lho_bDlGAqV1A`
- Version: `@28`
- Description: `Masam v10 current app deployment`
- Base URL: `https://script.google.com/macros/s/AKfycbzzs3-h6j0zA7YBrhnroj7wqzcwu53pXv4YTWc8MvgkdmDJAW169r2Z2lho_bDlGAqV1A/exec`

Verified pages:

- Index: `200 OK`, title `EOD System - Index`
- DWS: `200 OK`, title `EOD System - DWS`
- TJET Receipt & Expenditure: `200 OK`, title `EOD System - TJET Receipt and Expenditure`

Important: `appsscript.json` uses `ANYONE_ANONYMOUS`. Earlier deployment access using `ANYONE` caused Google sign-in pages.

## Current Implementation Progress

- Sequential team-based document references are implemented.
- PDF generation exists for DWS, OHC, TJET Registry, and TJET Receipt & Expenditure.
- DWS image upload uses the confirmed `ERW Images` Drive folder.
- DWS CRUD has a first implementation: load by `Doc_Ref_#`, update related rows, and soft-delete matching response rows.
- Local simulator mock supports DWS read, update, delete, validation list loading, and TJET stock functions.
- Live spreadsheet `DWS_Form` has a `Validation_Lists` tab.
- Initial validation values were imported from `Ref_1` for `TEAM_NO`, `EO_TYPE`, and `TASK_TYPE`.
- Backend has `getValidationLists(requestedKeys)`.
- DWS response sheet lookup supports live prefixed tab names such as `DWS_Form_...`.
- DWS append order was corrected so `Doc_Ref_#` and `Timestamp` align with sheet headers.
- DWS metadata fields were added for PDF URL, Drive folder URL, submission status, submitted by, created timestamp, and updated timestamp.
- MASAM visual identity and shared styling were improved.
- OHC and TJET Registry dynamic rows were made more responsive.
- TJET Receipt & Expenditure now reads item codes from `TJET_Item_Master` and writes movements to `TJET_Stock_Ledger`.

## Confirmed Drive Folders

| Purpose | Folder Name | Folder ID |
|---|---|---|
| DWS ERW image uploads | `ERW Images` | `1Je0rFpd7ypHmEMnn9BKwfTuZ8_Hd3zfo` |
| OHC image uploads | `OHC Images` | `112GYzGGR6oBnR7uKio6yQxlTWusIDg9R` |
| TJET Registry image uploads | `TJET Images` | `1woRKulJQ8JUdZjzOOuOV0wr_2XrjqWyF` |
| DWS PDFs | `DWS PDF Forms` | `1muEnkn0yBbR-rbPPjQfXGiaQBV6peMBZ` |
| OHC PDFs | `OHC PDF Forms` | `1UfNMCHK6CyxHd0ldRtVSS3agwcdPgEAC` |
| TJET Registry PDFs | `TJET Registry PDF Forms` | `1SKzQ89MY2CL7HgkuENkN7-jk2G_Unxr0` |
| TJET Receipt & Expenditure PDFs | `TJET Receipt and Expenditure PDF Forms` | `1daR-L_mVPvxSlvyUHcYkGVOgpP54UPvg` |

## Next Highest Priority

1. Test deployed DWS create/read/update/delete end-to-end.
2. Replace starter `TJET_Item_Master` rows with official MASAM item codes and names.
3. Test TJET stock ledger cards against the live spreadsheet.
4. Wire DWS HTML dropdowns to `Validation_Lists`.
5. Add backend validation against `Validation_Lists`.
6. Extend CRUD behavior to OHC, TJET Registry, and TJET Receipt & Expenditure.
7. Add image upload for OHC and TJET Registry.

## Useful Commands

```powershell
npm run dev
clasp.cmd push --force
clasp.cmd deploy -d "Deployment description"
clasp.cmd deployments
git status
git diff --stat
git add .
git commit -m "Describe change"
git push
```

## Documentation Rule

When work changes the project state, update:

- [[MASAM Web App - Master TODO]] for task status.
- [[MASAM Web App - Decisions]] for important choices.
- [[MASAM Web App - DWS Form]] for implementation/deployment state.
## Roadmap Notes Added 2026-06-11

The project roadmap now includes the following planned future work. These are documentation/planning items only until Awadh reviews and approves implementation order.

- Data and permissions foundation using Google Sheets-backed allowlist, roles, and per-form action permissions.
- MASAM logo support for the web app header and generated PDF headers after Awadh provides the official logo.
- PDF headers for every form with logo, title, document reference, generated date/time, and team number where applicable.
- Task metadata and event summary fields: task start date, task number, task end date, task status, and task/event summary reference.
- Explosive ordnance catalog with category/type dropdowns and Drive image lookup.
- Standalone Unknown Explosive Ordnance Registry form after Awadh provides field headings.
- Downloadable Windows and Android web-wrapper app plan, with no offline sync in v1.
- Make.com automation plan to sync local/Excel task and validation data into Google Sheets.

Awadh-owned prerequisites are tracked in [[MASAM Web App - Master TODO]] under `Awadh / User Action Required`.

## Live Sheet Header Reference

Live response sheet headers are documented in [[MASAM Web App - Live Sheet Headers]].

