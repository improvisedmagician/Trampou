"use client";
import { useState, useEffect } from "react";
import { ArrowLeftIcon, UserIcon, BriefcaseIcon, AcademicCapIcon, ClipboardDocumentListIcon, CalendarDaysIcon, XCircleIcon, ArrowLeftOnRectangleIcon } from "@heroicons/react/24/outline";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function CandidatoPerfil() {
  const router = useRouter();
  const [perfil, setPerfil] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      router.push("/auth");
      return;
    }

    fetch('https://trampou-api.onrender.com' + "/candidatos/me", {
      headers: {
        "Authorization": `Bearer ${token}`
      }
    })
      .then(res => {
        if (!res.ok) throw new Error("Não autorizado");
        return res.json();
      })
      .then(data => {
        setPerfil(data);
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        router.push("/auth");
      });
  }, [router]);

  const [isEditing, setIsEditing] = useState(false);

  const handleFotoChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append("foto", file);

    const token = localStorage.getItem("token");
    try {
      const res = await fetch('https://trampou-api.onrender.com/candidatos/me/foto', {
        method: "POST",
        headers: { "Authorization": `Bearer ${token}` },
        body: formData
      });
      if (res.ok) {
        const data = await res.json();
        setPerfil(prev => ({...prev, foto_perfil: data.foto_perfil}));
        alert("Foto atualizada com sucesso!");
      } else {
        const error = await res.json();
        alert("Erro: " + error.detail);
      }
    } catch (err) {
      console.error(err);
      alert("Erro ao enviar a foto.");
    }
  };

  if (loading) {
    return <div className="min-h-screen bg-[#ffffff] flex items-center justify-center font-sans">A carregar perfil...</div>;
  }

  return (
    <div className="bg-red-50 text-neutral-900 font-sans min-h-screen flex flex-col relative pb-28">
      {/* Header Fixo */}
      <header className="flex items-center justify-between px-5 py-4 bg-white border-b border-neutral-100 sticky top-0 z-10">
        <Link href="/" className="p-2 -ml-2 text-[#f27918] hover:bg-neutral-100 rounded-full transition-colors">
          <ArrowLeftIcon className="w-6 h-6" />
        </Link>
        <h1 className="text-lg font-bold text-neutral-900">{isEditing ? "Editar Perfil" : "Meu Perfil Digital"}</h1>
        <div className="w-8 h-8 rounded-full overflow-hidden border border-neutral-200">
          <img alt="Mini Avatar" className="w-full h-full object-cover" src={perfil?.foto_perfil || `https://ui-avatars.com/api/?name=${perfil?.nome}&background=1f2937&color=fff`} />
        </div>
      </header>

      <main className="flex-1 w-full max-w-md md:max-w-3xl lg:max-w-5xl mx-auto flex flex-col">
        {!isEditing ? (
          // Visualização do Perfil (Figura 11 Tela 3)
          <div className="flex flex-col md:flex-row md:items-start md:gap-8 animate-fadeIn px-5">
            
            {/* Avatar Central Arredondado */}
            <div className="flex flex-col items-center mt-10 mb-8 md:mb-0 md:w-1/3 relative bg-white p-6 rounded-2xl shadow-sm border border-neutral-100">
              <label className="w-24 h-24 rounded-2xl overflow-hidden border-2 border-[#f27918] shadow-sm mb-4 cursor-pointer relative group block">
                <img alt="Avatar" className="w-full h-full object-cover" src={perfil?.foto_perfil || `https://ui-avatars.com/api/?name=${perfil?.nome}&background=1f2937&color=fff&size=256`} />
                <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                  <span className="text-white text-xs font-bold">Alterar</span>
                </div>
                <input type="file" className="hidden" accept="image/*" onChange={handleFotoChange} />
              </label>
              <h2 className="text-xl font-bold text-neutral-900">{perfil?.nome}</h2>
              <p className="text-neutral-500 text-sm mt-1 text-center">{perfil?.resumo_profissional ? perfil.resumo_profissional.substring(0, 80) + "..." : "Candidato na Trampou"}</p>
            </div>

            {/* Cartões de Navegação */}
            <div className="space-y-4 md:w-2/3 md:mt-10">
              <div onClick={() => setIsEditing(true)} className="bg-white border border-neutral-200 rounded-xl p-4 flex items-center justify-between cursor-pointer hover:border-[#f27918] transition-colors shadow-sm">
                <div className="flex items-center gap-4">
                  <UserIcon className="w-6 h-6 text-[#785b16]" />
                  <div>
                    <h3 className="font-bold text-neutral-900 text-base">Dados Pessoais</h3>
                    <p className="text-xs text-neutral-500 mt-0.5">Informações de contato e endereço</p>
                  </div>
                </div>
                <div className="text-neutral-400 font-bold text-xl">&gt;</div>
              </div>

              <div onClick={() => setIsEditing(true)} className="bg-white border border-neutral-200 rounded-xl p-4 flex items-center justify-between cursor-pointer hover:border-[#f27918] transition-colors shadow-sm">
                <div className="flex items-center gap-4">
                  <BriefcaseIcon className="w-6 h-6 text-[#785b16]" />
                  <div>
                    <h3 className="font-bold text-neutral-900 text-base">Experiência</h3>
                    <p className="text-xs text-neutral-500 mt-0.5">Histórico profissional e cargos</p>
                  </div>
                </div>
                <div className="text-neutral-400 font-bold text-xl">&gt;</div>
              </div>

              <div onClick={() => setIsEditing(true)} className="bg-white border border-neutral-200 rounded-xl p-4 flex items-center justify-between cursor-pointer hover:border-[#f27918] transition-colors shadow-sm">
                <div className="flex items-center gap-4">
                  <AcademicCapIcon className="w-6 h-6 text-[#785b16]" />
                  <div>
                    <h3 className="font-bold text-neutral-900 text-base">Educação</h3>
                    <p className="text-xs text-neutral-500 mt-0.5">Formação acadêmica e cursos</p>
                  </div>
                </div>
                <div className="text-neutral-400 font-bold text-xl">&gt;</div>
              </div>

              {/* Botão Sair */}
              <div className="pt-4">
                <button 
                  onClick={() => {
                    localStorage.removeItem("token");
                    localStorage.removeItem("role");
                    router.push("/auth");
                  }} 
                  className="w-full bg-red-50 text-red-600 font-bold py-4 rounded-xl border border-red-100 hover:bg-red-100 transition-colors flex items-center justify-center gap-2 shadow-sm"
                >
                  <ArrowLeftOnRectangleIcon className="w-5 h-5" />
                  Sair da Conta
                </button>
              </div>
            </div>
          </div>
        ) : (
          // Modo de Edição
          <div className="px-5 py-8 animate-fadeIn max-w-md mx-auto w-full">
            <form onSubmit={(e) => {
              e.preventDefault();
              const token = localStorage.getItem("token");
              fetch('https://trampou-api.onrender.com' + "/candidatos/me", {
                method: "PUT",
                headers: { "Content-Type": "application/json", "Authorization": `Bearer ${token}` },
                body: JSON.stringify({
                  nome: perfil.nome,
                  contato: perfil.contato,
                  resumo_profissional: perfil.resumo_profissional,
                  escolaridade: perfil.escolaridade,
                  habilidades: perfil.habilidades
                })
              }).then(res => res.json())
                .then(data => {
                  alert("Perfil salvo com sucesso!");
                  setIsEditing(false);
                })
                .catch(console.error);
            }} className="space-y-4">
              
              <div className="bg-white border border-neutral-200 rounded-xl p-5 shadow-sm">
                <h4 className="font-bold text-neutral-900 mb-3 flex items-center gap-2">
                  <UserIcon className="w-5 h-5 text-[#f27918]" /> Dados Pessoais
                </h4>
                <div className="space-y-3">
                  <div>
                    <label className="block text-xs text-neutral-500 mb-1 font-medium">Nome Completo</label>
                    <input type="text" className="w-full border border-neutral-200 rounded-lg p-3 text-sm outline-none focus:ring-1 focus:ring-[#f27918] transition-shadow" value={perfil.nome || ""} onChange={e => setPerfil({...perfil, nome: e.target.value})} />
                  </div>
                  <div>
                    <label className="block text-xs text-neutral-500 mb-1 font-medium">Contato (Telefone/WhatsApp)</label>
                    <input type="text" className="w-full border border-neutral-200 rounded-lg p-3 text-sm outline-none focus:ring-1 focus:ring-[#f27918] transition-shadow" value={perfil.contato || ""} onChange={e => setPerfil({...perfil, contato: e.target.value})} />
                  </div>
                </div>
              </div>

              <div className="bg-white border border-neutral-200 rounded-xl p-5 shadow-sm">
                <h4 className="font-bold text-neutral-900 mb-3 flex items-center gap-2">
                  <BriefcaseIcon className="w-5 h-5 text-[#f27918]" /> Experiência & Habilidades
                </h4>
                <div className="space-y-3">
                  <div>
                    <label className="block text-xs text-neutral-500 mb-1 font-medium">Resumo Profissional / Experiência</label>
                    <textarea rows="3" className="w-full border border-neutral-200 rounded-lg p-3 text-sm outline-none focus:ring-1 focus:ring-[#f27918] transition-shadow" value={perfil.resumo_profissional || ""} onChange={e => setPerfil({...perfil, resumo_profissional: e.target.value})} />
                  </div>
                  <div>
                    <label className="block text-xs text-neutral-500 mb-1 font-medium">Principais Habilidades (Separadas por vírgula)</label>
                    <input type="text" placeholder="Ex: React, Vendas, Excel" className="w-full border border-neutral-200 rounded-lg p-3 text-sm outline-none focus:ring-1 focus:ring-[#f27918] transition-shadow" value={perfil.habilidades || ""} onChange={e => setPerfil({...perfil, habilidades: e.target.value})} />
                  </div>
                </div>
              </div>

              <div className="bg-white border border-neutral-200 rounded-xl p-5 shadow-sm">
                <h4 className="font-bold text-neutral-900 mb-3 flex items-center gap-2">
                  <AcademicCapIcon className="w-5 h-5 text-[#f27918]" /> Educação
                </h4>
                <div className="space-y-3">
                  <div>
                    <label className="block text-xs text-neutral-500 mb-1 font-medium">Escolaridade / Cursos</label>
                    <input type="text" placeholder="Ex: Ensino Médio Completo" className="w-full border border-neutral-200 rounded-lg p-3 text-sm outline-none focus:ring-1 focus:ring-[#f27918] transition-shadow" value={perfil.escolaridade || ""} onChange={e => setPerfil({...perfil, escolaridade: e.target.value})} />
                  </div>
                </div>
              </div>

              <div className="flex gap-3 mt-6">
                <button type="button" onClick={() => setIsEditing(false)} className="flex-1 border border-neutral-300 text-neutral-700 font-bold py-3.5 rounded-xl hover:bg-neutral-50 transition-colors shadow-sm">
                  Cancelar
                </button>
                <button type="submit" className="flex-1 bg-[#3D251E] text-white font-bold py-3.5 rounded-xl hover:bg-neutral-800 transition-colors shadow-sm">
                  Salvar Perfil
                </button>
              </div>
            </form>
          </div>
        )}
      </main>

      {/* Footer / Stats Fixos (Mockup Figura 11) */}
      <footer className="fixed bottom-0 left-0 right-0 max-w-md md:max-w-3xl lg:max-w-5xl mx-auto bg-white border-t border-neutral-200 px-2 py-4 flex justify-around items-center z-50 pb-6">
        <div className="flex flex-col items-center justify-center flex-1 text-[#f27918]">
          <ClipboardDocumentListIcon className="w-6 h-6 mb-1" />
          <span className="text-[10px] font-bold tracking-wider uppercase mt-1">Em Análise ({perfil?.stats?.em_analise || 0})</span>
          <div className="w-1.5 h-1.5 bg-[#f27918] rounded-full mt-1"></div>
        </div>
        
        <div className="flex flex-col items-center justify-center flex-1 text-neutral-400">
          <CalendarDaysIcon className="w-6 h-6 mb-1" />
          <span className="text-[10px] font-bold tracking-wider uppercase mt-1">Entrevista ({perfil?.stats?.entrevista || 0})</span>
        </div>

        <div className="flex flex-col items-center justify-center flex-1 text-neutral-400">
          <XCircleIcon className="w-6 h-6 mb-1" />
          <span className="text-[10px] font-bold tracking-wider uppercase mt-1">Reprovado ({perfil?.stats?.reprovado || 0})</span>
        </div>
      </footer>
    </div>
  );
}
