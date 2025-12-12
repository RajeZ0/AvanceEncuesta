#!/bin/sh
set -e

# Define path to DB
DB_FILE="/app/back/dev.db"

echo "Using Database File at: $DB_FILE"

# Ensure the back directory exists for the DB file
mkdir -p /app/back

# 1. Database Setup
echo "Synchronizing database schema..."
export DATABASE_URL="file:$DB_FILE"
npx prisma db push --schema=/app/back/prisma/schema.prisma

echo "Seeding database..."
# Run seed script using ts-node from root dependencies
export DATABASE_URL="file:$DB_FILE"
npx ts-node /app/back/prisma/seed.ts

# 2. Start Application
echo "Starting Frontend..."
cd /app/front
# With standalone output, we run the standalone server
# But we need to copy static files if we didn't use the minimal image strategy.
# For simplicity with full image, 'npm start' is safer unless we reshuffle files.
# However, 'npm start' works fine with standalone too, or we can run node server.js
# Let's stick to npm run start for maximum compatibility unless size is critical.
npm run start
