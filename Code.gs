const ERW_IMAGE_FOLDER_ID = '1Je0rFpd7ypHmEMnn9BKwfTuZ8_Hd3zfo'; // ERW Images
const OHC_IMAGE_FOLDER_ID = '112GYzGGR6oBnR7uKio6yQxlTWusIDg9R'; // OHC Images
const TJET_IMAGE_FOLDER_ID = '1woRKulJQ8JUdZjzOOuOV0wr_2XrjqWyF'; // TJET Images
const DWS_PDF_FOLDER_ID = '1muEnkn0yBbR-rbPPjQfXGiaQBV6peMBZ'; // DWS PDF Forms
const OHC_PDF_FOLDER_ID = '1UfNMCHK6CyxHd0ldRtVSS3agwcdPgEAC'; // OHC PDF Forms
const TJET_REGISTRY_PDF_FOLDER_ID = '1SKzQ89MY2CL7HgkuENkN7-jk2G_Unxr0'; // TJET Registry PDF Forms
const TJET_RECEIPT_EXPENDITURE_PDF_FOLDER_ID = '1daR-L_mVPvxSlvyUHcYkGVOgpP54UPvg'; // TJET Receipt and Expenditure PDF Forms

const DOC_REF_CONFIG = {
  DWS: { prefix: 'DWS', width: 5 },
  OHC: { prefix: 'OHC', width: 5 },
  TJET_REG: { prefix: 'TJET-REG', width: 5 },
  TJET_REC_EXP: { prefix: 'TJET-REC-EXP', width: 3 }
};

const RESPONSE_SHEETS = {
  DWS_TASK: ['DWS_Form_Task_Response', 'Form_Task_Response'],
  DWS_WORK_SUMMARY: ['DWS_Form_Work_Summary_Response', 'Form_Work_Summary_Response'],
  DWS_ERW_FINDS: ['DWS_Form_ERW_Finds_Response', 'Form_ERW_Finds_Response'],
  OHC: ['OHC_Form_Response'],
  TJET_REGISTRY: ['TJET_Registry_Form_Response'],
  TJET_RECEIPT_EXPENDITURE: ['TJET_Receipt_and_Expenditure_Form_Response']
};

const TJET_ITEM_MASTER_SHEET = 'TJET_Item_Master';
const TJET_STOCK_LEDGER_SHEET = 'TJET_Stock_Ledger';

const TJET_ITEM_MASTER_HEADERS = [
  'Item_Code',
  'Item_Name',
  'Category',
  'Unit',
  'Active',
  'Minimum_Stock',
  'Notes'
];

const TJET_STOCK_LEDGER_HEADERS = [
  'Transaction_ID',
  'Timestamp',
  'Date',
  'Item_Code',
  'Item_Name',
  'Category',
  'Movement_Type',
  'Quantity',
  'Team_No',
  'Recipient',
  'Reference_Doc',
  'Reason',
  'Submitted_By',
  'Created_At',
  'Status'
];

const USERS_ALLOWLIST_SHEET = 'Users_Allowlist';
const ROLES_SHEET = 'Roles';
const ROLE_PERMISSIONS_SHEET = 'Role_Permissions';
const PERMISSION_AUDIT_LOG_SHEET = 'Permission_Audit_Log';

const USERS_ALLOWLIST_HEADERS = [
  'Email',
  'Name',
  'Role',
  'Forms',
  'Active',
  'Notes',
  'Created_At',
  'Updated_At'
];

const ROLES_HEADERS = [
  'Role',
  'Description',
  'Active'
];

const ROLE_PERMISSIONS_HEADERS = [
  'Role',
  'Form_Key',
  'Can_View',
  'Can_Submit',
  'Can_Edit',
  'Can_Delete',
  'Can_Admin',
  'Active'
];

const PERMISSION_AUDIT_LOG_HEADERS = [
  'Timestamp',
  'Email',
  'Form_Key',
  'Action',
  'Allowed',
  'Reason'
];

const FORM_KEYS = {
  DWS: 'DWS',
  OHC: 'OHC',
  TJET_REGISTRY: 'TJET_Registry',
  TJET_RECEIPT_EXPENDITURE: 'TJET_Receipt_and_Expenditure',
  UNKNOWN_EO_REGISTRY: 'Unknown_EO_Registry',
  ALL: 'ALL'
};

/**
 * Serves the HTML file to the browser dynamically based on URL parameters.
 * Handles the EOD Web Portal page list:
 * - Index.html (Dashboard Home)
 * - DWS.html (Daily Worksheet Form)
 * - OHC.html
 * - TJET_Registry.html
 * - TJET_Receipt_and_Expenditure.html
 */
function doGet(e) {
  // 1. Get the requested page from the URL parameter (default to 'Index')
  let page = (e && e.parameter && e.parameter.page) ? e.parameter.page : 'Index';
  
  // 2. Exact file-name map (maps case-insensitive inputs to exact Google Apps Script HTML filenames)
  const pageMap = {
    'index': 'Index',
    'dashboard': 'Index', // Dashboard is now the homepage (Index.html)
    'dws': 'DWS',
    'ohc': 'OHC',
    'tjet_registry': 'TJET_Registry',
    'tjet_receipt_and_expenditure': 'TJET_Receipt_and_Expenditure'
  };
  
  // Lookup target filename or fallback to default
  let targetFile = pageMap[page.toLowerCase()] || 'Index';
  
  try {
    // 3. Log and return the requested template page with frame permissions allowed
    Logger.log('doGet requested page="%s" -> serving file="%s"', page, targetFile);
    return HtmlService.createTemplateFromFile(targetFile)
      .evaluate()
      .setTitle('EOD System - ' + targetFile.replace(/_/g, ' '))
      .setXFrameOptionsMode(HtmlService.XFrameOptionsMode.ALLOWALL) // Allows embedding if needed
      .addMetaTag('viewport', 'width=device-width, initial-scale=1');
  } catch (err) {
    Logger.log("Routing Error: " + err.toString());
    // Return a visible error page so the client isn't blank and we can see the failure
    const msg = '<div style="font-family:Arial,sans-serif;padding:20px;">'
      + '<h2>Page load error</h2>'
      + '<p>Requested page: ' + page + '</p>'
      + '<pre style="white-space:pre-wrap;color:#a00;">' + err.toString() + '</pre>'
      + '<p><a href="' + ScriptApp.getService().getUrl() + '">Return to Home</a></p>'
      + '</div>';
    return HtmlService.createHtmlOutput(msg)
      .setTitle('EOD System - Error')
      .setXFrameOptionsMode(HtmlService.XFrameOptionsMode.ALLOWALL)
      .addMetaTag('viewport', 'width=device-width, initial-scale=1');
  }
}

/**
 * Helper function for the frontend to retrieve the deployed Web App URL.
 * Essential for building dynamic menus/navigation links across your pages.
 */
function getScriptUrl() {
  return ScriptApp.getService().getUrl();
}

/**
 * Server-side include helper for HtmlService templates.
 * Usage in templates: <?!= include('SharedStyles'); ?>
 */
function include(filename) {
  return HtmlService.createHtmlOutputFromFile(filename).getContent();
}

function getSafeTeamNo(teamNo) {
  return String(teamNo || 'TEAM').trim().replace(/[^A-Za-z0-9-]/g, '_') || 'TEAM';
}

function getNextDocRef(formKey, teamNo) {
  const config = DOC_REF_CONFIG[formKey];
  if (!config) throw new Error('Unknown document reference form key: ' + formKey);

  const team = getSafeTeamNo(teamNo);
  const lock = LockService.getScriptLock();
  lock.waitLock(30000);

  try {
    const properties = PropertiesService.getScriptProperties();
    const propertyKey = 'DOC_COUNTER_' + formKey + '_' + team;
    const nextNumber = Number(properties.getProperty(propertyKey) || 0) + 1;
    properties.setProperty(propertyKey, String(nextNumber));
    const padded = String(nextNumber).padStart(config.width, '0');
    return config.prefix + '_' + team + '_' + padded;
  } finally {
    lock.releaseLock();
  }
}

function getRequiredSheet(ss, sheetNames) {
  const names = Array.isArray(sheetNames) ? sheetNames : [sheetNames];
  for (let i = 0; i < names.length; i++) {
    const sheet = ss.getSheetByName(names[i]);
    if (sheet) return sheet;
  }
  throw new Error("Response sheet not found. Tried: " + names.join(', '));
}

function ensureSheetWithHeaders(ss, sheetName, headers) {
  let sheet = ss.getSheetByName(sheetName);
  if (!sheet) {
    sheet = ss.insertSheet(sheetName);
  }

  if (sheet.getMaxColumns() < headers.length) {
    sheet.insertColumnsAfter(sheet.getMaxColumns(), headers.length - sheet.getMaxColumns());
  }

  const existing = sheet.getRange(1, 1, 1, headers.length).getValues()[0];
  const needsHeaders = headers.some(function(header, index) {
    return String(existing[index] || '').trim() !== header;
  });

  if (needsHeaders) {
    sheet.getRange(1, 1, 1, headers.length).setValues([headers]);
    sheet.getRange(1, 1, 1, headers.length).setFontWeight('bold').setWrap(true);
    sheet.setFrozenRows(1);
  }

  return sheet;
}

