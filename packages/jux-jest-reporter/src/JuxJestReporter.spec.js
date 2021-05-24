const { always } = require('ramda')
const classFactory = require('./JuxJestReporter')

describe('JuxJestReporter', () => {

  describe('on events', () => {

    const doTest = ({ doing, expectForwardedMessage }) => {
      // mock the jux API
      const jux = {
        send: jest.fn()
      }
      const JuxJestReporter = classFactory(always(jux))
      const globalConfig = { global: 'config' }
      const options = { option: 'A' }

      const reporter = new JuxJestReporter(globalConfig, options)

      doing(reporter)
      expect(jux.send).toBeCalledWith(expectForwardedMessage)
    }

    it('should delegate "onRunStart"', () => doTest({
      doing: reporter =>
        reporter.onRunStart('myAggregatedResults', 'myOptions'),
      expectForwardedMessage: {
        type: 'onRunStart',
        aggregatedResults: 'myAggregatedResults'
      }
    }))

    it('should delegate "onRunComplete"', () => doTest({
      doing: reporter =>
        reporter.onRunComplete('myContext', 'myResults'),
      expectForwardedMessage: {
        type: 'onRunComplete',
        results: 'myResults'
      }
    }))

    it('should delegate "onTestStart"', () => doTest({
      doing: reporter =>
        reporter.onTestStart('myTest'),
      expectForwardedMessage: {
        type: 'onTestStart',
        test: 'myTest'
      }
    }))

    it('should delegate "onTestResult"', () => doTest({
      doing: reporter =>
        reporter.onTestResult('myTest', 'myResult', 'myAggregatedResult'),
      expectForwardedMessage: {
        type: 'onTestResult',
        test: 'myTest',
        result: 'myResult',
        aggregatedResult: 'myAggregatedResult',
      }
    }))

    it('should delegate "onTestFileStart"', () => doTest({
      doing: reporter =>
        reporter.onTestFileStart('myTest'),
      expectForwardedMessage: {
        type: 'onTestFileStart',
        test: 'myTest',
      }
    }))

    it('should delegate "onTestFileStart"', () => doTest({
      doing: reporter =>
        reporter.onTestFileResult('myTest', 'myResult', 'myAggregatedResult'),
      expectForwardedMessage: {
        type: 'onTestFileResult',
        test: 'myTest',
        result: 'myResult',
        aggregatedResult: 'myAggregatedResult',
      }
    }))

    it('should delegate "onTestCaseResult"', () => doTest({
      doing: reporter =>
        reporter.onTestCaseResult('myTest', 'myResult'),
      expectForwardedMessage: {
        type: 'onTestCaseResult',
        test: 'myTest',
        result: 'myResult',
      }
    }))

  })

})