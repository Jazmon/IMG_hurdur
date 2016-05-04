const port = process.env.PORT || 8000;
const host = process.env.WEBSITE_HOSTNAME || `localhost:${port}`;
const debug = process.env.NODE_ENV !== 'production';
const ip = '0.0.0.0';
const databaseUrl = process.env.DATABASE_URL || 'sqlite:database.sqlite';
const auth = {
  // TODO: Change jwt secret
  jwt: {
    secret: process.env.JWT_SECRET || 'FOOBAR'
  },
};

module.exports = {
  port,
  host,
  debug,
  ip,
  databaseUrl,
  auth
};
