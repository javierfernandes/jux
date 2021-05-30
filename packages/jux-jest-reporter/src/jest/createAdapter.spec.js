const { toUpper } = require('ramda')
const createAdapter = require('./createAdapter').impl
const { IGNORE, param } = require('./adapters/defs')

describe('jest / createAdapter', () => {

  const doTest = ({ def, expecting }) => {
    const sendMock = jest.fn()
    const reporter = {
      justReporter: {
        send: sendMock
      }
    }
    createAdapter({}, reporter, def)
    expecting(reporter, sendMock)
  }

  it('should do nothing for an empty definition', () => {
    doTest({
      def: [],
      expecting: ({ justReporter, ...reporter }) => {
        expect(reporter).toEqual({})
      }
    })
  })

  it('should add a new method with no param, calling it sends an event to jux', () => {
    doTest({
      def: [
        ['methodNoParam', []]
      ],
      expecting: (reporter, mock) => {
        expect(reporter).toHaveProperty('methodNoParam')

        // call it
        reporter.methodNoParam()

        expect(mock).toBeCalledWith({ type: 'methodNoParam' })
      }
    })
  })

  describe('params', () => {

    it('should pass a named param as payload', () => {
      doTest({
        def: [
          ['hello', ['to']]
        ],
        expecting: (reporter, mock) => {
          reporter.hello('world')

          expect(mock).toBeCalledWith({ type: 'hello', to: 'world' })
        }
      })
    })

    it('should pass many params, name is defined positionally', () => {
      doTest({
        def: [
          ['hello', ['title', 'to']]
        ],
        expecting: (reporter, mock) => {
          reporter.hello('Dr', 'Seuss')

          expect(mock).toBeCalledWith({ type: 'hello', to: 'Seuss', title: 'Dr' })
        }
      })
    })

    it('should IGNORE a positional parameter', () => {
      doTest({
        def: [
          ['hello', [IGNORE, 'to']]
        ],
        expecting: (reporter, mock) => {
          // will ignore 'Dr'
          reporter.hello('Dr', 'Seuss')
          expect(mock).toBeCalledWith({ type: 'hello', to: 'Seuss' })
        }
      })
    })

    it('should allow to define a param with the verbose structure', () => {
      doTest({
        def: [
          ['hello', [{ name: 'to' }]]
        ],
        expecting: (reporter, mock) => {
          reporter.hello('Seuss')
          expect(mock).toBeCalledWith({ type: 'hello', to: 'Seuss' })
        }
      })
    })

    it('should allow to define a param with a transformation', () => {
      doTest({
        def: [
          ['hello', [{ name: 'to', transform: toUpper }]]
        ],
        expecting: (reporter, mock) => {
          reporter.hello('Seuss')
          expect(mock).toBeCalledWith({ type: 'hello', to: 'SEUSS' })
        }
      })
    })

    it('should allow to define a param with a transformation (same using param())', () => {
      doTest({
        def: [
          ['hello', [param('to', toUpper)]]
        ],
        expecting: (reporter, mock) => {
          reporter.hello('Seuss')
          expect(mock).toBeCalledWith({ type: 'hello', to: 'SEUSS' })
        }
      })
    })

  })

})