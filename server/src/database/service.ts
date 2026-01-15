import { db, sql } from './index';
import { findAvailableServer } from './serverCheck';

/**
 * Example usage of the database connection
 */
export class DatabaseService {
    /**
     * Execute a query with parameters
     */
    async executeQuery<T>(query: string, params?: Record<string, any>): Promise<T[]> {
        try {
            // server check 
            const pool = await db.getPool();
            const request = pool.request();

            // Add parameters if provided
            if (params) {
                Object.entries(params).forEach(([key, value]) => {
                    request.input(key, value);
                });
            }

            const result = await request.query(query);
            return result.recordset as T[];
        } catch (error) {
            console.error('Query execution error:', error);
            throw error;
        }
    }

    /**
     * Execute a stored procedure
     */
    async executeStoredProcedure<T>(
        procedureName: string,
        params?: Record<string, any>
    ): Promise<T[]> {
        try {
            const pool = await db.getPool();
            const request = pool.request();

            // Add parameters if provided
            if (params) {
                Object.entries(params).forEach(([key, value]) => {
                    request.input(key, value);
                });
            }

            const result = await request.execute(procedureName);
            return result.recordset as T[];
        } catch (error) {
            console.error('Stored procedure execution error:', error);
            throw error;
        }
    }

    /**
     * Get a single record
     */
    async getSingle<T>(query: string, params?: Record<string, any>): Promise<T | null> {
        const results = await this.executeQuery<T>(query, params);
        return results.length > 0 ? results[0] : null;
    }
}

export const dbService = new DatabaseService();
