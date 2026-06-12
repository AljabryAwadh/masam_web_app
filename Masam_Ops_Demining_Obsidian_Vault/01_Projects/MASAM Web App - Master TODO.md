# MASAM Web App - Master TODO

## Current Project State

Last updated: 2026-06-11

Project memory folder: `D:\Awadh_AI_Vault\01_Projects`
Code workspace: `D:\Masam files\Masam_Ops_Room_PC\google sheets project\DWS_Form`
GitHub repository: `https://github.com/AljabryAwadh/masam_web_app.git`
Current branch: `master`
Latest pushed commit: `67588a8 Add TJET stock ledger form`
Current GAS deployment: `@30 - Masam v12 TJET stock ledger form`
Current web app URL: `https://script.google.com/macros/s/AKfycby9QGFSEuwrAAIR4UdFuOn1C6Fc1Wrmfxnb0-BjyW5H_Nj6MZNkq9smHILMY3HuCAhMCA/exec`

Important access decision: use `/exec` versioned deployment URLs. Do not use the `@HEAD` / test deployment URL for public users because it is read-only and has shown Google sign-in or unavailable-file behavior.

## Completed So Far

- [x] Established `D:\Awadh_AI_Vault\01_Projects` as the project memory folder for MASAM web app notes.
- [x] Confirmed the local Apps Script project workspace.
- [x] Added local simulator support through `local-server.js` and `mock.js`.
- [x] Standardized local routes for `Index`, `DWS`, `OHC`, `TJET_Registry`, and `TJET_Receipt_and_Expenditure`.
- [x] Implemented sequential team-based document references.
- [x] Scoped document numbering by form type and team number.
- [x] Added `LockService` around document reference generation.
- [x] Implemented PDF generation for DWS, OHC, TJET Registry, and TJET Receipt & Expenditure.
- [x] Saved generated PDFs to configured Drive folders.
- [x] Passed generated PDF links to success modals.
- [x] Confirmed Drive folder IDs for DWS images, OHC images, TJET images, and form PDFs.
- [x] Implemented first DWS CRUD workflow.
- [x] DWS can load a submission by `Doc_Ref_#`.
- [x] DWS can update loaded task, work summary, and ERW find rows.
- [x] DWS can soft-delete matching response rows by marking them deleted.
- [x] Updated local simulator mock for DWS read/update/delete.
- [x] Confirmed live spreadsheet `DWS_Form`.
- [x] Confirmed live DWS response tabs use `DWS_Form_...` names.
- [x] Updated backend sheet lookup to support live prefixed DWS response tabs.
- [x] Corrected DWS append order so `Doc_Ref_#` and `Timestamp` align with sheet headers.
- [x] Added DWS metadata fields: PDF URL, Drive folder URL, submission status, submitted by, created timestamp, updated timestamp.
- [x] Updated live DWS response headers for the new metadata fields.
- [x] Created live `Validation_Lists` tab in `DWS_Form`.
- [x] Imported initial `TEAM_NO`, `EO_TYPE`, and `TASK_TYPE` values from `Ref_1`.
- [x] Added backend `getValidationLists(requestedKeys)`.
- [x] Added local simulator mock support for validation lists.
- [x] Added TJET inventory tabs: `TJET_Item_Master` and `TJET_Stock_Ledger`.
- [x] Added backend auto-create/repair for TJET inventory tabs.
- [x] Added TJET item-code dropdown loading from `TJET_Item_Master`.
- [x] Updated TJET Receipt & Expenditure submissions to append stock ledger movements.
- [x] Added TJET stock cards and movement summary table from `TJET_Stock_Ledger`.
- [x] Added one-time legacy receipt row backfill into the TJET stock ledger.
- [x] Improved MASAM branding and shared page styling.
- [x] Improved responsive dynamic row layout for OHC and TJET Registry.
- [x] Updated `appsscript.json` to `ANYONE_ANONYMOUS` public access.
- [x] Committed and pushed main app work to GitHub: `65de138 Add DWS CRUD updates and TJET stock ledger`.
- [x] Committed and pushed public access fix to GitHub: `b6ce82c Allow public anonymous web app access`.
- [x] Pushed current source to Google Apps Script.
- [x] Deployed current app to GAS as `@28 - Masam v10 current app deployment`.
- [x] Verified Index, DWS, and TJET Receipt & Expenditure pages return `200 OK` and actual MASAM markup on deployment `@28`.
- [x] Created standalone TJET Stock Ledger page at `?page=TJET_Stock_Ledger`.
- [x] Added manual stock movement workflow for purchased, received, issued-to-team, expended, returned, positive adjustment, negative adjustment, damaged, and lost movements.
- [x] Wired TJET Stock Ledger into Apps Script routing, local simulator routing, dashboard/shared navigation, and `.claspignore`.
- [x] Added local simulator mock support for manual TJET stock ledger movements.
- [x] Committed and pushed TJET Stock Ledger form to GitHub: `67588a8 Add TJET stock ledger form`.
- [x] Pushed source to Google Apps Script and deployed as `@30 - Masam v12 TJET stock ledger form`.
- [x] Verified deployed TJET Stock Ledger page returns `200 OK`, includes `TJET Stock Ledger`, includes `tjetStockLedgerForm`, and does not show the Google unavailable-file error.

