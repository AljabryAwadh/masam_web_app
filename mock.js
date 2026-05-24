// Local Apps Script browser mock for the VS Code simulator.
(function () {
  if (typeof window === 'undefined' || window.google?.script?.run) return;

  let successHandler = null;
  let failureHandler = null;

  function makeRef(prefix) {
    return `${prefix}-${Date.now()}`;
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
      respond({
        success: true,
        ref: makeRef('LOCAL-DWS'),
        pdfUrl: window.location.href
      });
      return runner;
    },
    processOHC(data) {
      console.log('Local mock processOHC:', data);
      respond({ success: true, ref: makeRef('LOCAL-OHC') });
      return runner;
    },
    processTJET(data) {
      console.log('Local mock processTJET:', data);
      respond({ success: true, ref: makeRef('LOCAL-TJET') });
      return runner;
    },
    processTJETReceiptAndExpenditure(data) {
      console.log('Local mock processTJETReceiptAndExpenditure:', data);
      respond({ success: true, ref: makeRef('LOCAL-TJET-REX') });
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