function ensureTjetInventorySheets() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  return {
    itemMaster: ensureSheetWithHeaders(ss, TJET_ITEM_MASTER_SHEET, TJET_ITEM_MASTER_HEADERS),
    ledger: ensureSheetWithHeaders(ss, TJET_STOCK_LEDGER_SHEET, TJET_STOCK_LEDGER_HEADERS)
  };
}

function ensurePermissionSheets() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const sheets = {
    users: ensureSheetWithHeaders(ss, USERS_ALLOWLIST_SHEET, USERS_ALLOWLIST_HEADERS),
    roles: ensureSheetWithHeaders(ss, ROLES_SHEET, ROLES_HEADERS),
    permissions: ensureSheetWithHeaders(ss, ROLE_PERMISSIONS_SHEET, ROLE_PERMISSIONS_HEADERS),
    audit: ensureSheetWithHeaders(ss, PERMISSION_AUDIT_LOG_SHEET, PERMISSION_AUDIT_LOG_HEADERS)
  };

  seedPermissionDefaults(sheets);
  return sheets;
}

function seedPermissionDefaults(sheets) {
  if (sheets.roles.getLastRow() <= 1) {
    sheets.roles.getRange(2, 1, 4, ROLES_HEADERS.length).setValues([
      ['Admin', 'Full access to all forms and administration tasks.', true],
      ['Supervisor', 'Can view, submit, and edit operational forms.', true],
      ['DataEntry', 'Can view and submit operational forms.', true],
      ['Viewer', 'Can view form pages and reference data only.', true]
    ]);
  }

  if (sheets.permissions.getLastRow() <= 1) {
    const rows = [];
    const formKeys = [
      FORM_KEYS.ALL,
      FORM_KEYS.DWS,
      FORM_KEYS.OHC,
      FORM_KEYS.TJET_REGISTRY,
      FORM_KEYS.TJET_RECEIPT_EXPENDITURE,
      FORM_KEYS.UNKNOWN_EO_REGISTRY
    ];

    formKeys.forEach(function(formKey) {
      rows.push(['Admin', formKey, true, true, true, true, true, true]);
      rows.push(['Supervisor', formKey, true, true, true, false, false, true]);
      rows.push(['DataEntry', formKey, true, true, false, false, false, true]);
      rows.push(['Viewer', formKey, true, false, false, false, false, true]);
    });

    sheets.permissions.getRange(2, 1, rows.length, ROLE_PERMISSIONS_HEADERS.length).setValues(rows);
  }
}

function getSubmittedBy() {
  try {
    return Session.getActiveUser().getEmail() || '';
  } catch (err) {
    return '';
  }
}

function getCurrentUserEmail() {
  try {
    return Session.getActiveUser().getEmail() || '';
  } catch (err) {
    return '';
  }
}

function normalizePermissionValue(value) {
  return String(value || '').trim().toLowerCase();
}

function valueIsActive(value) {
  return value === true || normalizePermissionValue(value) === 'true' || normalizePermissionValue(value) === 'yes' || normalizePermissionValue(value) === 'active';
}

function splitPermissionList(value) {
  return String(value || '')
    .split(',')
    .map(function(item) { return item.trim(); })
    .filter(function(item) { return item; });
}

function permissionColumnForAction(action) {
  const normalized = normalizePermissionValue(action);
  const map = {
    view: 2,
    submit: 3,
    edit: 4,
    delete: 5,
    admin: 6
  };
  return map[normalized] === undefined ? null : map[normalized];
}

function getUsersAllowlistRows(sheet) {
  const values = sheet.getDataRange().getValues();
  const rows = [];
  for (let i = 1; i < values.length; i++) {
    const row = values[i];
    const email = normalizePermissionValue(row[0]);
    if (!email) continue;
    rows.push({
      email: email,
      name: String(row[1] || '').trim(),
      role: String(row[2] || '').trim(),
      forms: splitPermissionList(row[3] || FORM_KEYS.ALL),
      active: valueIsActive(row[4]),
      rowNumber: i + 1
    });
  }
  return rows;
}

function getRolePermissions(sheet, role, formKey, action) {
  const permissionColumn = permissionColumnForAction(action);
  if (permissionColumn === null) return { allowed: false, reason: 'Unknown permission action: ' + action };

  const values = sheet.getDataRange().getValues();
  const normalizedRole = normalizePermissionValue(role);
  const normalizedFormKey = normalizePermissionValue(formKey);

  for (let i = 1; i < values.length; i++) {
    const row = values[i];
    if (!valueIsActive(row[7])) continue;
    const rowRole = normalizePermissionValue(row[0]);
    const rowForm = normalizePermissionValue(row[1]);
    if (rowRole !== normalizedRole) continue;
    if (rowForm !== normalizedFormKey && rowForm !== normalizePermissionValue(FORM_KEYS.ALL)) continue;
    return {
      allowed: valueIsActive(row[permissionColumn]),
      reason: valueIsActive(row[permissionColumn]) ? 'Allowed by role permission.' : 'Role does not permit this action.'
    };
  }

  return { allowed: false, reason: 'No matching role permission found.' };
}

function userCanAccessForm(userRow, formKey) {
  if (normalizePermissionValue(formKey) === normalizePermissionValue(FORM_KEYS.ALL)) return true;
  if (!userRow.forms.length) return true;
  const normalizedFormKey = normalizePermissionValue(formKey);
  return userRow.forms.some(function(form) {
    const normalizedForm = normalizePermissionValue(form);
    return normalizedForm === normalizePermissionValue(FORM_KEYS.ALL) || normalizedForm === normalizedFormKey;
  });
}

function logPermissionCheck(sheets, email, formKey, action, allowed, reason) {
  try {
    sheets.audit.appendRow([new Date(), email || '', formKey || '', action || '', allowed ? 'Yes' : 'No', reason || '']);
  } catch (err) {
    Logger.log('Permission audit log failed: ' + err.toString());
  }
}

function checkUserPermission(formKey, action) {
  const sheets = ensurePermissionSheets();
  const email = normalizePermissionValue(getCurrentUserEmail());
  const users = getUsersAllowlistRows(sheets.users).filter(function(user) { return user.active; });

  if (!users.length) {
    return {
      success: true,
      allowed: true,
      bootstrapMode: true,
      email: email,
      role: 'Bootstrap',
      reason: 'Users_Allowlist has no active users yet; permissions are in bootstrap mode.'
    };
  }

  if (!email) {
    const noEmailReason = 'No signed-in Google email was available for this request.';
    logPermissionCheck(sheets, '', formKey, action, false, noEmailReason);
    return { success: true, allowed: false, email: '', role: '', reason: noEmailReason };
  }

  const user = users.filter(function(row) { return row.email === email; })[0];
  if (!user) {
    const notListedReason = 'Email is not listed in Users_Allowlist.';
    logPermissionCheck(sheets, email, formKey, action, false, notListedReason);
    return { success: true, allowed: false, email: email, role: '', reason: notListedReason };
  }

  if (!userCanAccessForm(user, formKey)) {
    const formReason = 'User is not assigned to this form.';
    logPermissionCheck(sheets, email, formKey, action, false, formReason);
    return { success: true, allowed: false, email: email, role: user.role, reason: formReason };
  }

  const rolePermission = getRolePermissions(sheets.permissions, user.role, formKey, action);
  logPermissionCheck(sheets, email, formKey, action, rolePermission.allowed, rolePermission.reason);
  return {
    success: true,
    allowed: rolePermission.allowed,
    email: email,
    name: user.name,
    role: user.role,
    reason: rolePermission.reason
  };
}

function requirePermission(formKey, action) {
  const permission = checkUserPermission(formKey, action);
  if (!permission.allowed) {
    throw new Error('Access denied: ' + permission.reason);
  }
  return permission;
}

function getCurrentUserProfile() {
  const permission = checkUserPermission(FORM_KEYS.ALL, 'view');
  return {
    success: true,
    email: permission.email || '',
    name: permission.name || '',
    role: permission.role || '',
    allowed: permission.allowed,
    bootstrapMode: !!permission.bootstrapMode,
    reason: permission.reason || ''
  };
}

function getDriveFolderUrl(folderId) {
  try {
    return DriveApp.getFolderById(folderId).getUrl();
  } catch (err) {
    return '';
  }
}

function getValidationLists(requestedKeys) {
  requirePermission(FORM_KEYS.ALL, 'view');
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const sheet = ss.getSheetByName('Validation_Lists');
  if (!sheet) return {};

  const keys = Array.isArray(requestedKeys) ? requestedKeys : [];
  const keyFilter = keys.length ? keys.reduce(function(map, key) {
    map[String(key)] = true;
    return map;
  }, {}) : null;

  const values = sheet.getDataRange().getValues();
  const lists = {};
  for (let i = 1; i < values.length; i++) {
    const row = values[i];
    const listKey = String(row[0] || '').trim();
    const value = String(row[1] || '').trim();
    const active = row[4] === true || String(row[4]).toUpperCase() === 'TRUE';
    if (!listKey || !value || !active) continue;
    if (keyFilter && !keyFilter[listKey]) continue;

    if (!lists[listKey]) lists[listKey] = [];
    lists[listKey].push({
      value: value,
      labelEn: String(row[2] || value).trim(),
      labelAr: String(row[3] || '').trim(),
      sortOrder: Number(row[5] || 0),
      notes: String(row[6] || '').trim()
    });
  }

  Object.keys(lists).forEach(function(key) {
    lists[key].sort(function(a, b) {
      return (a.sortOrder || 0) - (b.sortOrder || 0) || a.value.localeCompare(b.value);
    });
  });

  return lists;
}

