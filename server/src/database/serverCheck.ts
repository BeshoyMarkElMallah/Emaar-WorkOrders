import sql from 'mssql';

export interface ServerConfig {
    server: string;
    user: string;
    password: string;
    database: string;
    port?: number;
    encrypt?: boolean;
    trustServerCertificate?: boolean;
}

/**
 * Test if a SQL Server is reachable and responsive
 */
export async function pingServer(config: ServerConfig): Promise<boolean> {
    try {
        const testConfig: sql.config = {
            user: config.user,
            password: config.password,
            server: config.server,
            database: config.database,
            options: {
                encrypt: config.encrypt ?? true,
                trustServerCertificate: config.trustServerCertificate ?? true,
                enableArithAbort: true,
            },
            port: config.port || 1433,
            connectionTimeout: 5000, // 5 seconds timeout for ping
            requestTimeout: 5000,
        };

        const pool = await sql.connect(testConfig);
        await pool.request().query('SELECT 1'); // Simple test query
        await pool.close();

        return true;
    } catch (error) {
        console.error(`❌ Server ${config.server} is unreachable:`, error instanceof Error ? error.message : error);
        return false;
    }
}

/**
 * Find the first available server from a list
 */
export async function findAvailableServer(servers: ServerConfig[]): Promise<ServerConfig | null> {
    console.log(`🔍 Checking ${servers.length} server(s) for availability...`);

    for (const server of servers) {
        console.log(`⏳ Testing server: ${server.server}...`);
        const isAvailable = await pingServer(server);

        if (isAvailable) {
            console.log(`✅ Server ${server.server} is available!`);
            return server;
        }
    }

    console.error('❌ No available servers found!');
    return null;
}

/**
 * Get all available servers from a list
 */
export async function getAvailableServers(servers: ServerConfig[]): Promise<ServerConfig[]> {
    console.log(`🔍 Checking ${servers.length} server(s) for availability...`);

    const availabilityChecks = servers.map(async (server) => {
        const isAvailable = await pingServer(server);
        return { server, isAvailable };
    });

    const results = await Promise.all(availabilityChecks);
    const availableServers = results
        .filter(result => result.isAvailable)
        .map(result => result.server);

    console.log(`✅ Found ${availableServers.length} available server(s)`);
    return availableServers;
}
