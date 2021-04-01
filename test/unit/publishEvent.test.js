const PublishEvent = require('../../app/protective-monitoring/publish-event')
let messageSchema = require('../../app/protective-monitoring/message-schema')
let wreck = require('wreck')

describe('Publish Event', () => {
  beforeEach(() => {
    wreck = {
      post: jest.fn()
    }

    messageSchema = {
      validateAsync: jest.fn()
    }
  })

  afterEach(() => {
    jest.resetAllMocks()
  })

  test('Null endpoint supplied', async function () {
    const publishEvent = new PublishEvent(null)

    await publishEvent.sendEvent('test json')

    expect(wreck.post).toHaveBeenCalledTimes(0)
    expect(messageSchema.validateAsync).toHaveBeenCalledTimes(0)
  })

  test('No logging into protective monitoring', async function () {
    const publishEvent = new PublishEvent('test', false)

    await publishEvent.sendEvent('test json')

    expect(wreck.post).toHaveBeenCalledTimes(0)
    expect(messageSchema.validateAsync).toHaveBeenCalledTimes(0)
  })

  test('Protective monitoring successfully called', async function () {
    const publishEvent = new PublishEvent('test')

    const data = {
      user: 'IDM/8b7c6b0a-4ea2-e911-a971-000d3a28d1a0',
      sessionid: 'e66d78f5-a58d-46f6-a9b4-f8c90e99b6dc',
      datetime: '2020-10-09T12:51:41.381Z',
      environment: 'PRD-Blue',
      version: '1.1',
      application: 'FI001',
      component: '<internal app name>',
      ip: '127.0.0.1',
      pmccode: '0703',
      priority: '0',
      details: {
        transactioncode: '2306',
        message: 'User successfully downloaded a stored document',
        additionalinfo: '<details or obfuscated location of document, etc.>'
      }
    }

    await publishEvent.sendEvent(data)

    expect(wreck.post).toHaveBeenCalledTimes(1)
    expect(messageSchema.validateAsync).toHaveBeenCalledTimes(1)
  })
})
