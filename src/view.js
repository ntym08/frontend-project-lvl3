const buildFeedbackElement = (content) => {
  const feedbackElement = document.createElement('p');
  feedbackElement.classList.add('feedback', 'm-0', 'position-absolute', 'small');
  feedbackElement.textContent = content;
  return feedbackElement;
};

const renderFormError = (elements, error) => {
  const feedbackElement = buildFeedbackElement(error);
  feedbackElement.classList.add('text-danger');
  const divEl = elements.form.parentElement;
  divEl.lastChild.remove();
  divEl.append(feedbackElement);
};

const handleProcessState = (elements, processState) => {
  switch (processState) {
    case 'loaded':
      console.log(processState);
      break;

    case 'error':
      console.log(processState);
      break;

    case 'getting':
      elements.form.reset();
      elements.fieldUrl.focus();
      break;

    case 'filling':
      console.log(processState);
      break;

    default:
      throw new Error(`Unknown process state: ${processState}`);
  }
};

const render = (elements) => (path, value) => {
  switch (path) {
    case 'form.valid':
      if (!value) {
        elements.fieldUrl.classList.add('is-invalid');
      } else {
        elements.fieldUrl.classList.remove('is-invalid');
      }
      break;

    case 'form.error':
      renderFormError(elements, value);
      break;

    case 'form.processState':
      console.log(elements, value);
      handleProcessState(elements, value);
      break;

    default:
      break;
  }
};

export default render;
