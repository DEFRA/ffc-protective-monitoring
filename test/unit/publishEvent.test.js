const PublishEvent = require('../../app/protective-monitoring/publish-event')
const messageSchema = require('../../app/protective-monitoring/message-schema')
const wreck = require('wreck')

beforeEach(() => {
  wreck.post = jest.fn()

  messageSchema.validate = jest.fn()
})

afterEach(() => {
  jest.resetAllMocks()
})

describe('Publish Event', () => {
  test('Null endpoint supplied', async function () {
    const publishEvent = new PublishEvent(null)

    await publishEvent.sendEvent('test json')

    expect(wreck.post).toHaveBeenCalledTimes(0)
    expect(messageSchema.validate).toHaveBeenCalledTimes(0)
  })

  test('Empty string endpoint supplied', async function () {
    const publishEvent = new PublishEvent('')

    await publishEvent.sendEvent('test json')

    expect(wreck.post).toHaveBeenCalledTimes(0)
    expect(messageSchema.validate).toHaveBeenCalledTimes(0)
  })

  test('Logging into protective monitoring is not required', async function () {
    const publishEvent = new PublishEvent('http://localhost', false)

    await publishEvent.sendEvent('test json')

    expect(wreck.post).toHaveBeenCalledTimes(0)
    expect(messageSchema.validate).toHaveBeenCalledTimes(0)
  })

  test('Error raised from validating JSON', async function () {
    const publishEvent = new PublishEvent('http://localhost')

    messageSchema.validate.mockImplementation(() => {
      throw new Error()
    })

    await publishEvent.sendEvent('test json')

    expect(wreck.post).toHaveBeenCalledTimes(0)
    expect(messageSchema.validate).toHaveBeenCalledTimes(1)
  })

  test('Required sessionid property not present in JSON', async function () {
    const publishEvent = new PublishEvent('http://localhost')

    const data = {
      datetime: '2020-10-09T12:51:41.381Z',
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

    const validationResult = {
      error: '"sessionid" is required'
    }

    messageSchema.validate.mockReturnValue(validationResult)

    await publishEvent.sendEvent(data)

    expect(validationResult.error).toBe('"sessionid" is required')

    expect(messageSchema.validate).toHaveBeenCalledTimes(1)
    expect(wreck.post).toHaveBeenCalledTimes(0)
  })

  test('Invalid environment property in JSON', async function () {
    const publishEvent = new PublishEvent('http://localhost')

    const data = {
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

    const validationResult = {
      error: '"environment" is not allowed'
    }

    messageSchema.validate.mockReturnValue(validationResult)

    await publishEvent.sendEvent(data)

    expect(validationResult.error).toBe('"environment" is not allowed')

    expect(messageSchema.validate).toHaveBeenCalledTimes(1)
    expect(wreck.post).toHaveBeenCalledTimes(0)
  })

  test('Successfully logged protective monitoring event', async function () {
    const publishEvent = new PublishEvent('http://localhost')

    const data = {
      sessionid: 'e66d78f5-a58d-46f6-a9b4-f8c90e99b6dc',
      datetime: '2020-10-09T12:51:41.381Z',
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

    const validationResult = {
      success: true
    }

    const result = {
      statusCode: 200,
      statusMessage: 'OK'
    }

    messageSchema.validate.mockReturnValue(validationResult)
    wreck.post.mockReturnValue(result)

    await publishEvent.sendEvent(data)

    expect(result.statusCode).toBe(200)
    expect(result.statusMessage).toBe('OK')

    expect(messageSchema.validate).toHaveBeenCalledTimes(1)
    expect(wreck.post).toHaveBeenCalledTimes(1)
  })
})
