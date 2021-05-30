const { always } = require('ramda')

/**
 * Tells that this parameter must be ignored and not forwarded
 * to the JUX message
 */
const IGNORE = '__IGNORE__'

/*
 * Creates a declaration for a parameter.
 * Requires a name, and can have a "transform" function
 * to make changes before sending the value to JUX
 */
const param = (name, transform) => ({ name, transform })

const rename = (name, to) => ({ name, transform: always(to) })

//
module.exports = {
  IGNORE,
  param,
  rename,
}