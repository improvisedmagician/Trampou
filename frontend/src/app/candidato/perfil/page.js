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

  if (loading) {
    return <div className="min-h-screen bg-[#ffffff] flex items-center justify-center font-sans">A carregar perfil...</div>;
  }

  return (
    <div className="bg-[#ffffff] text-neutral-900 font-sans min-h-screen flex flex-col relative pb-24">
      {/* Header */}
      <header className="flex items-center justify-between px-5 py-4 bg-[#ffffff] border-b border-neutral-100">
        <Link href="/" className="p-2 -ml-2 text-primary-500 hover:bg-neutral-100 rounded-full transition-colors">
          <ArrowLeftIcon className="w-6 h-6" />
        </Link>
        <h1 className="text-xl font-bold text-neutral-900">Meu Perfil Digital</h1>
        <div className="w-10 h-10 rounded-full overflow-hidden bg-neutral-200">
          <img src={`https://ui-avatars.com/api/?name=${perfil?.nome}&background=4B2E2A&color=fff`} alt="Mini Avatar" className="w-full h-full object-cover"/>
        </div>
      </header>

      <main className="px-5 py-8 max-w-md mx-auto w-full flex-1">
        {/* Avatar Central */}
        <div className="flex flex-col items-center mb-6">
          <div className="w-28 h-28 rounded-2xl overflow-hidden mb-4 shadow-lg border-2 border-primary-300">
            <img alt="Avatar" className="w-full h-full object-cover" src={`https://ui-avatars.com/api/?name=${perfil?.nome}&background=4B2E2A&color=fff&size=256`} />
          </div>
          <h2 className="text-2xl font-bold text-neutral-900 mb-1">{perfil?.nome}</h2>
          <p className="text-sm text-neutral-600 mb-4">Candidato na Trampou</p>
        </div>

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
            .then(data => alert("Perfil salvo com sucesso!"))
            .catch(console.error);
        }} className="space-y-4">
          <div className="bg-white border border-neutral-200 rounded-xl p-5 shadow-sm">
            <h4 className="font-bold text-neutral-900 mb-3 flex items-center gap-2">
              <UserIcon className="w-5 h-5 text-primary-600" /> Dados Pessoais
            </h4>
            <div className="space-y-3">
              <div>
                <label className="block text-xs text-neutral-500 mb-1">Nome Completo</label>
                <input type="text" className="w-full border rounded-lg p-2 text-sm outline-none focus:ring-1 focus:ring-primary-500" value={perfil.nome || ""} onChange={e => setPerfil({...perfil, nome: e.target.value})} />
              </div>
              <div>
                <label className="block text-xs text-neutral-500 mb-1">Contato (Telefone/WhatsApp)</label>
                <input type="text" className="w-full border rounded-lg p-2 text-sm outline-none focus:ring-1 focus:ring-primary-500" value={perfil.contato || ""} onChange={e => setPerfil({...perfil, contato: e.target.value})} />
              </div>
            </div>
          </div>

          <div className="bg-white border border-neutral-200 rounded-xl p-5 shadow-sm">
            <h4 className="font-bold text-neutral-900 mb-3 flex items-center gap-2">
              <BriefcaseIcon className="w-5 h-5 text-primary-600" /> Experiência & Habilidades
            </h4>
            <div className="space-y-3">
              <div>
                <label className="block text-xs text-neutral-500 mb-1">Resumo Profissional / Experiência</label>
                <textarea rows="3" className="w-full border rounded-lg p-2 text-sm outline-none focus:ring-1 focus:ring-primary-500" value={perfil.resumo_profissional || ""} onChange={e => setPerfil({...perfil, resumo_profissional: e.target.value})} />
              </div>
              <div>
                <label className="block text-xs text-neutral-500 mb-1">Principais Habilidades</label>
                <input type="text" placeholder="Ex: Vendas, Excel, Atendimento" className="w-full border rounded-lg p-2 text-sm outline-none focus:ring-1 focus:ring-primary-500" value={perfil.habilidades || ""} onChange={e => setPerfil({...perfil, habilidades: e.target.value})} />
              </div>
            </div>
          </div>

          <div className="bg-white border border-neutral-200 rounded-xl p-5 shadow-sm">
            <h4 className="font-bold text-neutral-900 mb-3 flex items-center gap-2">
              <AcademicCapIcon className="w-5 h-5 text-primary-600" /> Educação
            </h4>
            <div className="space-y-3">
              <div>
                <label className="block text-xs text-neutral-500 mb-1">Escolaridade / Cursos</label>
                <input type="text" placeholder="Ex: Ensino Médio Completo" className="w-full border rounded-lg p-2 text-sm outline-none focus:ring-1 focus:ring-primary-500" value={perfil.escolaridade || ""} onChange={e => setPerfil({...perfil, escolaridade: e.target.value})} />
              </div>
            </div>
          </div>

          <button type="submit" className="w-full bg-[#000000] text-white font-bold py-3 rounded-xl hover:bg-[#1f2937] transition-colors mt-2 mb-4 shadow-md">
            Salvar Perfil
          </button>
        </form>
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
