const config = {
  mongo: {
    url: process.env.MONGO_DATABASE_URL,
  },
  auth0: {
    // to decode the token
    frontend: {
      CLIENT_ID: process.env.AUTH0_FRONTEND_CLIENT_ID,
      CLIENT_SECRET: process.env.AUTH0_FRONTEND_CLIENT_SECRET,
      DOMAIN: process.env.AUTH0_DOMAIN,
    },
    // To get access to auth0 admin features
    backend: {
      CLIENT_ID: process.env.AUTH0_BACKEND_CLIENT_ID,
      CLIENT_SECRET: process.env.AUTH0_BACKEND_CLIENT_SECRET!,
      DOMAIN: process.env.AUTH0_DOMAIN!,
      AUDIENCE: process.env.AUTH0_AUDIENCE!,
    },
  },
  sendGrid: {
    API_KEY: process.env.SENDGRID_API_KEY!,
  },
  smtp2go: {
    API_KEY: process.env.SMTP2GO_API_KEY!,
  },
  sentry: {
    DSN: process.env.SENTRY_DSN,
  },
  email: {
    FROM: 'Coding Coach <admin@codingcoach.io>',
  },
  files: {
    public: process.env.PUBLIC_FOLDER,
    avatars: `avatars`,
  },
  pagination: {
    limit: 20,
  },
  urls: {
    CLIENT_BASE_URL: process.env.CLIENT_BASE_URL,
  },
};

export default config;
