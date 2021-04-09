const Joi = require('joi')

module.exports = Joi.object({
  user: Joi.string().optional(),
  sessionid: Joi.string().required(),
  datetime: Joi.date().required(),
  version: Joi.string().required(),
  application: Joi.string().required(),
  component: Joi.string().required(),
  ip: Joi.string().required(),
  pmccode: Joi.string().required(),
  priority: Joi.string().required(),
  details: Joi.object({
    transactioncode: Joi.string().optional(),
    message: Joi.string().optional(),
    additionalinfo: Joi.string().optional()
  })
})
