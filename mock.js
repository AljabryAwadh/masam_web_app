// Local Apps Script browser mock for the VS Code simulator.
(function () {
  if (typeof window === 'undefined' || window.google?.script?.run) return;

  let successHandler = null;
  let failureHandler = null;

  const counters = {};
  const dwsSubmissions = {};
  const tjetReceiptRows = [];
  const tjetItemMaster = [
    { code: 'TJET-DEMO-001', name: 'TJET Demo Item', category: 'Demo', unit: 'Units', minimumStock: 0, notes: 'Local mock item' }
  ];
  const validationLists = {
    TEAM_NO: ['T34', 'T35', 'T36', 'T37', 'T38', 'T39', 'T40', 'T41', 'T42', 'T43', 'T44']
      .map((value, index) => ({ value, labelEn: value, labelAr: '', sortOrder: index + 1, notes: 'Local mock' })),
    EO_TYPE: [
      ['AP', 'مضاد للأفراد'],
      ['AT', 'مضاد للدبابات'],
      ['IED', 'عبوة ناسفة'],
      ['UXO', 'الذخائر غير المنفجرة'],
      ['FUZES', 'فيوزات'],
      ['PROJECTILES', 'المقذوفات'],
      ['PRESSURE PLATES', 'دواسات'],
      ['ROUNDS', 'الطالقت']
    ].map(([value, labelAr], index) => ({ value, labelEn: value, labelAr, sortOrder: index + 1, notes: 'Local mock' })),
    TASK_TYPE: [
      ['TJET Operations', 'عمليات TJET'],
      ['Mine Field Clearance', 'إزالة حقول الألغام'],
      ['Non Technical Survey', 'المسح غير تقني'],
      ['Training', 'تدريب'],
      ['Technical Survey', 'المسح تقني'],
      ['EO Transport', 'نقل الذخائر المتفجرة']
    ].map(([value, labelAr], index) => ({ value, labelEn: value, labelAr, sortOrder: index + 1, notes: 'Local mock' }))
  };

  function makeRef(prefix, teamNo, width) {
    const team = String(teamNo || 'TEAM').trim().replace(/[^A-Za-z0-9-]/g, '_') || 'TEAM';
    const key = `${prefix}_${team}`;
    counters[key] = (counters[key] || 0) + 1;
    return `${prefix}_${team}_${String(counters[key]).padStart(width, '0')}`;
  }

  function localPdfUrl(ref) {
    return `${window.location.origin}/local-pdf/${encodeURIComponent(ref)}.pdf`;
  }

  function localFolderUrl(ref) {
    return `${window.location.origin}/local-folder/${encodeURIComponent(ref)}`;
  }

  function toNumber(value) {
    const number = Number(String(value || '').replace(/,/g, ''));
    return Number.isFinite(number) ? number : 0;
  }

  function currentMonth(dateValue) {
    const date = new Date(dateValue);
    const now = new Date();
    return Number.isFinite(date.getTime()) && date.getFullYear() === now.getFullYear() && date.getMonth() === now.getMonth();
  }

  function buildTjetReceiptStats() {
    const itemMap = {};
    let totalReceived = 0;
    let totalExpended = 0;
    let totalReturned = 0;
    let expendedThisMonth = 0;

    function item(name) {
      const key = String(name || '').trim() || 'Unspecified';
      itemMap[key] = itemMap[key] || { item: key, received: 0, expended: 0, returned: 0, balance: 0 };
      return itemMap[key];
    }

    tjetReceiptRows.forEach(row => {
      const receivedQty = toNumber(row.receivedQty);
      const expendedQty = toNumber(row.expendedQty);
      const returnedQty = toNumber(row.returnedQty);
      totalReceived += receivedQty;
      totalExpended += expendedQty;
      totalReturned += returnedQty;
      if (currentMonth(row.date)) expendedThisMonth += expendedQty;
      if (receivedQty) item(row.received).received += receivedQty;
      if (expendedQty) item(row.expended).expended += expendedQty;
      if (returnedQty) item(row.returned).returned += returnedQty;
    });

    const items = Object.keys(itemMap).sort().map(key => {
      const row = itemMap[key];
      row.balance = row.received - row.expended + row.returned;
      return row;
    });

    return {
          success: true,
          totalReceived,
          totalExpended,
          totalReturned,
          totalPurchased: 0,
          totalIssued: 0,
          totalAdjustmentPositive: 0,
          totalAdjustmentNegative: 0,
          totalLostDamaged: 0,
          expendedThisMonth,
          balance: totalReceived - totalExpended + totalReturned,
          rowsCounted: tjetReceiptRows.length,
          formula: 'Balance = Purchased + Received + Returned + Positive Adjustments - Expended - Issued - Negative Adjustments - Lost/Damaged',
          items
    };
  }

  function respond(result) {
    const onSuccess = successHandler;
    successHandler = null;
    failureHandler = null;
    setTimeout(() => {
      if (onSuccess) onSuccess(result);
    }, 350);
  }

  function fail(error) {
    const onFailure = failureHandler;
    successHandler = null;
    failureHandler = null;
    setTimeout(() => {
      if (onFailure) onFailure(error);
      else console.error(error);
    }, 350);
  }

  const runner = {
    withSuccessHandler(callback) {
      successHandler = callback;
      return runner;
    },
    withFailureHandler(callback) {
      failureHandler = callback;
      return runner;
    },
    getScriptUrl() {
      respond(window.location.origin + window.location.pathname);
      return runner;
    },
    getValidationLists(keys) {
      const requestedKeys = Array.isArray(keys) && keys.length ? keys : Object.keys(validationLists);
      const result = requestedKeys.reduce((acc, key) => {
        acc[key] = validationLists[key] || [];
        return acc;
      }, {});
      respond(result);
      return runner;
    },
    processForm(data) {
      console.log('Local mock processForm:', data);
      const ref = makeRef('DWS', data.teamNo, 5);
      dwsSubmissions[ref] = {
        formData: { ...data, docRef: ref, status: 'Submitted', pdfUrl: localPdfUrl(ref), folderUrl: localFolderUrl(ref) },
        erwRows: JSON.parse(data.erwRows || '[]').map(row => ({
          ...row,
          existingImageUrl: row.existingImageUrl || ''
        }))
      };
      respond({
        success: true,
        ref,
        pdfUrl: localPdfUrl(ref),
        folderUrl: localFolderUrl(ref)
      });
      return runner;
    },
    getDwsSubmission(ref) {
      console.log('Local mock getDwsSubmission:', ref);
      const record = dwsSubmissions[String(ref || '').trim()];
      if (!record || record.deleted) {
        respond({ success: false, error: 'No local mock DWS submission found for ' + ref });
      } else {
        respond({ success: true, ref, formData: record.formData, erwRows: record.erwRows });
      }
      return runner;
    },
    updateDwsSubmission(data) {
      console.log('Local mock updateDwsSubmission:', data);
      const ref = String(data.docRef || '').trim();
      if (!ref || !dwsSubmissions[ref]) {
        respond({ success: false, error: 'No local mock DWS submission found for update.' });
      } else {
        dwsSubmissions[ref] = {
          formData: { ...data, docRef: ref, status: 'Updated', pdfUrl: localPdfUrl(ref), folderUrl: localFolderUrl(ref) },
          erwRows: JSON.parse(data.erwRows || '[]').map(row => ({
            ...row,
            existingImageUrl: row.existingImageUrl || ''
          }))
        };
        respond({ success: true, ref, updated: true, pdfUrl: localPdfUrl(ref), folderUrl: localFolderUrl(ref) });
      }
      return runner;
    },
    deleteDwsSubmission(ref) {
      console.log('Local mock deleteDwsSubmission:', ref);
      const key = String(ref || '').trim();
      if (!key || !dwsSubmissions[key]) {
        respond({ success: false, error: 'No local mock DWS submission found for delete.' });
      } else {
        dwsSubmissions[key].deleted = true;
        dwsSubmissions[key].formData.status = 'Deleted';
        respond({ success: true, ref: key, deleted: true });
      }
      return runner;
    },
    processOHC(data) {
      console.log('Local mock processOHC:', data);
      const ref = makeRef('OHC', data.teamNo, 5);
      respond({ success: true, ref, pdfUrl: localPdfUrl(ref) });
      return runner;
    },
    processTJET(data) {
      console.log('Local mock processTJET:', data);
      const ref = makeRef('TJET-REG', data.teamNo, 5);
      respond({ success: true, ref, pdfUrl: localPdfUrl(ref) });
      return runner;
    },
    processTJETReceiptAndExpenditure(data) {
      console.log('Local mock processTJETReceiptAndExpenditure:', data);
      const ref = makeRef('TJET-REC-EXP', data.teamNo, 3);
      tjetReceiptRows.push({ ...data, ref });
      respond({ success: true, ref, pdfUrl: localPdfUrl(ref) });
      return runner;
    },
    getTjetItemMaster() {
      console.log('Local mock getTjetItemMaster');
      respond({ success: true, items: tjetItemMaster });
      return runner;
    },
    getTjetReceiptStats() {
      console.log('Local mock getTjetReceiptStats');
      respond(buildTjetReceiptStats());
      return runner;
    },
    simulateFailure(message) {
      fail(new Error(message || 'Local mock failure'));
      return runner;
    }
  };

  window.google = {
    script: {
      run: runner
    }
  };
})();
