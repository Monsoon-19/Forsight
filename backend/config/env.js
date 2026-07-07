require('dotenv').config();

const env = {
  PORT: process.env.PORT || 5000,
  MONGODB_URI: process.env.MONGODB_URI,
  JWT_SECRET: process.env.JWT_SECRET,
  JWT_REFRESH_SECRET: process.env.JWT_REFRESH_SECRET,
  NODE_ENV: process.env.NODE_ENV || 'development',
};

if (!env.MONGODB_URI || !env.JWT_SECRET || !env.JWT_REFRESH_SECRET) {
  console.error('Missing required environment variables');
  process.exit(1);
}

module.exports = env;
