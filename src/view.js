const renderFeedback = (elements, message, mode = 'danger') => {
  elements.feedbackEl.classList.remove('text-danger', 'text-success');
  elements.feedbackEl.classList.add(`text-${mode}`);
  elements.feedbackEl.textContent = message;
};

const handleProcessState = (elements, processState, i18nInstance) => {
  switch (processState) {
    case 'loaded':
      elements.form.reset();
      elements.fieldUrl.focus();
      renderFeedback(elements, i18nInstance.t('messages.success.loaded'), 'success');
      console.log(processState);
      break;

    case 'failed':
      console.log(processState);
      break;

    case 'loading':
      renderFeedback(elements, i18nInstance.t('messages.success.loading'), 'success');
      console.log(processState);
      break;

    case 'filling':
      elements.fieldUrl.focus();
      console.log(processState);
      break;

    default:
      throw new Error(`Unknown process state: ${processState}`);
  }
};

const render = (elements, i18nInstance) => (path, value) => {
  switch (path) {
    case 'form.valid':
      if (!value) {
        elements.fieldUrl.classList.add('is-invalid');
      } else {
        elements.fieldUrl.classList.remove('is-invalid');
      }
      break;

    case 'form.error':
      renderFeedback(elements, value);
      elements.fieldUrl.select();
      break;

    case 'form.processState':
      console.log(elements, value);
      handleProcessState(elements, value, i18nInstance);
      break;

    case 'form.processError':
      renderFeedback(elements, value);
      break;

    default:
      break;
  }
};

export default render;
