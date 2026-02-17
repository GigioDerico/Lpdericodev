import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Plus, Pencil, Trash2, X, Loader2, Image as ImageIcon, Link as LinkIcon, Save, Search } from "lucide-react";
import { toast } from "sonner";
import { ProjectsService, Project } from "../../../lib/services";

export default function AdminProjects() {
    const [projects, setProjects] = useState<Project[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingProject, setEditingProject] = useState<Project | null>(null);

    // Form states
    const [formData, setFormData] = useState<Partial<Project>>({
        title: "",
        category: "",
        description: "",
        image_url: "",
        tags: [],
        link: "",
        highlighted: false
    });
    const [tagsInput, setTagsInput] = useState("");
    const [saving, setSaving] = useState(false);

    useEffect(() => {
        fetchProjects();
    }, []);

    const fetchProjects = async () => {
        try {
            const data = await ProjectsService.getAll();
            setProjects(data as Project[]);
        } catch (error) {
            toast.error("Erro ao carregar projetos");
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    const handleOpenModal = (project?: Project) => {
        if (project) {
            setEditingProject(project);
            setFormData({
                title: project.title,
                category: project.category,
                description: project.description,
                image_url: project.image_url,
                tags: project.tags,
                link: project.link || "",
                highlighted: project.highlighted
            });
            setTagsInput(project.tags?.join(", ") || "");
        } else {
            setEditingProject(null);
            setFormData({
                title: "",
                category: "",
                description: "",
                image_url: "",
                tags: [],
                link: "",
                highlighted: false
            });
            setTagsInput("");
        }
        setIsModalOpen(true);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setSaving(true);

        try {
            const projectData = {
                ...formData,
                tags: tagsInput.split(",").map(t => t.trim()).filter(Boolean),
                link: formData.link || null, // Ensure empty string becomes null
            };

            if (editingProject) {
                await ProjectsService.update(editingProject.id, projectData);
                toast.success("Projeto atualizado com sucesso!");
            } else {
                await ProjectsService.create(projectData as any);
                toast.success("Projeto criado com sucesso!");
            }

            setIsModalOpen(false);
            fetchProjects();
        } catch (error) {
            toast.error("Erro ao salvar projeto");
            console.error(error);
        } finally {
            setSaving(false);
        }
    };

    const handleDelete = async (id: string) => {
        if (!confirm("Tem certeza que deseja excluir este projeto?")) return;

        try {
            await ProjectsService.delete(id);
            toast.success("Projeto excluído");
            setProjects(projects.filter(p => p.id !== id));
        } catch (error) {
            toast.error("Erro ao excluir projeto");
        }
    };

    const filteredProjects = projects.filter(p =>
        p.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.category.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="space-y-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-white mb-2">Projetos</h1>
                    <p className="text-slate-400">Gerencie seu portfólio de projetos.</p>
                </div>
                <button
                    onClick={() => handleOpenModal()}
                    className="flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg transition-colors font-medium self-start md:self-auto"
                >
                    <Plus size={18} /> Novo Projeto
                </button>
            </div>

            {/* Search */}
            <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 w-5 h-5" />
                <input
                    type="text"
                    placeholder="Buscar projetos..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 bg-slate-900 border border-slate-800 rounded-xl text-slate-200 focus:outline-none focus:border-indigo-500/50 focus:ring-1 focus:ring-indigo-500/50 placeholder:text-slate-600"
                />
            </div>

            {/* List */}
            {loading ? (
                <div className="flex justify-center py-12">
                    <Loader2 className="w-8 h-8 text-indigo-400 animate-spin" />
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredProjects.map((project) => (
                        <motion.div
                            key={project.id}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            layout
                            className="group bg-slate-900 border border-slate-800 rounded-xl overflow-hidden hover:border-indigo-500/30 transition-all flex flex-col"
                        >
                            <div className="h-48 overflow-hidden relative bg-slate-950">
                                {project.image_url ? (
                                    <img
                                        src={project.image_url}
                                        alt={project.title}
                                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                    />
                                ) : (
                                    <div className="w-full h-full flex items-center justify-center text-slate-700">
                                        <ImageIcon size={40} />
                                    </div>
                                )}
                                <div className="absolute top-2 right-2 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                    <button
                                        onClick={() => handleOpenModal(project)}
                                        className="p-2 bg-slate-900/80 backdrop-blur text-white rounded-lg hover:bg-indigo-600 transition-colors"
                                    >
                                        <Pencil size={16} />
                                    </button>
                                    <button
                                        onClick={() => handleDelete(project.id)}
                                        className="p-2 bg-slate-900/80 backdrop-blur text-white rounded-lg hover:bg-red-600 transition-colors"
                                    >
                                        <Trash2 size={16} />
                                    </button>
                                </div>
                                {project.highlighted && (
                                    <span className="absolute top-2 left-2 px-2 py-1 bg-yellow-500/20 text-yellow-500 text-xs font-bold uppercase rounded border border-yellow-500/30 backdrop-blur-sm">
                                        Destaque
                                    </span>
                                )}
                            </div>

                            <div className="p-5 flex-1 flex flex-col">
                                <div className="mb-2">
                                    <span className="text-xs font-mono text-indigo-400 uppercase tracking-wider">
                                        {project.category}
                                    </span>
                                </div>
                                <h3 className="text-lg font-bold text-white mb-2">{project.title}</h3>
                                <p className="text-slate-400 text-sm line-clamp-2 mb-4 flex-1">
                                    {project.description}
                                </p>

                                <div className="flex flex-wrap gap-2 mt-auto">
                                    {project.tags?.slice(0, 3).map((tag, i) => (
                                        <span key={i} className="text-xs px-2 py-1 bg-slate-800 rounded text-slate-300">
                                            {tag}
                                        </span>
                                    ))}
                                    {(project.tags?.length || 0) > 3 && (
                                        <span className="text-xs px-2 py-1 bg-slate-800 rounded text-slate-500">
                                            +{project.tags!.length - 3}
                                        </span>
                                    )}
                                </div>
                            </div>
                        </motion.div>
                    ))}

                    {filteredProjects.length === 0 && (
                        <div className="col-span-full py-12 text-center text-slate-500">
                            Nenhum projeto encontrado.
                        </div>
                    )}
                </div>
            )}

            {/* Modal */}
            <AnimatePresence>
                {isModalOpen && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="absolute inset-0 bg-black/80 backdrop-blur-sm"
                            onClick={() => setIsModalOpen(false)}
                        />
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.95, y: 20 }}
                            className="relative w-full max-w-2xl bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]"
                        >
                            <div className="flex items-center justify-between p-6 border-b border-slate-800 bg-slate-900 z-10">
                                <h2 className="text-xl font-bold text-white">
                                    {editingProject ? "Editar Projeto" : "Novo Projeto"}
                                </h2>
                                <button
                                    onClick={() => setIsModalOpen(false)}
                                    className="text-slate-400 hover:text-white transition-colors"
                                >
                                    <X size={24} />
                                </button>
                            </div>

                            <div className="p-6 overflow-y-auto custom-scrollbar space-y-4">
                                <form id="project-form" onSubmit={handleSubmit} className="space-y-4">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div className="space-y-2">
                                            <label className="text-sm font-medium text-slate-300">Título</label>
                                            <input
                                                required
                                                className="w-full px-4 py-2 bg-slate-950 border border-slate-800 rounded-lg text-white focus:outline-none focus:border-indigo-500"
                                                value={formData.title}
                                                onChange={e => setFormData({ ...formData, title: e.target.value })}
                                                placeholder="Ex: SaaS B2B..."
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-sm font-medium text-slate-300">Categoria</label>
                                            <input
                                                required
                                                className="w-full px-4 py-2 bg-slate-950 border border-slate-800 rounded-lg text-white focus:outline-none focus:border-indigo-500"
                                                value={formData.category}
                                                onChange={e => setFormData({ ...formData, category: e.target.value })}
                                                placeholder="Ex: Web App, Mobile..."
                                            />
                                        </div>
                                    </div>

                                    <div className="space-y-2">
                                        <label className="text-sm font-medium text-slate-300">Descrição</label>
                                        <textarea
                                            required
                                            rows={3}
                                            className="w-full px-4 py-2 bg-slate-950 border border-slate-800 rounded-lg text-white focus:outline-none focus:border-indigo-500 resize-none"
                                            value={formData.description}
                                            onChange={e => setFormData({ ...formData, description: e.target.value })}
                                            placeholder="Breve descrição do projeto..."
                                        />
                                    </div>

                                    <div className="space-y-2">
                                        <label className="text-sm font-medium text-slate-300">URL da Imagem</label>
                                        <div className="flex gap-2">
                                            <input
                                                className="w-full px-4 py-2 bg-slate-950 border border-slate-800 rounded-lg text-white focus:outline-none focus:border-indigo-500"
                                                value={formData.image_url}
                                                onChange={e => setFormData({ ...formData, image_url: e.target.value })}
                                                placeholder="https://..."
                                            />
                                            <div className="w-10 h-10 border border-slate-800 rounded bg-slate-950 flex items-center justify-center shrink-0 overflow-hidden">
                                                {formData.image_url ? (
                                                    <img src={formData.image_url} className="w-full h-full object-cover" />
                                                ) : (
                                                    <ImageIcon size={16} className="text-slate-600" />
                                                )}
                                            </div>
                                        </div>
                                    </div>

                                    <div className="space-y-2">
                                        <label className="text-sm font-medium text-slate-300">Tags (separadas por vírgula)</label>
                                        <input
                                            className="w-full px-4 py-2 bg-slate-950 border border-slate-800 rounded-lg text-white focus:outline-none focus:border-indigo-500"
                                            value={tagsInput}
                                            onChange={e => setTagsInput(e.target.value)}
                                            placeholder="React, Next.js, TypeScript..."
                                        />
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div className="space-y-2">
                                            <label className="text-sm font-medium text-slate-300">Link do Projeto (Opcional)</label>
                                            <div className="relative">
                                                <LinkIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                                                <input
                                                    className="w-full pl-10 pr-4 py-2 bg-slate-950 border border-slate-800 rounded-lg text-white focus:outline-none focus:border-indigo-500"
                                                    value={formData.link || ""}
                                                    onChange={e => setFormData({ ...formData, link: e.target.value })}
                                                    placeholder="https://..."
                                                />
                                            </div>
                                        </div>

                                        <div className="flex items-center gap-3 pt-8">
                                            <input
                                                type="checkbox"
                                                id="highlighted"
                                                checked={formData.highlighted}
                                                onChange={e => setFormData({ ...formData, highlighted: e.target.checked })}
                                                className="w-5 h-5 rounded border-slate-700 bg-slate-800 text-indigo-600 focus:ring-indigo-500 focus:ring-offset-slate-900"
                                            />
                                            <label htmlFor="highlighted" className="text-sm font-medium text-slate-300 cursor-pointer">
                                                Destacar na Home
                                            </label>
                                        </div>
                                    </div>
                                </form>
                            </div>

                            <div className="p-6 border-t border-slate-800 bg-slate-900 flex justify-end gap-3 z-10">
                                <button
                                    type="button"
                                    onClick={() => setIsModalOpen(false)}
                                    className="px-4 py-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-colors"
                                >
                                    Cancelar
                                </button>
                                <button
                                    type="submit"
                                    form="project-form"
                                    disabled={saving}
                                    className="flex items-center gap-2 px-6 py-2 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-lg transition-colors font-medium"
                                >
                                    {saving ? <Loader2 size={18} className="animate-spin" /> : <Save size={18} />}
                                    Salvar Projeto
                                </button>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
}
