const messageSchema = require('./message-schema')
const wreck = require('wreck')

class PublishEvent {
  constructor (endPoint, log = true) {
    this.endPoint = endPoint
    this.log = log
  }

  async sendEvent (jsonMessage) {
    if (this.endPoint === null) {
      console.log('Protective Monitoring end point not set!')
    } else if (!this.log) {
      console.log('Protective Monitoring logging disabled!')
    } else {
      await messageSchema.validateAsync(jsonMessage)

      const { res, payload } = await wreck.post(this.endPoint, {
        payload: jsonMessage,
        json: true
      })
      console.log({ res })
      console.log({ payload })
  }
}

module.exports = PublishEvent
