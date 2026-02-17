import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Lock, Mail, ArrowRight, AlertCircle, Terminal, ArrowLeft, KeyRound, CheckCircle2 } from "lucide-react";
import { useNavigate } from "react-router";
import { auth } from "../../../lib/auth";

type ViewMode = "login" | "forgot" | "reset";

export default function AdminLogin() {
    const [mode, setMode] = useState<ViewMode>("login");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");
    const navigate = useNavigate();

    // Login fields
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    // Forgot password fields
    const [forgotEmail, setForgotEmail] = useState("");
    const [resetToken, setResetToken] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [newPasswordConfirm, setNewPasswordConfirm] = useState("");

    const clearFields = () => {
        setError("");
        setSuccess("");
        setEmail("");
        setPassword("");
        setForgotEmail("");
        setResetToken("");
        setNewPassword("");
        setNewPasswordConfirm("");
    };

    const switchMode = (newMode: ViewMode) => {
        clearFields();
        setMode(newMode);
    };

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError("");

        const result = await auth.signIn(email, password);

        if (result.success) {
            navigate("/admin");
        } else {
            setError(result.error || "Erro ao fazer login.");
        }

        setLoading(false);
    };

    const handleForgotPassword = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError("");

        const result = await auth.resetPassword(forgotEmail);

        if (result.success) {
            setSuccess("Token de recuperação gerado. Verifique o console do servidor.");
            switchMode("reset");
        } else {
            setError(result.error || "Erro ao processar.");
        }

        setLoading(false);
    };

    const handleResetPassword = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError("");

        if (newPassword !== newPasswordConfirm) {
            setError("As senhas não conferem.");
            setLoading(false);
            return;
        }

        if (newPassword.length < 6) {
            setError("A senha deve ter no mínimo 6 caracteres.");
            setLoading(false);
            return;
        }

        const result = await auth.confirmResetPassword(forgotEmail, resetToken, newPassword);

        if (result.success) {
            setSuccess("Senha redefinida com sucesso!");
            setTimeout(() => switchMode("login"), 2000);
        } else {
            setError(result.error || "Erro ao redefinir senha.");
        }

        setLoading(false);
    };

    return (
        <div className="min-h-screen bg-slate-950 flex items-center justify-center p-4 relative overflow-hidden">
            {/* Background Effects */}
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-indigo-900/20 via-slate-950 to-slate-950" />
            <div className="absolute inset-0 bg-[linear-gradient(rgba(18,24,27,0)_0%,rgba(99,102,241,0.03)_50%,rgba(18,24,27,0)_100%)] pointer-events-none" />

            <div className="w-full max-w-md relative z-10">
                <AnimatePresence mode="wait">
                    {/* ============= LOGIN ============= */}
                    {mode === "login" && (
                        <motion.div
                            key="login"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -20 }}
                            transition={{ duration: 0.3 }}
                        >
                            <div className="bg-slate-900/50 backdrop-blur-xl border border-slate-800 rounded-2xl p-8 shadow-2xl shadow-indigo-500/10">
                                <div className="text-center mb-8">
                                    <div className="w-12 h-12 bg-indigo-500/10 rounded-xl flex items-center justify-center mx-auto mb-4 border border-indigo-500/20">
                                        <Terminal className="text-indigo-400 w-6 h-6" />
                                    </div>
                                    <h1 className="text-2xl font-bold text-white mb-2">Acesso Admin</h1>
                                    <p className="text-slate-400 text-sm">Gerencie seu portfólio de alta performance</p>
                                </div>

                                <form onSubmit={handleLogin} className="space-y-4">
                                    <InputField icon={<Mail />} type="email" value={email} onChange={setEmail} placeholder="seu@email.com" label="Email" />
                                    <InputField icon={<Lock />} type="password" value={password} onChange={setPassword} placeholder="••••••••" label="Senha" />

                                    <ErrorMessage message={error} />
                                    <SuccessMessage message={success} />

                                    <SubmitButton loading={loading} label="Entrar no Console" />
                                </form>

                                <div className="mt-6 text-center">
                                    <button
                                        onClick={() => switchMode("forgot")}
                                        className="text-slate-400 hover:text-indigo-400 transition-colors text-sm"
                                    >
                                        Esqueci minha senha
                                    </button>
                                </div>
                            </div>
                        </motion.div>
                    )}

                    {/* ============= FORGOT PASSWORD ============= */}
                    {mode === "forgot" && (
                        <motion.div
                            key="forgot"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -20 }}
                            transition={{ duration: 0.3 }}
                        >
                            <div className="bg-slate-900/50 backdrop-blur-xl border border-slate-800 rounded-2xl p-8 shadow-2xl shadow-indigo-500/10">
                                <BackButton onClick={() => switchMode("login")} />
                                <div className="text-center mb-6">
                                    <div className="w-12 h-12 bg-amber-500/10 rounded-xl flex items-center justify-center mx-auto mb-4 border border-amber-500/20">
                                        <KeyRound className="text-amber-400 w-6 h-6" />
                                    </div>
                                    <h1 className="text-2xl font-bold text-white mb-2">Recuperar Senha</h1>
                                    <p className="text-slate-400 text-sm">Informe seu email para gerar um token de recuperação</p>
                                </div>

                                <form onSubmit={handleForgotPassword} className="space-y-4">
                                    <InputField icon={<Mail />} type="email" value={forgotEmail} onChange={setForgotEmail} placeholder="seu@email.com" label="Email Cadastrado" />

                                    <ErrorMessage message={error} />
                                    <SuccessMessage message={success} />

                                    <SubmitButton loading={loading} label="Gerar Token" color="amber" />
                                </form>
                            </div>
                        </motion.div>
                    )}

                    {/* ============= RESET PASSWORD ============= */}
                    {mode === "reset" && (
                        <motion.div
                            key="reset"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -20 }}
                            transition={{ duration: 0.3 }}
                        >
                            <div className="bg-slate-900/50 backdrop-blur-xl border border-slate-800 rounded-2xl p-8 shadow-2xl shadow-indigo-500/10">
                                <BackButton onClick={() => switchMode("forgot")} />
                                <div className="text-center mb-6">
                                    <div className="w-12 h-12 bg-amber-500/10 rounded-xl flex items-center justify-center mx-auto mb-4 border border-amber-500/20">
                                        <Lock className="text-amber-400 w-6 h-6" />
                                    </div>
                                    <h1 className="text-2xl font-bold text-white mb-2">Nova Senha</h1>
                                    <p className="text-slate-400 text-sm">Cole o token gerado e defina sua nova senha</p>
                                </div>

                                <form onSubmit={handleResetPassword} className="space-y-4">
                                    <InputField icon={<KeyRound />} type="text" value={resetToken} onChange={setResetToken} placeholder="Cole o token aqui" label="Token de Recuperação" />
                                    <InputField icon={<Lock />} type="password" value={newPassword} onChange={setNewPassword} placeholder="Nova senha" label="Nova Senha" />
                                    <InputField icon={<Lock />} type="password" value={newPasswordConfirm} onChange={setNewPasswordConfirm} placeholder="Confirme a nova senha" label="Confirmar Nova Senha" />

                                    <ErrorMessage message={error} />
                                    <SuccessMessage message={success} />

                                    <SubmitButton loading={loading} label="Redefinir Senha" color="amber" />
                                </form>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>

                <p className="text-center text-slate-600 text-xs mt-8">
                    &copy; 2026 Derico Dev. Access Restricted.
                </p>
            </div>
        </div>
    );
}

