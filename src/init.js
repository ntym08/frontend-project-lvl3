// import onChange from 'on-change';
import * as yup from 'yup';
// import render from './view.js';

export default () => {
  const state = {
    form: {
      valid: true,
      errors: [],
      fields: {
        url: '',
      },
    },
    feeds: [{ url: '', title: '', description: '' }],
    posts: [],
  };
  const schema = yup
    .string()
    .required()
    .url('Ссылка должна быть валидным URL')
    .notOneOf(
      state.feeds.map((feed) => feed.url),
      'RSS уже существует'
    );

  const form = document.querySelector('.rss-form');
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const urlValue = new FormData(e.target).get('url').trim();
    state.form.fields.url = urlValue;

    schema
      .validate(state.form.fields.url)
      .then(() => {
        state.form.errors = [];
        state.form.valid = true;
      })
      .catch((err) => {
        state.form.valid = false;
        state.form.errors = err.errors;
      });
    console.log('state', state);
  });
};
