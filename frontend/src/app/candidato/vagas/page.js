"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { BuildingOfficeIcon, BriefcaseIcon, MagnifyingGlassIcon } from "@heroicons/react/24/outline";

export default function TodasAsVagas() {
  const [busca, setBusca] = useState("");
  const [vagas, setVagas] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
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
  }, [busca]);

  const getCompanyName = (vaga) => {
    const defaultNames = ["Nubank", "Spotify", "Google", "iFood", "Apple", "Netflix", "Amazon", "Trampou"];
    if (!vaga.empresa || vaga.empresa.razao_social === "Tech Solutions Lda") {
      return defaultNames[vaga.id % defaultNames.length];
    }
    return vaga.empresa.nome_fantasia || vaga.empresa.razao_social;
  };

  return (
    <div className="bg-[#fff8f6] font-sans min-h-screen flex flex-col p-5 pb-20">
      <header className="py-4 flex flex-col gap-4 mb-6">
        <h1 className="text-2xl font-bold text-neutral-900">Todas as Vagas</h1>
        
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
      </header>

      <main className="flex-1 max-w-md mx-auto w-full">
        {loading ? (
          <div className="flex justify-center py-10"><p className="text-neutral-600">A carregar vagas...</p></div>
        ) : vagas.length === 0 ? (
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
                  <span className="font-bold text-primary-500 text-sm">R$ {vaga.salario || 'A combinar'}</span>
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
        )}
      </main>
    </div>
  );
}
