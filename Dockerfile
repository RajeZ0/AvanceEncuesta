FROM node:20-bookworm

WORKDIR /app

# 1. Install system dependencies
RUN apt-get update && apt-get install -y openssl python3 make g++

# 2. Copy package files
COPY package.json package-lock.json ./
COPY front/package.json front/package-lock.json* ./front/

# 3. Install dependencies
# Root install
RUN npm install

# Front install with sanitation
RUN cd front && python3 -c 'import json, sys; pkg = json.load(open("package.json")); pkg.get("scripts", {}).pop("postinstall", None); json.dump(pkg, open("package.json", "w"), indent=2)'
RUN cd front && npm install

# 5. Copy Source Code
COPY back ./back
COPY front ./front

# 6. Generate Prisma Client
# We use the schema from back/ so the relative 'output' path (../../front/node_modules)
# resolves correctly to /app/front/node_modules
ENV DATABASE_URL="file:/tmp/dummy.db"
ENV DATABASE_FILE_PATH="/tmp/dummy.db"

# Push schema to dummy DB for build-time static generation
# RUN npx prisma db push --schema=back/prisma/schema.prisma

# Generate client into front/node_modules
# Strategy: Copy schema locally and Remove 'output' config to force default generation path
RUN mkdir -p front/prisma
COPY back/prisma/schema.prisma front/prisma/schema.prisma
RUN sed -i '/output/d' front/prisma/schema.prisma
RUN cd front && npx prisma generate --schema=prisma/schema.prisma

# 7. Build Next.js Application
ENV NEXT_TELEMETRY_DISABLED=1
RUN cd front && npm run build

# 8. Setup Startup
EXPOSE 3000
COPY start.sh /start.sh
RUN chmod +x /start.sh

CMD ["/start.sh"]
