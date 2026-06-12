"use client";
import { useState } from "react";
import { EyeIcon, EyeSlashIcon } from "@heroicons/react/24/outline";
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
    setFormData({...formData, [e.target.id]: e.target.value});
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    if(tab === "login") {
      const loginEndpoint = perfil === "empresa" ? "/auth/login/empresa" : "/auth/login/candidato";
      const loginPayload = perfil === "empresa" ? {
        cnpj: formData.doc,
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
      cnpj: formData.doc,
      senha: formData.senha
    } : {
      nome: formData.nome,
      cpf: formData.doc,
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
    <div className="flex-1 flex flex-col p-5 bg-primary-50 font-sans antialiased min-h-screen">
      <div className="flex-1 flex flex-col justify-center w-full max-w-md mx-auto pt-12 pb-8">
        
        <div className="mb-6 text-center">
          <h1 className="text-4xl font-bold text-neutral-900 tracking-tight">Trampou</h1>
        </div>

        {error && (
          <div className="bg-red-50 text-red-600 border border-red-200 p-4 rounded-lg mb-6 text-sm font-medium">
            {error}
          </div>
        )}

        <div className="flex border-b border-neutral-300 mb-6">
          <button onClick={() => setTab("login")} className={`flex-1 pb-3 text-base font-semibold text-center border-b-2 transition-colors ${tab === "login" ? "border-neutral-900 text-neutral-900" : "border-transparent text-neutral-600 hover:text-neutral-900"}`}>Login</button>
          <button onClick={() => setTab("cadastro")} className={`flex-1 pb-3 text-base font-semibold text-center border-b-2 transition-colors ${tab === "cadastro" ? "border-neutral-900 text-neutral-900" : "border-transparent text-neutral-600 hover:text-neutral-900"}`}>Cadastro</button>
        </div>

        <div className="flex mb-8 rounded-md overflow-hidden">
          <button onClick={() => setPerfil("candidato")} className={`flex-1 py-3 font-semibold text-sm transition-colors ${perfil === "candidato" ? "bg-neutral-900 text-white" : "bg-[#f5e6e3] text-neutral-600 hover:bg-[#ebd5d0]"}`}>Sou Candidato</button>
          <button onClick={() => setPerfil("empresa")} className={`flex-1 py-3 font-semibold text-sm transition-colors ${perfil === "empresa" ? "bg-neutral-900 text-white" : "bg-[#f5e6e3] text-neutral-600 hover:bg-[#ebd5d0]"}`}>Sou Empresa</button>
        </div>

          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            {tab === "cadastro" && (
              <div>
                <label htmlFor="nome" className="block text-sm font-medium text-neutral-900 mb-1">
                  {perfil === "empresa" ? "Razão Social" : "Nome Completo"}
                </label>
                <input id="nome" value={formData.nome} onChange={handleChange} required type="text" className="w-full bg-neutral-50 border border-neutral-300 rounded-lg px-4 py-2.5 text-neutral-900 focus:outline-none focus:border-primary-500 focus:ring-1 focus:ring-primary-500 transition-colors" />
              </div>
            )}

            {tab === "cadastro" && (
              <div>
                <label htmlFor="doc" className="block text-sm font-medium text-neutral-900 mb-1">
                  {perfil === "empresa" ? "CNPJ" : "CPF"}
                </label>
                <input id="doc" value={formData.doc} onChange={handleChange} required type="text" className="w-full bg-neutral-50 border border-neutral-300 rounded-lg px-4 py-2.5 text-neutral-900 focus:outline-none focus:border-primary-500 focus:ring-1 focus:ring-primary-500 transition-colors" />
              </div>
            )}

            <div>
              <label htmlFor="email" className="block text-sm font-medium text-neutral-900 mb-1">E-mail</label>
              <input id="email" value={formData.email} onChange={handleChange} required type="email" className="w-full bg-white border border-neutral-300 rounded-lg px-4 py-3 text-neutral-900 focus:outline-none focus:border-primary-500 focus:ring-1 focus:ring-primary-500 transition-colors" />
            </div>

            <div className="relative mb-2">
              <label htmlFor="senha" className="block text-sm font-medium text-neutral-900 mb-1">Senha</label>
              <input id="senha" value={formData.senha} onChange={handleChange} required type={showPassword ? "text" : "password"} className="w-full bg-white border border-neutral-300 rounded-lg px-4 py-3 pr-12 text-neutral-900 focus:outline-none focus:border-primary-500 focus:ring-1 focus:ring-primary-500 transition-colors" />
              <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-[38px] text-neutral-600 hover:text-neutral-900">
                {showPassword ? <EyeSlashIcon className="w-5 h-5" /> : <EyeIcon className="w-5 h-5" />}
              </button>
            </div>
            
            <div className="flex justify-end pt-1">
              <a href="/auth/recuperar-senha" className="text-sm font-medium text-[#000000] hover:underline cursor-pointer">
                Esqueci a senha
              </a>
            </div>

            <button type="submit" className="w-full bg-neutral-900 text-white font-semibold py-4 rounded-lg hover:bg-neutral-800 transition-colors">
              {tab === "login" ? "Entrar" : "Cadastrar"}
            </button>
          </form>
      </div>
    </div>
  );
}
