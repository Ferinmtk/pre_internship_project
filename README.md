# Admin Dashboard

This is an admin dashboard built with Node.js, Express.js, PostgreSQL, HTML, CSS, and JavaScript.

## Table of Contents
- [Features](#features)
- [Setup](#setup)
  - [Prerequisites](#prerequisites)
  - [Database Setup](#database-setup)
  - [Environment Variables](#environment-variables)
  - [Running the Application](#running-the-application)
- [Automate Database Setup (Optional)](#automate-database-setup-optional)
- [Contributing](#contributing)
- [License](#license)

## Features
- User authentication (login/signup).
- Admin dashboard with CRUD operations.
- Responsive design.

## Setup

### Prerequisites
Before running the application, ensure you have the following installed:
- [Node.js](https://nodejs.org/) (v16 or higher)
- [PostgreSQL](https://www.postgresql.org/) (v12 or higher)
- [Git](https://git-scm.com/)

### Database Setup
1. **Install PostgreSQL**: If you haven't already, install PostgreSQL on your system. You can download it from [here](https://www.postgresql.org/download/).

2. **Create a New Database**:
   Use the `createdb` command to create a new database:
   ```bash
   createdb tera  <!-- Replace "tera" with your actual database name if different -->


3. psql -U postgres -d tera -f database/schema.sql
psql -U postgres -d tera -f database/data.sql  <!-- Optional: Only if you have a data.sql file -->



Automate Database Setup
#!/bin/bash

# Create the database
createdb tera

# Set up the schema and seed data
psql -U postgres -d tera -f database/schema.sql
psql -U postgres -d tera -f database/data.sql

Make the script executable and run it:
chmod +x setup.sh
./setup.sh
