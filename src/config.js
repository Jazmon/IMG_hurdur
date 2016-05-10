const port = process.env.PORT || 8000;
const host = process.env.WEBSITE_HOSTNAME || `localhost:${port}`;
const debug = process.env.NODE_ENV !== 'production';
const ip = '0.0.0.0';

const databaseUrl = 'localhost:5432';
const database = {
  url : 'localhost:5432',
  name: 'postgres',
  user: 'postgres',
  password: '18rWiF'
};

const passwordMinLength = 10;
const passwordMaxLength = 50;
const saltWorkFactor = 10;

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
  database,
  auth,
  passwordMinLength,
  passwordMaxLength,
  saltWorkFactor,
};