function createPdfFile(html, docRef, folderId) {
  const folder = DriveApp.getFolderById(folderId);
  const blob = Utilities.newBlob(html, 'text/html', docRef + '.html');
  const pdf = folder.createFile(blob.getAs('application/pdf')).setName(docRef + '.pdf');
  return pdf.getUrl();
}

function escapeHtml(value) {
  return String(value === undefined || value === null ? '' : value)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

function toInputDate(value) {
  if (!value) return '';
  if (Object.prototype.toString.call(value) === '[object Date]' && !isNaN(value.getTime())) {
    return Utilities.formatDate(value, Session.getScriptTimeZone(), 'yyyy-MM-dd');
  }
  const text = String(value).trim();
  if (/^\d{4}-\d{2}-\d{2}/.test(text)) return text.substring(0, 10);
  const parsed = new Date(text);
  if (!isNaN(parsed.getTime())) {
    return Utilities.formatDate(parsed, Session.getScriptTimeZone(), 'yyyy-MM-dd');
  }
  return text;
}

function findRowsByDocRef(sheet, docRef) {
  const target = String(docRef || '').trim();
  if (!target) return [];
  const values = sheet.getDataRange().getValues();
  const matches = [];
  for (let i = 1; i < values.length; i++) {
    if (String(values[i][0] || '').trim() === target || String(values[i][1] || '').trim() === target) {
      matches.push({ rowNumber: i + 1, values: values[i] });
    }
  }
  return matches;
}

function dwsTaskRowFromForm(formData, docRef, timestamp, pdfUrl, folderUrl, status, submittedBy, createdTimestamp) {
  return [
    docRef,
    timestamp,
    formData.taskDetails || '',
    formData.taskStartDate || '',
    formData.taskCompleteDate || 'N/A',
    formData.date || '',
    formData.teamNo || '',
    formData.siteAddress || '',
    formData.teamLeader || '',
    formData.gpsN || '',
    formData.gpsE || '',
    pdfUrl || '',
    folderUrl || '',
    status || 'Submitted',
    submittedBy || '',
    createdTimestamp || timestamp,
    timestamp
  ];
}

function dwsSummaryRowFromForm(formData, docRef, timestamp, pdfUrl, folderUrl, status, submittedBy, createdTimestamp) {
  return [
    docRef,
    timestamp,
    formData.date || '',
    formData.teamNo || '',
    formData.siteAddress || '',
    formData.teamLeader || '',
    formData.gpsN || '',
    formData.gpsE || '',
    formData.f3lBlackCleared || 0,
    formData.f3lBlackQA || 0,
    formData.f3lBlackComp || 0,
    formData.f3lRedCleared || 0,
    formData.f3lRedQA || 0,
    formData.f3lRedComp || 0,
    formData.largeLoopCleared || 0,
    formData.largeLoopQA || 0,
    formData.largeLoopComp || 0,
    formData.workDetails || '',
    pdfUrl || '',
    folderUrl || '',
    status || 'Submitted',
    submittedBy || '',
    createdTimestamp || timestamp,
    timestamp
  ];
}

function dwsErwRowFromForm(row, formData, docRef, timestamp, pdfUrl, imageFolderUrl, status, submittedBy, createdTimestamp, index) {
  let imageUrl = row.existingImageUrl || '';
  if (row.imageBase64) {
    const latClean = (row.eoN || '0').replace(/[\s\.]+/g, '_');
    const lonClean = (row.eoE || '0').replace(/[\s\.]+/g, '_');
    const itemNo = String((index || 0) + 1).padStart(2, '0');
    const fileName = `${docRef}_${formData.teamNo}_${formData.date}_ERW${itemNo}_${row.eoType || 'EO'}_${latClean}_${lonClean}`;
    imageUrl = saveToDrive(row.imageBase64, fileName, ERW_IMAGE_FOLDER_ID);
  }
  const imageFormula = imageUrl ? `=IMAGE("${imageUrl}")` : "No Image";

  return [
    docRef,
    timestamp,
    formData.date || '',
    formData.teamNo || '',
    formData.siteAddress || '',
    formData.teamLeader || '',
    formData.gpsN || '',
    formData.gpsE || '',
    row.eoN || '',
    row.eoE || '',
    row.eoType || '',
    row.eoDesc || '',
    row.removed ? "Yes" : "No",
    row.leftOnSite ? "Yes" : "No",
    imageFormula,
    imageUrl,
    imageFolderUrl || '',
    pdfUrl || '',
    status || 'Submitted',
    submittedBy || '',
    createdTimestamp || timestamp,
    timestamp
  ];
}

function getDwsSubmission(docRef) {
  try {
    requirePermission(FORM_KEYS.DWS, 'view');
    const ref = String(docRef || '').trim();
    if (!ref) return { success: false, error: 'Please enter a document reference number.' };

    const ss = SpreadsheetApp.getActiveSpreadsheet();
    const sheetTask = getRequiredSheet(ss, RESPONSE_SHEETS.DWS_TASK);
    const sheetSummary = getRequiredSheet(ss, RESPONSE_SHEETS.DWS_WORK_SUMMARY);
    const sheetERW = getRequiredSheet(ss, RESPONSE_SHEETS.DWS_ERW_FINDS);

    const taskMatch = findRowsByDocRef(sheetTask, ref)[0];
    if (!taskMatch) return { success: false, error: 'No DWS submission found for ' + ref };
    if (String(taskMatch.values[13] || '').toLowerCase() === 'deleted') {
      return { success: false, error: 'This DWS submission is marked as deleted.' };
    }

    const summaryMatch = findRowsByDocRef(sheetSummary, ref)[0];
    const task = taskMatch.values;
    const summary = summaryMatch ? summaryMatch.values : [];
    const erwRows = findRowsByDocRef(sheetERW, ref)
      .filter(function(match) { return String(match.values[18] || '').toLowerCase() !== 'deleted'; })
      .map(function(match) {
        const row = match.values;
        return {
          eoN: row[8] || '',
          eoE: row[9] || '',
          eoType: row[10] || '',
          eoDesc: row[11] || '',
          removed: String(row[12] || '').toLowerCase() === 'yes',
          leftOnSite: String(row[13] || '').toLowerCase() === 'yes',
          existingImageUrl: row[15] || ''
        };
      });

    return {
      success: true,
      ref: ref,
      formData: {
        docRef: ref,
        taskDetails: task[2] || '',
        taskStartDate: toInputDate(task[3]),
        taskCompleteDate: toInputDate(task[4] === 'N/A' ? '' : task[4]),
        date: toInputDate(task[5]),
        teamNo: task[6] || '',
        siteAddress: task[7] || '',
        teamLeader: task[8] || '',
        gpsN: task[9] || '',
        gpsE: task[10] || '',
        f3lBlackCleared: summary[8] || '',
        f3lBlackQA: summary[9] || '',
        f3lBlackComp: summary[10] || '',
        f3lRedCleared: summary[11] || '',
        f3lRedQA: summary[12] || '',
        f3lRedComp: summary[13] || '',
        largeLoopCleared: summary[14] || '',
        largeLoopQA: summary[15] || '',
        largeLoopComp: summary[16] || '',
        workDetails: summary[17] || '',
        pdfUrl: task[11] || '',
        folderUrl: task[12] || '',
        status: task[13] || ''
      },
      erwRows: erwRows
    };
  } catch (err) {
    return { success: false, error: err.toString() };
  }
}

/**
 * Processes the form data, saves to 3 sheets, and generates a PDF.
 */
function processForm(formData) {
  try {
    requirePermission(FORM_KEYS.DWS, 'submit');
  } catch (err) {
    return { success: false, error: err.toString() };
  }

  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const timestamp = new Date();
  const docRef = getNextDocRef('DWS', formData.teamNo);
  const submittedBy = getSubmittedBy();
  
  try {
    const sheetTask = getRequiredSheet(ss, RESPONSE_SHEETS.DWS_TASK);
    const sheetSummary = getRequiredSheet(ss, RESPONSE_SHEETS.DWS_WORK_SUMMARY);
    const sheetERW = getRequiredSheet(ss, RESPONSE_SHEETS.DWS_ERW_FINDS);
    
    const erwData = JSON.parse(formData.erwRows || '[]');
    const processedErwRows = [];
    const erwSheetRows = [];
    const dwsPdfFolderUrl = getDriveFolderUrl(DWS_PDF_FOLDER_ID);
    const erwImageFolderUrl = getDriveFolderUrl(ERW_IMAGE_FOLDER_ID);

    erwData.forEach((row, idx) => {
      let imageUrl = "";
      if (row.imageBase64) {
        const latClean = (row.eoN || '0').replace(/[\s\.]+/g, '_');
        const lonClean = (row.eoE || '0').replace(/[\s\.]+/g, '_');
        const itemNo = String(idx + 1).padStart(2, '0');
        const fileName = `${docRef}_${formData.teamNo}_${formData.date}_ERW${itemNo}_${row.eoType || 'EO'}_${latClean}_${lonClean}`;
        imageUrl = saveToDrive(row.imageBase64, fileName, ERW_IMAGE_FOLDER_ID);
      }
      
      const imageFormula = imageUrl ? `=IMAGE("${imageUrl}")` : "No Image";
      
      erwSheetRows.push([
        docRef, 
        timestamp,
        formData.date, 
        formData.teamNo, 
        formData.siteAddress, 
        formData.teamLeader, 
        formData.gpsN, 
        formData.gpsE,
        row.eoN, 
        row.eoE, 
        row.eoType, 
        row.eoDesc, 
        row.removed ? "Yes" : "No", 
        row.leftOnSite ? "Yes" : "No", 
        imageFormula,
        imageUrl,
        erwImageFolderUrl,
        '',
        'Submitted',
        submittedBy,
        timestamp,
        timestamp
      ]);

      processedErwRows.push({
        ...row,
        savedImageUrl: imageUrl
      });
    });

    const pdfUrl = createPDF(formData, docRef, processedErwRows);

    sheetTask.appendRow([
      docRef, 
      timestamp, 
      formData.taskDetails, 
      formData.taskStartDate, 
      formData.taskCompleteDate || 'N/A', 
      formData.date, 
      formData.teamNo, 
      formData.siteAddress, 
      formData.teamLeader, 
      formData.gpsN, 
      formData.gpsE,
      pdfUrl,
      dwsPdfFolderUrl,
      'Submitted',
      submittedBy,
      timestamp,
      timestamp
    ]);

    sheetSummary.appendRow([
      docRef, 
      timestamp,
      formData.date, 
      formData.teamNo, 
      formData.siteAddress, 
      formData.teamLeader, 
      formData.gpsN, 
      formData.gpsE,
      formData.f3lBlackCleared || 0, 
      formData.f3lBlackQA || 0, 
      formData.f3lBlackComp || 0,
      formData.f3lRedCleared || 0, 
      formData.f3lRedQA || 0, 
      formData.f3lRedComp || 0,
      formData.largeLoopCleared || 0, 
      formData.largeLoopQA || 0, 
      formData.largeLoopComp || 0,
      formData.workDetails || '',
      pdfUrl,
      dwsPdfFolderUrl,
      'Submitted',
      submittedBy,
      timestamp,
      timestamp
    ]);

    erwSheetRows.forEach(function(sheetRow) {
      sheetRow[17] = pdfUrl;
      const lastRow = sheetERW.getLastRow() + 1;
      sheetERW.appendRow(sheetRow);
      if (sheetRow[14] && sheetRow[14] !== 'No Image') {
        sheetERW.setRowHeight(lastRow, 200);
        sheetERW.setColumnWidth(15, 200);
      }
    });

    return { success: true, ref: docRef, pdfUrl: pdfUrl, folderUrl: dwsPdfFolderUrl };
  } catch (e) {
    return { success: false, error: e.toString() };
  }
}

function updateDwsSubmission(formData) {
  try {
    requirePermission(FORM_KEYS.DWS, 'edit');
  } catch (err) {
    return { success: false, error: err.toString() };
  }

  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const timestamp = new Date();
  const docRef = String(formData.docRef || '').trim();
  const submittedBy = getSubmittedBy();

  if (!docRef) return { success: false, error: 'Document reference is required for updates.' };

  try {
    const sheetTask = getRequiredSheet(ss, RESPONSE_SHEETS.DWS_TASK);
    const sheetSummary = getRequiredSheet(ss, RESPONSE_SHEETS.DWS_WORK_SUMMARY);
    const sheetERW = getRequiredSheet(ss, RESPONSE_SHEETS.DWS_ERW_FINDS);

    const taskMatch = findRowsByDocRef(sheetTask, docRef)[0];
    const summaryMatch = findRowsByDocRef(sheetSummary, docRef)[0];
    if (!taskMatch || !summaryMatch) {
      return { success: false, error: 'Cannot update because the original DWS rows were not found.' };
    }

    const dwsPdfFolderUrl = getDriveFolderUrl(DWS_PDF_FOLDER_ID);
    const erwImageFolderUrl = getDriveFolderUrl(ERW_IMAGE_FOLDER_ID);
    const erwData = JSON.parse(formData.erwRows || '[]');
    const pdfUrl = createPDF(formData, docRef, erwData);

    const createdTaskTimestamp = taskMatch.values[15] || taskMatch.values[1] || timestamp;
    const createdSummaryTimestamp = summaryMatch.values[22] || summaryMatch.values[1] || timestamp;

    sheetTask.getRange(taskMatch.rowNumber, 1, 1, 17).setValues([
      dwsTaskRowFromForm(formData, docRef, timestamp, pdfUrl, dwsPdfFolderUrl, 'Updated', submittedBy, createdTaskTimestamp)
    ]);
    sheetSummary.getRange(summaryMatch.rowNumber, 1, 1, 24).setValues([
      dwsSummaryRowFromForm(formData, docRef, timestamp, pdfUrl, dwsPdfFolderUrl, 'Updated', submittedBy, createdSummaryTimestamp)
    ]);

    const oldErwRows = findRowsByDocRef(sheetERW, docRef);
    oldErwRows.sort(function(a, b) { return b.rowNumber - a.rowNumber; }).forEach(function(match) {
      sheetERW.deleteRow(match.rowNumber);
    });

    const newErwRows = erwData.map(function(row, idx) {
      return dwsErwRowFromForm(row, formData, docRef, timestamp, pdfUrl, erwImageFolderUrl, 'Updated', submittedBy, timestamp, idx);
    });
    if (newErwRows.length) {
      const startRow = sheetERW.getLastRow() + 1;
      sheetERW.getRange(startRow, 1, newErwRows.length, 22).setValues(newErwRows);
      for (let i = 0; i < newErwRows.length; i++) {
        if (newErwRows[i][14] && newErwRows[i][14] !== 'No Image') {
          sheetERW.setRowHeight(startRow + i, 200);
        }
      }
      sheetERW.setColumnWidth(15, 200);
    }

    return { success: true, ref: docRef, pdfUrl: pdfUrl, folderUrl: dwsPdfFolderUrl, updated: true };
  } catch (err) {
    return { success: false, error: err.toString() };
  }
}

function deleteDwsSubmission(docRef) {
  try {
    requirePermission(FORM_KEYS.DWS, 'delete');
    const ref = String(docRef || '').trim();
    if (!ref) return { success: false, error: 'Document reference is required.' };

    const ss = SpreadsheetApp.getActiveSpreadsheet();
    const timestamp = new Date();
    const submittedBy = getSubmittedBy();
    const targets = [
      { sheet: getRequiredSheet(ss, RESPONSE_SHEETS.DWS_TASK), statusCol: 14, submittedByCol: 15, updatedCol: 17 },
      { sheet: getRequiredSheet(ss, RESPONSE_SHEETS.DWS_WORK_SUMMARY), statusCol: 21, submittedByCol: 22, updatedCol: 24 },
      { sheet: getRequiredSheet(ss, RESPONSE_SHEETS.DWS_ERW_FINDS), statusCol: 19, submittedByCol: 20, updatedCol: 22 }
    ];

    let changed = 0;
    targets.forEach(function(target) {
      findRowsByDocRef(target.sheet, ref).forEach(function(match) {
        target.sheet.getRange(match.rowNumber, target.statusCol).setValue('Deleted');
        target.sheet.getRange(match.rowNumber, target.submittedByCol).setValue(submittedBy);
        target.sheet.getRange(match.rowNumber, target.updatedCol).setValue(timestamp);
        changed++;
      });
    });

    if (!changed) return { success: false, error: 'No DWS submission found for ' + ref };
    return { success: true, ref: ref, deleted: true };
  } catch (err) {
    return { success: false, error: err.toString() };
  }
}

/**
 * Saves base64 image data to Google Drive as a JPEG.
 */
function saveToDrive(base64, name, folderId) {
  try {
    const folder = DriveApp.getFolderById(folderId || ERW_IMAGE_FOLDER_ID);
    const contentType = base64.substring(5, base64.indexOf(';'));
    const bytes = Utilities.base64Decode(base64.split(',')[1]);
    const blob = Utilities.newBlob(bytes, contentType, name + ".jpg");
    const file = folder.createFile(blob);
    file.setSharing(DriveApp.Access.ANYONE_WITH_LINK, DriveApp.Permission.VIEW);
    
    // Return direct web link for Spreadsheet IMAGE formula support
    return `https://drive.google.com/uc?export=view&id=${file.getId()}`;
  } catch (err) {
    Logger.log("Error saving image: " + err.toString());
    return "";
  }
}

/**
 * Generates a comprehensive PDF report from the form data, incorporating ERW list and images.
 */
function createPDF(data, docRef, erwRows) {
  // Build ERW rows HTML markup
  let erwRowsHtml = '';
  if (erwRows && erwRows.length > 0) {
    erwRows.forEach((row, idx) => {
      const status = row.removed ? 'Removed / تم النقل' : (row.leftOnSite ? 'Left on Site / ترك بالموقع' : 'N/A');
      const imageSrc = row.imageBase64 || row.existingImageUrl || '';
      const inlineImg = imageSrc 
        ? `<img src="${imageSrc}" style="max-height: 120px; width: auto; border-radius: 4px; display: block; margin: 0 auto;"/>`
        : '<span style="color:#999; font-size:11px;">No Photo / لا توجد صورة</span>';

      erwRowsHtml += `
        <tr style="border-bottom: 1px solid #ddd;">
          <td style="padding: 8px; font-size:11px;">${idx + 1}</td>
          <td style="padding: 8px; font-size:11px; font-family: monospace;">N: ${row.eoN}<br>E: ${row.eoE}</td>
          <td style="padding: 8px; font-size:11px;"><b>${row.eoType}</b></td>
          <td style="padding: 8px; font-size:11px; text-align: left;">${row.eoDesc || 'N/A'}</td>
          <td style="padding: 8px; font-size:11px; font-weight: bold; color: ${row.removed ? '#1b5e20' : '#b71c1c'};">${status}</td>
          <td style="padding: 8px; text-align: center;">${inlineImg}</td>
        </tr>
      `;
    });
  } else {
    erwRowsHtml = `<tr><td colspan="6" style="padding: 15px; text-align: center; color: #777;">No ERW Finds reported on this date. / لم يتم تسجيل أي ذخائر مكتشفة اليوم.</td></tr>`;
  }

  let html = `
    <div style="font-family: Arial, sans-serif; padding: 25px; color: #222; max-width: 800px; margin: 0 auto;">
      <div style="border-bottom: 3px solid #1a73e8; padding-bottom: 12px; margin-bottom: 20px;">
        <table style="width: 100%; border: none;">
          <tr>
            <td>
              <h2 style="margin: 0; color: #1a73e8; font-size: 24px; letter-spacing: 0.5px;">EOD DAILY WORKSHEET</h2>
              <h4 style="margin: 4px 0 0 0; color: #666; font-weight: normal; font-size: 14px;">Reference: ${docRef}</h4>
            </td>
            <td style="text-align: right; vertical-align: bottom;">
              <span style="background-color: #e8f0fe; color: #1a73e8; padding: 6px 12px; border-radius: 20px; font-weight: bold; font-size: 13px;">
                Date: ${data.date}
              </span>
            </td>
          </tr>
        </table>
      </div>

      <!-- Section: Mission Details -->
      <table style="width: 100%; border-collapse: collapse; margin-bottom: 20px; background-color: #f8f9fa; border-radius: 6px;">
        <tr>
          <td style="padding: 12px; width: 50%; vertical-align: top; border-right: 1px solid #eee;">
            <p style="margin: 0 0 8px 0; font-size: 13px;"><b>Task Type / تفاصيل المهمة:</b> <br><span style="color: #333; font-size:14px;">${data.taskDetails}</span></p>
            <p style="margin: 0 0 8px 0; font-size: 13px;"><b>Team / الفريق:</b> <span style="color: #333;">${data.teamNo}</span></p>
            <p style="margin: 0 0 8px 0; font-size: 13px;"><b>Site Location / موقع العمل:</b> <br><span style="color: #333;">${data.siteAddress}</span></p>
          </td>
          <td style="padding: 12px; width: 50%; vertical-align: top;">
            <p style="margin: 0 0 8px 0; font-size: 13px;"><b>Supervisor / قائد الفريق:</b> <br><span style="color: #333; font-size:14px;">${data.teamLeader}</span></p>
            <p style="margin: 0 0 8px 0; font-size: 13px;"><b>Site GPS / إحداثيات الموقع:</b> <br><span style="color: #333; font-family: monospace;">N: ${data.gpsN || 'N/A'}<br>E: ${data.gpsE || 'N/A'}</span></p>
            <p style="margin: 0 0 8px 0; font-size: 13px;"><b>Project Duration:</b> <span style="color: #555;">${data.taskStartDate} to ${data.taskCompleteDate || 'Ongoing'}</span></p>
          </td>
        </tr>
      </table>

      <!-- Section: Work Summary -->
      <h3 style="color: #333; border-bottom: 1px solid #ddd; padding-bottom: 6px; margin-top: 25px; font-size: 16px;">
        Work Summary / ملخص العمل اليومي
      </h3>
      <table style="width: 100%; border-collapse: collapse; text-align: center; margin-bottom: 20px;">
        <thead>
          <tr style="background-color: #343a40; color: white;">
            <th style="padding: 8px; font-size:12px; text-align: left;">Clearance Method / طريقة التطهير</th>
            <th style="padding: 8px; font-size:12px;">Cleared Area (m²) / المساحة</th>
            <th style="padding: 8px; font-size:12px;">Daily QA / ضمان الجودة</th>
            <th style="padding: 8px; font-size:12px;">Completion QA / الانجاز</th>
          </tr>
        </thead>
        <tbody style="font-size: 13px;">
          <tr style="border-bottom: 1px solid #eee;">
            <td style="padding: 8px; text-align: left;">F-3L Black Cap / غطاء أسود</td>
            <td style="padding: 8px; font-weight: bold;">${data.f3lBlackCleared || '0'}</td>
            <td style="padding: 8px;">${data.f3lBlackQA || '0'}</td>
            <td style="padding: 8px;">${data.f3lBlackComp || '0'}</td>
          </tr>
          <tr style="border-bottom: 1px solid #eee;">
            <td style="padding: 8px; text-align: left;">F-3L Red Cap / غطاء أحمر</td>
            <td style="padding: 8px; font-weight: bold;">${data.f3lRedCleared || '0'}</td>
            <td style="padding: 8px;">${data.f3lRedQA || '0'}</td>
            <td style="padding: 8px;">${data.f3lRedComp || '0'}</td>
          </tr>
          <tr style="border-bottom: 2px solid #ddd;">
            <td style="padding: 8px; text-align: left;">Large Loop / اللاج لوب</td>
            <td style="padding: 8px; font-weight: bold;">${data.largeLoopCleared || '0'}</td>
            <td style="padding: 8px;">${data.largeLoopQA || '0'}</td>
            <td style="padding: 8px;">${data.largeLoopComp || '0'}</td>
          </tr>
        </tbody>
      </table>

      <!-- Work Details Comments -->
      <div style="background-color: #fffde7; border-left: 4px solid #fbc02d; padding: 12px; border-radius: 4px; margin-bottom: 25px;">
        <h4 style="margin: 0 0 6px 0; font-size: 13px; color: #f57f17;">Notes & Actions / تفاصيل إضافية:</h4>
        <p style="margin: 0; font-size: 13px; line-height: 1.5; color: #444;">${data.workDetails || 'No additional notes provided.'}</p>
      </div>

      <!-- Section: ERW Finds with Photos -->
      <h3 style="color: #333; border-bottom: 1px solid #ddd; padding-bottom: 6px; margin-top: 30px; font-size: 16px;">
        ERW Finds Detail / الذخائر المكتشفة بالصور
      </h3>
      <table style="width: 100%; border-collapse: collapse; text-align: center;">
        <thead>
          <tr style="background-color: #1a73e8; color: white;">
            <th style="padding: 8px; font-size:11px; width: 4%;">#</th>
            <th style="padding: 8px; font-size:11px; width: 22%; text-align: left;">Coordinates (DMS)</th>
            <th style="padding: 8px; font-size:11px; width: 14%;">Type</th>
            <th style="padding: 8px; font-size:11px; width: 25%; text-align: left;">Description</th>
            <th style="padding: 8px; font-size:11px; width: 18%;">Status / الحالة</th>
            <th style="padding: 8px; font-size:11px; width: 17%;">Photo / صورة</th>
          </tr>
        </thead>
        <tbody>
          ${erwRowsHtml}
        </tbody>
      </table>

      <!-- Footer Signatures -->
      <div style="margin-top: 50px; border-top: 1px solid #eee; padding-top: 15px;">
        <table style="width: 100%; border: none;">
          <tr>
            <td style="width: 50%; font-size: 12px;">
              <p style="margin: 0;"><b>Submitted By:</b> ___________________________</p>
              <p style="margin: 4px 0 0 0; color: #666;">EOD Team Leader / Supervisor</p>
            </td>
            <td style="width: 50%; text-align: right; font-size: 12px;">
              <p style="margin: 0;"><b>Verification Signature:</b> ___________________________</p>
              <p style="margin: 4px 0 0 0; color: #666;">Operations Office</p>
            </td>
          </tr>
        </table>
      </div>
    </div>
  `;
  
  return createPdfFile(html, docRef, DWS_PDF_FOLDER_ID);
}

/**
 * Processes the Ordnance Handover Certificate form and appends rows to 'OHC_Form_Response'.
 * Expects formData.items as a JSON string of objects: {eoType, description, quantity, remarks}
 */
function processOHC(formData) {
  try {
    requirePermission(FORM_KEYS.OHC, 'submit');
  } catch (err) {
    return { success: false, error: err.toString() };
  }

  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const timestamp = new Date();
  const docRef = getNextDocRef('OHC', formData.teamNo);
  try {
    const sheet = ss.getSheetByName('OHC_Form_Response');
    if (!sheet) throw new Error("Sheet 'OHC_Form_Response' not found.");

    const items = JSON.parse(formData.items || '[]');
    const pdfUrl = createOHCPDF(formData, docRef, items);
    if (items.length === 0) {
      sheet.appendRow([docRef, timestamp, formData.date || '', formData.teamNo || '', formData.supervisor || '', formData.siteTaskNo || '', '', '', '', formData.recipientName || '', 'No items', pdfUrl]);
    } else {
      items.forEach(function(item) {
        sheet.appendRow([
          docRef,
          timestamp,
          formData.date || '',
          formData.teamNo || '',
          formData.supervisor || '',
          formData.siteTaskNo || '',
          item.eoType || '',
          item.description || '',
          item.quantity || '',
          formData.recipientName || '',
          item.remarks || '',
          pdfUrl
        ]);
      });
    }

    return { success: true, ref: docRef, pdfUrl: pdfUrl };
  } catch (err) {
    return { success: false, error: err.toString() };
  }
}

function createOHCPDF(data, docRef, items) {
  let rowsHtml = '';
  if (items && items.length > 0) {
    items.forEach(function(item, idx) {
      rowsHtml += `
        <tr>
          <td style="padding:8px;border:1px solid #ddd;">${idx + 1}</td>
          <td style="padding:8px;border:1px solid #ddd;">${escapeHtml(item.eoType || '')}</td>
          <td style="padding:8px;border:1px solid #ddd;">${escapeHtml(item.description || '')}</td>
          <td style="padding:8px;border:1px solid #ddd;text-align:center;">${escapeHtml(item.quantity || '')}</td>
          <td style="padding:8px;border:1px solid #ddd;">${escapeHtml(item.remarks || '')}</td>
        </tr>`;
    });
  } else {
    rowsHtml = '<tr><td colspan="5" style="padding:12px;border:1px solid #ddd;text-align:center;">No items</td></tr>';
  }

  const html = `
    <div style="font-family:Arial,sans-serif;padding:28px;color:#222;">
      <h2 style="margin:0 0 6px 0;color:#b91c1c;">ORDNANCE HANDOVER CERTIFICATE</h2>
      <div style="margin-bottom:18px;color:#555;">Reference: <b>${escapeHtml(docRef)}</b></div>
      <table style="width:100%;border-collapse:collapse;margin-bottom:18px;">
        <tr>
          <td style="padding:8px;"><b>Date:</b> ${escapeHtml(data.date || '')}</td>
          <td style="padding:8px;"><b>Team:</b> ${escapeHtml(data.teamNo || '')}</td>
        </tr>
        <tr>
          <td style="padding:8px;"><b>Supervisor:</b> ${escapeHtml(data.supervisor || '')}</td>
          <td style="padding:8px;"><b>Site / Task No:</b> ${escapeHtml(data.siteTaskNo || '')}</td>
        </tr>
        <tr>
          <td style="padding:8px;" colspan="2"><b>Recipient:</b> ${escapeHtml(data.recipientName || '')}</td>
        </tr>
      </table>
      <table style="width:100%;border-collapse:collapse;">
        <thead>
          <tr style="background:#7f1d1d;color:white;">
            <th style="padding:8px;border:1px solid #ddd;">#</th>
            <th style="padding:8px;border:1px solid #ddd;">EO Type</th>
            <th style="padding:8px;border:1px solid #ddd;">Description</th>
            <th style="padding:8px;border:1px solid #ddd;">Quantity</th>
            <th style="padding:8px;border:1px solid #ddd;">Remarks</th>
          </tr>
        </thead>
        <tbody>${rowsHtml}</tbody>
      </table>
      <div style="margin-top:48px;display:flex;justify-content:space-between;">
        <div>Submitted By: ____________________</div>
        <div>Received By: ____________________</div>
      </div>
    </div>`;

  return createPdfFile(html, docRef, OHC_PDF_FOLDER_ID);
}

/**
 * Processes the TJET Registry form and appends rows to 'TJET_Registry_Form_Response'.
 * Expects formData.items as a JSON string of objects: {siteForTeam,gpsN,gpsE,eoType,eoDesc,tjetType,tjetQty,remarks}
 */
function processTJET(formData) {
  try {
    requirePermission(FORM_KEYS.TJET_REGISTRY, 'submit');
  } catch (err) {
    return { success: false, error: err.toString() };
  }

  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const timestamp = new Date();
  const docRef = getNextDocRef('TJET_REG', formData.teamNo);
  try {
    const sheet = ss.getSheetByName('TJET_Registry_Form_Response');
    if (!sheet) throw new Error("Sheet 'TJET_Registry_Form_Response' not found.");
    const items = JSON.parse(formData.items || '[]');
    const pdfUrl = createTJETRegistryPDF(formData, docRef, items);
    if (items.length === 0) {
      sheet.appendRow([docRef, timestamp, formData.date || '', formData.teamNo || '', formData.siteLocation || '', formData.teamLeader || '', formData.taskNumber || '', '', '', '', '', '', '', 'No items', pdfUrl]);
    } else {
      items.forEach(function(item) {
        sheet.appendRow([
          docRef,
          timestamp,
          formData.date || '',
          formData.teamNo || '',
          formData.siteLocation || '',
          formData.teamLeader || '',
          formData.taskNumber || '',
          item.siteForTeam || '',
          item.gpsN || '',
          item.gpsE || '',
          item.eoType || '',
          item.eoDesc || '',
          item.tjetType || '',
          item.tjetQty || '',
          item.remarks || '',
          pdfUrl
        ]);
      });
    }
    return { success: true, ref: docRef, pdfUrl: pdfUrl };
  } catch (err) {
    return { success: false, error: err.toString() };
  }
}

function createTJETRegistryPDF(data, docRef, items) {
  let rowsHtml = '';
  if (items && items.length > 0) {
    items.forEach(function(item, idx) {
      rowsHtml += `
        <tr>
          <td style="padding:7px;border:1px solid #ddd;">${idx + 1}</td>
          <td style="padding:7px;border:1px solid #ddd;">${escapeHtml(item.siteForTeam || '')}</td>
          <td style="padding:7px;border:1px solid #ddd;font-family:monospace;">N: ${escapeHtml(item.gpsN || '')}<br>E: ${escapeHtml(item.gpsE || '')}</td>
          <td style="padding:7px;border:1px solid #ddd;">${escapeHtml(item.eoType || '')}</td>
          <td style="padding:7px;border:1px solid #ddd;">${escapeHtml(item.eoDesc || '')}</td>
          <td style="padding:7px;border:1px solid #ddd;">${escapeHtml(item.tjetType || '')}</td>
          <td style="padding:7px;border:1px solid #ddd;text-align:center;">${escapeHtml(item.tjetQty || '')}</td>
          <td style="padding:7px;border:1px solid #ddd;">${escapeHtml(item.remarks || '')}</td>
        </tr>`;
    });
  } else {
    rowsHtml = '<tr><td colspan="8" style="padding:12px;border:1px solid #ddd;text-align:center;">No items</td></tr>';
  }

  const html = `
    <div style="font-family:Arial,sans-serif;padding:24px;color:#222;">
      <h2 style="margin:0 0 6px 0;color:#1d4ed8;">TJET REGISTRY</h2>
      <div style="margin-bottom:16px;color:#555;">Reference: <b>${escapeHtml(docRef)}</b></div>
      <table style="width:100%;border-collapse:collapse;margin-bottom:16px;">
        <tr>
          <td style="padding:8px;"><b>Date:</b> ${escapeHtml(data.date || '')}</td>
          <td style="padding:8px;"><b>Team:</b> ${escapeHtml(data.teamNo || '')}</td>
        </tr>
        <tr>
          <td style="padding:8px;"><b>Site Location:</b> ${escapeHtml(data.siteLocation || '')}</td>
          <td style="padding:8px;"><b>Team Leader:</b> ${escapeHtml(data.teamLeader || '')}</td>
        </tr>
        <tr>
          <td style="padding:8px;" colspan="2"><b>Task Number:</b> ${escapeHtml(data.taskNumber || '')}</td>
        </tr>
      </table>
      <table style="width:100%;border-collapse:collapse;font-size:11px;">
        <thead>
          <tr style="background:#1d4ed8;color:white;">
            <th style="padding:7px;border:1px solid #ddd;">#</th>
            <th style="padding:7px;border:1px solid #ddd;">Site For Team</th>
            <th style="padding:7px;border:1px solid #ddd;">GPS</th>
            <th style="padding:7px;border:1px solid #ddd;">EO Type</th>
            <th style="padding:7px;border:1px solid #ddd;">EO Description</th>
            <th style="padding:7px;border:1px solid #ddd;">TJET Type</th>
            <th style="padding:7px;border:1px solid #ddd;">Qty</th>
            <th style="padding:7px;border:1px solid #ddd;">Remarks</th>
          </tr>
        </thead>
        <tbody>${rowsHtml}</tbody>
      </table>
    </div>`;

  return createPdfFile(html, docRef, TJET_REGISTRY_PDF_FOLDER_ID);
}

/**
 * Processes the TJET Receipt & Expenditure form and appends to
 * 'TJET_Receipt_and_Expenditure_Form_Response'.
 * Dynamic field detection maps both uppercase script fields and camelCase client parameters perfectly.
 */
function processTJETReceiptAndExpenditure(e) {
  try {
    requirePermission(FORM_KEYS.TJET_RECEIPT_EXPENDITURE, 'submit');
  } catch (err) {
    return { success: false, error: err.toString() };
  }

  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var sheetName = 'TJET_Receipt_and_Expenditure_Form_Response';
  var sheet = ss.getSheetByName(sheetName);
  if (!sheet) {
    return { success: false, error: "Sheet '" + sheetName + "' not found." };
  }

  try {
    var timestamp = new Date();
    var named = (e && e.namedValues) ? e.namedValues : (e || {});
    var teamNo = getNamedValue(named, ['teamNo', 'TEAM_NO', 'TEAM #', 'Team No', 'Team']) || 'TEAM';
    var docRef = getNextDocRef('TJET_REC_EXP', teamNo);

    // Repaired case-insensitive fallback mapping helper
    function getField() {
      for (var i = 0; i < arguments.length; i++) {
        var k = arguments[i];
        if (named[k] !== undefined && named[k] !== null) {
          return Array.isArray(named[k]) ? named[k].join(', ') : named[k];
        }
        // Fallback checks for camelCase vs snake_case mismatches
        var lowerK = normalizeNamedFieldKey(k);
        for (var key in named) {
          var lowerKey = normalizeNamedFieldKey(key);
          if (lowerK === lowerKey && named[key] !== undefined && named[key] !== null) {
            return Array.isArray(named[key]) ? named[key].join(', ') : named[key];
          }
        }
      }
      return '';
    }

    var pdfUrl = createTJETReceiptExpenditurePDF(named, docRef);
    var row = [
      docRef, // Doc_Ref_#
      timestamp, // Timestamp
      getField('DATE', 'Date', 'date'), // DATE
      getField('TEAM_NO', 'Team No', 'teamNo'), // TEAM_NO
      getField('RECEIVED', 'Received', 'received'), // RECEIVED
      getField('RECEIVED_QTY', 'Received Qty', 'RECEIVED QTY', 'receivedQty'), // RECEIVED_QTY
      getField('RECIPIENT_NAME', 'Recipient Name', 'Recipient', 'recipientName'), // RECIPIENT_NAME
      getField('EXPENDED', 'Expended', 'expended'), // EXPENDED
      getField('EXPENDED_QTY', 'Expended Qty', 'EXPENDED_QTY', 'expendedQty'), // EXPENDED_QTY
      getField('RETURNED', 'Returned', 'returned'), // RETURNED
      getField('RETURNED_QTY', 'Returned Qty', 'RETURNED_QTY', 'returnedQty'), // RETURNED_QTY
      getField('TYPES_DESTROYED', 'Types Destroyed', 'typesDestroyed'), // TYPES_DESTROYED
      getField('NUMBER_DESTROYED', 'Number Destroyed', 'NUMBER_DESTROYED', 'numberDestroyed'), // NUMBER_DESTROYED
      getField('MISFIRED_IGNITERS', 'Misfired Igniters', 'MISFIRED_IGNITERS', 'misfiredIgniters'), // MISFIRED_IGNITERS
      pdfUrl
    ];

    sheet.appendRow(row);
    const ledgerRowsCreated = appendTjetStockLedgerMovements(named, docRef, timestamp);
    Logger.log('processTJETReceiptAndExpenditure appended successfully: %s', JSON.stringify(row));
    return { success: true, ref: docRef, pdfUrl: pdfUrl, ledgerRowsCreated: ledgerRowsCreated };
  } catch (err) {
    Logger.log('processTJETReceiptAndExpenditure error: %s', err.toString());
    return { success: false, error: err.toString() };
  }
}

function parseQuantity(value) {
  const text = String(value === undefined || value === null ? '' : value).replace(/,/g, '').trim();
  const number = Number(text);
  return isNaN(number) ? 0 : number;
}

function normalizeItemName(value) {
  return String(value || '').trim() || 'Unspecified';
}

function normalizeNamedFieldKey(value) {
  return String(value || '').toLowerCase().replace(/[^a-z0-9]/g, '');
}

function dateIsCurrentMonth(value, now) {
  if (!value) return false;
  let date = value;
  if (!(Object.prototype.toString.call(date) === '[object Date]' && !isNaN(date.getTime()))) {
    date = new Date(String(value));
  }
  if (isNaN(date.getTime())) return false;
  return date.getFullYear() === now.getFullYear() && date.getMonth() === now.getMonth();
}

function getTjetItemMaster() {
  try {
    requirePermission(FORM_KEYS.TJET_RECEIPT_EXPENDITURE, 'view');
    const sheets = ensureTjetInventorySheets();
    const values = sheets.itemMaster.getDataRange().getValues();
    const items = [];
    for (let i = 1; i < values.length; i++) {
      const row = values[i];
      const code = String(row[0] || '').trim();
      const name = String(row[1] || '').trim();
      const active = row[4] === true || String(row[4] || '').toUpperCase() === 'TRUE' || row[4] === '';
      if (!code && !name) continue;
      if (!active) continue;
      items.push({
        code: code || name,
        name: name || code,
        category: String(row[2] || '').trim(),
        unit: String(row[3] || 'Units').trim(),
        minimumStock: parseQuantity(row[5]),
        notes: String(row[6] || '').trim()
      });
    }

    return { success: true, items: items };
  } catch (err) {
    return { success: false, error: err.toString(), items: [] };
  }
}

function lookupTjetItem(itemCode, itemName) {
  const sheets = ensureTjetInventorySheets();
  const values = sheets.itemMaster.getDataRange().getValues();
  const codeTarget = String(itemCode || '').trim();
  const nameTarget = String(itemName || '').trim();

  for (let i = 1; i < values.length; i++) {
    const row = values[i];
    const code = String(row[0] || '').trim();
    const name = String(row[1] || '').trim();
    if ((codeTarget && code === codeTarget) || (nameTarget && name === nameTarget)) {
      return {
        code: code || codeTarget || nameTarget,
        name: name || nameTarget || codeTarget,
        category: String(row[2] || '').trim(),
        unit: String(row[3] || 'Units').trim()
      };
    }
  }

  return {
    code: codeTarget,
    name: normalizeItemName(nameTarget || codeTarget),
    category: '',
    unit: 'Units'
  };
}

function getNamedValue(named, keys) {
  for (let i = 0; i < keys.length; i++) {
    const key = keys[i];
    if (named[key] !== undefined && named[key] !== null) {
      return Array.isArray(named[key]) ? named[key].join(', ') : named[key];
    }

    const lowerKey = normalizeNamedFieldKey(key);
    for (const namedKey in named) {
      const lowerNamedKey = normalizeNamedFieldKey(namedKey);
      if (lowerKey === lowerNamedKey && named[namedKey] !== undefined && named[namedKey] !== null) {
        return Array.isArray(named[namedKey]) ? named[namedKey].join(', ') : named[namedKey];
      }
    }
  }
  return '';
}

function makeTjetStockTransactionId(docRef, movementType, index) {
  return [
    docRef || 'TJET-REC-EXP',
    movementType || 'MOVE',
    String(index || 1).padStart(2, '0')
  ].join('_');
}

function appendTjetStockLedgerMovements(named, docRef, timestamp) {
  const sheets = ensureTjetInventorySheets();
  const submittedBy = getSubmittedBy();
  const date = getNamedValue(named, ['DATE', 'Date', 'date']);
  const teamNo = getNamedValue(named, ['TEAM_NO', 'Team No', 'teamNo']);
  const recipient = getNamedValue(named, ['RECIPIENT_NAME', 'Recipient Name', 'Recipient', 'recipientName']);
  const reason = getNamedValue(named, ['REASON', 'Reason', 'reason', 'typesDestroyed', 'TYPES_DESTROYED']);

  const candidates = [
    {
      movementType: getNamedValue(named, ['receivedMovementType', 'RECEIVED_MOVEMENT_TYPE']) || 'RECEIVED',
      itemCode: getNamedValue(named, ['receivedItemCode', 'RECEIVED_ITEM_CODE', 'itemCode']),
      itemName: getNamedValue(named, ['RECEIVED', 'Received', 'received']),
      quantity: parseQuantity(getNamedValue(named, ['RECEIVED_QTY', 'Received Qty', 'RECEIVED QTY', 'receivedQty']))
    },
    {
      movementType: 'EXPENDED',
      itemCode: getNamedValue(named, ['expendedItemCode', 'EXPENDED_ITEM_CODE', 'itemCode']),
      itemName: getNamedValue(named, ['EXPENDED', 'Expended', 'expended']),
      quantity: parseQuantity(getNamedValue(named, ['EXPENDED_QTY', 'Expended Qty', 'EXPENDED_QTY', 'expendedQty']))
    },
    {
      movementType: 'RETURNED',
      itemCode: getNamedValue(named, ['returnedItemCode', 'RETURNED_ITEM_CODE', 'itemCode']),
      itemName: getNamedValue(named, ['RETURNED', 'Returned', 'returned']),
      quantity: parseQuantity(getNamedValue(named, ['RETURNED_QTY', 'Returned Qty', 'RETURNED_QTY', 'returnedQty']))
    }
  ];

  const rows = [];
  candidates.forEach(function(candidate, idx) {
    if (!candidate.quantity) return;
    const item = lookupTjetItem(candidate.itemCode, candidate.itemName);
    rows.push([
      makeTjetStockTransactionId(docRef, candidate.movementType, idx + 1),
      timestamp,
      date,
      item.code,
      item.name,
      item.category,
      candidate.movementType,
      candidate.quantity,
      teamNo,
      recipient,
      docRef,
      reason,
      submittedBy,
      timestamp,
      'Active'
    ]);
  });

  if (rows.length) {
    sheets.ledger.getRange(sheets.ledger.getLastRow() + 1, 1, rows.length, TJET_STOCK_LEDGER_HEADERS.length).setValues(rows);
  }

  return rows.length;
}

function syncTjetLegacyReceiptRowsToLedger() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const sheets = ensureTjetInventorySheets();
  const legacySheet = getRequiredSheet(ss, RESPONSE_SHEETS.TJET_RECEIPT_EXPENDITURE);
  const ledgerValues = sheets.ledger.getDataRange().getValues();
  const migratedRefs = {};

  for (let i = 1; i < ledgerValues.length; i++) {
    const ref = String(ledgerValues[i][10] || '').trim();
    if (ref) migratedRefs[ref] = true;
  }

  const legacyValues = legacySheet.getDataRange().getValues();
  for (let i = 0; i < legacyValues.length; i++) {
    const row = legacyValues[i];
    const docRef = String(row[0] || '').trim();
    if (!docRef || docRef === 'Doc_Ref_#' || docRef.indexOf('TJET-REC-EXP') !== 0 || migratedRefs[docRef]) continue;

    const hasTeamColumn = /^T(EAM)?\d*/i.test(String(row[3] || '').trim());
    const named = hasTeamColumn ? {
      date: row[2],
      teamNo: row[3],
      received: row[4],
      receivedQty: row[5],
      recipientName: row[6],
      expended: row[7],
      expendedQty: row[8],
      returned: row[9],
      returnedQty: row[10],
      typesDestroyed: row[11]
    } : {
      date: row[2],
      received: row[3],
      receivedQty: row[4],
      recipientName: row[5],
      expended: row[6],
      expendedQty: row[7],
      returned: row[8],
      returnedQty: row[9],
      typesDestroyed: row[10]
    };

    appendTjetStockLedgerMovements(named, docRef, row[1] || new Date());
    migratedRefs[docRef] = true;
  }
}

