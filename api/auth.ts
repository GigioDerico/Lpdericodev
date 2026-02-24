import { sql } from './_lib/neon';

export const config = {
    runtime: 'edge',
};

async function hashPassword(password: string): Promise<string> {
    const encoder = new TextEncoder();
    const data = encoder.encode(password);
    const hashBuffer = await crypto.subtle.digest("SHA-256", data);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    return hashArray.map(b => b.toString(16).padStart(2, "0")).join("");
}

export default async function handler(req: Request) {
    if (!sql) {
        return new Response(JSON.stringify({ error: "Database not configured" }), { status: 500 });
    }

    if (req.method !== 'POST') {
        return new Response(`Method ${req.method} Not Allowed`, { status: 405 });
    }

    try {
        const body = await req.json();
        const { action, ...data } = body;

        switch (action) {
            case 'signUp': {
                const { name, email, password } = data;
                const existing = await sql`SELECT id FROM neon_auth."user" WHERE email = ${email}`;
                if (existing.length > 0) return new Response(JSON.stringify({ success: false, error: "Este email já está cadastrado." }));

                const hashedPassword = await hashPassword(password);
                const userResult = await sql`
          INSERT INTO neon_auth."user" (name, email, "emailVerified", role)
          VALUES (${name}, ${email}, false, 'admin')
          RETURNING id
        `;
                const userId = userResult[0].id;

                await sql`
          INSERT INTO neon_auth."account" ("accountId", "providerId", "userId", password, "createdAt", "updatedAt")
          VALUES (${userId}, 'credential', ${userId}, ${hashedPassword}, NOW(), NOW())
        `;
                return new Response(JSON.stringify({ success: true }));
            }

            case 'signIn': {
                const { email, password } = data;
                const users = await sql`
          SELECT u.id, u.name, u.email, u.role, u.image, u.banned
          FROM neon_auth."user" u
          WHERE u.email = ${email}
        `;
                if (users.length === 0) return new Response(JSON.stringify({ success: false, error: "Email ou senha incorretos." }));
                const user = users[0];
                if (user.banned) return new Response(JSON.stringify({ success: false, error: "Esta conta foi desativada." }));

                const accounts = await sql`
          SELECT password FROM neon_auth."account"
          WHERE "userId" = ${user.id} AND "providerId" = 'credential'
        `;
                if (accounts.length === 0) return new Response(JSON.stringify({ success: false, error: "Nenhuma credencial encontrada para este usuário." }));

                const hashedInput = await hashPassword(password);
                if (accounts[0].password !== hashedInput) return new Response(JSON.stringify({ success: false, error: "Email ou senha incorretos." }));

                const sessionToken = crypto.randomUUID();
                const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000); // 7 days
                await sql`
          INSERT INTO neon_auth."session" (id, "expiresAt", token, "userId", "createdAt", "updatedAt")
          VALUES (gen_random_uuid(), ${expiresAt.toISOString()}, ${sessionToken}, ${user.id}, NOW(), NOW())
        `;

                return new Response(JSON.stringify({
                    success: true,
                    token: sessionToken,
                    user: { id: user.id, name: user.name, email: user.email, role: user.role, image: user.image }
                }));
            }

            case 'signOut': {
                const { token } = data;
                if (token) {
                    await sql`DELETE FROM neon_auth."session" WHERE token = ${token}`;
                }
                return new Response(JSON.stringify({ success: true }));
            }

            case 'getSession': {
                const { token } = data;
                if (!token) return new Response(JSON.stringify({ user: null }));

                const sessions = await sql`
          SELECT u.id, u.name, u.email, u.role, u.image
          FROM neon_auth."session" s
          JOIN neon_auth."user" u ON s."userId" = u.id
          WHERE s.token = ${token} AND s."expiresAt" > NOW()
        `;
                if (sessions.length === 0) return new Response(JSON.stringify({ user: null }));
                return new Response(JSON.stringify({ user: sessions[0] }));
            }

            case 'resetPassword': {
                const { email } = data;
                const users = await sql`SELECT id FROM neon_auth."user" WHERE email = ${email}`;
                if (users.length === 0) return new Response(JSON.stringify({ success: true }));
                const resetToken = crypto.randomUUID();
                const expiresAt = new Date(Date.now() + 30 * 60 * 1000);
                await sql`
          INSERT INTO neon_auth."verification" (id, identifier, value, "expiresAt", "createdAt", "updatedAt")
          VALUES (gen_random_uuid(), ${email}, ${resetToken}, ${expiresAt.toISOString()}, NOW(), NOW())
        `;
                console.log(`[RESET TOKEN] Para ${email}: ${resetToken}`);
                return new Response(JSON.stringify({ success: true }));
            }

            case 'confirmResetPassword': {
                const { email, token, newPassword } = data;
                const verifications = await sql`
          SELECT id FROM neon_auth."verification"
          WHERE identifier = ${email} AND value = ${token} AND "expiresAt" > NOW()
          ORDER BY "createdAt" DESC LIMIT 1
        `;
                if (verifications.length === 0) return new Response(JSON.stringify({ success: false, error: "Token inválido ou expirado." }));

                const users = await sql`SELECT id FROM neon_auth."user" WHERE email = ${email}`;
                if (users.length === 0) return new Response(JSON.stringify({ success: false, error: "Usuário não encontrado." }));

                const hashedPassword = await hashPassword(newPassword);
                await sql`
          UPDATE neon_auth."account"
          SET password = ${hashedPassword}, "updatedAt" = NOW()
          WHERE "userId" = ${users[0].id} AND "providerId" = 'credential'
        `;
                await sql`DELETE FROM neon_auth."verification" WHERE identifier = ${email} AND value = ${token}`;
                return new Response(JSON.stringify({ success: true }));
            }

            case 'updateProfile': {
                const { userId, name, image } = data;
                await sql`
          UPDATE neon_auth."user"
          SET name = COALESCE(${name ?? null}, name),
              image = COALESCE(${image ?? null}, image),
              "updatedAt" = NOW()
          WHERE id = ${userId}
        `;
                return new Response(JSON.stringify({ success: true }));
            }

            case 'updatePassword': {
                const { userId, currentPassword, newPassword } = data;
                const accounts = await sql`SELECT password FROM neon_auth."account" WHERE "userId" = ${userId} AND "providerId" = 'credential'`;
                if (accounts.length === 0) return new Response(JSON.stringify({ success: false, error: "Conta não encontrada." }));

                const hashedCurrent = await hashPassword(currentPassword);
                if (accounts[0].password !== hashedCurrent) return new Response(JSON.stringify({ success: false, error: "Senha atual incorreta." }));

                const hashedNew = await hashPassword(newPassword);
                await sql`
          UPDATE neon_auth."account"
          SET password = ${hashedNew}, "updatedAt" = NOW()
          WHERE "userId" = ${userId} AND "providerId" = 'credential'
        `;
                return new Response(JSON.stringify({ success: true }));
            }

            default:
                return new Response(JSON.stringify({ error: "Unknown action" }), { status: 400 });
        }
    } catch (error: any) {
        console.error(`Failed to handle auth action:`, error);
        return new Response(JSON.stringify({ error: error.message }), { status: 500, headers: { 'Content-Type': 'application/json' } });
    }
}
