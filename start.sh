#!/bin/sh
set -e

echo "Synchronizing database schema..."
# DATABASE_URL is provided by Render environment
echo "Running: /app/node_modules/.bin/prisma db push --schema=/app/back/prisma/schema.prisma --force-reset"
/app/node_modules/.bin/prisma db push --schema=/app/back/prisma/schema.prisma --force-reset

echo "Seeding database..."
# Compile seed script to CommonJS to avoid ts-node/ESM issues
echo "Compiling seed script..."
npx tsc /app/back/prisma/seed.ts --outDir /app/back/prisma --module commonjs --target es2020 --skipLibCheck --moduleResolution node --esModuleInterop

echo "Running seed script..."
node /app/back/prisma/seed.js

# 2. Start Application
echo "Starting Frontend..."
cd /app/front
# With standalone output, we run the standalone server
# But we need to copy static files if we didn't use the minimal image strategy.
# For simplicity with full image, 'npm start' is safer unless we reshuffle files.
# However, 'npm start' works fine with standalone too, or we can run node server.js
# Let's stick to npm run start for maximum compatibility unless size is critical.
npm run start
