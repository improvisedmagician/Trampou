"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeftIcon } from "@heroicons/react/24/outline";

export default function PerfilEmpresa() {
  const router = useRouter();
  const [perfil, setPerfil] = useState({
    nome_fantasia: "",
    endereco: "",
    descricao: "",
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPerfil = async () => {
      const token = localStorage.getItem("token");
      if (!token) {
        router.push("/auth");
        return;
      }
      try {
        const res = await fetch(((process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000')) + "/empresas/me", {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (res.ok) {
          const data = await res.json();
          setPerfil({
            nome_fantasia: data.nome_fantasia || "",
            endereco: data.endereco || "",
            descricao: data.descricao || "",
          });
        }
      } catch (err) {
        console.error("Erro ao carregar perfil:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchPerfil();
  }, [router]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem("token");
    try {
      const res = await fetch(((process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000')) + "/empresas/me", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(perfil),
      });
      if (res.ok) {
        router.push("/empresa/dashboard");
      }
    } catch (err) {
      console.error("Erro ao salvar:", err);
    }
  };

  if (loading) return <div className="p-8 text-center text-neutral-500">A carregar...</div>;

  return (
    <div className="min-h-screen bg-[#FAFAFA] pb-20">
      <header className="bg-white border-b border-neutral-100 px-4 py-4 flex items-center sticky top-0 z-10 shadow-sm">
        <button onClick={() => router.back()} className="mr-4 text-neutral-900 hover:bg-neutral-100 p-2 rounded-full transition-colors">
          <ArrowLeftIcon className="w-6 h-6" />
        </button>
        <h1 className="text-xl font-bold text-[#000000] flex-1 text-center pr-10">Editar Perfil</h1>
      </header>
      
      <main className="p-6">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="bg-white p-5 rounded-2xl shadow-sm border border-neutral-100">
            <h2 className="text-lg font-bold text-[#000000] mb-4">Informações Públicas</h2>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-1">Nome Fantasia</label>
                <input
                  type="text"
                  value={perfil.nome_fantasia}
                  onChange={(e) => setPerfil({...perfil, nome_fantasia: e.target.value})}
                  placeholder="Nome comercial da empresa"
                  className="w-full p-3 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-[#f27918] focus:border-[#f27918] outline-none transition-all"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-1">Endereço</label>
                <input
                  type="text"
                  value={perfil.endereco}
                  onChange={(e) => setPerfil({...perfil, endereco: e.target.value})}
                  placeholder="Ex: Av. Principal, 123 - Centro"
                  className="w-full p-3 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-[#f27918] focus:border-[#f27918] outline-none transition-all"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-1">Descrição do Negócio</label>
                <textarea
                  value={perfil.descricao}
                  onChange={(e) => setPerfil({...perfil, descricao: e.target.value})}
                  placeholder="Fale um pouco sobre a empresa e a cultura de trabalho..."
                  rows="4"
                  className="w-full p-3 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-[#f27918] focus:border-[#f27918] outline-none transition-all resize-none"
                />
              </div>
            </div>
          </div>

          <button
            type="submit"
            className="w-full py-4 bg-[#000000] text-white rounded-xl font-bold text-lg hover:bg-[#1f2937] transition-colors shadow-md active:scale-[0.98]"
          >
            Salvar Alterações
          </button>
        </form>
      </main>
    </div>
  );
}
