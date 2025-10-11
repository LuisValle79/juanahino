// Environment configuration
export const config = {
  database: {
    url: process.env.DATABASE_URL || 'postgresql://user:password@localhost:5432/hino_connect',
  },
  auth: {
    secret: process.env.AUTH_SECRET || 'hino-connect-secret-key',
    tokenExpiration: '24h',
  },
  app: {
    name: 'Hino Connect Intranet',
    version: '1.0.0',
  },
}