import onChange from 'on-change';
import _ from 'lodash';
import i18next from 'i18next';
import axios from 'axios';
import ru from './locales/ru.js';
import render from './view.js';
import validate from './validation.js';

import parse from './parser.js';

const routes = {
  proxyUrl: (userUrl) => {
    const proxyUrl = new URL('https://hexlet-allorigins.herokuapp.com/get');
    proxyUrl.searchParams.set('disableCache', 'true');
    proxyUrl.searchParams.set('url', userUrl);
    return proxyUrl.toString();
  },
};

const checkForUpdates = () => {
  console.log('rere');
  setTimeout(checkForUpdates, 5000);
};

export default () => {
  const defaultLanguage = 'ru';
  const i18nInstance = i18next.createInstance();
  i18nInstance
    .init({
      lng: defaultLanguage,
      debug: false,
      resources: {
        ru,
      },
    })
    .catch((err) => console.log('something went wrong loading', err));

  const elements = {
    form: document.querySelector('.rss-form'),
    fieldUrl: document.getElementById('url-input'),
    submitButton: document.querySelector('button[type="submit"]'),
    feedbackEl: document.querySelector('.feedback'),
    postsContainer: document.querySelector('.posts'),
    feedsContainer: document.querySelector('.feeds'),
  };

  const state = onChange(
    {
      form: {
        valid: null,
        error: [],
        processState: 'filling',
        processError: null,
        fields: {
          url: '',
        },
      },

      feeds: [],
      posts: [],
    },
    render(elements, i18nInstance)
  );

  const handleSubmit = (e) => {
    e.preventDefault();
    const urlValue = new FormData(e.target).get('url').trim();
    state.form.fields.url = urlValue;
    const listUrls = state.feeds.map((feed) => feed.url);

    validate(state.form.fields.url, listUrls, i18nInstance)
      .then((errors) => {
        state.form.error = errors;
      })
      .then(() => {
        state.form.valid = _.isEmpty(state.form.error);
        if (state.form.valid) {
          state.form.processState = 'loading';
          state.form.processError = null;
          axios
            .get(routes.proxyUrl(state.form.fields.url))
            .then((response) => {
              const { feed, posts } = parse(response.data.contents, state.form.fields.url);
              state.feeds = [feed, ...state.feeds];
              state.posts = [...posts, ...state.posts];
              state.form.processState = 'loaded';
              console.log(state);
            })
            .catch((err) => {
              state.form.processState = 'failed';
              if (axios.isAxiosError(err)) {
                state.form.processError = i18nInstance.t('messages.errors.network');
              } else if (err.isParsingError) {
                state.form.processError = i18nInstance.t('messages.errors.no_rss');
              } else {
                state.form.processError = i18nInstance.t('messages.errors.unknown');
              }
              console.error(err);
            })
            .finally(() => {
              setTimeout(checkForUpdates, 5000);
            });
        } else {
          state.form.processState = 'filling';
        }
      });

    console.log(state);
  };

  elements.form.addEventListener('submit', handleSubmit);
};
