import { neon } from "@neondatabase/serverless";

const DATABASE_URL = process.env.DATABASE_URL;

if (!DATABASE_URL) {
    console.warn("DATABASE_URL not set. Database queries will fail.");
}

export const sql = DATABASE_URL ? neon(DATABASE_URL, { disableWarningInBrowsers: true }) : null;
