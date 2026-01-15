import sql from 'mssql';
import { dbConfig, dbServers, createServerConfig } from './config';
import { findAvailableServer, ServerConfig } from './serverCheck';

class DatabaseConnection {
    private static instance: DatabaseConnection;
    private pool: sql.ConnectionPool | null = null;
    private connecting: Promise<sql.ConnectionPool> | null = null;
    private activeServer: string | null = null;

    private constructor() { }

    public static getInstance(): DatabaseConnection {
        if (!DatabaseConnection.instance) {
            DatabaseConnection.instance = new DatabaseConnection();
        }
        return DatabaseConnection.instance;
    }

    public async getPool(): Promise<sql.ConnectionPool> {
        if (this.pool && this.pool.connected) {
            return this.pool;
        }

        if (this.connecting) {
            return this.connecting;
        }

        this.connecting = this.createPool();
        this.pool = await this.connecting;
        this.connecting = null;

        return this.pool;
    }

    private async createPool(): Promise<sql.ConnectionPool> {
        try {
            // If multiple servers configured, find the first available one
            if (dbServers.length > 1) {
                console.log(`🔍 Multiple servers configured (${dbServers.length}), checking availability...`);

                const serverConfigs: ServerConfig[] = dbServers.map(server => ({
                    server,
                    user: dbConfig.user as string,
                    password: dbConfig.password as string,
                    database: dbConfig.database as string,
                    port: dbConfig.port,
                    encrypt: Boolean(dbConfig.options?.encrypt),
                    trustServerCertificate: Boolean(dbConfig.options?.trustServerCertificate),
                }));

                const availableServer = await findAvailableServer(serverConfigs);

                if (!availableServer) {
                    throw new Error('No available database servers found');
                }

                this.activeServer = availableServer.server;
                const config = createServerConfig(availableServer.server);
                const pool = await sql.connect(config);

                console.log(`✅ Connected to database server: ${this.activeServer}`);

                pool.on('error', (err) => {
                    console.error('❌ Database pool error:', err);
                    this.pool = null;
                });

                return pool;
            } else {
                // Single server configuration
                const pool = await sql.connect(dbConfig);
                this.activeServer = dbConfig.server as string;
                console.log(`✅ Database connected to: ${this.activeServer}`);

                pool.on('error', (err) => {
                    console.error('❌ Database pool error:', err);
                    this.pool = null;
                });

                return pool;
            }
        } catch (error) {
            console.error('❌ Database connection failed:', error);
            throw error;
        }
    }

    public getActiveServer(): string | null {
        return this.activeServer;
    }

    public async close(): Promise<void> {
        if (this.pool) {
            await this.pool.close();
            this.pool = null;
            this.activeServer = null;
            console.log('Database connection closed');
        }
    }
}

export const db = DatabaseConnection.getInstance();
export { sql };