## Awadh / User Action Required

These are tasks that require Awadh to provide assets, decisions, data, or real-world validation before implementation can be completed.

- [ ] Provide official MASAM logo file for web app and PDFs.
- [ ] Provide official TJET item codes/names for `TJET_Item_Master`.
- [ ] Prepare Google Drive folder for explosive ordnance images.
- [ ] Correctly name and upload EO images to the Drive folder.
- [ ] Prepare or confirm Google Sheets tab for explosive ordnance catalog.
- [ ] Provide EO catalog columns, categories, and image filename/link rules.
- [ ] Provide unknown explosive ordnance registry field headings.
- [ ] Provide role/permission names and who should have which role.
- [ ] Provide initial email allowlist with name, email, role, and permissions.
- [ ] Confirm whether TJET Receipt & Expenditure needs image upload.
- [ ] Provide Excel folder/file details for future Make.com automation.
- [ ] Test deployed DWS create/read/update/delete with real submissions.
- [ ] Review generated PDFs for logo/header/title layout approval.

## Current Known Loose Ends

- [ ] Untracked local artifacts remain in the repo folder: `files/`, `project/`, and `sheets`. They appear accidental/empty and were not committed.
- [ ] The `@HEAD` Apps Script deployment is read-only and should not be used as the public app link.
- [ ] Deployed app pages load, but full create/read/update/delete workflow testing still needs to be performed with real submissions.

## Priority Order For Next Work

1. Data and permissions foundation.
2. Test deployed DWS create/read/update/delete end-to-end using the current `/exec` deployment.
3. Replace starter `TJET_Item_Master` rows with official MASAM item codes and names.
4. Test TJET stock ledger cards and manual stock movement entries against the live spreadsheet with real data.
5. Add MASAM logo to the web app and generated PDFs after logo is provided.
6. Add task metadata and event summary integration.
7. Add explosive ordnance catalog and image lookup from Google Sheets/Drive.
8. Add standalone Unknown Explosive Ordnance Registry.
9. Wire DWS HTML dropdowns to `Validation_Lists`.
10. Add backend validation against `Validation_Lists`.
11. Extend CRUD behavior to OHC, TJET Registry, and TJET Receipt & Expenditure.
12. Add image upload support for OHC.
13. Add image upload support for TJET Registry.
14. Decide whether TJET Receipt & Expenditure needs image upload.
15. Improve mobile/tablet/desktop responsiveness across every form.
16. Extend local simulator mocks for dropdowns, image upload, PDF success responses, and error simulation.
17. Replace flat Drive folder behavior with structured response folders.
18. Plan downloadable Windows and Android web-wrapper apps.
19. Plan Make.com automation from Excel/local files to Google Sheets.
20. Final end-to-end deployment testing across all forms.

## Future Feature Roadmap

### Phase 1: Data And Permissions Foundation

- [x] Add Google Sheets-backed permission tables: `Users_Allowlist`, `Roles`, `Role_Permissions`, and optional `Permission_Audit_Log`.
- [x] Identify each user by email.
- [x] Assign each user a role.
- [x] Check permissions per form/action: `view`, `submit`, `edit`, `delete`, `admin`.
- [x] Add backend helpers for current user email, user profile lookup, permission checks, and access-denied messages.
- [x] Document that public deployment can load, but form actions are controlled by the sheet allowlist.

### Phase 2: Logo And PDF Headers

- [ ] Add MASAM logo to the web app header after Awadh provides the logo file or Drive-hosted image.
- [ ] Add consistent PDF headers containing MASAM logo, form title, document reference number, generated date/time, and team number where applicable.
- [ ] Apply PDF header update to DWS, OHC, TJET Registry, TJET Receipt & Expenditure, and future Unknown EO Registry.

