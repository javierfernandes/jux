const { omit } = require('ramda')
const { IGNORE, param } = require('./defs')

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

  ['onTestFileStart', [test]],
  ['onTestFileResult', [test, 'result', 'aggregatedResult']],
  ['onTestCaseResult', [test, 'result']],

  // I suspect this two are from jest 24 ! Similar to "onTestFileStart" + "onTestFileResult"
  ['onTestStart', [test]],
  ['onTestResult', [test, 'result', 'aggregatedResult']],

]

module.exports = adapter