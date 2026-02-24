import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Plus, Pencil, Trash2, X, Loader2, Save, Search, Quote, Star, User } from "lucide-react";
import { toast } from "sonner";
import { TestimonialsService, Testimonial } from "../../../lib/services";

export default function AdminTestimonials() {
    const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingTestimonial, setEditingTestimonial] = useState<Testimonial | null>(null);

    // Form states
    const [formData, setFormData] = useState<Partial<Testimonial>>({
        name: "",
        role: "",
        text: "",
        photo_url: "",
        rating: 5,
        initials: ""
    });
    const [saving, setSaving] = useState(false);

    useEffect(() => {
        fetchTestimonials();
    }, []);

    const fetchTestimonials = async () => {
        try {
            const data = await TestimonialsService.getAll();
            setTestimonials(data as Testimonial[]);
        } catch (error) {
            toast.error("Erro ao carregar depoimentos");
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    const handleOpenModal = (testimonial?: Testimonial) => {
        if (testimonial) {
            setEditingTestimonial(testimonial);
            setFormData({
                name: testimonial.name,
                role: testimonial.role,
                text: testimonial.text,
                photo_url: testimonial.photo_url || "",
                rating: testimonial.rating,
                initials: testimonial.initials,
            });
        } else {
            setEditingTestimonial(null);
            setFormData({
                name: "",
                role: "",
                text: "",
                photo_url: "",
                rating: 5,
                initials: ""
            });
        }
        setIsModalOpen(true);
    };

    const getInitials = (name: string) => {
        return name
            .split(" ")
            .map(n => n[0])
            .join("")
            .toUpperCase()
            .slice(0, 2);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setSaving(true);

        try {
            const testimonialData = {
                ...formData,
                initials: getInitials(formData.name || ""),
                photo_url: formData.photo_url || null, // Ensure empty string becomes null
            };

            if (editingTestimonial) {
                await TestimonialsService.update(editingTestimonial.id, testimonialData);
                toast.success("Depoimento atualizado!");
            } else {
                await TestimonialsService.create(testimonialData as any);
                toast.success("Depoimento criado com sucesso!");
            }

            setIsModalOpen(false);
            fetchTestimonials();
        } catch (error) {
            toast.error("Erro ao salvar depoimento");
            console.error(error);
        } finally {
            setSaving(false);
        }
    };

    const handleDelete = async (id: string) => {
        if (!confirm("Tem certeza que deseja excluir este depoimento?")) return;

        try {
            await TestimonialsService.delete(id);
            toast.success("Depoimento excluído");
            setTestimonials(testimonials.filter(t => t.id !== id));
        } catch (error) {
            toast.error("Erro ao excluir depoimento");
        }
    };

    const filteredTestimonials = testimonials.filter(t =>
        t.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        t.role.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="space-y-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-white mb-2">Depoimentos</h1>
                    <p className="text-slate-400">Gerencie o feedback dos seus clientes.</p>
                </div>
                <button
                    onClick={() => handleOpenModal()}
                    className="flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg transition-colors font-medium self-start md:self-auto"
                >
                    <Plus size={18} /> Novo Depoimento
                </button>
            </div>

            {/* Search */}
            <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 w-5 h-5" />
                <input
                    type="text"
                    placeholder="Buscar por nome ou cargo..."
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
                    {filteredTestimonials.map((testimonial) => (
                        <motion.div
                            key={testimonial.id}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            layout
                            className="group bg-slate-900 border border-slate-800 rounded-xl p-6 hover:border-indigo-500/30 transition-all flex flex-col relative"
                        >
                            <div className="absolute top-4 right-4 flex gap-2">
                                <button
                                    onClick={() => handleOpenModal(testimonial)}
                                    className="p-2 bg-slate-800 text-slate-300 hover:text-white rounded-lg hover:bg-indigo-600 transition-colors"
                                >
                                    <Pencil size={16} />
                                </button>
                                <button
                                    onClick={() => handleDelete(testimonial.id)}
                                    className="p-2 bg-slate-800 text-slate-300 hover:text-white rounded-lg hover:bg-red-600 transition-colors"
                                >
                                    <Trash2 size={16} />
                                </button>
                            </div>

                            <div className="flex items-center gap-4 mb-4">
                                <div className="w-12 h-12 rounded-full bg-slate-800 flex items-center justify-center overflow-hidden shrink-0 border border-slate-700">
                                    {testimonial.photo_url ? (
                                        <img src={testimonial.photo_url} alt={testimonial.name} className="w-full h-full object-cover" />
                                    ) : (
                                        <span className="text-sm font-bold text-slate-400">{testimonial.initials}</span>
                                    )}
                                </div>
                                <div>
                                    <h3 className="font-bold text-white text-lg leading-tight">{testimonial.name}</h3>
                                    <p className="text-slate-500 text-sm">{testimonial.role}</p>
                                </div>
                            </div>

                            <div className="flex items-center gap-1 mb-4">
                                {[...Array(5)].map((_, i) => (
                                    <Star
                                        key={i}
                                        size={16}
                                        className={`${i < (testimonial.rating || 5) ? "fill-yellow-500 text-yellow-500" : "fill-slate-800 text-slate-800"}`}
                                    />
                                ))}
                            </div>

                            <div className="relative">
                                <Quote className="absolute -top-2 -left-2 w-6 h-6 text-slate-800 rotate-180" />
                                <p className="text-slate-400 text-sm leading-relaxed pl-6 relative z-10 italic">
                                    "{testimonial.text}"
                                </p>
                            </div>
                        </motion.div>
                    ))}

                    {filteredTestimonials.length === 0 && (
                        <div className="col-span-full py-12 text-center text-slate-500">
                            Nenhum depoimento encontrado.
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
                            className="relative w-full max-w-lg bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]"
                        >
                            <div className="flex items-center justify-between p-6 border-b border-slate-800 bg-slate-900 z-10">
                                <h2 className="text-xl font-bold text-white">
                                    {editingTestimonial ? "Editar Depoimento" : "Novo Depoimento"}
                                </h2>
                                <button
                                    onClick={() => setIsModalOpen(false)}
                                    className="text-slate-400 hover:text-white transition-colors"
                                >
                                    <X size={24} />
                                </button>
                            </div>

                            <div className="p-6 overflow-y-auto custom-scrollbar space-y-4">
                                <form id="testimonial-form" onSubmit={handleSubmit} className="space-y-4">
                                    <div className="space-y-2">
                                        <label className="text-sm font-medium text-slate-300">Nome do Cliente</label>
                                        <div className="relative">
                                            <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                                            <input
                                                required
                                                className="w-full pl-10 pr-4 py-2 bg-slate-950 border border-slate-800 rounded-lg text-white focus:outline-none focus:border-indigo-500"
                                                value={formData.name}
                                                onChange={e => setFormData({ ...formData, name: e.target.value })}
                                                placeholder="Ex: João da Silva"
                                            />
                                        </div>
                                    </div>

                                    <div className="space-y-2">
                                        <label className="text-sm font-medium text-slate-300">Cargo / Empresa</label>
                                        <input
                                            required
                                            className="w-full px-4 py-2 bg-slate-950 border border-slate-800 rounded-lg text-white focus:outline-none focus:border-indigo-500"
                                            value={formData.role}
                                            onChange={e => setFormData({ ...formData, role: e.target.value })}
                                            placeholder="Ex: CEO na TechCorp"
                                        />
                                    </div>

                                    <div className="space-y-2">
                                        <label className="text-sm font-medium text-slate-300">Depoimento</label>
                                        <textarea
                                            required
                                            rows={4}
                                            className="w-full px-4 py-2 bg-slate-950 border border-slate-800 rounded-lg text-white focus:outline-none focus:border-indigo-500 resize-none"
                                            value={formData.text}
                                            onChange={e => setFormData({ ...formData, text: e.target.value })}
                                            placeholder="O que o cliente disse..."
                                        />
                                    </div>

                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="space-y-2">
                                            <label className="text-sm font-medium text-slate-300">Foto (URL)</label>
                                            <input
                                                className="w-full px-4 py-2 bg-slate-950 border border-slate-800 rounded-lg text-white focus:outline-none focus:border-indigo-500"
                                                value={formData.photo_url || ""}
                                                onChange={e => setFormData({ ...formData, photo_url: e.target.value })}
                                                placeholder="https://..."
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-sm font-medium text-slate-300">Avaliação (1-5)</label>
                                            <div className="flex items-center gap-2 h-[42px]">
                                                {[1, 2, 3, 4, 5].map((star) => (
                                                    <button
                                                        key={star}
                                                        type="button"
                                                        onClick={() => setFormData({ ...formData, rating: star })}
                                                        className="focus:outline-none hover:scale-110 transition-transform"
                                                    >
                                                        <Star
                                                            size={24}
                                                            className={`${(formData.rating || 0) >= star ? "fill-yellow-500 text-yellow-500" : "fill-slate-800 text-slate-700"}`}
                                                        />
                                                    </button>
                                                ))}
                                            </div>
                                        </div>
                                    </div>

                                    {formData.photo_url && (
                                        <div className="flex justify-center pt-2">
                                            <img src={formData.photo_url} alt="Preview" className="w-16 h-16 rounded-full object-cover border-2 border-slate-700" />
                                        </div>
                                    )}

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
                                    form="testimonial-form"
                                    disabled={saving}
                                    className="flex items-center gap-2 px-6 py-2 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-lg transition-colors font-medium"
                                >
                                    {saving ? <Loader2 size={18} className="animate-spin" /> : <Save size={18} />}
                                    Salvar
                                </button>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
}
