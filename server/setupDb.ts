import { Client } from 'pg';
import dotenv from 'dotenv';
import fs from 'fs/promises';
import path from 'path';

// Load .env from the project root, not the server directory
dotenv.config({ path: path.resolve(__dirname, '../../.env') });

const dbUrl = process.env.DATABASE_URL;

if (!dbUrl) {
    throw new Error("DATABASE_URL is not defined in the .env file");
}

// Parse the main database URL
const dbConfig = new URL(dbUrl);
const dbName = dbConfig.pathname.slice(1);

// Create a new configuration to connect to the default 'postgres' database
// This is necessary to check for and create the target database
const maintenanceConfig = {
    user: dbConfig.username,
    password: dbConfig.password,
    host: dbConfig.hostname,
    port: Number(dbConfig.port),
    database: 'postgres', 
};

const setupDatabase = async () => {
    const maintenanceClient = new Client(maintenanceConfig);
    try {
        await maintenanceClient.connect();

        // 1. Check if the target database exists
        const res = await maintenanceClient.query(`SELECT 1 FROM pg_database WHERE datname = $1`, [dbName]);
        
        if (res.rowCount === 0) {
            console.log(`Database "${dbName}" not found. Creating...`);
            // 2. Create the database if it doesn't exist
            await maintenanceClient.query(`CREATE DATABASE "${dbName}"`);
            console.log(`Database "${dbName}" created successfully.`);
        } else {
            console.log(`Database "${dbName}" already exists.`);
        }
    } catch (error) {
        console.error("Error during database creation check:", error);
        // Ensure the client disconnects even on error before throwing
        await maintenanceClient.end();
        throw error;
    } finally {
        await maintenanceClient.end();
    }

    // Now, connect to the target database to set up the tables
    const appClient = new Client({ connectionString: dbUrl });
    try {
        await appClient.connect();
        
        // 3. Check if tables already exist (checking for the 'users' table is sufficient)
        const tableRes = await appClient.query(`
            SELECT EXISTS (
                SELECT FROM information_schema.tables 
                WHERE table_schema = 'public' AND table_name = 'users'
            );
        `);
        
        if (!tableRes.rows[0].exists) {
            console.log("Tables not found. Creating schema from schema.sql...");
            // 4. Read and execute the schema.sql file to create tables
            const schemaSql = await fs.readFile(path.join(__dirname, 'schema.sql'), 'utf-8');
            await appClient.query(schemaSql);
            console.log("Schema created successfully.");
        } else {
            console.log("Tables already exist.");
        }
    } catch (error) {
        console.error("Error setting up tables:", error);
        await appClient.end();
        throw error;
    } finally {
        await appClient.end();
    }
};

export default setupDatabase;