### Phase 3: Task Metadata And Event Summary

- [ ] Add task start date, task number, task end date, task status, and task/event summary reference fields.
- [ ] Use Google Sheets task/validation tabs as the runtime source of truth.
- [ ] Later sync task metadata from Excel via Make.com.
- [ ] Auto-fill task details in forms when task number is selected.
- [ ] Derive task status from event/task summary rules after Awadh confirms source columns.

### Phase 4: Explosive Ordnance Catalog

- [ ] Create or confirm Google Sheets EO catalog tab.
- [ ] Store EO category, EO type/name, description, image filename or Drive URL, and active/inactive status.
- [ ] Add EO category/type selection to DWS ERW, OHC, TJET Registry, and Unknown EO Registry.
- [ ] Show or link EO image in forms when available.
- [ ] Save EO category/type/image reference into response sheets.

### Phase 5: Unknown EO Registry

- [ ] Add standalone Unknown Explosive Ordnance Registry page.
- [ ] Add dedicated response sheet.
- [ ] Add PDF generation.
- [ ] Add image upload support.
- [ ] Add workflow status fields for review/classification.
- [ ] Wait for Awadh to provide exact field headings before implementation.

### Phase 6: Downloadable App

- [ ] Plan Windows web-wrapper app that opens the GAS web app.
- [ ] Plan Android APK web-wrapper app that opens the same GAS web app.
- [ ] Keep Google Sheets and GAS as the single backend.
- [ ] Do not plan offline sync for v1.
- [ ] Evaluate PWA/native wrapper tooling after permissions and validation are stable.

### Phase 7: Make.com Automation

- [ ] Plan Make.com automation from local/Excel data into Google Sheets.
- [ ] Initial synced targets: task start date, task number, task name, task end date, team assigned, task status, and validation lists.
- [ ] Awadh must provide Excel folder path, file names, sheet names, and column headings before implementation.
- [ ] Add safety rule that Google Sheets remains the web app runtime source of truth.


### 2026-06-11 Implementation Progress - Permissions Foundation

- [x] Added backend constants and headers for `Users_Allowlist`, `Roles`, `Role_Permissions`, and `Permission_Audit_Log`.
- [x] Added default roles: `Admin`, `Supervisor`, `DataEntry`, and `Viewer`.
- [x] Added default per-form permissions for `ALL`, DWS, OHC, TJET Registry, TJET Receipt & Expenditure, and future Unknown EO Registry.
- [x] Added bootstrap mode: if `Users_Allowlist` has no active users, backend actions remain allowed so the app is not locked before setup.
- [x] Added enforcement on validation list lookup, DWS read/submit/edit/delete, OHC submit, TJET Registry submit, TJET Receipt & Expenditure submit, TJET item master lookup, and TJET stock stats lookup.
- [x] Added local simulator mock support for current user profile.

### 2026-06-11 Implementation Progress - TJET Stock Ledger Form

- [x] Added standalone `TJET_Stock_Ledger.html` page.
- [x] Added route support for `?page=TJET_Stock_Ledger` in GAS and local simulator.
- [x] Added shared navigation link: `Stock Ledger`.
- [x] Added backend `processTjetStockLedgerMovement(formData)` to append manual movements into `TJET_Stock_Ledger`.
- [x] Added `TJET_Stock_Ledger` to role permission defaults.
- [x] Manual movement submit currently requires `admin` permission when the allowlist is active.
- [x] Added deployed smoke test result: `200 OK`, title `EOD System - TJET Stock Ledger`, form present, unavailable-file error absent.
- [ ] Test live manual stock movement submission with official item master data and confirm ledger totals in Google Sheets.

## Detailed Remaining Tasks

### Core Web App Stability

- [x] Confirm the deployed Apps Script web app serves the latest pushed code at deployment `@28`.
- [x] Standardize routing for all known pages through `doGet(e)`.
- [x] Keep local simulator routing aligned with Apps Script routes.
- [ ] Add clearer user-facing error messages when a page, sheet, folder, or server function is missing.
- [ ] Add CRUD behavior across all forms, not only DWS.

### Google Sheets Response Structure

- [ ] Finalize all required response sheets and headers for every form.
- [ ] Confirm live sheet column alignment after deployment with real submissions.
- [x] Add DWS metadata fields for PDF URL, Drive folder URL, status, submitted by, created timestamp, and updated timestamp.
- [x] Support live prefixed DWS response tab names.

### Document Reference Numbering

