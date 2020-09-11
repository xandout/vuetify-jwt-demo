module.exports = {
  development: {
    port: process.env.PORT || 3000,
    httpsPort: process.env.HTTPS_PORT || 8443,
    saltingRounds: 10
  }
}