import * as yup from 'yup';

export default (field, urls, i18nInstance) => {
  yup.setLocale({
    string: {
      url: i18nInstance.t('messages.errors.not_valid_url'),
    },
    mixed: {
      notOneOf: i18nInstance.t('messages.errors.already_exist_rss'),
      required: i18nInstance.t('messages.errors.not_empty'),
    },
  });

  const schema = yup.string().required().url().notOneOf(urls);
  return schema
    .validate(field)
    .then(() => [])
    .catch((err) => err.errors);
};
