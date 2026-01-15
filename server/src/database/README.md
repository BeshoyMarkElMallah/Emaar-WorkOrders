# Database Configuration

This folder contains the SQL Server database configuration and connection management for direct SQL queries.

## Files

### `config.ts`
Database connection configuration using environment variables.

### `connection.ts`
Singleton connection pool manager with automatic reconnection and error handling.

### `service.ts`
Helper service with common database operations (queries, stored procedures, etc.).

### `index.ts`
Main export file for the database module.

## Usage

### Basic Query
```typescript
import { dbService } from './database/service';

// Execute a query with parameters
const users = await dbService.executeQuery(
  'SELECT * FROM Users WHERE Status = @status',
  { status: 'active' }
);
```

### Stored Procedure
```typescript
import { dbService } from './database/service';

const result = await dbService.executeStoredProcedure(
  'sp_GetUserById',
  { userId: 123 }
);
```

### Direct Pool Access
```typescript
import { db, sql } from './database';

const pool = await db.getPool();
const result = await pool.request()
  .input('param1', sql.VarChar, 'value')
  .query('SELECT * FROM Table WHERE Column = @param1');
```

## Environment Variables

Add these to your `.env` file:

```env
DB_SERVER=your_server_name
DB_DATABASE=your_database_name
DB_USER=your_username
DB_PASSWORD=your_password
DB_PORT=1433
DB_ENCRYPT=true
DB_TRUST_CERT=true
```

## Connection Pool

The connection pool is automatically managed:
- Min connections: 0
- Max connections: 10
- Connection timeout: 30 seconds
- Request timeout: 30 seconds
