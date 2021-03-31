const Joi = require('joi')

module.exports = Joi.object({
  user: Joi.string().required(),
  sessionid: Joi.string().required(),
  datetime: Joi.date().required(),
  environment: Joi.string().required(),
  version: Joi.string().required(),
  application: Joi.string().required(),
  component: Joi.string().required(),
  ip: Joi.string().required(),
  pmccode: Joi.string().required(),
  priority: Joi.string().required(),
  details: Joi.object({
    transactioncode: Joi.string().required(),
    message: Joi.string().required(),
    additionalinfo: Joi.string().required()
  })
})
