import onChange from 'on-change';
import _ from 'lodash';
import i18next from 'i18next';
import ru from './locales/ru.js';
import render from './view.js';
import validate from './validation.js';

export default () => {
  const defaultLanguage = 'ru';
  const newInstance = i18next.createInstance();
  newInstance
    .init({
      lng: defaultLanguage,
      debug: false,
      resources: {
        ru,
      },
    })
    .then(console.log)
    .catch((err) => console.log('something went wrong loading', err));

  const elements = {
    form: document.querySelector('.rss-form'),
    fieldUrl: document.getElementById('url-input'),
    submitButton: document.querySelector('button[type="submit"]'),
  };

  const state = onChange(
    {
      form: {
        valid: true,
        processState: 'filling',
        error: [],
        fields: {
          url: '',
        },
      },

      feeds: [{ url: 'https://ru.hexlet.io/lessons.rss', title: '', description: '' }],
      posts: [],
    },
    render(elements)
  );

  elements.form.addEventListener('submit', (e) => {
    e.preventDefault();
    const urlValue = new FormData(e.target).get('url').trim();
    state.form.fields.url = urlValue;
    const listUrls = state.feeds.map((feed) => feed.url);

    validate(state.form.fields.url, listUrls)
      .then((errors) => {
        state.form.error = errors;
      })
      .then(() => {
        state.form.valid = _.isEmpty(state.form.error);
        if (state.form.valid) {
          state.form.processState = 'sending';
        } else {
          state.form.processState = 'filling';
        }
      });

    console.log(state);
  });
};
