"use client";
import { useState, useEffect } from "react";
import { MagnifyingGlassIcon, BriefcaseIcon, BuildingOfficeIcon, XMarkIcon } from "@heroicons/react/24/outline";

export default function MuralVagas() {
  const [busca, setBusca] = useState("");
  const [vagas, setVagas] = useState([]);
  const [loading, setLoading] = useState(true);

  // Modal State
  const [selectedVaga, setSelectedVaga] = useState(null);
  const [file, setFile] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [userRole, setUserRole] = useState(null);

  useEffect(() => {
    setUserRole(localStorage.getItem("role"));
    
    // Create an async function to debounce or fetch
    const delayDebounceFn = setTimeout(() => {
      setLoading(true);
      const url = busca ? `${process.env.NEXT_PUBLIC_API_URL || (process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000')}/vagas/?q=${encodeURIComponent(busca)}` : ((process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000')) + "/vagas/";
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
    }, 300); // 300ms debounce

    return () => clearTimeout(delayDebounceFn);
  }, [busca]);

  const vagasFiltradas = vagas;

  const handleApply = async (e) => {
    e.preventDefault();
    if(!file) return alert("Por favor, selecione um currículo em PDF.");
    
    setIsSubmitting(true);
    const token = localStorage.getItem("token");
    const role = localStorage.getItem("role");
    if (!token || role !== "candidato") {
      alert("Você precisa estar logado como candidato para se candidatar.");
      setIsSubmitting(false);
      return;
    }

    const formData = new FormData();
    formData.append("fk_vaga", selectedVaga.id);
    formData.append("curriculo", file);

    try {
      const response = await fetch(((process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000')) + "/candidaturas/", {
        method: "POST",
        headers: { "Authorization": `Bearer ${token}` },
        body: formData
      });
      if(response.ok) {
        alert("Candidatura enviada com sucesso!");
        setSelectedVaga(null);
        setFile(null);
      } else {
        const error = await response.json();
        alert("Erro: " + error.detail);
      }
    } catch(err) {
      console.error(err);
      alert("Erro ao conectar com o servidor.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex-1 bg-neutral-50 flex flex-col relative">
      <section className="bg-primary-50 py-16 px-4">
        <div className="max-w-md mx-auto text-left">
          <div className="flex items-center gap-2 mb-8 text-neutral-900">
            <BriefcaseIcon className="w-6 h-6" />
            <span className="text-xl font-bold">Trampou</span>
          </div>
          <h1 className="text-4xl font-bold tracking-tight mb-4 text-neutral-900 leading-tight">
            Encontre o seu <br/> próximo legado.
          </h1>
          <p className="text-base text-neutral-600 mb-8 max-w-sm">
            Oportunidades exclusivas para profissionais de elite.
          </p>
          
          <div className="flex bg-white border border-primary-300 rounded-lg p-1 shadow-sm focus-within:ring-2 focus-within:ring-primary-500 transition-shadow">
            <div className="flex-1 flex items-center pl-3">
              <MagnifyingGlassIcon className="h-5 w-5 text-neutral-600" />
              <input 
                type="text" 
                placeholder="Cargo, empresa ou palavra-chave" 
                className="w-full py-3 px-3 text-neutral-900 bg-transparent outline-none placeholder:text-neutral-400 text-sm"
                value={busca}
                onChange={(e) => setBusca(e.target.value)}
              />
            </div>
            <button className="text-primary-500 px-4 flex items-center justify-center">
              <svg xmlns="http://www.டிகorg/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 6h9.75M10.5 6a1.5 1.5 0 1 1-3 0m3 0a1.5 1.5 0 1 0-3 0M3.75 6H7.5m3 12h9.75m-9.75 0a1.5 1.5 0 0 1-3 0m3 0a1.5 1.5 0 0 0-3 0m-3.75 0H7.5m9-6h3.75m-3.75 0a1.5 1.5 0 0 1-3 0m3 0a1.5 1.5 0 0 0-3 0m-9.75 0h9.75" />
              </svg>
            </button>
          </div>
        </div>
      </section>

      <section className="max-w-md mx-auto px-4 py-8 w-full flex-1">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-neutral-900">Vagas em Destaque</h2>
          <button className="text-xs font-bold tracking-widest text-neutral-900 hover:underline uppercase">
            VER TODAS
          </button>
        </div>

        {loading ? (
          <div className="flex justify-center py-10"><p className="text-neutral-600">A carregar vagas...</p></div>
        ) : (
          <div className="flex flex-col gap-4">
            {vagasFiltradas.map(vaga => (
              <div key={vaga.id} className="bg-white rounded-xl p-5 border border-neutral-200 hover:shadow-md transition-all flex flex-col relative">
                <button className="absolute top-5 right-5 text-neutral-400 hover:text-primary-500">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M17.593 3.322c1.1.128 1.907 1.077 1.907 2.185V21L12 17.25 4.5 21V5.507c0-1.108.806-2.057 1.907-2.185a48.507 48.507 0 0 1 11.186 0Z" />
                  </svg>
                </button>
                
                <div className="w-12 h-12 bg-neutral-900 rounded-md mb-4 flex items-center justify-center text-white text-xs font-bold">
                  {/* Placeholder de logo */}
                  {vaga.id_empresa}
                </div>
                
                <div className="flex-1">
                  <h3 className="text-xl font-bold text-neutral-900 mb-1">
                    {vaga.titulo}
                  </h3>
                  <div className="flex items-center gap-4 text-sm text-neutral-600 mb-4">
                    <div className="flex items-center gap-1">
                      <BuildingOfficeIcon className="h-4 w-4" />
                      Empresa {vaga.id_empresa}
                    </div>
                    <div className="flex items-center gap-1">
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
                        <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1 1 15 0Z" />
                      </svg>
                      {/* Local placeholder */}
                      Brasil
                    </div>
                  </div>
                </div>
                <div className="mt-2 pt-4 border-t border-dashed border-neutral-200 flex justify-between items-center">
                  <span className="font-bold text-primary-500 text-sm">R$ {vaga.salario || 'A combinar'}</span>
                  <a 
                    href={`/candidatar/${vaga.id}`}
                    className="px-5 py-2 bg-primary-300 text-neutral-900 font-bold rounded-lg hover:bg-primary-500 transition-colors text-sm"
                  >
                    Candidatar-se
                  </a>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

    </div>
  );
}
