# MASAM Web App TODO Plan

## 1. Core Web App Stability

- Confirm the deployed Apps Script web app serves the latest pushed code.
- Standardize routing for all pages through `doGet(e)`:
  - `?page=Index`
  - `?page=DWS`
  - `?page=OHC`
  - `?page=TJET_Registry`
  - `?page=TJET_Receipt_and_Expenditure`
- Keep local simulator behavior aligned with Apps Script behavior.
- Add clear user-facing error messages when a page, sheet, folder, or server function is missing.
- Add CRUD behavior so submissions can be found, reviewed, updated, and deleted after initial submission.
- 2026-06-10 progress:
  - Added first CRUD implementation for DWS.
  - DWS can now load a submission by `Doc_Ref_#`.
  - DWS can update the loaded task, work summary, and ERW find rows.
  - DWS soft-delete marks matching response rows as `Deleted`.
  - Local simulator mock now supports DWS read, update, and delete calls.

## 2. Google Sheets Response Structure

- Finalize required response sheets:
  - `Form_Task_Response`
  - `Form_Work_Summary_Response`
  - `Form_ERW_Finds_Response`
  - `OHC_Form_Response`
  - `TJET_Registry_Form_Response`
  - `TJET_Receipt_and_Expenditure_Form_Response`
- Add missing columns for:
  - PDF URL
  - Image URL
  - Drive folder URL
  - Submission status
  - Submitted by
  - Created timestamp
  - Updated timestamp
- Ensure each form writes consistent `Doc_Ref_Number` values to all related rows.
- 2026-06-10 progress:
  - Installed Google Drive access for direct Drive/Sheets work.
  - Confirmed live spreadsheet `DWS_Form`.
  - Confirmed live DWS response tabs use `DWS_Form_...` names.
  - Updated DWS backend lookup to support the live prefixed tab names.
  - Corrected DWS append order so `Doc_Ref_#` and `Timestamp` align with sheet headers.
  - Added DWS metadata fields for PDF URL, Drive folder URL, submission status, submitted by, created timestamp, and updated timestamp.
  - Updated live DWS Task, Work Summary, and ERW Finds response headers for the new fields.

## 3. Document Reference Numbering

- Completed initial implementation: timestamp-only references were replaced with sequential team-based references.
- Required formats:
  - `DWS_TEAM#_00001`
  - `OHC_TEAM#_00001`
  - `TJET-REG_TEAM#_00001`
  - `TJET-REC-EXP_TEAM#_001`
- Counter mechanism now uses Script Properties.
- Numbering is scoped by form type and team number.
- Backend locking now uses `LockService` to reduce duplicate-number risk during simultaneous submissions.

## 4. PDF Generation

- Completed initial implementation for all forms:
  - DWS
  - OHC
  - TJET Registry
  - TJET Receipt & Expenditure
- Every generated PDF is saved to the configured Drive PDF folder.
- PDF URLs are appended to response rows.
- PDF filenames use `Doc_Ref_Number`.
- Success modals now receive generated PDF links.

## 5. Drive Folder Structure

- Replace the current flat folder behavior with structured folders.
- Current confirmed Drive folders:

| Purpose | Folder Name | Folder ID |
|---|---|---|
| DWS ERW image uploads | `ERW Images` | `1Je0rFpd7ypHmEMnn9BKwfTuZ8_Hd3zfo` |
| OHC image uploads | `OHC Images` | `112GYzGGR6oBnR7uKio6yQxlTWusIDg9R` |
| TJET Registry image uploads | `TJET Images` | `1woRKulJQ8JUdZjzOOuOV0wr_2XrjqWyF` |
| DWS PDFs | `DWS PDF Forms` | `1muEnkn0yBbR-rbPPjQfXGiaQBV6peMBZ` |
| OHC PDFs | `OHC PDF Forms` | `1UfNMCHK6CyxHd0ldRtVSS3agwcdPgEAC` |
| TJET Registry PDFs | `TJET Registry PDF Forms` | `1SKzQ89MY2CL7HgkuENkN7-jk2G_Unxr0` |
| TJET Receipt & Expenditure PDFs | `TJET Receipt and Expenditure PDF Forms` | `1daR-L_mVPvxSlvyUHcYkGVOgpP54UPvg` |

- Recommended Drive structure:

```text
MASAM Web App Responses/
  DWS/
    TEAM#/
      YYYY-MM/
        DOC_REF/
          PDF/
          Images/
  OHC/
    TEAM#/
      YYYY-MM/
        DOC_REF/
          PDF/
          Images/
  TJET Registry/
    TEAM#/
      YYYY-MM/
        DOC_REF/
          PDF/
          Images/
  TJET Receipt and Expenditure/
    TEAM#/
      YYYY-MM/
        DOC_REF/
          PDF/
```

- Store folder IDs in constants or Script Properties.
- Save folder URLs into Google Sheets for traceability.

## 6. Image Uploads

- Current state: DWS ERW Finds supports image upload.
- Completed folder mapping update:
  - DWS ERW Finds images use `ERW Images` folder ID `1Je0rFpd7ypHmEMnn9BKwfTuZ8_Hd3zfo`.
- Add image upload support for:
  - OHC
  - TJET Registry
- Decide whether TJET Receipt & Expenditure needs image upload. Current assumption: no.
- Use client-side resizing before upload.
- Save OHC and TJET Registry images to their correct Drive folders under the relevant document reference.
- Add image URLs or `=IMAGE("...")` formulas to Google Sheets.
- Recommended image naming format:

```text
DOC_REF_TEAM#_DATE_ITEM#_TYPE_COORDINATES.jpg
```

