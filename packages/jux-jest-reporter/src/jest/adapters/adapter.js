const { omit } = require('ramda')
const { IGNORE, param, rename } = require('./defs')

// common params definitions

const test = param('test', omit(['context']))


//
// [ methodName, [paramName1, paramName2] ]
//   gets converted into
//  { type: 'methodName, paramName1: value1, paramName2: value2 }
//
const adapter = [

  ['onRunStart', ['aggregatedResults']],
  ['onRunComplete', [IGNORE, 'results']],

  // jest 26 (?)
  ['onTestFileStart', [test]],
  ['onTestFileResult', [test, 'result', 'aggregatedResult']],

  ['onTestCaseResult', [test, 'result']],

  // TODO: support jest 24 !
  // I suspect this two are from jest 24 ! Similar to "onTestFileStart" + "onTestFileResult"
  [rename('onTestStart', 'onTestFileStart'), [test]],
  [rename('onTestResult', 'onTestFileResult'), [test, 'result', 'aggregatedResult']],

]

module.exports = adapter