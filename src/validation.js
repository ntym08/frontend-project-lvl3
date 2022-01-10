import * as yup from 'yup';

export default (field, urls) => {
  yup.setLocale({
    string: {
      url: 'messages.errors.not_valid_url',
    },
    mixed: {
      notOneOf: 'messages.errors.already_exist_rss',
      required: 'messages.errors.not_empty',
    },
  });

  const schema = yup.string().required().url().notOneOf(urls);
  return schema
    .validate(field);
};