Example:

```text
DWS_T34_00001_T34_2026-05-24_ERW01_AP_16_21_20_61_042_52_35_58.jpg
```

## 7. Sheet-Driven Dropdown Validation

- Create a Google Sheet tab:

```text
Validation_Lists
```

- Recommended columns:

```text
List_Key
Value
Label_EN
Label_AR
Active
Sort_Order
Notes
```

- Move hard-coded dropdown values out of HTML and into Google Sheets.
- Required validation list keys:

```text
TEAM_NO
TASK_TYPE
TASK_NUMBER
SITE_LOCATION
SITE_FOR_TEAM
TEAM_LEADER
SUPERVISOR
RECIPIENT_NAME
EO_TYPE
EO_DESCRIPTION
ERW_STATUS
TJET_TYPE
TJET_ITEM
TARGET_TYPE
IGNITER_TYPE
OHC_REMARKS
TJET_REMARKS
```

- Load dropdown lists with `google.script.run`.
- Cache validation lists for performance.
- Validate submitted values again on the backend before saving.
- 2026-06-10 progress:
  - Created live `Validation_Lists` tab in `DWS_Form`.
  - Imported initial values from `Ref_1` for `TEAM_NO`, `EO_TYPE`, and `TASK_TYPE`.
  - Added backend `getValidationLists(requestedKeys)` function.
  - Added local simulator mock support for `getValidationLists`.

## 8. Form-Specific Dropdowns

### DWS

- `TASK_TYPE`
- `TEAM_NO`
- `SITE_LOCATION`
- `TEAM_LEADER`
- `EO_TYPE`
- `ERW_STATUS`

### OHC

- `TEAM_NO`
- `SUPERVISOR`
- `TASK_NUMBER`
- `EO_TYPE`
- `EO_DESCRIPTION`
- `RECIPIENT_NAME`
- `OHC_REMARKS`

### TJET Registry

- `TEAM_NO`
- `SITE_LOCATION`
- `TEAM_LEADER`
- `TASK_NUMBER`
- `SITE_FOR_TEAM`
- `EO_TYPE`
- `EO_DESCRIPTION`
- `TJET_TYPE`
- `TJET_REMARKS`

### TJET Receipt & Expenditure

- `TJET_ITEM`
- `RECIPIENT_NAME`
- `TARGET_TYPE`
- `IGNITER_TYPE`

## 9. Backend Validation

- Validate required fields on the server side.
- Validate dropdown values against active values in `Validation_Lists`.
- Validate coordinate formats.
- Validate quantities and numeric fields.
- Reject invalid submissions with clear error messages.
- Return consistent response objects:

```javascript
{
  success: true,
  ref: "DWS_T34_00001",
  pdfUrl: "https://...",
  folderUrl: "https://..."
}
```

or:

```javascript
{
  success: false,
  error: "Validation message"
}
```

## 10. Responsiveness And UI

- Review every form on mobile, tablet, and desktop.
- Replace cramped fixed columns like `col-1`, `col-2`, `col-3` with responsive layouts.
- Ensure dynamic rows wrap cleanly on mobile.
- Add consistent section headers and spacing across all forms.
- Make submit, reset, add row, and delete row buttons consistent.
- Ensure long Arabic/English labels do not overflow.

## 11. Local Simulator

- Continue using:

```powershell
npm run dev
```

- Keep `mock.js` updated with every new backend function.
- Extend local mocks for:
  - Validation list loading
  - PDF success responses
  - Image upload success responses
  - Error simulation
- Confirm local simulator routes match Apps Script routes.

## 12. Deployment Workflow

- Local edit and test:

```powershell
npm run dev
```

- Push Apps Script files:

```powershell
clasp push
```

- Deploy or update Apps Script web app version.
- Test deployed URLs:

```text
/exec?page=DWS
/exec?page=OHC
/exec?page=TJET_Registry
/exec?page=TJET_Receipt_and_Expenditure
```

- Commit and push source code to GitHub:

```powershell
git status
git add .
git commit -m "Describe change"
git push
```

## 13. Testing Checklist

- Dashboard links open all forms.
- Every form submits successfully.
- DWS existing submissions can be loaded by `Doc_Ref_#`.
- DWS loaded submissions can be edited and updated without creating a new reference number.
- DWS loaded submissions can be marked deleted.
- Every form creates the correct `Doc_Ref_Number`. Initial implementation complete; real deployment testing still required.
- Every form writes to the correct Google Sheet.
- DWS creates PDF and uploads ERW images to the confirmed ERW Images folder.
- OHC creates PDF; image upload still pending.
- TJET Registry creates PDF; image upload still pending.
- TJET Receipt & Expenditure creates PDF.
- PDF URLs are saved into response sheets. Real sheet column alignment still needs deployment testing.
- Image URLs are saved into response sheets.
- Drive folders are created correctly.
- Dropdowns update after editing `Validation_Lists`.
- Invalid dropdown values are rejected by backend validation.
- Mobile layout is usable.
- Local simulator and deployed web app behave consistently.

## 14. Priority Order

1. Push updated Apps Script and test deployed DWS create/read/update/delete end-to-end.
2. Wire DWS HTML dropdowns to `Validation_Lists`.
3. Add backend validation against `Validation_Lists`.
4. Extend CRUD behavior to OHC, TJET Registry, and TJET Receipt & Expenditure.
5. Add image upload for OHC and TJET Registry.
6. Improve responsiveness.
7. Extend local simulator mocks for dropdowns and image upload.
8. Final deployment and end-to-end testing.
