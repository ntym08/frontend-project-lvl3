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

const checkForUpdates = (watchedState) => {
  const promises = watchedState.feeds.map((feed) => axios
    .get(routes.proxyUrl(feed.url))
    .then((response) => {
      const { posts: updatePosts } = parse(response.data.contents, feed.url);
      const currentPosts = watchedState.posts
        .filter((post) => post.feedId === feed.id)
        .map((post) => post.title);
      const newPosts = updatePosts.filter((post) => !currentPosts.includes(post.title));
      const newPostsWithId = newPosts.map((post) => ({
        ...post,
        feedId: feed.id,
        id: _.uniqueId(),
      }));
      watchedState.posts = [...newPostsWithId, ...watchedState.posts];
    })
    .catch((err) => {
      console.error(err);
    }));

  Promise.all(promises).finally(() => setTimeout(() => checkForUpdates(watchedState), 5000));
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
    .catch((err) => console.error('something went wrong loading', err));

  const elements = {
    form: document.querySelector('.rss-form'),
    fieldUrl: document.getElementById('url-input'),
    submitButton: document.querySelector('button[type="submit"]'),
    feedbackEl: document.querySelector('.feedback'),
    postsContainer: document.querySelector('.posts'),
    feedsContainer: document.querySelector('.feeds'),
    modal: document.querySelector('#modal'),
  };

  const state = {
    form: {
      valid: null,
      error: [],
      fields: {
        url: '',
      },
    },
    processState: 'filling',
    processError: null,
    feeds: [],
    posts: [],
    uiState: {
      viewedPosts: new Set(),
      openedModal: null,
    },
  };

  const watchedState = onChange(state, render(elements, i18nInstance, state));

  const handleSubmit = (e) => {
    e.preventDefault();
    const urlValue = new FormData(e.target).get('url').trim();
    watchedState.form.fields.url = urlValue;
    const listUrls = watchedState.feeds.map((feed) => feed.url);

    validate(watchedState.form.fields.url, listUrls, i18nInstance)
      .then((errors) => {
        watchedState.form.error = errors;
      })
      .then(() => {
        watchedState.form.valid = _.isEmpty(watchedState.form.error);
        if (watchedState.form.valid) {
          watchedState.processState = 'loading';
          watchedState.processError = null;
          axios
            .get(routes.proxyUrl(watchedState.form.fields.url))
            .then((response) => {
              const { feed, posts } = parse(response.data.contents, watchedState.form.fields.url);
              const feedWithId = { ...feed, id: _.uniqueId() };
              const postsWithId = posts.map((post) => ({
                ...post,
                feedId: feedWithId.id,
                id: _.uniqueId(),
              }));
              watchedState.feeds = [feedWithId, ...watchedState.feeds];
              watchedState.posts = [...postsWithId, ...watchedState.posts];
              watchedState.processState = 'loaded';
            })
            .catch((err) => {
              state.processState = 'failed';
              if (err.isAxiosError) {
                watchedState.processError = i18nInstance.t('messages.errors.network');
              } else if (err.isParsingError) {
                watchedState.processError = i18nInstance.t('messages.errors.no_rss');
              } else {
                watchedState.processError = i18nInstance.t('messages.errors.unknown');
              }
              console.error(err);
            });
        } else {
          watchedState.processState = 'filling';
        }
      });
  };

  const handleClik = (e) => {
    if (e.target.dataset.id) {
      const { id: idViewedPost } = e.target.dataset;
      watchedState.uiState.viewedPosts.add(idViewedPost);
      watchedState.uiState.openedModal = idViewedPost;
    }
  };

  elements.form.addEventListener('submit', handleSubmit);
  elements.postsContainer.addEventListener('click', handleClik);

  setTimeout(() => checkForUpdates(watchedState), 5000);
};
