const result = require('dotenv').config();

if (result.error) {
    console.log("error form env",result.error);
  console.error(result.error);
}

const nextConfig = {}

module.exports = nextConfig
