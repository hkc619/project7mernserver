const joi = require("joi");

//register validation
const registerValidation = (data) => {
  const schema = joi.object({
    username: joi.string().min(3).max(50).required(),
    email: joi.string().min(10).max(100).required().email(),
    password: joi.string().min(8).max(255).required(),
    role: joi.string().required().valid("student", "instructor"),
  });
  return schema.validate(data);
};

const loginValidation = (data) => {
  const schema = joi.object({
    email: joi.string().min(10).max(100).required().email(),
    password: joi.string().min(8).max(255).required(),
  });
  return schema.validate(data);
};

const courseValidation = (data) => {
  const schema = joi.object({
    title: joi.string().min(10).max(50).required(),
    description: joi.string().min(20).max(200).required(),
    price: joi.number().min(100).max(1000).required(),
  });
  return schema.validate(data);
};

module.exports.registerValidation = registerValidation;
module.exports.loginValidation = loginValidation;
module.exports.courseValidation = courseValidation;
