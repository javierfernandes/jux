const { identity } = require('ramda')
const { IGNORE } = require('./adapters/defs')
const adapter = require('./adapters/adapter')

/**
 * Given a Jest Reporter it will monkey patch it with methods
 * that will be called by Jest for which we send events to Jux.
 *
 * It uses a declarative approach to adapt jest reporter methods
 * into WS messages. @see ./adapters/*
 *
 * The context object could allow us to have different adapters
 * for different versions of Jest if the underlying jest model changes
 */
const createAdapter = (context, reporter) => _createAdapter(context, reporter, adapter)

const _createAdapter = (context, reporter, definition) => {
  definition.forEach((def) => {
    // for each monkey patches a method that call jux with a "jux message"
    adaptMethod(def, reporter)
  })
}

const adaptMethod = ([nameDef, paramNames], reporter) => {
  const methodDef = typeof nameDef === 'string' ? { name: nameDef } : nameDef

  reporter[methodDef.name] = (...args) => {
    reporter.justReporter.send({
      type: (methodDef.transform || identity)(methodDef.name),
      ...argsToParams(args, paramNames)
    })
  }
}

// for tests
createAdapter.impl = _createAdapter

module.exports = createAdapter

/**
 * Given a list of argument values and a list of param names creates an object
 * Naming the args and using the arg values.
 * Ignores those params having IGNORE name
 */
const argsToParams = (args, paramNames) => paramNames.reduce((acc, paramDef, i) => {
  if (paramDef !== IGNORE) {
    paramDef = typeof(paramDef) === 'string' ? { name: paramDef } : paramDef

    acc[paramDef.name] = (paramDef.transform || identity)(args[i])
  }
  return acc
}, {})