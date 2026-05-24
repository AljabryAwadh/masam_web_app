const IMAGE_FOLDER_ID = '1x_QaizeAmXCRn6RewqiqfNUpGw-zyYM4'; // ERW Images
const PDF_FOLDER_ID = '1daR-L_mVPvxSlvyUHcYkGVOgpP54UPvg'; // TJET Receipt and Expenditure PDF Forms

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

/**
 * Processes the form data, saves to 3 sheets, and generates a PDF.
 */
function processForm(formData) {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const timestamp = new Date();
  const docRef = "EOD-" + timestamp.getTime(); // Unique Reference based on timestamp
  
  try {
    // 1. Log Task Response
    const sheetTask = ss.getSheetByName('Form_Task_Response');
    if (!sheetTask) throw new Error("Sheet 'Form_Task_Response' not found.");
    sheetTask.appendRow([
      timestamp, 
      docRef, 
      formData.taskDetails, 
      formData.taskStartDate, 
      formData.taskCompleteDate || 'N/A', 
      formData.date, 
      formData.teamNo, 
      formData.siteAddress, 
      formData.teamLeader, 
      formData.gpsN, 
      formData.gpsE
    ]);

    // 2. Log Work Summary
    const sheetSummary = ss.getSheetByName('Form_Work_Summary_Response');
    if (!sheetSummary) throw new Error("Sheet 'Form_Work_Summary_Response' not found.");
    sheetSummary.appendRow([
      docRef, 
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
      formData.workDetails || ''
    ]);

    // 3. Log ERW Finds
    const sheetERW = ss.getSheetByName('Form_ERW_Finds_Response');
    if (!sheetERW) throw new Error("Sheet 'Form_ERW_Finds_Response' not found.");
    
    const erwData = JSON.parse(formData.erwRows || '[]');
    const processedErwRows = [];

    erwData.forEach((row) => {
      let imageUrl = "";
      if (row.imageBase64) {
        // Filename cleaning: Replace dots and spaces with underscores
        const latClean = (row.eoN || '0').replace(/[\s\.]+/g, '_');
        const lonClean = (row.eoE || '0').replace(/[\s\.]+/g, '_');
        const fileName = `${formData.teamNo}_${formData.date}_${latClean}_${lonClean}`;
        imageUrl = saveToDrive(row.imageBase64, fileName);
      }
      
      const lastRow = sheetERW.getLastRow() + 1;
      const imageFormula = imageUrl ? `=IMAGE("${imageUrl}")` : "No Image";
      
      sheetERW.appendRow([
        docRef, 
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
        imageFormula
      ]);

      // Set cell size for the image display in Google Sheets (200x200)
      if (imageUrl) {
        sheetERW.setRowHeight(lastRow, 200);
        sheetERW.setColumnWidth(14, 200); // Column N
      }

      // Add local URL to rows list for custom PDF rendering
      processedErwRows.push({
        ...row,
        savedImageUrl: imageUrl
      });
    });

    // 4. Generate the PDF with the compiled data
    const pdfUrl = createPDF(formData, docRef, processedErwRows);

    return { success: true, ref: docRef, pdfUrl: pdfUrl };
  } catch (e) {
    return { success: false, error: e.toString() };
  }
}

/**
 * Saves base64 image data to Google Drive as a JPEG.
 */
function saveToDrive(base64, name) {
  try {
    const folder = DriveApp.getFolderById(IMAGE_FOLDER_ID);
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
  const folder = DriveApp.getFolderById(PDF_FOLDER_ID);
  
  // Build ERW rows HTML markup
  let erwRowsHtml = '';
  if (erwRows && erwRows.length > 0) {
    erwRows.forEach((row, idx) => {
      const status = row.removed ? 'Removed / تم النقل' : (row.leftOnSite ? 'Left on Site / ترك بالموقع' : 'N/A');
      const inlineImg = row.imageBase64 
        ? `<img src="${row.imageBase64}" style="max-height: 120px; width: auto; border-radius: 4px; display: block; margin: 0 auto;"/>`
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
  
  const blob = Utilities.newBlob(html, "text/html", docRef + ".html");
  const pdf = folder.createFile(blob.getAs("application/pdf"));
  return pdf.getUrl();
}

/**
 * Processes the Ordnance Handover Certificate form and appends rows to 'OHC_Form_Response'.
 * Expects formData.items as a JSON string of objects: {eoType, description, quantity, remarks}
 */
function processOHC(formData) {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const timestamp = new Date();
  const docRef = 'OHC-' + timestamp.getTime();
  try {
    const sheet = ss.getSheetByName('OHC_Form_Response');
    if (!sheet) throw new Error("Sheet 'OHC_Form_Response' not found.");

    const items = JSON.parse(formData.items || '[]');
    if (items.length === 0) {
      sheet.appendRow([docRef, timestamp, formData.date || '', formData.teamNo || '', formData.supervisor || '', formData.siteTaskNo || '', '', '', '', formData.recipientName || '', 'No items']);
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
          item.remarks || ''
        ]);
      });
    }

    return { success: true, ref: docRef };
  } catch (err) {
    return { success: false, error: err.toString() };
  }
}

