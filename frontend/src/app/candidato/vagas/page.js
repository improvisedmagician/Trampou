"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { BuildingOfficeIcon, BriefcaseIcon, MagnifyingGlassIcon, DocumentTextIcon } from "@heroicons/react/24/outline";

export default function VagasPage() {
  const [activeTab, setActiveTab] = useState("todas"); // "todas" | "minhas"
  const [busca, setBusca] = useState("");
  const [vagas, setVagas] = useState([]);
  const [minhasCandidaturas, setMinhasCandidaturas] = useState([]);
  const [loading, setLoading] = useState(true);

  // Busca Vagas
  useEffect(() => {
    if (activeTab !== "todas") return;
    const delayDebounceFn = setTimeout(() => {
      setLoading(true);
      const url = busca ? `https://trampou-api.onrender.com/vagas/?q=${encodeURIComponent(busca)}` : "https://trampou-api.onrender.com/vagas/";
      fetch(url)
        .then(res => res.json())
        .then(data => {
          setVagas(data);
          setLoading(false);
        })
        .catch(err => {
          console.error("Erro ao buscar vagas", err);
          setLoading(false);
        });
    }, 300);
    return () => clearTimeout(delayDebounceFn);
  }, [busca, activeTab]);

  // Busca Candidaturas
  useEffect(() => {
    if (activeTab !== "minhas") return;
    setLoading(true);
    const token = localStorage.getItem("token");
    if (!token) {
      setLoading(false);
      return;
    }
    fetch("https://trampou-api.onrender.com/candidaturas/minhas", {
      headers: { "Authorization": `Bearer ${token}` }
    })
      .then(res => res.json())
      .then(data => {
        setMinhasCandidaturas(data);
        setLoading(false);
      })
      .catch(err => {
        console.error("Erro ao buscar candidaturas", err);
        setLoading(false);
      });
  }, [activeTab]);

  const getCompanyName = (vaga) => {
    const defaultNames = ["Nubank", "Spotify", "Google", "iFood", "Apple", "Netflix", "Amazon", "Trampou"];
    if (!vaga.empresa || vaga.empresa.razao_social === "Tech Solutions Lda") {
      return defaultNames[vaga.id % defaultNames.length];
    }
    return vaga.empresa.nome_fantasia || vaga.empresa.razao_social;
  };

  const getStatusColor = (status) => {
    if (status === "Entrevista") return "bg-green-100 text-green-700";
    if (status === "Recusada") return "bg-red-100 text-red-700";
    return "bg-amber-100 text-amber-700"; // Em Análise
  };

  return (
    <div className="bg-[#fff8f6] font-sans min-h-screen flex flex-col p-5 pb-20">
      <header className="py-4 flex flex-col gap-6 mb-2">
        <h1 className="text-2xl font-bold text-neutral-900">Vagas</h1>
        
        {/* Tabs */}
        <div className="flex bg-neutral-100 p-1 rounded-lg">
          <button 
            onClick={() => setActiveTab("todas")}
            className={`flex-1 py-2 text-sm font-bold rounded-md transition-all ${activeTab === "todas" ? "bg-white text-primary-600 shadow-sm" : "text-neutral-500 hover:text-neutral-700"}`}
          >
            Explorar Vagas
          </button>
          <button 
            onClick={() => setActiveTab("minhas")}
            className={`flex-1 py-2 text-sm font-bold rounded-md transition-all ${activeTab === "minhas" ? "bg-white text-primary-600 shadow-sm" : "text-neutral-500 hover:text-neutral-700"}`}
          >
            Ver Candidaturas
          </button>
        </div>

        {activeTab === "todas" && (
          <div className="flex bg-white border border-primary-300 rounded-lg p-1 shadow-sm focus-within:ring-2 focus-within:ring-primary-500 transition-shadow">
            <div className="flex-1 flex items-center pl-3">
              <MagnifyingGlassIcon className="h-5 w-5 text-neutral-600" />
              <input 
                type="text" 
                placeholder="Pesquisar vagas..." 
                className="w-full py-2 px-3 text-neutral-900 bg-transparent outline-none placeholder:text-neutral-400 text-sm"
                value={busca}
                onChange={(e) => setBusca(e.target.value)}
              />
            </div>
          </div>
        )}
      </header>

      <main className="flex-1 max-w-md mx-auto w-full mt-4">
        {loading ? (
          <div className="flex justify-center py-10"><p className="text-neutral-600">A carregar...</p></div>
        ) : activeTab === "todas" ? (
          vagas.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-10 text-center">
               <BriefcaseIcon className="w-12 h-12 text-neutral-300 mb-4" />
               <p className="text-neutral-600 font-medium">Nenhuma vaga encontrada para "{busca}".</p>
            </div>
          ) : (
            <div className="flex flex-col gap-4">
              {vagas.map(vaga => (
                <div key={vaga.id} className="bg-white rounded-xl p-5 border border-neutral-200 hover:shadow-md transition-all flex flex-col relative">
                  <div className="w-12 h-12 bg-[#3D251E] rounded-md mb-4 flex items-center justify-center text-white overflow-hidden shadow-sm">
                    {vaga.empresa?.logotipo ? (
                      <img src={vaga.empresa.logotipo} alt="Logo" className="w-full h-full object-cover" />
                    ) : (
                      <img src={`https://ui-avatars.com/api/?name=${encodeURIComponent(getCompanyName(vaga))}&background=3D251E&color=fff&bold=true`} alt="Logo" className="w-full h-full object-cover" />
                    )}
                  </div>
                  
                  <div className="flex-1">
                    <h3 className="text-xl font-bold text-neutral-900 mb-1">
                      {vaga.titulo}
                    </h3>
                    <div className="flex items-center gap-4 text-sm text-neutral-600 mb-4">
                      <div className="flex items-center gap-1">
                        <BuildingOfficeIcon className="h-4 w-4" />
                        {getCompanyName(vaga)}
                      </div>
                      <div className="flex items-center gap-1">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
                          <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1 1 15 0Z" />
                        </svg>
                        {vaga.cidade || 'Brasil'}
                      </div>
                    </div>
                  </div>
                  <div className="mt-2 pt-4 border-t border-dashed border-neutral-200 flex justify-between items-center">
                    <span className="font-bold text-primary-500 text-sm">
                      {vaga.salario ? (isNaN(parseFloat(vaga.salario.replace(',','.'))) ? vaga.salario : parseFloat(vaga.salario.replace(',','.')).toLocaleString('pt-BR', {style: 'currency', currency: 'BRL'})) : '-'}
                    </span>
                    <Link 
                      href={`/candidatar/${vaga.id}`}
                      className="px-5 py-2 bg-primary-300 text-neutral-900 font-bold rounded-lg hover:bg-primary-500 transition-colors text-sm"
                    >
                      Candidatar-se
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          )
        ) : (
          /* Minhas Candidaturas Tab */
          minhasCandidaturas.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-10 text-center">
               <DocumentTextIcon className="w-12 h-12 text-neutral-300 mb-4" />
               <p className="text-neutral-600 font-medium mb-4">Ainda não se candidatou a nenhuma vaga.</p>
               <button 
                onClick={() => setActiveTab("todas")}
                className="bg-primary-500 text-white font-bold py-2 px-6 rounded-lg hover:bg-primary-600"
               >
                 Explorar Vagas
               </button>
            </div>
          ) : (
            <div className="flex flex-col gap-4">
              {minhasCandidaturas.map(cand => (
                <div key={cand.id} className="bg-white rounded-xl p-5 border border-neutral-200 hover:shadow-md transition-all flex flex-col relative">
                  <div className="flex justify-between items-start mb-2">
                    <div className="w-10 h-10 bg-[#3D251E] rounded-md flex items-center justify-center text-white overflow-hidden shadow-sm">
                      {cand.vaga?.empresa?.logotipo ? (
                        <img src={cand.vaga.empresa.logotipo} alt="Logo" className="w-full h-full object-cover" />
                      ) : (
                        <img src={`https://ui-avatars.com/api/?name=${encodeURIComponent(getCompanyName(cand.vaga || {}))}&background=3D251E&color=fff&bold=true`} alt="Logo" className="w-full h-full object-cover" />
                      )}
                    </div>
                    <span className={`px-3 py-1 text-xs font-bold rounded-full ${getStatusColor(cand.status_triagem)}`}>
                      {cand.status_triagem}
                    </span>
                  </div>
                  
                  <h3 className="text-lg font-bold text-neutral-900 mb-1">
                    {cand.vaga?.titulo}
                  </h3>
                  <div className="flex items-center gap-4 text-sm text-neutral-600">
                    <div className="flex items-center gap-1">
                      <BuildingOfficeIcon className="h-4 w-4" />
                      {getCompanyName(cand.vaga || {})}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )
        )}
      </main>
    </div>
  );
}
