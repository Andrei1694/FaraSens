import Joi from 'joi';

const userValidationSchema = {
  create: Joi.object({
    email: Joi.string()
      .email()
      .required()
      .messages({
        'string.email': 'Please provide a valid email address',
        'any.required': 'Email is required'
      }),
    username: Joi.string()
      .min(3)
      .max(30)
      .pattern(/^[a-zA-Z0-9_]+$/)
      .required()
      .messages({
        'string.min': 'Username must be at least 3 characters long',
        'string.max': 'Username cannot exceed 30 characters',
        'string.pattern.base': 'Username can only contain letters, numbers, and underscores',
        'any.required': 'Username is required'
      }),
    password: Joi.string()
      .min(6)
      .required()
      .messages({
        'string.min': 'Password must be at least 6 characters long',
        'any.required': 'Password is required'
      }),
    firstName: Joi.string().min(1).max(50).optional(),
    lastName: Joi.string().min(1).max(50).optional(),
    role: Joi.string().valid('USER', 'ADMIN').optional()
  }),

  update: Joi.object({
    email: Joi.string().email().optional(),
    username: Joi.string()
      .min(3)
      .max(30)
      .pattern(/^[a-zA-Z0-9_]+$/)
      .optional(),
    firstName: Joi.string().min(1).max(50).optional(),
    lastName: Joi.string().min(1).max(50).optional(),
    role: Joi.string().valid('USER', 'ADMIN').optional(),
    isActive: Joi.boolean().optional()
  }).min(1),

  login: Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().required()
  })
};

export { userValidationSchema };
