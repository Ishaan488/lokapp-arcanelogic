import app from './app';
import { config } from './config/env';

const PORT = config.port;

app.listen(PORT, () => {
    console.log(`
  🚀 LokApp Server is running!
  
  Environment : ${config.nodeEnv}
  Port        : ${PORT}
  API Base    : http://localhost:${PORT}/api
  Health      : http://localhost:${PORT}/api/health
  
  Available routes:
    POST   /api/auth/signup    - Register a new citizen
    POST   /api/auth/login     - Login & get JWT
    GET    /api/auth/me        - Get current user profile
    PUT    /api/auth/me        - Update profile
  `);
});
