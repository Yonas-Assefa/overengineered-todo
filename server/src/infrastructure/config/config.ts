import dotenv from "dotenv";
import joi from "joi";
dotenv.config({
  path: process.env.NODE_ENV !== "production" ? ".env.dev" : ".env",
});

const envVarsSchema = joi
  .object({
    NODE_ENV: joi
      .string()
      .valid("development", "production", "test")
      .default("development"),
    PORT: joi.number().default(3000),
    JWT_SECRET: joi.string().required().description("JWT secret key"),
    JWT_ACCESS_EXPIRATION_MINUTES: joi
      .number()
      .default(30)
      .description("minutes after which access tokens expire"),
    JWT_REFRESH_EXPIRATION_DAYS: joi
      .number()
      .default(30)
      .description("days after which refresh tokens expire"),
    BASE_URL: joi
      .string()
      .required()
      .description("Base url for the application")
      .default("http://localhost:3000"),

    // Database Configuration for MySQL
    DB_HOST: joi.string().default("localhost").required(),
    DB_PORT: joi.number().default(3306).required(),
    DB_USER: joi.string().required(),
    DB_PASSWORD: joi.string().required(),
    DB_NAME: joi.string().required(),
    DB_MIGRATIONS_RUN: joi
      .boolean()
      .default(true)
      .description("Run migrations on application start"),
  })
  .unknown()
  .required();

const { error, value: envVars } = envVarsSchema
  .prefs({
    errors: { label: "key" },
    abortEarly: false,
  })
  .validate(process.env);
if (error) {
  throw new Error(`Config validation error: ${error.message}`);
}

const config = {
  env: envVars.NODE_ENV,
  port: envVars.PORT,
  jwt: {
    secret: envVars.JWT_SECRET,
    accessExpirationMinutes: envVars.JWT_ACCESS_EXPIRATION_MINUTES,
    refreshExpirationDays: envVars.JWT_REFRESH_EXPIRATION_DAYS,
    verifyEmailExpirationMinutes: envVars.JWT_VERIFY_EMAIL_EXPIRATION_MINUTES,
    resetPasswordExpirationMinutes:
      envVars.JWT_RESET_PASSWORD_EXPIRATION_MINUTES,
  },
  baseUrl: envVars.BASE_URL,
  db: {
    host: envVars.DB_HOST,
    port: envVars.DB_PORT,
    username: envVars.DB_USER,
    password: envVars.DB_PASSWORD,
    database: envVars.DB_NAME,

    migrationsRun: envVars.DB_MIGRATIONS_RUN,
  },
};

export default config;
