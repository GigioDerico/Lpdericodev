export interface User {
    id: string;
    name: string;
    email: string;
    role: string | null;
    image: string | null;
}

export const auth = {
    async signUp(name: string, email: string, password: string): Promise<{ success: boolean; error?: string }> {
        try {
            const res = await fetch('/api/auth', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ action: 'signUp', name, email, password })
            });
            return await res.json();
        } catch (err) {
            return { success: false, error: "Erro ao conectar com servidor." };
        }
    },

    async signIn(email: string, password: string): Promise<{ success: boolean; user?: User; error?: string }> {
        try {
            const res = await fetch('/api/auth', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ action: 'signIn', email, password })
            });
            const data = await res.json();

            if (data.success && data.token && data.user) {
                localStorage.setItem("admin_token", data.token);
                localStorage.setItem("admin_user", JSON.stringify(data.user));
                return { success: true, user: data.user };
            }
            return data;
        } catch (err) {
            return { success: false, error: "Erro ao conectar com servidor." };
        }
    },

    async signOut(): Promise<void> {
        const token = localStorage.getItem("admin_token");
        if (token) {
            try {
                await fetch('/api/auth', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ action: 'signOut', token })
                });
            } catch (err) {
                console.error("SignOut error:", err);
            }
        }
        localStorage.removeItem("admin_token");
        localStorage.removeItem("admin_user");
    },

    async getSession(): Promise<User | null> {
        const token = localStorage.getItem("admin_token");
        if (!token) return null;

        try {
            const res = await fetch('/api/auth', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ action: 'getSession', token })
            });
            const data = await res.json();

            if (!data.user) {
                localStorage.removeItem("admin_token");
                localStorage.removeItem("admin_user");
                return null;
            }

            return data.user;
        } catch (err) {
            console.error("GetSession error:", err);
            return null;
        }
    },

    async resetPassword(email: string): Promise<{ success: boolean; error?: string }> {
        try {
            const res = await fetch('/api/auth', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ action: 'resetPassword', email })
            });
            return await res.json();
        } catch (err) {
            return { success: false, error: "Erro ao processar requisição." };
        }
    },

    async confirmResetPassword(email: string, token: string, newPassword: string): Promise<{ success: boolean; error?: string }> {
        try {
            const res = await fetch('/api/auth', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ action: 'confirmResetPassword', email, token, newPassword })
            });
            return await res.json();
        } catch (err) {
            return { success: false, error: "Erro ao processar requisição." };
        }
    },

    async updateProfile(userId: string, data: { name?: string; image?: string }): Promise<{ success: boolean; error?: string }> {
        try {
            const res = await fetch('/api/auth', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ action: 'updateProfile', userId, ...data })
            });
            const result = await res.json();

            if (result.success) {
                const stored = localStorage.getItem("admin_user");
                if (stored) {
                    const user = JSON.parse(stored);
                    if (data.name) user.name = data.name;
                    if (data.image) user.image = data.image;
                    localStorage.setItem("admin_user", JSON.stringify(user));
                }
            }
            return result;
        } catch (err) {
            return { success: false, error: "Erro de conexão." };
        }
    },

    async updatePassword(userId: string, currentPassword: string, newPassword: string): Promise<{ success: boolean; error?: string }> {
        try {
            const res = await fetch('/api/auth', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ action: 'updatePassword', userId, currentPassword, newPassword })
            });
            return await res.json();
        } catch (err) {
            return { success: false, error: "Erro de conexão." };
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
