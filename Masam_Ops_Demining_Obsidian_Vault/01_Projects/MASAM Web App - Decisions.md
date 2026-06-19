# MASAM Web App - Decisions

## 2026-06-11 - Use Awadh AI Vault As Canonical Project Memory

Decision: All memory/status/planning notes for the MASAM web app project live in `G:\google sheets project\Masam_Ops_Demining_Project\Masam_Ops_Demining_Obsidian_Vault\01_Projects`.

Reason: This is the AI/project memory vault created for continuity across sessions. Future work should start by reviewing these notes.

Current project notes:

- `MASAM Web App - Master TODO.md`
- `MASAM Web App - Decisions.md`
- `MASAM Web App - DWS Form.md`

Rule: Anything durable about the MASAM web app project should be recorded here, including completed work, remaining work, decisions, deployment URLs, and new planning ideas.

## 2026-06-11 - Public Deployment Must Use Anonymous Access

Decision: The Apps Script web app manifest should use:

```json
"webapp": {
  "executeAs": "USER_DEPLOYING",
  "access": "ANYONE_ANONYMOUS"
}
```

Reason: The earlier `ANYONE` setting returned Google sign-in pages for users. `ANYONE_ANONYMOUS` allowed public `/exec` deployment URLs to serve the MASAM app directly.

Deployment `@28` was the working deployment when this decision was recorded:

- `@28 - Masam v10 current app deployment`
- `https://script.google.com/macros/s/AKfycbzzs3-h6j0zA7YBrhnroj7wqzcwu53pXv4YTWc8MvgkdmDJAW169r2Z2lho_bDlGAqV1A/exec`

Do not use the `@HEAD` / test deployment as the public app link. It is read-only and has produced sign-in or unavailable-file behavior.

Current deployment as of 2026-06-19:

- `@30 - Masam v12 TJET stock ledger form`
- `https://script.google.com/macros/s/AKfycby9QGFSEuwrAAIR4UdFuOn1C6Fc1Wrmfxnb0-BjyW5H_Nj6MZNkq9smHILMY3HuCAhMCA/exec`

## 2026-06-11 - Versioned `/exec` URLs Are The Public Links

Decision: Share versioned `/exec` URLs from `clasp deployments`, not Apps Script test deployment links.

Reason: The versioned `/exec` URLs were verified to serve actual app markup. Test or `@HEAD` style links may fail for public users.

Verification from current deployment:

- Index: `200 OK`, title `EOD System - Index`
- DWS: `200 OK`, title `EOD System - DWS`
- TJET Receipt & Expenditure: `200 OK`, title `EOD System - TJET Receipt and Expenditure`


## 2026-06-11 - Roadmap Defaults For Next Phase

Decision: The next project phase will be planned with these defaults:

- First implementation priority: data, permissions, and validation foundation.
- Downloadable Windows/Android app: web-wrapper app around the GAS web app.
- User tasks: keep a separate clearly marked `Awadh / User Action Required` section.
- Permissions: role + per-form rights.
- Explosive ordnance catalog: dropdown + Drive image lookup.
- Unknown EO: new standalone registry form.

Reason: These choices keep the Google Sheets/GAS architecture as the single source of truth while giving the project a clear order of work and separating user-provided data/assets from implementation work.

Implementation note: This is a planning/documentation decision only. No application feature work should begin until Awadh reviews and adjusts the roadmap.
## 2026-06-10 - Vault As Shared AI Memory

Decision: Use `D:\Awadh_AI_Vault` as the persistent documentation vault for Codex and ChatGPT.

Reason: Future sessions need a reliable place to understand project state, current plans, decisions, and pending work without relying only on chat history.

Documentation pattern:

- Project notes live in `01_Projects/`.
- Daily session logs live in `Daily Notes/`.
- Open tasks live in the project master TODO.
- Durable decisions are recorded here.

## Sequential Document References

Decision: Use sequential team-based document references instead of timestamp-only references.

Formats:

- `DWS_TEAM#_00001`
- `OHC_TEAM#_00001`
- `TJET-REG_TEAM#_00001`
- `TJET-REC-EXP_TEAM#_001`

Reason: Operational records need readable, stable, team-scoped reference numbers.

Implementation notes:

- Counters use Script Properties.
- Numbering is scoped by form type and team number.
- `LockService` is used to reduce duplicate-number risk during simultaneous submissions.

## Validation Lists In Google Sheets

Decision: Move dropdown source values toward a `Validation_Lists` sheet tab.

Reason: Non-developers should be able to update operational lists without editing HTML/code.

Current state:

- Live `Validation_Lists` tab exists.
- Initial values imported from `Ref_1` for `TEAM_NO`, `EO_TYPE`, and `TASK_TYPE`.
- Backend has `getValidationLists(requestedKeys)`.
- Frontend wiring and backend enforcement are still pending.

## DWS CRUD First

Decision: Implement CRUD first for DWS before extending to other forms.

Reason: DWS is the most developed form and provides the pattern for load/update/delete behavior.

Current state:

- Load by `Doc_Ref_#` exists.
- Update exists for task, work summary, and ERW find rows.
- Delete is soft-delete by marking matching rows as deleted.
- Deployed full workflow testing is still required.

## TJET Stock Ledger

Decision: Use a ledger-based inventory model for TJET Receipt & Expenditure instead of calculating from display-only totals.

Reason: Stock changes need an audit trail. A ledger supports received, purchased, issued, expended, returned, adjustments, damaged, and lost movements.

Current state:

- `TJET_Item_Master` stores official item definitions.
- `TJET_Stock_Ledger` stores movement rows.
- TJET Receipt & Expenditure submissions append ledger rows.
- Stock cards and movement table read from the ledger.
- Official MASAM item master data still needs to replace starter/demo rows.

