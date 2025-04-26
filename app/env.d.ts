declare global {
  namespace NodeJS {
    interface ProcessEnv {
      API_BASE_URL?: string;
      API_KEY?: string;
      API_SECRET?: string;
      NODE_ENV: 'development' | 'production' | 'test';
      SESSION_SECRET: string;
      SESSION_DOMAIN?: string;
    }
  }
}

export {}; 