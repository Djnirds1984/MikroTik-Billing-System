# Full-Stack MikroTik Billing System - Setup Guide for Orange Pi (Armbian/Ubuntu)

This guide provides step-by-step instructions to set up and run the entire full-stack application on a single-board computer like the Orange Pi One running a Debian-based OS (e.g., Armbian, Ubuntu).

## 1. Prerequisites (System Setup)

First, connect to your Orange Pi via SSH and follow these steps to install the necessary software.

### Step 1.1: Update Your System

Ensure your package list and installed packages are up-to-date.

```bash
sudo apt update
sudo apt upgrade -y
```

### Step 1.2: Install Git

Git is used to clone the project repository.

```bash
sudo apt install git -y
```

### Step 1.3: Install PostgreSQL Database

Install the PostgreSQL server and client.

```bash
sudo apt install postgresql postgresql-contrib -y
```

After installation, the PostgreSQL service should start automatically. You can check its status with:

```bash
sudo systemctl status postgresql
```

### Step 1.4: Install Node.js and Build Tools

The default Ubuntu/Armbian repositories can have outdated Node.js versions. We'll use the NodeSource repository to get a modern LTS version. `build-essential` is required to compile native Node.js modules like `bcrypt`.

```bash
# Add the NodeSource repository for Node.js LTS
curl -fsSL https://deb.nodesource.com/setup_lts.x | sudo -E bash -

# Install Node.js and build tools
sudo apt install -y nodejs build-essential
```

Verify the installation:
```bash
node -v  # Should show v18.x or a later LTS version
npm -v
```

## 2. Project Installation

Clone the project repository to your home directory.

```bash
# Replace <your-repository-url> with the actual URL
git clone <your-repository-url>

# Navigate into the project directory
cd <project-directory-name>
```

## 3. Backend Setup

### Step 3.1: Install Node.js Dependencies

Install the required packages for the backend server.

```bash
npm install
```

### Step 3.2: Set Up the PostgreSQL Database

The application is designed to automatically create the database and its tables on the first run. You just need to ensure PostgreSQL is running and configure the connection in the `.env` file.

1.  **(Optional but Recommended) Create a Dedicated User**:
    For security, it's best to create a dedicated user for your application instead of using the `postgres` superuser.

    *   Log in to PostgreSQL:
        ```bash
        sudo -u postgres psql
        ```
    *   Create a user with database creation privileges. Replace `myuser` and `mypassword` with secure credentials:
        ```sql
        CREATE USER myuser WITH CREATEDB PASSWORD 'mypassword';
        \q
        ```
    *   This user will now be able to create the application's database automatically.

2.  **No further manual setup is required!**
    When you start the backend server for the first time, it will:
    - Connect to PostgreSQL using the credentials from your `.env` file.
    - Automatically create the `mikrotik_billing` database if it doesn't exist.
    - Automatically create all the necessary tables (`users`, `tenants`, `routers`) if they don't exist.

### Step 3.3: Configure Environment Variables

1.  **Create the `.env` file**:
    In the root of the project, create a new file named `.env` to store your configuration secrets.

    ```bash
    nano .env
    ```

2.  **Add Configuration**:
    Copy and paste the following content into the file. Adjust the `DATABASE_URL` to use the user you created, or use the default `postgres` user. **Crucially, replace the `JWT_SECRET` with your own long, random string.**

    ```
    # PostgreSQL Connection URL
    # Format: postgresql://USER:PASSWORD@HOST:PORT/DATABASE
    DATABASE_URL=postgresql://myuser:mypassword@localhost:5432/mikrotik_billing

    # A long, random, and secret string for signing JWTs
    JWT_SECRET=replace-this-with-a-very-long-and-secure-random-string

    # The port for the backend server to run on
    PORT=4000
    ```
    Save the file and exit the editor (in `nano`, press `Ctrl+X`, then `Y`, then `Enter`).

### Step 3.4: Run the Backend Server

Start the backend development server.

```bash
npm run dev
```

The server should now be running on `http://localhost:4000`. Keep this terminal window open.

## 4. Frontend Setup

The frontend is a static site but should be served via a web server to avoid browser security issues.

### Step 4.1: Run the Frontend

Open a **new SSH session** to your Orange Pi, navigate to the project directory, and use `npx` to run a simple, temporary web server.

```bash
# In your second terminal, go to the project folder
cd <path-to-your-project-directory>

# Start a simple web server on port 8080
npx http-server . -p 8080
```
`npx` will automatically download and run `http-server` for you.

## 5. Using the Application

1.  Find your Orange Pi's IP address by running `ip a` in the terminal.
2.  On your computer (on the same network), open a web browser and navigate to `http://<YOUR_ORANGE_PI_IP>:8080`.
3.  The application should load. You can now register a new account and begin using the system.

## 6. (Optional) Running as a Service with PM2

To keep the application running in the background (and automatically restart it on reboots), you can use PM2, a process manager for Node.js.

```bash
# Install PM2 globally
sudo npm install pm2 -g

# Start the backend server with PM2
pm2 start npm --name "mikrotik-backend" -- run dev

# Start the frontend server with PM2
pm2 start http-server --name "mikrotik-frontend" -- . -p 8080

# Check that both services are online
pm2 list

# Configure PM2 to start on system boot
pm2 startup
# (Follow the on-screen instructions, which will give you a command to run)

# Save the current process list to be restored on reboot
pm2 save
```
Your application will now run continuously in the background.