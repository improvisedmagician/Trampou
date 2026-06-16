"use client";
import { ArrowLeftIcon } from "@heroicons/react/24/outline";
import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function PublicarVaga() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    titulo: "",
    salario: "",
    descricao: "",
    cidade: ""
  });
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setFormData({...formData, [e.target.id]: e.target.value});
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    try {
      const token = localStorage.getItem("token");
      if(!token) {
        alert("Sessão expirada. Faça login novamente.");
        router.push("/auth");
        return;
      }
      const response = await fetch('https://trampou-api.onrender.com' + "/vagas/", {
        method: "POST",
        headers: { 
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify(formData)
      });
      if(response.ok) {
        router.push("/empresa/dashboard");
      } else {
        const errorData = await response.json();
        setError(errorData.detail || "Erro ao publicar vaga.");
      }
    } catch(err) {
      console.error(err);
      setError("Erro de conexão ao servidor.");
    }
  }

  return (
    <div className="bg-primary-50 font-sans min-h-screen flex flex-col">
      <header className="bg-primary-50 border-b border-neutral-200 px-4 py-4 flex items-center sticky top-0 z-10">
        <button onClick={() => router.back()} className="mr-4 text-primary-700 p-2">
          <ArrowLeftIcon className="w-6 h-6" />
        </button>
        <h1 className="text-xl font-bold text-primary-700 flex-1 text-center pr-10">Publicar Vaga</h1>
      </header>

      <main className="flex-1 w-full flex flex-col pt-6">
        {error && (
          <div className="bg-red-50 text-red-600 border border-red-200 p-4 mx-5 mb-6 text-sm font-medium">
            {error}
          </div>
        )}

        <form id="vaga-form" onSubmit={handleSubmit} className="flex flex-col flex-1">
          <div className="px-5 flex flex-col gap-4 flex-1">
            <input 
              id="titulo" 
              value={formData.titulo} 
              onChange={handleChange} 
              required 
              type="text" 
              placeholder="Título da Vaga"
              className="w-full bg-white border border-neutral-300 px-4 py-4 text-neutral-900 placeholder:text-neutral-700 focus:outline-none focus:border-primary-500 focus:ring-1 focus:ring-primary-500 transition-colors" 
            />

            <input 
              id="salario" 
              value={formData.salario} 
              onChange={handleChange} 
              type="text" 
              placeholder="Salário (Opcional)"
              className="w-full bg-white border border-neutral-300 px-4 py-4 text-neutral-900 placeholder:text-neutral-700 focus:outline-none focus:border-primary-500 focus:ring-1 focus:ring-primary-500 transition-colors" 
            />

            <textarea 
              id="descricao" 
              value={formData.descricao} 
              onChange={handleChange} 
              required 
              rows="6" 
              placeholder="Requisitos"
              className="w-full bg-white border border-neutral-300 px-4 py-4 text-neutral-900 placeholder:text-neutral-700 focus:outline-none focus:border-primary-500 focus:ring-1 focus:ring-primary-500 transition-colors resize-none" 
            />

            <input 
              id="cidade" 
              value={formData.cidade} 
              onChange={handleChange} 
              required 
              type="text" 
              placeholder="Cidade"
              className="w-full bg-white border border-neutral-300 px-4 py-4 text-neutral-900 placeholder:text-neutral-700 focus:outline-none focus:border-primary-500 focus:ring-1 focus:ring-primary-500 transition-colors" 
            />
          </div>

          <div className="mt-auto border-t border-neutral-200 bg-primary-50 px-5 py-5 flex gap-4 mt-8">
            <button 
              type="button"
              onClick={() => router.back()}
              className="flex-1 text-center py-4 text-primary-700 font-medium border border-primary-500 bg-white hover:bg-primary-50 transition-colors"
            >
              Cancelar
            </button>
            <button 
              type="submit" 
              className="flex-1 text-center py-4 text-white font-medium bg-primary-700 hover:bg-primary-600 transition-colors"
            >
              Publicar Vaga
            </button>
          </div>
        </form>
      </main>
    </div>
  );
}
