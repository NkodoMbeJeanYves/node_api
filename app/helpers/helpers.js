const { v4: uuidv4, validate: uuidValidate, version: uuidVersion } = require('uuid')

/**
 * description output into console
 * @param {$value} $value
 */
const consoleLog = ($value) => {
  if (process.env.DEBUG) {
    console.log($value)
  }
}

/**
 * description cast value into boolean
 * @param {$value} value
 * @returns boolean
 */
const isTrue = ($value) => ($value === 'true')

/**
 * description generate a custom uuidV4
 * @returns string
 */
const generateUuidV4 = () => {
  return uuidv4()
}

const isUUID = ($value) => (uuidValidate($value) && uuidVersion === '4')

const randomBytes64 = () => require('crypto').randomBytes(64).toString('hex')

const groupBy = (items, $property) => {
  // check if items is iterable
  if (!isIterable(items) || typeof items === 'string') return null
  // check if each item has its property
  const isPropertyExisted = items.reduce((res, el) => Object(el)[$property] !== undefined, Object.create(null))
  if (!isPropertyExisted) return null

  const result = items.reduce(function (result, currentValue) {
    result[currentValue.make] = result[currentValue.make] || []
    result[currentValue.make].push(currentValue)
    return result
  }, Object.create(null))
  return result
}

function isIterable (obj) {
  // checks for null and undefined
  if (obj === null || obj === undefined) {
    return false
  }
  return typeof obj[Symbol.iterator] === 'function'
}

module.exports = { consoleLog, isTrue, generateUuidV4, isUUID, randomBytes64, groupBy }
