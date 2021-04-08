# ffc-protective-monitoring

NPM module for logging protective monitoring events into Azure Logic App

## Usage

### Installation

```
npm install --save ffc-protective-monitoring

```

### Configuration

`endPoint` - The protective monitoring endpoint for the Azure Logic App

`log` - Optional parameter to disable sending protective monitoring data. If not set, the value is `true`

#### Example usage

```
const { PublishEvent } = require('ffc-protective-monitoring')

const protectiveMonitoring = new PublishEvent(PROTECTIVE_MONITORING_URL)

await protectiveMonitoring.sendEvent({
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
})

```

## Licence

THIS INFORMATION IS LICENSED UNDER THE CONDITIONS OF THE OPEN GOVERNMENT LICENCE found at:

<http://www.nationalarchives.gov.uk/doc/open-government-licence/version/3>

The following attribution statement MUST be cited in your products and applications when using this information.

> Contains public sector information licensed under the Open Government license v3

### About the licence

The Open Government Licence (OGL) was developed by the Controller of Her Majesty's Stationery Office (HMSO) to enable information providers in the public sector to license the use and re-use of their information under a common open licence.

It is designed to encourage use and re-use of information freely and flexibly, with only a few conditions.
