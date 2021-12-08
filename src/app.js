import onChange from 'on-change';
import render from './view.js';

export default () => {
  const state = onChange(
    {
      form: {
        valid: true,
        errors: [],
        fields: {
          url: '',
        },
      },
    },
    render()
  );
  console.log(state);
};
