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

## 3. Document Reference Numbering

- Replace timestamp-only references with sequential team-based references.
- Required formats:
  - `DWS_TEAM#_00001`
  - `OHC_TEAM#_00001`
  - `TJET-REG_TEAM#_00001`
  - `TJET-REC-EXP_TEAM#_001`
- Create a counter mechanism in Google Sheets or Script Properties.
- Ensure numbering is unique per form type and team number.
- Add backend locking with `LockService` to prevent duplicate numbers during simultaneous submissions.

## 4. PDF Generation

- Current state: only DWS creates a PDF.
- Add PDF generation for:
  - OHC
  - TJET Registry
  - TJET Receipt & Expenditure
- Save every generated PDF to Drive.
- Append the PDF URL back into the relevant Google Sheets response row.
- Use consistent PDF filenames based on `Doc_Ref_Number`.
- Add a success modal link to the generated PDF for every form.

## 5. Drive Folder Structure

- Replace the current flat folder behavior with structured folders.
- Current confirmed Drive folders:

| Purpose | Folder Name | Folder ID |
|---|---|---|
| Image uploads | `ERW Images` | `1x_QaizeAmXCRn6RewqiqfNUpGw-zyYM4` |
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

- Current state: only DWS supports image upload.
- Add image upload support for:
  - OHC
  - TJET Registry
- Decide whether TJET Receipt & Expenditure needs image upload. Current assumption: no.
- Use client-side resizing before upload.
- Save images to the correct Drive folder under the relevant document reference.
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
- Every form creates the correct `Doc_Ref_Number`.
- Every form writes to the correct Google Sheet.
- DWS creates PDF and uploads ERW images.
- OHC creates PDF and uploads images after implementation.
- TJET Registry creates PDF and uploads images after implementation.
- TJET Receipt & Expenditure creates PDF after implementation.
- PDF URLs are saved into response sheets.
- Image URLs are saved into response sheets.
- Drive folders are created correctly.
- Dropdowns update after editing `Validation_Lists`.
- Invalid dropdown values are rejected by backend validation.
- Mobile layout is usable.
- Local simulator and deployed web app behave consistently.

## 14. Priority Order

1. Implement document reference numbering.
2. Add PDF URL columns and save DWS PDF URL to Sheets.
3. Add PDF generation for OHC, TJET Registry, and TJET Receipt & Expenditure.
4. Add Drive folder structure.
5. Add image upload for OHC and TJET Registry.
6. Add `Validation_Lists` sheet and dynamic dropdown loading.
7. Add backend validation.
8. Improve responsiveness.
9. Extend local simulator mocks.
10. Final deployment and end-to-end testing.
