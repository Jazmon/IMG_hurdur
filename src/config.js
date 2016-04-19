export const port = process.env.PORT || 3000;
export const host = process.env.WEBSITE_HOSTNAME || `localhost:${port}`;
export const debug = process.env.NODE_ENV !== 'production';

export const databaseUrl = process.env.DATABASE_URL || 'sqlite:database.sqlite';

export const auth = {
  // TODO: Change jwt secret
  jwt: { secret: process.env.JWT_SECRET || 'FOOBAR'},
}
