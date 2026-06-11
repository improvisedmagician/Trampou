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
      const response = await fetch(((process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000')) + "/vagas/", {
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
    <div className="bg-neutral-50 font-sans min-h-screen pt-8 pb-20">
      <main className="px-5 max-w-2xl mx-auto w-full">
        <div className="flex items-center gap-4 mb-6">
          <Link href="/empresa/dashboard" className="p-2 hover:bg-neutral-200 rounded-full transition-colors">
            <ArrowLeftIcon className="w-5 h-5 text-neutral-600" />
          </Link>
          <h1 className="text-2xl font-bold text-neutral-900">Publicar Nova Vaga</h1>
        </div>

        {error && (
          <div className="bg-red-50 text-red-600 border border-red-200 p-4 rounded-lg mb-6 text-sm font-medium">
            {error}
          </div>
        )}

        <form id="vaga-form" onSubmit={handleSubmit} className="bg-white p-6 rounded-xl shadow-sm border border-neutral-100 flex flex-col gap-6">
          <div>
            <label htmlFor="titulo" className="block text-sm font-medium text-neutral-900 mb-1">Título da Vaga</label>
            <input id="titulo" value={formData.titulo} onChange={handleChange} required type="text" className="w-full bg-white border border-neutral-300 rounded-lg px-4 py-3 text-neutral-900 focus:outline-none focus:border-primary-500 focus:ring-1 focus:ring-primary-500 transition-colors" />
          </div>

          <div>
            <label htmlFor="salario" className="block text-sm font-medium text-neutral-900 mb-1">Salário (Opcional)</label>
            <input id="salario" value={formData.salario} onChange={handleChange} type="text" className="w-full bg-white border border-neutral-300 rounded-lg px-4 py-3 text-neutral-900 focus:outline-none focus:border-primary-500 focus:ring-1 focus:ring-primary-500 transition-colors" />
          </div>

          <div>
            <label htmlFor="descricao" className="block text-sm font-medium text-neutral-900 mb-1">Requisitos</label>
            <textarea id="descricao" value={formData.descricao} onChange={handleChange} required rows="4" className="w-full bg-white border border-neutral-300 rounded-lg px-4 py-3 text-neutral-900 focus:outline-none focus:border-primary-500 focus:ring-1 focus:ring-primary-500 transition-colors resize-none" />
          </div>

          <div>
            <label htmlFor="cidade" className="block text-sm font-medium text-neutral-900 mb-1">Cidade</label>
            <input id="cidade" value={formData.cidade} onChange={handleChange} required type="text" className="w-full bg-white border border-neutral-300 rounded-lg px-4 py-3 text-neutral-900 focus:outline-none focus:border-primary-500 focus:ring-1 focus:ring-primary-500 transition-colors" />
          </div>

          <div className="pt-4 border-t border-neutral-100 flex gap-4">
            <Link href="/empresa/dashboard" className="flex-1 text-center py-2.5 text-neutral-600 font-semibold border border-neutral-300 rounded-lg hover:bg-neutral-100 transition-colors">
              Cancelar
            </Link>
            <button type="submit" className="flex-1 bg-primary-600 text-white font-semibold py-2.5 rounded-lg hover:bg-primary-700 transition-colors">
              Publicar Vaga
            </button>
          </div>
        </form>
      </main>
    </div>
  );
}
