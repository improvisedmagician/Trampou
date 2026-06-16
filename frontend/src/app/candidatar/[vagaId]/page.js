"use client";
import { ArrowLeftIcon, CloudArrowUpIcon, DocumentIcon } from "@heroicons/react/24/outline";
import { useState, use } from "react";
import { useRouter } from "next/navigation";

export default function UploadCurriculo({ params }) {
  // Desembrulhar params com React.use() conforme Next.js 15
  const unwrappedParams = use(params);
  const vagaId = unwrappedParams.vagaId;

  const router = useRouter();
  const [file, setFile] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleFileChange = async (e) => {
    if(e.target.files && e.target.files[0]) {
      const selectedFile = e.target.files[0];
      setFile(selectedFile);
      
      // Auto submit as soon as file is selected, matching mockup
      setIsSubmitting(true);
      const token = localStorage.getItem("token");
      const role = localStorage.getItem("role");
      
      if (!token || role !== "candidato") {
        alert("Você precisa estar logado como candidato para se candidatar.");
        setIsSubmitting(false);
        router.push("/auth");
        return;
      }

      const formData = new FormData();
      formData.append("fk_vaga", vagaId);
      formData.append("curriculo", selectedFile);

      try {
        const response = await fetch("https://trampou-api.onrender.com/candidaturas/", {
          method: "POST",
          headers: { "Authorization": `Bearer ${token}` },
          body: formData
        });
        if(response.ok) {
          router.push("/sucesso");
        } else {
          const error = await response.json();
          alert("Erro: " + error.detail);
          setIsSubmitting(false);
        }
      } catch(err) {
        console.error(err);
        alert("Erro ao conectar com o servidor.");
        setIsSubmitting(false);
      }
    }
  };

  return (
    <div className="bg-[#fff8f6] font-sans min-h-screen flex flex-col relative pb-8">
      <header className="bg-white px-4 py-4 flex items-center shadow-sm sticky top-0 z-10 border-b border-neutral-100">
        <button onClick={() => router.back()} className="mr-4 text-neutral-900 hover:bg-neutral-100 p-2 rounded-full transition-colors">
          <ArrowLeftIcon className="w-6 h-6" />
        </button>
        <h1 className="text-xl font-bold text-neutral-900 flex-1 text-center pr-10">Upload de Currículo</h1>
      </header>

      <main className="flex-1 max-w-md mx-auto w-full px-5 pt-8 flex flex-col">
        
        {/* Drag and Drop Zone */}
        <label className="border-2 border-dashed border-primary-300 rounded-xl bg-white p-10 flex flex-col items-center justify-center cursor-pointer hover:bg-neutral-50 transition-colors mb-6 text-center">
          <CloudArrowUpIcon className="w-16 h-16 text-primary-400 mb-4" />
          <span className="text-base font-bold text-neutral-800 mb-2">Clique para selecionar PDF</span>
          <span className="text-xs text-neutral-500">Tamanho máximo: 5MB</span>
          <input 
            type="file" 
            accept=".pdf" 
            className="hidden" 
            onChange={handleFileChange} 
            disabled={isSubmitting}
          />
        </label>

        {/* File Preview */}
        {file && (
          <div className="bg-white border border-neutral-200 rounded-lg p-4 flex items-center gap-3 mb-auto shadow-sm">
            <DocumentIcon className="w-8 h-8 text-primary-500 flex-shrink-0" />
            <div className="flex-1 overflow-hidden">
              <p className="text-sm font-bold text-neutral-800 truncate">{file.name}</p>
              <div className="mt-2 w-full bg-neutral-100 rounded-full h-1.5">
                <div className="bg-primary-500 h-1.5 rounded-full" style={{width: isSubmitting ? "70%" : "100%", transition: "width 0.5s ease-in-out"}}></div>
              </div>
              <p className="text-xs text-neutral-500 mt-1">{isSubmitting ? "Enviando... 70%" : "Enviado"}</p>
            </div>
          </div>
        )}

        {/* Footer Button */}
        <div className="mt-auto pt-8 flex flex-col gap-3">
          <button 
            onClick={() => {
              if (isSubmitting) {
                // To cancel an ongoing request would require an AbortController,
                // but for mockup fidelity, just go back.
                router.back();
              } else {
                router.back();
              }
            }}
            className={`w-full py-4 rounded-xl font-bold transition-colors border ${isSubmitting ? 'border-primary-400 text-primary-600 bg-transparent' : 'border-primary-500 text-neutral-900 bg-transparent hover:bg-primary-50'}`}
          >
            CANCELAR
          </button>
        </div>

      </main>
    </div>
  );
}
