"use client";
import { useState } from "react";
import { EyeIcon, EyeSlashIcon, ArrowLeftIcon } from "@heroicons/react/24/outline";
import { useRouter } from "next/navigation";

export default function AuthPage() {
  const router = useRouter();
  const [tab, setTab] = useState("login");
  const [perfil, setPerfil] = useState("candidato");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  
  const [formData, setFormData] = useState({
    nome: "",
    doc: "",
    email: "",
    senha: ""
  });

  const handleChange = (e) => {
    let value = e.target.value;
    if (e.target.id === "doc") {
      value = value.replace(/\D/g, ""); // Remove tudo o que não é dígito
      if (perfil === "candidato") {
        if (value.length > 11) value = value.slice(0, 11);
        value = value.replace(/(\d{3})(\d)/, "$1.$2");
        value = value.replace(/(\d{3})(\d)/, "$1.$2");
        value = value.replace(/(\d{3})(\d{1,2})$/, "$1-$2");
      } else {
        if (value.length > 14) value = value.slice(0, 14);
        value = value.replace(/^(\d{2})(\d)/, "$1.$2");
        value = value.replace(/^(\d{2})\.(\d{3})(\d)/, "$1.$2.$3");
        value = value.replace(/\.(\d{3})(\d)/, ".$1/$2");
        value = value.replace(/(\d{4})(\d)/, "$1-$2");
      }
    }
    setFormData({...formData, [e.target.id]: value});
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    if(tab === "login") {
      const loginEndpoint = perfil === "empresa" ? "/auth/login/empresa" : "/auth/login/candidato";
      const loginPayload = perfil === "empresa" ? {
        cnpj: formData.doc.replace(/\D/g, ""),
        senha: formData.senha
      } : {
        email: formData.email,
        senha: formData.senha
      };

      try {
        const response = await fetch(`${'https://trampou-api.onrender.com'}${loginEndpoint}`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(loginPayload)
        });
        
        if(response.ok) {
          const data = await response.json();
          localStorage.setItem("token", data.access_token);
          localStorage.setItem("role", data.role);
          localStorage.setItem("user_id", data.user_id);
          localStorage.setItem("nome", data.nome);
          
          if (data.role === "empresa") {
            router.push("/empresa/dashboard");
          } else {
            router.push("/");
          }
        } else {
          const errorData = await response.json();
          setError(errorData.detail || "Dados inválidos.");
        }
      } catch(err) {
        console.error(err);
        setError("Erro de conexão ao servidor.");
      }
      return;
    }

    const endpoint = perfil === "empresa" ? "/empresas/" : "/candidatos/";
    
    const payload = perfil === "empresa" ? {
      razao_social: formData.nome,
      cnpj: formData.doc.replace(/\D/g, ""),
      senha: formData.senha
    } : {
      nome: formData.nome,
      cpf: formData.doc.replace(/\D/g, ""),
      email: formData.email,
      senha: formData.senha
    };

    try {
      const response = await fetch(`${'https://trampou-api.onrender.com'}${endpoint}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });
      
      if(response.ok) {
        alert("Conta criada com sucesso! Faça login para continuar.");
        setTab("login");
      } else {
        const errorData = await response.json();
        setError(errorData.detail || "Erro ao criar conta.");
      }
    } catch(err) {
      console.error(err);
      setError("Erro de conexão ao servidor.");
    }
  };

  return (
    <div className="flex-1 flex flex-col p-5 bg-primary-50 font-sans antialiased min-h-screen relative">
      <header className="absolute top-4 left-4 z-10">
        <button onClick={() => router.push("/")} className="text-primary-700 p-2 transition-colors flex items-center justify-center">
          <ArrowLeftIcon className="w-6 h-6" />
        </button>
      </header>

      <div className="flex-1 flex flex-col justify-center w-full max-w-sm mx-auto pt-12 pb-8">
        
        <div className="mb-10 text-center mt-8">
          <h1 className="text-4xl md:text-5xl font-bold text-primary-700 tracking-tight">Trampou</h1>
        </div>

        {error && (
          <div className="bg-red-50 text-red-600 border border-red-200 p-4 mb-6 text-sm font-medium">
            {error}
          </div>
        )}

        <div className="flex border-b border-neutral-300 mb-8">
          <button onClick={() => setTab("login")} className={`flex-1 pb-3 text-lg transition-colors ${tab === "login" ? "border-b-2 border-primary-700 text-primary-700 font-semibold" : "border-b-2 border-transparent text-primary-700 hover:border-neutral-400"}`}>Login</button>
          <button onClick={() => setTab("cadastro")} className={`flex-1 pb-3 text-lg transition-colors ${tab === "cadastro" ? "border-b-2 border-primary-700 text-primary-700 font-semibold" : "border-b-2 border-transparent text-primary-700 hover:border-neutral-400"}`}>Cadastro</button>
        </div>

        <div className="flex mb-8 bg-primary-100 p-0">
          <button onClick={() => setPerfil("candidato")} className={`flex-1 py-3.5 font-medium transition-colors ${perfil === "candidato" ? "bg-primary-700 text-white" : "text-primary-700 hover:bg-primary-200"}`}>Sou Candidato</button>
          <button onClick={() => setPerfil("empresa")} className={`flex-1 py-3.5 font-medium transition-colors ${perfil === "empresa" ? "bg-primary-700 text-white" : "text-primary-700 hover:bg-primary-200"}`}>Sou Empresa</button>
        </div>

          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            {/* Campo NOME (Apenas no cadastro) */}
            {tab === "cadastro" && (
              <div>
                <input id="nome" value={formData.nome} onChange={handleChange} required type="text" placeholder={perfil === "empresa" ? "Razão Social" : "Nome Completo"} className="w-full bg-white border border-primary-500 px-4 py-4 text-neutral-900 placeholder:text-neutral-700 focus:outline-none focus:ring-1 focus:ring-primary-500 transition-colors" />
              </div>
            )}

            {/* Campo DOC (CPF ou CNPJ) - Aparece no Cadastro para ambos, mas no Login só para Empresa */}
            {(tab === "cadastro" || (tab === "login" && perfil === "empresa")) && (
              <div>
                <input id="doc" value={formData.doc} onChange={handleChange} required type="text" placeholder={perfil === "empresa" ? "CNPJ" : "CPF"} className="w-full bg-white border border-primary-500 px-4 py-4 text-neutral-900 placeholder:text-neutral-700 focus:outline-none focus:ring-1 focus:ring-primary-500 transition-colors" />
              </div>
            )}

            {/* Campo EMAIL - Aparece no Cadastro para ambos, mas no Login só para Candidato */}
            {(tab === "cadastro" || (tab === "login" && perfil === "candidato")) && (
              <div>
                <input id="email" value={formData.email} onChange={handleChange} required type="email" placeholder="E-mail" className="w-full bg-white border border-primary-500 px-4 py-4 text-neutral-900 placeholder:text-neutral-700 focus:outline-none focus:ring-1 focus:ring-primary-500 transition-colors" />
              </div>
            )}

            <div className="relative mb-2">
              <input id="senha" value={formData.senha} onChange={handleChange} required type={showPassword ? "text" : "password"} placeholder="Senha" className="w-full bg-white border border-primary-500 px-4 py-4 pr-12 text-neutral-900 placeholder:text-neutral-700 focus:outline-none focus:ring-1 focus:ring-primary-500 transition-colors" />
              <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-4 top-[18px] text-primary-700 hover:text-primary-800">
                {showPassword ? <EyeSlashIcon className="w-5 h-5" /> : <EyeIcon className="w-5 h-5" />}
              </button>
            </div>
            
            {tab === "login" && (
              <div className="flex justify-end pt-1">
                <a href="/auth/recuperar-senha" className="text-sm font-medium text-primary-700 hover:underline cursor-pointer">
                  Esqueci a senha
                </a>
              </div>
            )}

            <div className="mt-8 mb-4">
              <button type="submit" className="w-full bg-primary-700 text-white font-medium py-4 hover:bg-primary-800 transition-colors">
                {tab === "login" ? "Entrar" : "Cadastrar"}
              </button>
            </div>
          </form>
      </div>
    </div>
  );
}
