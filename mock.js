// Local Apps Script browser mock for the VS Code simulator.
(function () {
  if (typeof window === 'undefined' || window.google?.script?.run) return;

  let successHandler = null;
  let failureHandler = null;

  const counters = {};

  function makeRef(prefix, teamNo, width) {
    const team = String(teamNo || 'TEAM').trim().replace(/[^A-Za-z0-9-]/g, '_') || 'TEAM';
    const key = `${prefix}_${team}`;
    counters[key] = (counters[key] || 0) + 1;
    return `${prefix}_${team}_${String(counters[key]).padStart(width, '0')}`;
  }

  function localPdfUrl(ref) {
    return `${window.location.origin}/local-pdf/${encodeURIComponent(ref)}.pdf`;
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
    processForm(data) {
      console.log('Local mock processForm:', data);
      const ref = makeRef('DWS', data.teamNo, 5);
      respond({
        success: true,
        ref,
        pdfUrl: localPdfUrl(ref)
      });
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
      respond({ success: true, ref, pdfUrl: localPdfUrl(ref) });
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
