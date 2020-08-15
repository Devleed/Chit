export default body => {
  let formErrors = {};

  for (let key in body) {
    if (body[key] === '') {
      formErrors = { ...formErrors, [key]: 'field should not be empty' };
    } else if (key === 'gender' && body[key] === 'gender') {
      formErrors = { ...formErrors, [key]: 'please, select your gender' };
    } else if (
      key === 'confirmPassword' &&
      body.password !== body.confirmPassword
    ) {
      formErrors = {
        ...formErrors,
        confirmPassword: 'password does not match'
      };
    }
  }

  return formErrors;
};
