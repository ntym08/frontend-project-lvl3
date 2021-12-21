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

const buildCardElement = (title) => {
  const cardEl = document.createElement('div');
  cardEl.classList.add('card', 'border-0');
  const cardBodyEl = document.createElement('div');
  cardBodyEl.classList.add('card-body');
  const cardTitleEl = document.createElement('h2');
  cardTitleEl.classList.add('card-title', 'h4');
  cardTitleEl.textContent = title;
  cardBodyEl.append(cardTitleEl);
  const listEl = document.createElement('ul');
  listEl.classList.add('list-group', 'border-0', 'rounded-0');
  cardEl.append(cardBodyEl, listEl);
  return { cardEl, listEl };
};

const renderPostsList = (elements, value, i18nInstance) => {
  elements.postsContainer.innerHTML = '';
  const { cardEl, listEl } = buildCardElement(i18nInstance.t('headings.posts'));
  elements.postsContainer.append(cardEl);

  const postsElements = value.map((post) => {
    const liEl = document.createElement('li');
    liEl.classList.add(
      'list-group-item',
      'd-flex',
      'justify-content-between',
      'align-items-start',
      'border-0',
      'border-end-0'
    );

    const aEl = document.createElement('a');
    aEl.classList.add('fw-bold');
    aEl.href = post.link;
    aEl.dataset.id = post.id;
    aEl.target = '_blank';
    aEl.rel = 'noopener noreferrer';
    aEl.textContent = post.title;

    const btnEl = document.createElement('button');
    btnEl.type = 'button';
    btnEl.classList.add('btn', 'btn-outline-primary', 'btn-sm');
    btnEl.dataset.id = post.id;
    btnEl.dataset.bsToggle = 'modal';
    btnEl.dataset.bsTarget = '#modal';
    btnEl.textContent = 'Просмотр';

    liEl.append(aEl, btnEl);
    return liEl;
  });
  listEl.append(...postsElements);
};

const renderFeedsList = (elements, value, i18nInstance) => {
  elements.feedsContainer.innerHTML = '';
  const { cardEl, listEl } = buildCardElement(i18nInstance.t('headings.feeds'));
  elements.feedsContainer.append(cardEl);

  const feedsElements = value.map((feed) => {
    const liEl = document.createElement('li');
    liEl.classList.add('list-group-item', 'border-0', 'border-end-0');

    const hEl = document.createElement('h3');
    hEl.classList.add('h6', 'm-0');
    hEl.textContent = feed.title;

    const pEl = document.createElement('p');
    pEl.classList.add('m-0', 'small', 'text-black-50');
    pEl.textContent = feed.description;

    liEl.append(hEl, pEl);
    return liEl;
  });
  listEl.append(...feedsElements);
};

const renderModal = (elements) => {
  const modalTitle = elements.modal.querySelector('.modal-title');
  const modalBody = elements.modal.querySelector('.modal-body');
  const linkResourse = elements.modal.querySelector('.resource');
  modalTitle.textContent = 'title';
  modalBody.textContent = 'description';
  linkResourse.href = 'http://ru';
  console.log(modalTitle, modalBody, linkResourse);
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

    case 'feeds':
      renderFeedsList(elements, value, i18nInstance);
      break;

    case 'posts':
      renderPostsList(elements, value, i18nInstance);
      break;

    case 'uiState.viewedPosts':
      value.forEach((id) => {
        const viewedPost = document.querySelector(`a[data-id="${id}"]`);
        viewedPost.classList.remove('fw-bold');
        viewedPost.classList.add('fw-normal', 'link-secondary');
      });
      break;

    case 'uiState.openedModal':
      renderModal(elements, value);
      break;

    default:
      break;
  }
};

export default render;
