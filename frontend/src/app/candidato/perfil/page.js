"use client";
import { useState, useEffect } from "react";
import { ArrowLeftIcon, UserIcon, BriefcaseIcon, AcademicCapIcon, ClipboardDocumentListIcon, CalendarDaysIcon, XCircleIcon } from "@heroicons/react/24/outline";
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

  if (loading) {
    return <div className="min-h-screen bg-[#ffffff] flex items-center justify-center font-sans">A carregar perfil...</div>;
  }

  return (
    <div className="bg-[#fcfcfc] text-neutral-900 font-sans min-h-screen flex flex-col relative pb-24">
      {/* Header Fixo */}
      <header className="flex items-center justify-between px-5 py-4 bg-white border-b border-neutral-100 sticky top-0 z-10">
        <Link href="/" className="p-2 -ml-2 text-neutral-900 hover:bg-neutral-100 rounded-full transition-colors">
          <ArrowLeftIcon className="w-6 h-6" />
        </Link>
        <h1 className="text-xl font-bold text-neutral-900">{isEditing ? "Editar Perfil" : "Meu Perfil"}</h1>
        <div className="w-8 h-8"></div> {/* Espaçador */}
      </header>

      <main className="flex-1 w-full max-w-md mx-auto flex flex-col">
        {!isEditing ? (
          // Visualização do Perfil (Tela 5 do PDF)
          <div className="flex flex-col animate-fadeIn">
            {/* Bloco de cor no topo com Avatar sobreposto */}
            <div className="bg-[#3D251E] h-32 relative flex justify-center rounded-b-[30px] shadow-sm">
              <div className="absolute -bottom-16 w-32 h-32 rounded-full border-4 border-white bg-white overflow-hidden shadow-md">
                <img alt="Avatar" className="w-full h-full object-cover" src={`https://ui-avatars.com/api/?name=${perfil?.nome}&background=f27918&color=fff&size=256`} />
              </div>
            </div>

            <div className="mt-20 px-6 text-center">
              <h2 className="text-2xl font-bold text-neutral-900 mb-1">{perfil?.nome}</h2>
              <p className="text-[#f27918] font-semibold text-sm mb-5">Candidato na Trampou</p>
              
              <button onClick={() => setIsEditing(true)} className="border-2 border-neutral-200 text-neutral-800 font-bold px-8 py-2.5 rounded-full hover:bg-neutral-50 transition-colors shadow-sm text-sm">
                Editar Perfil
              </button>
            </div>

            <div className="px-6 mt-10 space-y-8">
              <section>
                <h3 className="text-lg font-bold text-neutral-900 mb-3 flex items-center gap-2">
                  <UserIcon className="w-5 h-5 text-[#f27918]" /> Sobre Mim
                </h3>
                <p className="text-neutral-600 text-sm leading-relaxed bg-white p-4 rounded-2xl border border-neutral-100 shadow-sm">
                  {perfil?.resumo_profissional || 'Nenhum resumo profissional adicionado. Edite o perfil para contar um pouco sobre si.'}
                </p>
              </section>

              <section>
                <h3 className="text-lg font-bold text-neutral-900 mb-3 flex items-center gap-2">
                  <BriefcaseIcon className="w-5 h-5 text-[#f27918]" /> Habilidades
                </h3>
                <div className="flex flex-wrap gap-2">
                  {perfil?.habilidades ? perfil.habilidades.split(',').map((hab, i) => (
                    <span key={i} className="bg-primary-50 text-[#f27918] border border-primary-100 px-4 py-1.5 rounded-full text-xs font-bold tracking-wide">
                      {hab.trim()}
                    </span>
                  )) : (
                    <span className="text-neutral-500 text-sm">Nenhuma habilidade listada.</span>
                  )}
                </div>
              </section>

              <section>
                <h3 className="text-lg font-bold text-neutral-900 mb-3 flex items-center gap-2">
                  <AcademicCapIcon className="w-5 h-5 text-[#f27918]" /> Formação
                </h3>
                <div className="bg-white p-4 rounded-2xl border border-neutral-100 shadow-sm flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-neutral-50 flex items-center justify-center flex-shrink-0">
                    <AcademicCapIcon className="w-5 h-5 text-neutral-400" />
                  </div>
                  <div>
                    <h4 className="font-bold text-neutral-900 text-sm">{perfil?.escolaridade || 'Não informada'}</h4>
                  </div>
                </div>
              </section>

              <section>
                <h3 className="text-lg font-bold text-neutral-900 mb-3 flex items-center gap-2">
                  <ClipboardDocumentListIcon className="w-5 h-5 text-[#f27918]" /> Contato
                </h3>
                <div className="bg-white p-4 rounded-2xl border border-neutral-100 shadow-sm">
                  <p className="text-neutral-600 text-sm">{perfil?.contato || 'Nenhum contato adicionado'}</p>
                </div>
              </section>
            </div>
          </div>
        ) : (
          // Modo de Edição
          <div className="px-5 py-8 animate-fadeIn">
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
      <footer className="fixed bottom-0 left-0 right-0 bg-white border-t border-neutral-200 px-2 py-4 flex justify-around items-center">
        <div className="flex flex-col items-center justify-center flex-1 text-[#f27918]">
          <ClipboardDocumentListIcon className="w-6 h-6 mb-1" />
          <span className="text-[10px] font-bold tracking-wider uppercase">Em Análise ({perfil?.stats?.em_analise || 0})</span>
          <div className="w-1 h-1 bg-[#f27918] rounded-full mt-1"></div>
        </div>
        
        <div className="flex flex-col items-center justify-center flex-1 text-neutral-400">
          <CalendarDaysIcon className="w-6 h-6 mb-1" />
          <span className="text-[10px] font-bold tracking-wider uppercase">Entrevista ({perfil?.stats?.entrevista || 0})</span>
        </div>

        <div className="flex flex-col items-center justify-center flex-1 text-neutral-400">
          <XCircleIcon className="w-6 h-6 mb-1" />
          <span className="text-[10px] font-bold tracking-wider uppercase">Recusada ({perfil?.stats?.recusada || 0})</span>
        </div>
      </footer>
    </div>
  );
}
