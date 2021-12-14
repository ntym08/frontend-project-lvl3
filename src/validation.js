import * as yup from 'yup';

yup.setLocale({
  string: {
    url: 'Ссылка должна быть валидным URL',
  },
  mixed: {
    notOneOf: 'RSS уже существует',
  },
});

export default (field, urls) => {
  const schema = yup.string().required().url().notOneOf(urls);
  return schema
    .validate(field)
    .then(() => [])
    .catch((err) => err.errors);
};
