import { useState, useEffect } from "react";
import { motion } from "motion/react";
import { Save, Shield, User, Mail, AlertCircle, CheckCircle2, Loader2 } from "lucide-react";
import { auth, User as AuthUser } from "../../../lib/auth";

export default function SettingsPage() {
    const [user, setUser] = useState<AuthUser | null>(null);

    // Profile fields
    const [name, setName] = useState("");
    const [profileLoading, setProfileLoading] = useState(false);
    const [profileMessage, setProfileMessage] = useState({ type: "", text: "" });

    // Password fields
    const [currentPassword, setCurrentPassword] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [passwordLoading, setPasswordLoading] = useState(false);
    const [passwordMessage, setPasswordMessage] = useState({ type: "", text: "" });

    useEffect(() => {
        const loadUser = async () => {
            const session = await auth.getSession();
            if (session) {
                setUser(session);
                setName(session.name);
            }
        };
        loadUser();
    }, []);

    const handleProfileSave = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!user) return;

        setProfileLoading(true);
        setProfileMessage({ type: "", text: "" });

        const result = await auth.updateProfile(user.id, { name });

        if (result.success) {
            setProfileMessage({ type: "success", text: "Perfil atualizado com sucesso!" });
            setUser(prev => prev ? { ...prev, name } : null);
        } else {
            setProfileMessage({ type: "error", text: result.error || "Erro ao salvar." });
        }

        setProfileLoading(false);
    };

    const handlePasswordChange = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!user) return;

        setPasswordMessage({ type: "", text: "" });

        if (newPassword !== confirmPassword) {
            setPasswordMessage({ type: "error", text: "As senhas não conferem." });
            return;
        }

        if (newPassword.length < 6) {
            setPasswordMessage({ type: "error", text: "A nova senha deve ter no mínimo 6 caracteres." });
            return;
        }

        setPasswordLoading(true);

        const result = await auth.updatePassword(user.id, currentPassword, newPassword);

        if (result.success) {
            setPasswordMessage({ type: "success", text: "Senha alterada com sucesso!" });
            setCurrentPassword("");
            setNewPassword("");
            setConfirmPassword("");
        } else {
            setPasswordMessage({ type: "error", text: result.error || "Erro ao alterar senha." });
        }

        setPasswordLoading(false);
    };

    if (!user) {
        return (
            <div className="flex items-center justify-center h-64">
                <Loader2 className="w-8 h-8 text-indigo-400 animate-spin" />
            </div>
        );
    }

    return (
        <div className="max-w-2xl mx-auto space-y-8">
            <div>
                <h1 className="text-2xl font-bold text-white">Configurações</h1>
                <p className="text-slate-400 mt-1">Gerencie seu perfil e segurança</p>
            </div>

            {/* Profile Section */}
            <motion.div
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-slate-900/50 border border-slate-800 rounded-xl p-6"
            >
                <div className="flex items-center gap-3 mb-6">
                    <div className="w-10 h-10 bg-indigo-500/10 rounded-lg flex items-center justify-center border border-indigo-500/20">
                        <User className="w-5 h-5 text-indigo-400" />
                    </div>
                    <div>
                        <h2 className="text-lg font-semibold text-white">Informações Pessoais</h2>
                        <p className="text-sm text-slate-500">Atualize seu nome e dados de perfil</p>
                    </div>
                </div>

                <form onSubmit={handleProfileSave} className="space-y-4">
                    <div className="space-y-2">
                        <label className="text-xs font-medium text-slate-400 uppercase tracking-wider">Nome</label>
                        <input
                            type="text"
                            value={name}
                            onChange={e => setName(e.target.value)}
                            className="w-full bg-slate-950/50 border border-slate-700 rounded-xl py-3 px-4 text-slate-200 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500/50 transition-all text-sm"
                            required
                        />
                    </div>

                    <div className="space-y-2">
                        <label className="text-xs font-medium text-slate-400 uppercase tracking-wider">Email</label>
                        <div className="flex items-center gap-2 text-slate-400 bg-slate-950/30 border border-slate-700/50 rounded-xl py-3 px-4 text-sm">
                            <Mail size={16} />
                            {user.email}
                        </div>
                        <p className="text-xs text-slate-600">O email não pode ser alterado por aqui.</p>
                    </div>

                    <FeedbackMessage message={profileMessage} />

                    <button
                        type="submit"
                        disabled={profileLoading}
                        className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-500 text-white font-medium px-6 py-2.5 rounded-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {profileLoading ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />}
                        Salvar Alterações
                    </button>
                </form>
            </motion.div>

            {/* Security Section */}
            <motion.div
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="bg-slate-900/50 border border-slate-800 rounded-xl p-6"
            >
                <div className="flex items-center gap-3 mb-6">
                    <div className="w-10 h-10 bg-amber-500/10 rounded-lg flex items-center justify-center border border-amber-500/20">
                        <Shield className="w-5 h-5 text-amber-400" />
                    </div>
                    <div>
                        <h2 className="text-lg font-semibold text-white">Segurança</h2>
                        <p className="text-sm text-slate-500">Altere sua senha de acesso</p>
                    </div>
                </div>

                <form onSubmit={handlePasswordChange} className="space-y-4">
                    <div className="space-y-2">
                        <label className="text-xs font-medium text-slate-400 uppercase tracking-wider">Senha Atual</label>
                        <input
                            type="password"
                            value={currentPassword}
                            onChange={e => setCurrentPassword(e.target.value)}
                            className="w-full bg-slate-950/50 border border-slate-700 rounded-xl py-3 px-4 text-slate-200 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500/50 transition-all text-sm"
                            placeholder="••••••••"
                            required
                        />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <label className="text-xs font-medium text-slate-400 uppercase tracking-wider">Nova Senha</label>
                            <input
                                type="password"
                                value={newPassword}
                                onChange={e => setNewPassword(e.target.value)}
                                className="w-full bg-slate-950/50 border border-slate-700 rounded-xl py-3 px-4 text-slate-200 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500/50 transition-all text-sm"
                                placeholder="Mínimo 6 caracteres"
                                required
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-xs font-medium text-slate-400 uppercase tracking-wider">Confirmar Nova Senha</label>
                            <input
                                type="password"
                                value={confirmPassword}
                                onChange={e => setConfirmPassword(e.target.value)}
                                className="w-full bg-slate-950/50 border border-slate-700 rounded-xl py-3 px-4 text-slate-200 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500/50 transition-all text-sm"
                                placeholder="Repita a nova senha"
                                required
                            />
                        </div>
                    </div>

                    <FeedbackMessage message={passwordMessage} />

                    <button
                        type="submit"
                        disabled={passwordLoading}
                        className="flex items-center gap-2 bg-amber-600 hover:bg-amber-500 text-white font-medium px-6 py-2.5 rounded-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {passwordLoading ? <Loader2 size={16} className="animate-spin" /> : <Shield size={16} />}
                        Alterar Senha
                    </button>
                </form>
            </motion.div>
        </div>
    );
}

function FeedbackMessage({ message }: { message: { type: string; text: string } }) {
    if (!message.text) return null;

    const isError = message.type === "error";
    return (
        <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            className={`flex items-center gap-2 text-sm p-3 rounded-lg border ${isError
                    ? "text-red-400 bg-red-500/10 border-red-500/20"
                    : "text-emerald-400 bg-emerald-500/10 border-emerald-500/20"
                }`}
        >
            {isError ? <AlertCircle size={16} className="shrink-0" /> : <CheckCircle2 size={16} className="shrink-0" />}
            {message.text}
        </motion.div>
    );
}
