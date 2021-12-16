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

const getRssInfo = (htmlContent, url) => {
  const channel = htmlContent.querySelector('channel');
  const feedTitle = channel.querySelector('title').textContent;
  const feedDescription = channel.querySelector('description').textContent;
  const feed = {
    id: _.uniqueId(),
    title: feedTitle,
    description: feedDescription,
    url,
  };
  const posts = Array.from(channel.querySelectorAll('item')).map((item) => {
    const postTitle = item.querySelector('title').textContent;
    const postDescription = item.querySelector('description').textContent;
    const postLink = item.querySelector('link').textContent;
    const post = {
      id: _.uniqueId(),
      feedId: feed.id,
      title: postTitle,
      description: postDescription,
      link: postLink,
    };
    return post;
  });
  return { feed, posts };
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
  };

  const state = onChange(
    {
      form: {
        valid: null,
        error: [],
        processState: 'filling',
        processError: [],
        fields: {
          url: '',
        },
      },

      feeds: [],
      posts: [],
    },
    render(elements)
  );

  const handleSubmit = (e) => {
    e.preventDefault();
    const urlValue = new FormData(e.target).get('url').trim();
    state.form.fields.url = urlValue;
    const listUrls = state.feeds.map((feed) => feed.url);

    const error = validate(state.form.fields.url, listUrls, i18nInstance);
    error
      .then((errors) => {
        state.form.error = errors;
      })
      .then(() => {
        state.form.valid = _.isEmpty(state.form.error);
        if (state.form.valid) {
          state.form.processState = 'getting';
          state.form.processError = null;
          axios
            .get(routes.proxyUrl(state.form.fields.url))
            // .catch((err) => {
            //   // state.form.processError = ['Ошибка сети'];
            //   console.error(err);
            // })
            .then((response) => parse(response.data.contents))
            .then((htmlContent) => {
              state.form.processState = 'loaded';
              const { feed, posts } = getRssInfo(htmlContent, state.form.fields.url);
              state.feeds.push(feed);
              state.posts.push(...posts);
              console.log(state);
            })
            .catch((err) => {
              state.form.processState = 'error';
              state.form.processError = [i18nInstance.t('messages.errors.network_error')];
              console.error(err);
            });
        } else {
          state.form.processState = 'filling';
        }
      });

    console.log(state);
  };

  elements.form.addEventListener('submit', handleSubmit);
};
