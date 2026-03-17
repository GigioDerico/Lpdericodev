import { neon } from "@neondatabase/serverless";

const DATABASE_URL = import.meta.env.VITE_DATABASE_URL;

if (!DATABASE_URL) {
    console.warn("VITE_DATABASE_URL not set. Database queries will fail.");
}

export const sql = DATABASE_URL ? neon(DATABASE_URL, { disableWarningInBrowsers: true }) : null;
