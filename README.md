# MikroTik Billing System - Full Stack

This project now includes a full backend with Node.js, Express, and PostgreSQL.

## Backend Setup Instructions

### 1. Prerequisites

- [Node.js](https://nodejs.org/) (v18 or later recommended)
- [PostgreSQL](https://www.postgresql.org/download/) installed and running.

### 2. Install Dependencies

Navigate to the project's root directory and run:

```bash
npm install
```

This will install all the necessary dependencies for the backend listed in `package.json`.

### 3. Set Up the Database

This project features an automatic database installer. When you run the backend server for the first time, it will automatically create the database and tables for you.

1.  **Ensure PostgreSQL is running.**

2.  **Configure your `.env` file** with a PostgreSQL user that has permission to create databases. For local development, you can use the default `postgres` user, or create a dedicated one for better security.

    *Example of creating a dedicated user:*
    ```sql
    -- Connect to psql
    CREATE USER myuser WITH CREATEDB PASSWORD 'mysecretpassword';
    ```

3.  **That's it!** The server will handle the rest upon startup. You no longer need to manually run `CREATE DATABASE` or execute the `schema.sql` file.

### 4. Configure Environment Variables

1.  In the project's root directory, create a new file named `.env`.
2.  Copy the contents from `.env.example` into your new `.env` file.
3.  Update the `DATABASE_URL` with your actual PostgreSQL connection string. The format is: `postgresql://USER:PASSWORD@HOST:PORT/DATABASE`
4.  Update the `JWT_SECRET` with a long, random, and secret string.

    **Example `.env` file:**

    ```
    DATABASE_URL=postgresql://postgres:mysecretpassword@localhost:5432/mikrotik_billing
    JWT_SECRET=this-is-a-very-long-and-secret-string-for-jwt
    PORT=4000
    ```

### 5. Run the Backend Server

Once your dependencies are installed and your `.env` file is configured, you can start the development server:

```bash
npm run dev
```

The backend server will start, typically on `http://localhost:4000`. It will automatically restart when you make changes to the code.

### 6. Running the Frontend

The frontend should work as before. Simply open the `index.html` file. The updated `api.ts` file is now configured to send requests to your local backend server. You will need to register a new account to begin.