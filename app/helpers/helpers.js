const consoleLog = ($value) => {
  if (process.env.Log) {
    console.log($value)
  }
}
module.exports = { consoleLog }
