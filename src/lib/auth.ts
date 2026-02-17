import { sql } from "./neon";

export interface User {
    id: string;
    name: string;
    email: string;
    role: string | null;
    image: string | null;
}

// Hash password using Web Crypto API (SHA-256)
// Note: Better Auth uses bcrypt, but for this admin panel we'll use
// a compatible approach. For production, consider using a proper auth service.
async function hashPassword(password: string): Promise<string> {
    const encoder = new TextEncoder();
    const data = encoder.encode(password);
    const hashBuffer = await crypto.subtle.digest("SHA-256", data);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    return hashArray.map(b => b.toString(16).padStart(2, "0")).join("");
}

export const auth = {
    async signUp(name: string, email: string, password: string): Promise<{ success: boolean; error?: string }> {
        if (!sql) return { success: false, error: "Banco de dados não configurado." };

        try {
            // Check if user already exists
            const existing = await sql`SELECT id FROM neon_auth."user" WHERE email = ${email}`;
            if (existing.length > 0) {
                return { success: false, error: "Este email já está cadastrado." };
            }

            const hashedPassword = await hashPassword(password);

            // Create user
            const userResult = await sql`
        INSERT INTO neon_auth."user" (name, email, "emailVerified", role)
        VALUES (${name}, ${email}, false, 'admin')
        RETURNING id
      `;

            const userId = userResult[0].id;

            // Create credential account
            await sql`
        INSERT INTO neon_auth."account" ("accountId", "providerId", "userId", password, "createdAt", "updatedAt")
        VALUES (${userId}, 'credential', ${userId}, ${hashedPassword}, NOW(), NOW())
      `;

            return { success: true };
        } catch (err: any) {
            console.error("SignUp error:", err);
            return { success: false, error: "Erro ao criar conta. Tente novamente." };
        }
    },

    async signIn(email: string, password: string): Promise<{ success: boolean; user?: User; error?: string }> {
        if (!sql) return { success: false, error: "Banco de dados não configurado." };

        try {
            // Find user
            const users = await sql`
        SELECT u.id, u.name, u.email, u.role, u.image, u.banned
        FROM neon_auth."user" u
        WHERE u.email = ${email}
      `;

            if (users.length === 0) {
                return { success: false, error: "Email ou senha incorretos." };
            }

            const user = users[0];

            if (user.banned) {
                return { success: false, error: "Esta conta foi desativada." };
            }

            // Verify password
            const accounts = await sql`
        SELECT password FROM neon_auth."account"
        WHERE "userId" = ${user.id} AND "providerId" = 'credential'
      `;

            if (accounts.length === 0) {
                return { success: false, error: "Nenhuma credencial encontrada para este usuário." };
            }

            const hashedInput = await hashPassword(password);
            if (accounts[0].password !== hashedInput) {
                return { success: false, error: "Email ou senha incorretos." };
            }

            // Create session token
            const sessionToken = crypto.randomUUID();
            const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000); // 7 days

            await sql`
        INSERT INTO neon_auth."session" (id, "expiresAt", token, "userId", "createdAt", "updatedAt")
        VALUES (gen_random_uuid(), ${expiresAt.toISOString()}, ${sessionToken}, ${user.id}, NOW(), NOW())
      `;

            // Store token in localStorage
            localStorage.setItem("admin_token", sessionToken);
            localStorage.setItem("admin_user", JSON.stringify({
                id: user.id,
                name: user.name,
                email: user.email,
                role: user.role,
                image: user.image
            }));

            return {
                success: true,
                user: {
                    id: user.id,
                    name: user.name,
                    email: user.email,
                    role: user.role,
                    image: user.image
                }
            };
        } catch (err: any) {
            console.error("SignIn error:", err);
            return { success: false, error: "Erro ao fazer login. Tente novamente." };
        }
    },

    async signOut(): Promise<void> {
        const token = localStorage.getItem("admin_token");
        if (token && sql) {
            try {
                await sql`DELETE FROM neon_auth."session" WHERE token = ${token}`;
            } catch (err) {
                console.error("SignOut error:", err);
            }
        }
        localStorage.removeItem("admin_token");
        localStorage.removeItem("admin_user");
    },

    async getSession(): Promise<User | null> {
        const token = localStorage.getItem("admin_token");
        if (!token || !sql) return null;

        try {
            const sessions = await sql`
        SELECT u.id, u.name, u.email, u.role, u.image
        FROM neon_auth."session" s
        JOIN neon_auth."user" u ON s."userId" = u.id
        WHERE s.token = ${token} AND s."expiresAt" > NOW()
      `;

            if (sessions.length === 0) {
                localStorage.removeItem("admin_token");
                localStorage.removeItem("admin_user");
                return null;
            }

            return sessions[0] as User;
        } catch (err) {
            console.error("GetSession error:", err);
            return null;
        }
    },

    async resetPassword(email: string): Promise<{ success: boolean; error?: string }> {
        if (!sql) return { success: false, error: "Banco de dados não configurado." };

        try {
            const users = await sql`SELECT id FROM neon_auth."user" WHERE email = ${email}`;
            if (users.length === 0) {
                // Don't reveal if email exists for security
                return { success: true };
            }

            // Generate a temporary reset token
            const resetToken = crypto.randomUUID();
            const expiresAt = new Date(Date.now() + 30 * 60 * 1000); // 30 min

            await sql`
        INSERT INTO neon_auth."verification" (id, identifier, value, "expiresAt", "createdAt", "updatedAt")
        VALUES (gen_random_uuid(), ${email}, ${resetToken}, ${expiresAt.toISOString()}, NOW(), NOW())
      `;

            // In a real app, send email with the token
            // For now, we log it and show it (admin-only panel)
            console.log(`[RESET TOKEN] Para ${email}: ${resetToken}`);

            return { success: true };
        } catch (err: any) {
            console.error("ResetPassword error:", err);
            return { success: false, error: "Erro ao processar. Tente novamente." };
        }
    },

    async confirmResetPassword(email: string, token: string, newPassword: string): Promise<{ success: boolean; error?: string }> {
        if (!sql) return { success: false, error: "Banco de dados não configurado." };

        try {
            // Verify token
            const verifications = await sql`
        SELECT id FROM neon_auth."verification"
        WHERE identifier = ${email} AND value = ${token} AND "expiresAt" > NOW()
        ORDER BY "createdAt" DESC LIMIT 1
      `;

            if (verifications.length === 0) {
                return { success: false, error: "Token inválido ou expirado." };
            }

            // Find user
            const users = await sql`SELECT id FROM neon_auth."user" WHERE email = ${email}`;
            if (users.length === 0) {
                return { success: false, error: "Usuário não encontrado." };
            }

            const hashedPassword = await hashPassword(newPassword);

            // Update password
            await sql`
        UPDATE neon_auth."account"
        SET password = ${hashedPassword}, "updatedAt" = NOW()
        WHERE "userId" = ${users[0].id} AND "providerId" = 'credential'
      `;

            // Delete used verification token
            await sql`
        DELETE FROM neon_auth."verification"
        WHERE identifier = ${email} AND value = ${token}
      `;

            return { success: true };
        } catch (err: any) {
            console.error("ConfirmReset error:", err);
            return { success: false, error: "Erro ao redefinir senha. Tente novamente." };
        }
    },

    async updateProfile(userId: string, data: { name?: string; image?: string }): Promise<{ success: boolean; error?: string }> {
        if (!sql) return { success: false, error: "Banco de dados não configurado." };

        try {
            await sql`
        UPDATE neon_auth."user"
        SET 
          name = COALESCE(${data.name ?? null}, name),
          image = COALESCE(${data.image ?? null}, image),
          "updatedAt" = NOW()
        WHERE id = ${userId}
      `;

            // Update local storage
            const stored = localStorage.getItem("admin_user");
            if (stored) {
                const user = JSON.parse(stored);
                if (data.name) user.name = data.name;
                if (data.image) user.image = data.image;
                localStorage.setItem("admin_user", JSON.stringify(user));
            }

            return { success: true };
        } catch (err: any) {
            console.error("UpdateProfile error:", err);
            return { success: false, error: "Erro ao atualizar perfil." };
        }
    },

    async updatePassword(userId: string, currentPassword: string, newPassword: string): Promise<{ success: boolean; error?: string }> {
        if (!sql) return { success: false, error: "Banco de dados não configurado." };

        try {
            // Verify current password
            const accounts = await sql`
        SELECT password FROM neon_auth."account"
        WHERE "userId" = ${userId} AND "providerId" = 'credential'
      `;

            if (accounts.length === 0) {
                return { success: false, error: "Conta não encontrada." };
            }

            const hashedCurrent = await hashPassword(currentPassword);
            if (accounts[0].password !== hashedCurrent) {
                return { success: false, error: "Senha atual incorreta." };
            }

            const hashedNew = await hashPassword(newPassword);
            await sql`
        UPDATE neon_auth."account"
        SET password = ${hashedNew}, "updatedAt" = NOW()
        WHERE "userId" = ${userId} AND "providerId" = 'credential'
      `;

            return { success: true };
        } catch (err: any) {
            console.error("UpdatePassword error:", err);
            return { success: false, error: "Erro ao alterar senha." };
        }
    },

    getCurrentUser(): User | null {
        const stored = localStorage.getItem("admin_user");
        if (!stored) return null;
        try {
            return JSON.parse(stored) as User;
        } catch {
            return null;
        }
    }
};
