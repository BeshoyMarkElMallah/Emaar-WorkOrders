import sql from 'mssql';
import { DB_SERVER1, DB_SERVER2, DB_USER, DB_PASSWORD, DB_PORT, DB_ENCRYPT, DB_TRUST_CERT, DB_DATABASE } from '../secrets';


// Parse multiple servers from environment variable (comma-separated)
const getServers = (): string[] => {
    const serversEnv = DB_SERVER1 || DB_SERVER2 || '';
    return serversEnv.split(',').map(s => s.trim()).filter(s => s.length > 0);
};

export const dbServers = getServers();

export const dbConfig: sql.config = {
    user: DB_USER || '',
    password: DB_PASSWORD || '',
    server: dbServers[0] || 'localhost', // Default to first server
    database: DB_DATABASE || '',
    options: {
        encrypt: DB_ENCRYPT === 'true',
        trustServerCertificate: DB_TRUST_CERT === 'true',
        enableArithAbort: true,
    },
    port: parseInt(DB_PORT || '1433'),
    connectionTimeout: 30000,
    requestTimeout: 30000,
    pool: {
        max: 10,
        min: 0,
        idleTimeoutMillis: 30000,
    },
};

/**
 * Create a config for a specific server
 */
export function createServerConfig(serverName: string): sql.config {
    return {
        ...dbConfig,
        server: serverName,
    };
}
