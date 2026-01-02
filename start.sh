#!/bin/sh
set -e

DB_PATH="/app/back/dev.db"

# Check if database already has data (User table has records)
check_db_has_data() {
    if [ -f "$DB_PATH" ]; then
        # Check if User table exists and has data
        COUNT=$(sqlite3 "$DB_PATH" "SELECT COUNT(*) FROM User;" 2>/dev/null || echo "0")
        if [ "$COUNT" -gt "0" ]; then
            return 0  # Has data
        fi
    fi
    return 1  # No data
}

# Only seed if database is empty or doesn't exist
if check_db_has_data; then
    echo "✅ Database already has data, skipping seed..."
else
    echo "📦 Database is empty, running setup..."
    
    echo "Synchronizing database schema..."
    /app/node_modules/.bin/prisma db push --schema=/app/back/prisma/schema.prisma
    
    echo "Generating Prisma Clients..."
    /app/node_modules/.bin/prisma generate --schema=/app/back/prisma/schema.prisma
    
    echo "Compiling seed script..."
    npx tsc /app/back/prisma/seed.ts --outDir /app/back/prisma --module commonjs --target es2020 --skipLibCheck --moduleResolution node --esModuleInterop
    
    echo "Running seed script..."
    node /app/back/prisma/seed.js
fi

# Start Application
echo "🚀 Starting Frontend..."
cd /app/front
npm run start
