interface IEnvironment {
  redis?: {
    host?: string;
    port?: number;
  };
  mailer?: {
    host?: string;
    port?: number;
    auth?: {
      user: string;
      pass: string;
    };
  };
}

export function envs(): IEnvironment {
  const {
    REDIS_HOST,
    REDIS_PORT,
    MAILER_HOST,
    MAILER_PORT,
    MAILER_AUTH_USER,
    MAILER_AUTH_PASS,
  } = process.env;
  return {
    redis: {
      host: REDIS_HOST,
      port: Number(REDIS_PORT),
    },
    mailer: {
      host: MAILER_HOST,
      port: Number(MAILER_PORT),
      auth: {
        user: MAILER_AUTH_USER,
        pass: MAILER_AUTH_PASS,
      },
    },
  };
}
