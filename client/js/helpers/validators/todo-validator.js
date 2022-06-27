import Validator from '../validator.js';

const travelValidator = ({ title }) => {
  const errors = {};

  const titleValidator = new Validator(title)
    .required('Required')
    .max(32, 'Maximum 32 simboliai');
  if (titleValidator.hasErrors) errors.title = titleValidator.HTMLError;

  return errors;
}

export default travelValidator;
