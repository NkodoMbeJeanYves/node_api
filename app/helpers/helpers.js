const { uuid, isUuid } = require('uuidv4')

/**
 * description output into console
 * @param {$value} $value
 */
const consoleLog = ($value) => {
  if (process.env.Log) {
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
const generateUUIDV4 = () => {
  return uuid()
}

const isUUID = ($value) => (isUuid($value))

module.exports = { consoleLog, isTrue, generateUUIDV4, isUUID }
