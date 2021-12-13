const render = (elements) => (path, value) => {
  switch (path) {
    case 'form.valid': {
      if (value === false) {
        elements.fieldUrl.classList.add('is-invalid');
      } else {
        elements.fieldUrl.classList.remove('is-invalid');
      }
      break;
    }
    default:
      break;
  }
};

export default render;
