# Full-Stack MikroTik Billing System - Setup Guide

This guide provides step-by-step instructions to set up and run the entire full-stack application, including the Node.js backend, PostgreSQL database, and the client-side frontend.

## 1. Prerequisites

Before you begin, ensure you have the following software installed on your system:

- **[Git](https://git-scm.com/downloads)**: For cloning the project repository.
- **[Node.js](https://nodejs.org/en/download/)**: Version 18.x or later is recommended.
- **[PostgreSQL](https://www.postgresql.org/download/)**: A running instance of the PostgreSQL database server.

## 2. Project Installation

First, clone the project repository from GitHub to your local machine.

```bash
git clone <your-repository-url>
cd <project-directory-name>
```

## 3. Backend Setup

The backend is a Node.js/Express server that connects to the PostgreSQL database.

### Step 3.1: Install Dependencies

Navigate to the project's root directory (if you aren't already there) and install the necessary Node.js packages.

```bash
npm install
```

### Step 3.2: Set Up the PostgreSQL Database

1.  **Create the Database**:
    Open your PostgreSQL client (like `psql` or a GUI such as DBeaver) and create a new database for the application.

    ```sql
    CREATE DATABASE mikrotik_billing;
    ```

2.  **Create the Tables**:
    Connect to your newly created database and execute the `schema.sql` script to set up all the required tables (`tenants`, `users`, `routers`).

    ```bash
    # Run this command from the project's root directory
    psql -d mikrotik_billing -f server/schema.sql
    ```
    *Note: You may need to provide user credentials depending on your PostgreSQL setup (e.g., `psql -U your_user -d mikrotik_billing -f server/schema.sql`).*

### Step 3.3: Configure Environment Variables

1.  **Create the `.env` file**:
    In the root of the project, create a new file named `.env`.

2.  **Add Configuration**:
    Copy the contents from the `.env.example` file and paste them into your new `.env` file. Then, update the values to match your local setup.

    **Example `.env` configuration:**
    ```
    # PostgreSQL Connection URL
    # Format: postgresql://USER:PASSWORD@HOST:PORT/DATABASE
    DATABASE_URL=postgresql://postgres:mysecretpassword@localhost:5432/mikrotik_billing

    # A long, random, and secret string for signing JWTs
    JWT_SECRET=replace-this-with-a-very-long-and-secure-random-string

    # The port for the backend server to run on
    PORT=4000
    ```
    - **`DATABASE_URL`**: Replace with the connection string for the database you created in the previous step.
    - **`JWT_SECRET`**: It is critical to change this to a unique, long, and random secret.

### Step 3.4: Run the Backend Server

Start the backend development server using the following command:

```bash
npm run dev
```

The server should now be running on `http://localhost:4000`. You will see a confirmation message in your terminal: `Server is running on http://localhost:4000`.

## 4. Frontend Setup

The frontend is a client-side application built with React and requires no separate installation or build process.

### Step 4.1: Run the Frontend

Simply open the `index.html` file in your web browser. You can do this by:
- Dragging the `index.html` file into a browser window.
- Using a live server extension in your code editor (like "Live Server" for VS Code).

The frontend is already configured in `api.ts` to send requests to the backend server at `http://localhost:4000`.

## 5. Using the Application

You are all set! With both the backend and frontend running, you can now use the application.

1.  Open the `index.html` page in your browser.
2.  You will be greeted with the login screen. Since you don't have an account yet, click on **Register**.
3.  Create your first user and organization.
4.  Once registered, you will be automatically logged in and can start adding and managing your MikroTik routers.
