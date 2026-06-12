import dotenv from "dotenv"
import path from "path"
import { fileURLToPath } from "url"

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

dotenv.config({ path: path.resolve(__dirname, "../../.env") })

const parseAdminEmails = () => {
        const adminEmailsRaw = process.env.ADMIN_EMAILS;

        if (adminEmailsRaw) {
                return adminEmailsRaw
                        .split(",")
                        .map((email) => email.trim().toLowerCase())
                        .filter(Boolean);
        }

        if (process.env.ADMIN_EMAIL) {
                return [process.env.ADMIN_EMAIL.trim().toLowerCase()];
        }

        return [];
};

export const ENV = {
        NODE_ENV:process.env.NODE_ENV,
        PORT:process.env.PORT,
        DB_URL:process.env.DB_URL?.trim(),
        CLERK_PUBLISHABLE_KEY:process.env.CLERK_PUBLISHABLE_KEY,
        CLERK_SECRET_KEY:process.env.CLERK_SECRET_KEY,
        CLOUDINARY_API_KEY:process.env.CLOUDINARY_API_KEY,
        CLOUDINARY_API_SECRET:process.env.CLOUDINARY_API_SECRET,
        CLOUDINARY_CLOUD_NAME:process.env.CLOUDINARY_CLOUD_NAME,
        BACKEND_URL:process.env.BACKEND_URL || `http://localhost:${process.env.PORT || 3000}`,
        INNGEST_SIGNING_KEY:process.env.INNGEST_SIGNING_KEY,
        CLIENT_URL:process.env.CLIENT_URL,
        ADMIN_EMAIL:process.env.ADMIN_EMAIL,
        ADMIN_EMAILS:parseAdminEmails(),
        STRIPE_PUBLISHABLE_KEY:process.env.STRIPE_PUBLISHABLE_KEY,
        STRIPE_SECRET_KEY:process.env.STRIPE_SECRET_KEY,
        STRIPE_WEBHOOK_SECRET:process.env.STRIPE_WEBHOOK_SECRET
};
