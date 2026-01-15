import dotenv from 'dotenv';

dotenv.config({
    path: '.env'
});

// export const JWT_SECRET = process.env.JWT_SECRET!;
export const PORT = process.env.PORT;
export const DB_SERVER1 = process.env.DB_SERVER1!;
export const DB_SERVER2 = process.env.DB_SERVER2!;
export const DB_USER = process.env.DB_USER!;
export const DB_PASSWORD = process.env.DB_PASSWORD!;
export const DB_PORT = process.env.DB_PORT!;
export const DB_ENCRYPT = process.env.DB_ENCRYPT;
export const DB_TRUST_CERT = process.env.DB_TRUST_CERT;
export const DB_DATABASE = process.env.DB_DATABASE!;