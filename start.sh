#!/bin/sh
set -e

echo "Synchronizing database schema..."
# DATABASE_URL is provided by Render environment
echo "Running: /app/node_modules/.bin/prisma db push --schema=/app/back/prisma/schema.prisma --force-reset"
/app/node_modules/.bin/prisma db push --schema=/app/back/prisma/schema.prisma --force-reset

echo "Seeding database..."
# Explicitly use the local ts-node binary and transpile-only to avoid strict type checks and module issues
/app/node_modules/.bin/ts-node --esm --transpile-only /app/back/prisma/seed.ts

# 2. Start Application
echo "Starting Frontend..."
cd /app/front
# With standalone output, we run the standalone server
# But we need to copy static files if we didn't use the minimal image strategy.
# For simplicity with full image, 'npm start' is safer unless we reshuffle files.
# However, 'npm start' works fine with standalone too, or we can run node server.js
# Let's stick to npm run start for maximum compatibility unless size is critical.
npm run start