/**
 * Processes the TJET Registry form and appends rows to 'TJET_Registry_Form_Response'.
 * Expects formData.items as a JSON string of objects: {siteForTeam,gpsN,gpsE,eoType,eoDesc,tjetType,tjetQty,remarks}
 */
function processTJET(formData) {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const timestamp = new Date();
  const docRef = 'TJET-' + timestamp.getTime();
  try {
    const sheet = ss.getSheetByName('TJET_Registry_Form_Response');
    if (!sheet) throw new Error("Sheet 'TJET_Registry_Form_Response' not found.");
    const items = JSON.parse(formData.items || '[]');
    if (items.length === 0) {
      sheet.appendRow([docRef, timestamp, formData.date || '', formData.teamNo || '', formData.siteLocation || '', formData.teamLeader || '', formData.taskNumber || '', '', '', '', '', '', '', 'No items']);
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
          item.remarks || ''
        ]);
      });
    }
    return { success: true, ref: docRef };
  } catch (err) {
    return { success: false, error: err.toString() };
  }
}

/**
 * Processes the TJET Receipt & Expenditure form and appends to
 * 'TJET_Receipt_and_Expenditure_Form_Response'.
 * Dynamic field detection maps both uppercase script fields and camelCase client parameters perfectly.
 */
function processTJETReceiptAndExpenditure(e) {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var sheetName = 'TJET_Receipt_and_Expenditure_Form_Response';
  var sheet = ss.getSheetByName(sheetName);
  if (!sheet) {
    return { success: false, error: "Sheet '" + sheetName + "' not found." };
  }

  try {
    var timestamp = new Date();
    var docRef = 'TJET-REX-' + timestamp.getTime();
    var named = (e && e.namedValues) ? e.namedValues : (e || {});

    // Repaired case-insensitive fallback mapping helper
    function getField() {
      for (var i = 0; i < arguments.length; i++) {
        var k = arguments[i];
        if (named[k] !== undefined && named[k] !== null) {
          return Array.isArray(named[k]) ? named[k].join(', ') : named[k];
        }
        // Fallback checks for camelCase vs snake_case mismatches
        var lowerK = k.toLowerCase().replace(/_/g, '');
        for (var key in named) {
          var lowerKey = key.toLowerCase().replace(/_/g, '');
          if (lowerK === lowerKey && named[key] !== undefined && named[key] !== null) {
            return Array.isArray(named[key]) ? named[key].join(', ') : named[key];
          }
        }
      }
      return '';
    }

    var row = [
      docRef, // Doc_Ref_#
      timestamp, // Timestamp
      getField('DATE', 'Date', 'date'), // DATE
      getField('RECEIVED', 'Received', 'received'), // RECEIVED
      getField('RECEIVED_QTY', 'Received Qty', 'RECEIVED QTY', 'receivedQty'), // RECEIVED_QTY
      getField('RECIPIENT_NAME', 'Recipient Name', 'Recipient', 'recipientName'), // RECIPIENT_NAME
      getField('EXPENDED', 'Expended', 'expended'), // EXPENDED
      getField('EXPENDED_QTY', 'Expended Qty', 'EXPENDED_QTY', 'expendedQty'), // EXPENDED_QTY
      getField('RETURNED', 'Returned', 'returned'), // RETURNED
      getField('RETURNED_QTY', 'Returned Qty', 'RETURNED_QTY', 'returnedQty'), // RETURNED_QTY
      getField('TYPES_DESTROYED', 'Types Destroyed', 'typesDestroyed'), // TYPES_DESTROYED
      getField('NUMBER_DESTROYED', 'Number Destroyed', 'NUMBER_DESTROYED', 'numberDestroyed'), // NUMBER_DESTROYED
      getField('MISFIRED_IGNITERS', 'Misfired Igniters', 'MISFIRED_IGNITERS', 'misfiredIgniters') // MISFIRED_IGNITERS
    ];

    sheet.appendRow(row);
    Logger.log('processTJETReceiptAndExpenditure appended successfully: %s', JSON.stringify(row));
    return { success: true, ref: docRef };
  } catch (err) {
    Logger.log('processTJETReceiptAndExpenditure error: %s', err.toString());
    return { success: false, error: err.toString() };
  }
}