"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeftIcon } from "@heroicons/react/24/outline";

export default function RecuperarSenha() {
  const [email, setEmail] = useState("");
  const [success, setSuccess] = useState(false);
  const router = useRouter();

  const handleRecuperar = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch(((process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000')) + "/auth/recuperar-senha", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email }),
      });

      if (res.ok) {
        setSuccess(true);
      }
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="min-h-screen bg-[#FAFAFA] flex items-center justify-center p-6">
      <div className="w-full max-w-md bg-white rounded-xl shadow-sm border border-neutral-100 p-8 text-center">
        <h1 className="text-3xl font-bold text-[#000000] mb-2">Trampou</h1>
        <p className="text-neutral-500 mb-8">Recuperação de Senha</p>

        {success ? (
          <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg text-green-700">
            <p>Instruções enviadas para o seu e-mail com sucesso!</p>
            <button
              onClick={() => router.push("/auth")}
              className="mt-4 px-6 py-2 bg-[#000000] text-white rounded-lg font-medium hover:bg-[#1f2937] transition-colors w-full"
            >
              Voltar ao Login
            </button>
          </div>
        ) : (
          <form onSubmit={handleRecuperar} className="space-y-4">
            <Link href="/auth" className="flex items-center justify-center text-sm font-medium text-neutral-500 hover:text-neutral-700 transition-colors mb-4">
              <ArrowLeftIcon className="w-4 h-4 mr-2" />
              Voltar ao Login
            </Link>
            <div className="text-left">
              <label className="block text-sm font-medium text-neutral-700 mb-1">E-mail</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                placeholder="Insira o seu e-mail cadastrado"
                className="w-full p-3 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-[#f27918] focus:border-[#f27918] outline-none transition-all"
              />
            </div>

            <button
              type="submit"
              className="w-full py-3 bg-[#000000] text-white rounded-lg font-semibold hover:bg-[#1f2937] transition-all shadow-md active:scale-[0.98]"
            >
              Enviar Instruções
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