function getTjetReceiptStats() {
  try {
    requirePermission(FORM_KEYS.TJET_RECEIPT_EXPENDITURE, 'view');
    syncTjetLegacyReceiptRowsToLedger();
    const sheets = ensureTjetInventorySheets();
    const values = sheets.ledger.getDataRange().getValues();
    const now = new Date();
    const itemMap = {};
    let totalReceived = 0;
    let totalExpended = 0;
    let totalReturned = 0;
    let totalPurchased = 0;
    let totalIssued = 0;
    let totalAdjustmentPositive = 0;
    let totalAdjustmentNegative = 0;
    let totalLostDamaged = 0;
    let expendedThisMonth = 0;
    let lastUpdated = '';
    let rowsCounted = 0;

    function ensureItem(name) {
      const key = normalizeItemName(name);
      if (!itemMap[key]) {
        itemMap[key] = { item: key, received: 0, issued: 0, expended: 0, returned: 0, balance: 0 };
      }
      return itemMap[key];
    }

    for (let i = 1; i < values.length; i++) {
      const row = values[i];
      const status = String(row[14] || '').trim();
      if (status && status.toLowerCase() !== 'active') continue;

      const date = row[2];
      const itemName = normalizeItemName(row[4] || row[3]);
      const movementType = String(row[6] || '').trim().toUpperCase();
      const quantity = parseQuantity(row[7]);
      if (!movementType || !quantity) continue;

      const item = ensureItem(itemName);
      if (movementType === 'PURCHASED') {
        totalPurchased += quantity;
        item.received += quantity;
      } else if (movementType === 'RECEIVED') {
        totalReceived += quantity;
        item.received += quantity;
      } else if (movementType === 'RETURNED') {
        totalReturned += quantity;
        item.returned += quantity;
      } else if (movementType === 'EXPENDED') {
        totalExpended += quantity;
        item.expended += quantity;
        if (dateIsCurrentMonth(date, now)) expendedThisMonth += quantity;
      } else if (movementType === 'ISSUED_TO_TEAM') {
        totalIssued += quantity;
        item.issued = (item.issued || 0) + quantity;
      } else if (movementType === 'ADJUSTMENT_POSITIVE') {
        totalAdjustmentPositive += quantity;
        item.received += quantity;
      } else if (movementType === 'ADJUSTMENT_NEGATIVE') {
        totalAdjustmentNegative += quantity;
        item.expended += quantity;
      } else if (movementType === 'DAMAGED' || movementType === 'LOST') {
        totalLostDamaged += quantity;
        item.expended += quantity;
      }

      rowsCounted++;
      lastUpdated = row[1] || lastUpdated;
    }

    const items = Object.keys(itemMap).sort().map(function(key) {
      const item = itemMap[key];
      item.balance = item.received - item.issued - item.expended + item.returned;
      return item;
    });

    return {
      success: true,
      totalReceived: totalPurchased + totalReceived,
      totalExpended: totalExpended,
      totalReturned: totalReturned,
      totalPurchased: totalPurchased,
      totalIssued: totalIssued,
      totalAdjustmentPositive: totalAdjustmentPositive,
      totalAdjustmentNegative: totalAdjustmentNegative,
      totalLostDamaged: totalLostDamaged,
      expendedThisMonth: expendedThisMonth,
      balance: (totalPurchased + totalReceived + totalReturned + totalAdjustmentPositive) - (totalExpended + totalIssued + totalAdjustmentNegative + totalLostDamaged),
      rowsCounted: rowsCounted,
      lastUpdated: lastUpdated ? String(lastUpdated) : '',
      formula: 'Balance = Purchased + Received + Returned + Positive Adjustments - Expended - Issued - Negative Adjustments - Lost/Damaged',
      items: items
    };
  } catch (err) {
    return { success: false, error: err.toString() };
  }
}

