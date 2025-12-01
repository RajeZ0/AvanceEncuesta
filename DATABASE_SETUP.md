# PLANSUSTAIN Database Setup

## Setup Instructions

1. **Stop the development server** (if running):
   - Press `Ctrl+C` in the terminal running `npm run dev`

2. **Navigate to the front directory**:
   ```bash
   cd front
   ```

3. **Delete the existing database** (to start fresh):
   ```bash
   rm ../back/dev.db
   ```

4. **Generate Prisma Client**:
   ```bash
   npx prisma generate
   ```

5. **Push the new schema to the database**:
   ```bash
   npx prisma db push
   ```

6. **Run the seed file**:
   ```bash
   npx tsx ../back/prisma/seed-plansustain.ts
   ```

7. **Restart the development server**:
   ```bash
   npm run dev
   ```

## What's New

### Database Schema Changes:
- ✅ **Module** model: Organizes questions into 5 evaluation modules
- ✅ **Component** model: Groups questions by thematic components
- ✅ **ScaleOption** model: Stores detailed 1-5 scale criteria for each question
- ✅ **OdsImpact** model: Tracks SDG impact scores for Module 5
- ✅ Enhanced **Submission** model: Now includes `ipsScore` and `transformationScore`

### Seed Data:
- ✅ Module 1: Contexto Institucional (15 questions with detailed scales)
- ⏳ Modules 2-5: To be added in full seed file

## Alternative: Manual Database Reset

If you prefer to use Prisma Studio:

```bash
npx prisma studio
```

Then manually delete all records and re-run the seed.

## Troubleshooting

**Error: "Database is locked"**
- Stop the dev server first
- Close Prisma Studio if open
- Try again

**Error: "P2021: The table does not exist"**
- Delete the database file: `rm ../back/dev.db`
- Run `npx prisma db push` again
