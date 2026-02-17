import { useState, useEffect } from "react";
import { Outlet, useNavigate, useLocation } from "react-router";
import { motion } from "motion/react";
import { LayoutDashboard, LogOut, FileText, MessageSquare, Settings, Menu, X } from "lucide-react";
import { auth } from "../../lib/auth";

export default function AdminLayout() {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const navigate = useNavigate();
    const location = useLocation();

    useEffect(() => {
        const checkAuth = async () => {
            if (location.pathname === "/admin/login") {
                setIsLoading(false);
                return;
            }

            const user = await auth.getSession();
            if (!user) {
                navigate("/admin/login");
            } else {
                setIsAuthenticated(true);
            }
            setIsLoading(false);
        };

        checkAuth();
    }, [navigate, location.pathname]);

    if (location.pathname === "/admin/login") {
        return <Outlet />;
    }

    if (isLoading) {
        return (
            <div className="flex h-screen bg-slate-950 items-center justify-center">
                <div className="w-8 h-8 border-2 border-indigo-400/30 border-t-indigo-400 rounded-full animate-spin" />
            </div>
        );
    }

    if (!isAuthenticated) return null;

    const currentUser = auth.getCurrentUser();

    return (
        <div className="flex h-screen bg-slate-950 text-slate-100 font-sans selection:bg-indigo-500/30">

            {/* Mobile Header */}
            <div className="md:hidden fixed top-0 left-0 right-0 z-50 bg-slate-900/80 backdrop-blur-xl border-b border-slate-800 px-4 py-3 flex justify-between items-center">
                <h1 className="text-lg font-bold bg-gradient-to-r from-indigo-400 to-cyan-400 bg-clip-text text-transparent">
                    Derico Admin
                </h1>
                <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)} className="text-slate-400">
                    {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
                </button>
            </div>

            {/* Sidebar */}
            <aside className={`
        w-64 border-r border-slate-800 bg-slate-900/50 flex flex-col
        fixed md:relative inset-y-0 left-0 z-40
        transform transition-transform duration-300
        ${mobileMenuOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"}
      `}>
                <div className="p-6 border-b border-slate-800 hidden md:block">
                    <h1 className="text-xl font-bold bg-gradient-to-r from-indigo-400 to-cyan-400 bg-clip-text text-transparent">
                        Derico Admin
                    </h1>
                </div>

                {/* User Info */}
                {currentUser && (
                    <div className="p-4 border-b border-slate-800 mt-14 md:mt-0">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-indigo-500 to-cyan-500 p-[2px] shrink-0">
                                <div className="w-full h-full rounded-full bg-slate-950 flex items-center justify-center">
                                    <span className="text-sm font-bold text-white">
                                        {currentUser.name?.split(" ").map(n => n[0]).join("").toUpperCase().slice(0, 2)}
                                    </span>
                                </div>
                            </div>
                            <div className="min-w-0">
                                <p className="text-sm font-medium text-white truncate">{currentUser.name}</p>
                                <p className="text-xs text-slate-500 truncate">{currentUser.email}</p>
                            </div>
                        </div>
                    </div>
                )}

                <nav className="flex-1 p-4 space-y-2">
                    <NavItem to="/admin" icon={<LayoutDashboard size={20} />} label="Dashboard" onClick={() => setMobileMenuOpen(false)} />
                    <NavItem to="/admin/projects" icon={<FileText size={20} />} label="Projetos" onClick={() => setMobileMenuOpen(false)} />
                    <NavItem to="/admin/testimonials" icon={<MessageSquare size={20} />} label="Depoimentos" onClick={() => setMobileMenuOpen(false)} />
                    <NavItem to="/admin/settings" icon={<Settings size={20} />} label="Configurações" onClick={() => setMobileMenuOpen(false)} />
                </nav>

                <div className="p-4 border-t border-slate-800">
                    <button
                        onClick={async () => {
                            await auth.signOut();
                            navigate("/admin/login");
                        }}
                        className="flex items-center gap-3 px-4 py-2 text-slate-400 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-all w-full"
                    >
                        <LogOut size={20} />
                        <span>Sair</span>
                    </button>
                </div>
            </aside>

            {/* Mobile overlay */}
            {mobileMenuOpen && (
                <div
                    className="fixed inset-0 bg-black/50 z-30 md:hidden"
                    onClick={() => setMobileMenuOpen(false)}
                />
            )}

            {/* Main Content */}
            <main className="flex-1 overflow-auto relative pt-14 md:pt-0">
                <div className="p-6 md:p-8">
                    <Outlet />
                </div>
            </main>
        </div>
    );
}

function NavItem({ to, icon, label, onClick }: { to: string; icon: React.ReactNode; label: string; onClick?: () => void }) {
    const navigate = useNavigate();
    const location = useLocation();
    const isActive = location.pathname === to;

    return (
        <button
            onClick={() => {
                navigate(to);
                onClick?.();
            }}
            className={`flex items-center gap-3 px-4 py-3 rounded-lg w-full transition-all duration-200 ${isActive
                    ? "bg-indigo-500/10 text-indigo-400 border border-indigo-500/20"
                    : "text-slate-400 hover:bg-slate-800 hover:text-slate-200"
                }`}
        >
            {icon}
            <span className="font-medium">{label}</span>
        </button>
    );
}