function createTJETReceiptExpenditurePDF(data, docRef) {
  function field() {
    for (var i = 0; i < arguments.length; i++) {
      var key = arguments[i];
      if (data[key] !== undefined && data[key] !== null) return Array.isArray(data[key]) ? data[key].join(', ') : data[key];
    }
    return '';
  }

  const html = `
    <div style="font-family:Arial,sans-serif;padding:28px;color:#222;">
      <h2 style="margin:0 0 6px 0;color:#0369a1;">TJET RECEIPT & EXPENDITURE</h2>
      <div style="margin-bottom:18px;color:#555;">Reference: <b>${escapeHtml(docRef)}</b></div>
      <table style="width:100%;border-collapse:collapse;">
        <tr>
          <td style="padding:9px;border:1px solid #ddd;"><b>Date</b></td>
          <td style="padding:9px;border:1px solid #ddd;">${escapeHtml(field('date', 'DATE', 'Date'))}</td>
        </tr>
        <tr>
          <td style="padding:9px;border:1px solid #ddd;"><b>Team</b></td>
          <td style="padding:9px;border:1px solid #ddd;">${escapeHtml(field('teamNo', 'TEAM_NO', 'Team No'))}</td>
        </tr>
        <tr>
          <td style="padding:9px;border:1px solid #ddd;"><b>Received</b></td>
          <td style="padding:9px;border:1px solid #ddd;">${escapeHtml(field('received', 'RECEIVED'))} / Qty: ${escapeHtml(field('receivedQty', 'RECEIVED_QTY'))}</td>
        </tr>
        <tr>
          <td style="padding:9px;border:1px solid #ddd;"><b>Recipient Name</b></td>
          <td style="padding:9px;border:1px solid #ddd;">${escapeHtml(field('recipientName', 'RECIPIENT_NAME'))}</td>
        </tr>
        <tr>
          <td style="padding:9px;border:1px solid #ddd;"><b>Expended</b></td>
          <td style="padding:9px;border:1px solid #ddd;">${escapeHtml(field('expended', 'EXPENDED'))} / Qty: ${escapeHtml(field('expendedQty', 'EXPENDED_QTY'))}</td>
        </tr>
        <tr>
          <td style="padding:9px;border:1px solid #ddd;"><b>Returned</b></td>
          <td style="padding:9px;border:1px solid #ddd;">${escapeHtml(field('returned', 'RETURNED'))} / Qty: ${escapeHtml(field('returnedQty', 'RETURNED_QTY'))}</td>
        </tr>
        <tr>
          <td style="padding:9px;border:1px solid #ddd;"><b>Targets Destroyed</b></td>
          <td style="padding:9px;border:1px solid #ddd;">${escapeHtml(field('typesDestroyed', 'TYPES_DESTROYED'))} / Number: ${escapeHtml(field('numberDestroyed', 'NUMBER_DESTROYED'))}</td>
        </tr>
        <tr>
          <td style="padding:9px;border:1px solid #ddd;"><b>Misfired Igniters</b></td>
          <td style="padding:9px;border:1px solid #ddd;">${escapeHtml(field('misfiredIgniters', 'MISFIRED_IGNITERS'))}</td>
        </tr>
      </table>
      <div style="margin-top:48px;">Signature: ______________________________</div>
    </div>`;

  return createPdfFile(html, docRef, TJET_RECEIPT_EXPENDITURE_PDF_FOLDER_ID);
}
