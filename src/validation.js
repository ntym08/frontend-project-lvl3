import * as yup from 'yup';

export default (field, urls) => {
  const schema = yup.string().required().url('Ссылка должна быть валидным URL').notOneOf(urls, 'RSS уже существует');

  return schema
    .validate(field)
    .then(() => [])
    .catch((err) => err.errors);
};
