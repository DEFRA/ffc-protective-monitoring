const messageSchema = require('./message-schema')
const wreck = require('wreck')

class PublishEvent {
  constructor (endPoint, log = true) {
    this.endPoint = endPoint
    this.log = log
  }

  async sendEvent (jsonMessage) {
    try {
      if (this.endPoint === null || this.endPoint === '') {
        throw new Error('Protective Monitoring endpoint not set!')
      } else if (!this.log) {
        console.log('Protective Monitoring logging disabled!')
      } else {
        const validationResult = messageSchema.validate(jsonMessage)

        if (validationResult.error) {
          throw new Error(`JSON message is invalid. ${validationResult.error.message}`)
        }

        const { res, payload } = await wreck.post(this.endPoint, {
          payload: jsonMessage,
          json: true
        })
        console.log({ res })
        console.log({ payload })
      }
    } catch (error) {
      console.log(`sendEvent Error. ${error.message}`)
    }
  }
}

module.exports = PublishEvent
