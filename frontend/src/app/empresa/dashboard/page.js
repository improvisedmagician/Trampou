"use client";
import { PlusIcon, UsersIcon, BriefcaseIcon } from "@heroicons/react/24/outline";
import Link from "next/link";
import { useEffect, useState } from "react";

export default function EmpresaDashboard() {
  const [vagas, setVagas] = useState([]);
  const [selectedVaga, setSelectedVaga] = useState(null);
  const [candidatos, setCandidatos] = useState([]);
  const [loadingCandidatos, setLoadingCandidatos] = useState(false);
  const [nomeEmpresa, setNomeEmpresa] = useState("Empresa");
  
  const loadVagas = () => {
    const userId = localStorage.getItem("user_id");
    const token = localStorage.getItem("token");
    if(!userId || !token) {
      window.location.href = "/auth";
      return;
    }
    fetch(`${'https://trampou-api.onrender.com'}/vagas/empresa/${userId}`, {
      headers: { "Authorization": `Bearer ${token}` }
    })
      .then(res => {
        if(res.status === 401 || res.status === 403) window.location.href = "/auth";
        return res.json();
      })
      .then(data => { if(Array.isArray(data)) setVagas(data); })
      .catch(err => console.error(err));
  };

  useEffect(() => {
    loadVagas();
    setNomeEmpresa(localStorage.getItem("nome") || "Empresa");
  }, []);

  const handleToggleStatus = async (vaga) => {
    const newStatus = vaga.status === "Ativa" ? "Pausada" : "Ativa";
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`${'https://trampou-api.onrender.com'}/vagas/${vaga.id}/status`, {
        method: "PATCH",
        headers: { 
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({ status: newStatus })
      });
      if(response.ok) {
        loadVagas();
      }
    } catch(err) {
      console.error(err);
    }
  };

  const handleVerCandidatos = async (vaga) => {
    setSelectedVaga(vaga);
    setLoadingCandidatos(true);
    const token = localStorage.getItem("token");
    try {
      const response = await fetch(`${'https://trampou-api.onrender.com'}/candidaturas/vaga/${vaga.id}`, {
        headers: { "Authorization": `Bearer ${token}` }
      });
      if(response.ok) {
        const data = await response.json();
        setCandidatos(data);
      } else {
        alert("Erro ao buscar candidatos.");
      }
    } catch(err) {
      console.error(err);
    } finally {
      setLoadingCandidatos(false);
    }
  };

  const totalCandidatos = vagas.reduce((acc, vaga) => acc + (vaga.candidatos_count || 0), 0);
  const vagasAtivas = vagas.filter(v => v.status === "Ativa").length;

  return (
    <div className="bg-neutral-50 text-neutral-900 font-sans min-h-screen pt-4 pb-20 relative">
      <main className="px-5 max-w-md mx-auto w-full">
        
        {/* Header Dashboard */}
        <header className="flex items-center justify-between mb-8 pb-4 border-b border-neutral-200">
          <div className="flex items-center gap-3">
            <button className="text-neutral-900 hover:bg-neutral-200 p-1 rounded">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-6 h-6">
                <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
              </svg>
            </button>
            <h1 className="text-xl font-bold text-neutral-900">{nomeEmpresa}</h1>
          </div>
          <div className="w-8 h-8 rounded-full overflow-hidden bg-neutral-300">
            <img src="https://ui-avatars.com/api/?name=Empresa&background=4B2E2A&color=fff" alt="Avatar" className="w-full h-full object-cover"/>
          </div>
        </header>

        <h2 className="text-2xl font-bold text-neutral-900 mb-1">Painel - {nomeEmpresa}</h2>
        <p className="text-sm text-neutral-600 mb-6">Gerencie suas oportunidades de carreira e talentos.</p>

        {/* Botão Publicar */}
        <Link href="/empresa/publicar-vaga" className="w-full bg-primary-500 text-white rounded-lg py-4 flex justify-center items-center gap-2 hover:bg-primary-600 transition-colors font-semibold mb-8">
          <PlusIcon className="w-5 h-5" />
          + Publicar Nova Vaga
        </Link>

        {/* Cartões de Métricas */}
        <div className="flex flex-col gap-4 mb-8">
          <div className="bg-white border border-neutral-100 rounded-xl p-6 shadow-sm relative">
            <BriefcaseIcon className="w-6 h-6 text-primary-500 absolute top-6 right-6" />
            <p className="text-xs tracking-widest text-neutral-600 font-bold uppercase mb-4">Vagas Ativas</p>
            <h2 className="text-5xl font-bold text-primary-500 mb-2">{vagasAtivas}</h2>
            <p className="text-xs text-neutral-400">Atualizado hoje</p>
          </div>
          <div className="bg-white border border-neutral-100 rounded-xl p-6 shadow-sm relative">
            <UsersIcon className="w-6 h-6 text-primary-500 absolute top-6 right-6" />
            <p className="text-xs tracking-widest text-neutral-600 font-bold uppercase mb-4">Candidatos</p>
            <h2 className="text-5xl font-bold text-primary-500 mb-2">{totalCandidatos}</h2>
            <p className="text-xs text-neutral-400">Novos inscritos esta semana</p>
          </div>
        </div>

        {/* Tabela de Vagas */}
        <div className="bg-white border border-neutral-100 rounded-xl overflow-hidden shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-neutral-100 text-neutral-600">
                  <th className="p-4 font-semibold text-sm">Vaga</th>
                  <th className="p-4 font-semibold text-sm">Status</th>
                  <th className="p-4 font-semibold text-sm text-center">Candidatos</th>
                  <th className="p-4 font-semibold text-sm text-right">Ações</th>
                </tr>
              </thead>
              <tbody>
                {vagas.length === 0 ? (
                  <tr><td colSpan="4" className="p-4 text-center text-neutral-600">Nenhuma vaga publicada.</td></tr>
                ) : vagas.map((vaga, idx) => (
                  <tr key={vaga.id} className={idx % 2 === 0 ? "bg-white" : "bg-neutral-50"}>
                    <td className="p-4 text-neutral-900 font-semibold">{vaga.titulo}</td>
                    <td className="p-4">
                      {vaga.status === "Ativa" ? (
                        <span className="px-3 py-1 rounded-full text-xs font-bold bg-emerald-100 text-emerald-700">
                          Ativa
                        </span>
                      ) : (
                        <span className="px-3 py-1 rounded-full text-xs font-bold bg-amber-100 text-amber-700">
                          Pausada
                        </span>
                      )}
                    </td>
                    <td className="p-4 text-center">
                      <button 
                        onClick={() => handleVerCandidatos(vaga)}
                        className="font-bold text-neutral-900 hover:text-primary-500 underline"
                      >
                        {vaga.candidatos_count}
                      </button>
                    </td>
                    <td className="p-4 text-right flex items-center justify-end gap-2">
                      <button 
                        onClick={() => handleToggleStatus(vaga)}
                        className="font-semibold text-xs px-3 py-1.5 rounded transition-colors bg-primary-500 text-white hover:bg-primary-600"
                      >
                        {vaga.status === "Ativa" ? "Pausar" : "Ativar"}
                      </button>
                      {vaga.status === "Ativa" && (
                        <button className="font-semibold text-xs px-3 py-1.5 rounded transition-colors bg-status-danger text-white hover:bg-red-600">
                          Encerrar
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </main>

      {/* Modal de Candidatos */}
      {selectedVaga && (
        <div className="fixed inset-0 bg-neutral-900/50 flex items-center justify-center z-50 p-4 backdrop-blur-sm">
          <div className="bg-white rounded-xl w-full max-w-2xl p-6 relative shadow-xl border border-neutral-200 max-h-[80vh] flex flex-col">
            <button 
              onClick={() => { setSelectedVaga(null); setCandidatos([]); }}
              className="absolute top-4 right-4 text-neutral-400 hover:text-neutral-900 transition-colors text-2xl"
            >
              &times;
            </button>
            
            <h2 className="text-xl font-bold text-neutral-900 mb-1">Candidatos</h2>
            <p className="text-neutral-600 text-sm mb-6">Vaga: {selectedVaga.titulo}</p>
            
            <div className="overflow-y-auto flex-1">
              {loadingCandidatos ? (
                <p className="text-center text-neutral-600 py-4">A carregar candidatos...</p>
              ) : candidatos.length === 0 ? (
                <p className="text-center text-neutral-600 py-4">Ainda não há candidaturas para esta vaga.</p>
              ) : (
                <div className="flex flex-col gap-4">
                  {candidatos.map((c, index) => {
                    const pdfUrl = `${'https://trampou-api.onrender.com'}/${c.caminho_curriculo_pdf.replace(/\\/g, '/')}`;
                    return (
                      <div key={index} className="bg-neutral-50 p-4 rounded-lg border border-neutral-200 flex justify-between items-center">
                        <div>
                          <p className="font-bold text-neutral-900">{c.candidato?.nome || "Candidato Desconhecido"}</p>
                          <p className="text-sm text-neutral-600">{c.candidato?.email}</p>
                          <p className="text-xs text-neutral-500 mt-1">Status: {c.status_triagem}</p>
                        </div>
                        <a 
                          href={pdfUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="bg-primary-100 text-primary-700 font-semibold px-4 py-2 rounded hover:bg-primary-200 transition-colors text-sm"
                        >
                          Ver PDF
                        </a>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
