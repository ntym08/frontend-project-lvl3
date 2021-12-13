const handleProcessState = (elements, processState) => {
  switch (processState) {
    case 'sent':
      console.log(processState);
      break;

    case 'error':
      console.log(processState);
      break;

    case 'sending':
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
      if (value === false) {
        elements.fieldUrl.classList.add('is-invalid');
      } else {
        elements.fieldUrl.classList.remove('is-invalid');
      }
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
