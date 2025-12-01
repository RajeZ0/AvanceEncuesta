-- PLANSUSTAIN Database Schema

-- User table
CREATE TABLE IF NOT EXISTS "User" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "username" TEXT NOT NULL UNIQUE,
    "password" TEXT NOT NULL,
    "role" TEXT NOT NULL DEFAULT 'USER',
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- Module table
CREATE TABLE IF NOT EXISTS "Module" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "number" INTEGER NOT NULL UNIQUE,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "evaluationType" TEXT NOT NULL,
    "outputKey" TEXT,
    "order" INTEGER NOT NULL DEFAULT 0
);

-- Component table
CREATE TABLE IF NOT EXISTS "Component" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "moduleId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "order" INTEGER NOT NULL DEFAULT 0,
    FOREIGN KEY ("moduleId") REFERENCES "Module"("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- Question table
CREATE TABLE IF NOT EXISTS "Question" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "componentId" TEXT NOT NULL,
    "text" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "weight" INTEGER NOT NULL DEFAULT 1,
    "order" INTEGER NOT NULL DEFAULT 0,
    FOREIGN KEY ("componentId") REFERENCES "Component"("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- ScaleOption table
CREATE TABLE IF NOT EXISTS "ScaleOption" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "questionId" TEXT NOT NULL,
    "value" INTEGER NOT NULL,
    "label" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    FOREIGN KEY ("questionId") REFERENCES "Question"("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- Submission table
CREATE TABLE IF NOT EXISTS "Submission" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "userId" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'IN_PROGRESS',
    "score" REAL,
    "ipsScore" REAL,
    "transformationScore" REAL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- Answer table
CREATE TABLE IF NOT EXISTS "Answer" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "submissionId" TEXT NOT NULL,
    "questionId" TEXT NOT NULL,
    "value" TEXT NOT NULL,
    "score" REAL,
    FOREIGN KEY ("submissionId") REFERENCES "Submission"("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    FOREIGN KEY ("questionId") REFERENCES "Question"("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- OdsImpact table
CREATE TABLE IF NOT EXISTS "OdsImpact" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "submissionId" TEXT NOT NULL,
    "odsNumber" INTEGER NOT NULL,
    "odsName" TEXT NOT NULL,
    "impactScore" REAL NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY ("submissionId") REFERENCES "Submission"("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS "Component_moduleId_idx" ON "Component"("moduleId");
CREATE INDEX IF NOT EXISTS "Question_componentId_idx" ON "Question"("componentId");
CREATE INDEX IF NOT EXISTS "ScaleOption_questionId_idx" ON "ScaleOption"("questionId");
CREATE INDEX IF NOT EXISTS "Submission_userId_idx" ON "Submission"("userId");
CREATE INDEX IF NOT EXISTS "Answer_submissionId_idx" ON "Answer"("submissionId");
CREATE INDEX IF NOT EXISTS "Answer_questionId_idx" ON "Answer"("questionId");
CREATE INDEX IF NOT EXISTS "OdsImpact_submissionId_idx" ON "OdsImpact"("submissionId");