// ========= Reusable Components =========

function InputField({ icon, type, value, onChange, placeholder, label }: {
    icon: React.ReactNode; type: string; value: string;
    onChange: (v: string) => void; placeholder: string; label: string;
}) {
    return (
        <div className="space-y-2">
            <label className="text-xs font-medium text-slate-400 uppercase tracking-wider">{label}</label>
            <div className="relative group">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500 group-focus-within:text-indigo-400 transition-colors [&>svg]:w-5 [&>svg]:h-5">
                    {icon}
                </span>
                <input
                    type={type}
                    value={value}
                    onChange={(e) => onChange(e.target.value)}
                    className="w-full bg-slate-950/50 border border-slate-700 rounded-xl py-3 pl-10 pr-4 text-slate-200 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500/50 transition-all placeholder:text-slate-600 text-sm"
                    placeholder={placeholder}
                    required
                />
            </div>
        </div>
    );
}

function ErrorMessage({ message }: { message: string }) {
    if (!message) return null;
    return (
        <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            className="flex items-center gap-2 text-red-400 text-sm bg-red-500/10 p-3 rounded-lg border border-red-500/20"
        >
            <AlertCircle size={16} className="shrink-0" />
            {message}
        </motion.div>
    );
}

function SuccessMessage({ message }: { message: string }) {
    if (!message) return null;
    return (
        <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            className="flex items-center gap-2 text-emerald-400 text-sm bg-emerald-500/10 p-3 rounded-lg border border-emerald-500/20"
        >
            <CheckCircle2 size={16} className="shrink-0" />
            {message}
        </motion.div>
    );
}

function SubmitButton({ loading, label, color = "indigo" }: { loading: boolean; label: string; color?: string }) {
    const colors: Record<string, string> = {
        indigo: "bg-indigo-600 hover:bg-indigo-500 shadow-indigo-500/50 hover:shadow-indigo-500/70",
        amber: "bg-amber-600 hover:bg-amber-500 shadow-amber-500/50 hover:shadow-amber-500/70",
    };

    return (
        <button
            type="submit"
            disabled={loading}
            className={`w-full ${colors[color]} text-white font-bold py-3.5 rounded-xl transition-all shadow-[0_0_20px_-5px] hover:shadow-[0_0_25px_-5px] disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 mt-4`}
        >
            {loading ? (
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            ) : (
                <>
                    {label} <ArrowRight size={18} />
                </>
            )}
        </button>
    );
}

function BackButton({ onClick }: { onClick: () => void }) {
    return (
        <button
            onClick={onClick}
            className="flex items-center gap-1 text-slate-400 hover:text-white transition-colors mb-4 text-sm"
        >
            <ArrowLeft size={16} />
            Voltar
        </button>
    );
}
