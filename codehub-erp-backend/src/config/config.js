module.exports = {
  jwt: {
    secret: process.env.JWT_SECRET,
    expiration: process.env.JWT_EXPIRE,
    refreshExpiration: process.env.JWT_REFRESH_EXPIRE
  },
  smtp: {
    host: process.env.SMTP_HOST,
    port: process.env.SMTP_PORT,
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS
  },
  frontendUrl: process.env.FRONTEND_URL
};