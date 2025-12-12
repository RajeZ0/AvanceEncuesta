import path from 'path';

export function getDbPath() {
    if (process.env.DATABASE_FILE_PATH) {
        return process.env.DATABASE_FILE_PATH;
    }
    // Fallback for local development: resolve relative to CWD (usually 'front')
    return path.resolve(process.cwd(), '../back/dev.db');
}
