const messageSchema = require('./message-schema')
const wreck = require('@hapi/wreck')

class PublishEvent {
  constructor (endPoint, log = true) {
    this.endPoint = endPoint
    this.log = log
  }

  async sendEvent (jsonMessage) {
    if (this.endPoint) {
      const validationResult = messageSchema.validate(jsonMessage)

      if (validationResult.error) {
        throw new Error(`Protective monitoring event schema is invalid. ${validationResult.error.message}`)
      }

      try {
        await wreck.post(this.endPoint, {
          payload: jsonMessage,
          json: true
        })
      } catch (error) {
        console.error(`Unable to send protective monitoring event. ${error.message}`)
      }
    } else if (!this.endPoint && this.log) {
      console.log('Protective monitoring endpoint not set')
    }
  }
}

module.exports = PublishEvent