- [x] Replace timestamp-only references with sequential team-based references.
- [x] Scope numbering by form type and team number.
- [x] Use Script Properties for counters.
- [x] Use `LockService` to reduce duplicate-number risk.
- [ ] Verify numbering in deployed web app with live submissions for all forms.

### PDF Generation

- [x] Implement PDF generation for all forms.
- [x] Save generated PDFs to configured Drive folders.
- [x] Use `Doc_Ref_Number` in PDF filenames.
- [ ] Verify PDF URLs are saved in the correct live sheet columns for all forms.

### Drive Folder Structure

- [ ] Replace flat folder behavior with structured folders.
- [ ] Save folder URLs into Google Sheets for traceability.
- [ ] Store folder IDs in constants or Script Properties.

### TJET Stock Ledger And Inventory Control

- [x] Create controlled inventory tabs: `TJET_Item_Master`, `TJET_Stock_Ledger`.
- [x] Auto-create/repair inventory tabs from backend.
- [x] Load item-code dropdowns from `TJET_Item_Master`.
- [x] Append ledger movements from TJET Receipt & Expenditure submissions.
- [x] Display stock cards and stock movement table.
- [ ] Replace starter item master rows with official MASAM item codes and names.
- [ ] Validate TJET ledger totals with real live data.
- [x] Add manual movement/admin workflow for purchased, received, issued, expended, returned, adjustments, damaged, and lost movements.

### Image Uploads

- [x] DWS ERW Finds image upload is supported.
- [x] DWS ERW images use confirmed `ERW Images` folder.
- [ ] Add OHC image upload support.
- [ ] Add TJET Registry image upload support.
- [ ] Decide whether TJET Receipt & Expenditure needs image upload.
- [ ] Add client-side resizing before upload.
- [ ] Save image URLs or `=IMAGE("...")` formulas to Google Sheets.

### Sheet-Driven Dropdown Validation

- [x] Create live `Validation_Lists` tab in `DWS_Form`.
- [x] Import initial `TEAM_NO`, `EO_TYPE`, and `TASK_TYPE` from `Ref_1`.
- [x] Add backend `getValidationLists(requestedKeys)`.
- [x] Add local simulator mock support for `getValidationLists`.
- [ ] Move hard-coded dropdown values out of HTML.
- [ ] Load dropdown lists with `google.script.run`.
- [ ] Cache validation lists for performance.
- [ ] Validate submitted values on backend before saving.

### Backend Validation

- [ ] Validate required fields on server side.
- [ ] Validate dropdown values against active `Validation_Lists` values.
- [ ] Validate coordinate formats.
- [ ] Validate quantities and numeric fields.
- [ ] Return consistent success/error response objects.

### UI And Responsiveness

- [x] Apply MASAM visual identity to shared styling and navigation.
- [x] Improve OHC dynamic item rows for responsive layout.
- [x] Improve TJET Registry dynamic rows for responsive layout.
- [ ] Review every form on mobile, tablet, and desktop.
- [ ] Ensure dynamic rows wrap cleanly on mobile across all forms.
- [ ] Make submit/reset/add/delete buttons fully consistent.
- [ ] Ensure long Arabic/English labels do not overflow.

### Testing Checklist

- [x] Current Index deployment loads.
- [x] Current DWS deployment loads.
- [x] Current TJET Receipt & Expenditure deployment loads.
- [ ] Dashboard links open all forms on current deployment.
- [ ] Every form submits successfully.
- [ ] DWS submission can be loaded by `Doc_Ref_#` on deployed app.
- [ ] DWS loaded submission can be updated without creating a new reference number.
- [ ] DWS loaded submission can be marked deleted.
- [ ] Every form creates the correct `Doc_Ref_Number`.
- [ ] Every form writes to the correct Google Sheet.
- [ ] DWS creates PDF and uploads ERW images.
- [ ] OHC creates PDF.
- [ ] TJET Registry creates PDF.
- [ ] TJET Receipt & Expenditure creates PDF and stock ledger rows.
- [ ] Dropdowns update after editing `Validation_Lists`.
- [ ] Invalid dropdown values are rejected by backend validation.
- [ ] Mobile layout is usable.
- [ ] Local simulator and deployed web app behave consistently.

## Ideas To Add Next

Use this section for new ideas before they become approved tasks.

- [ ] New ideas from Awadh should be added here first, then promoted into the roadmap or user-action section.

## Useful Commands

```powershell
npm run dev
clasp.cmd push --force
clasp.cmd deploy -d "Deployment description"
clasp.cmd deployments
git status
git add .
git commit -m "Describe change"
git push
```


