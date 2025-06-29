// src/config.ts
const config = {
  MONGODB_URI: process.env.MONGODB_URI || 'mongodb://localhost:27017/loopr',
};

export default config;
