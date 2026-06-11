"use client";
import { CheckCircleIcon } from "@heroicons/react/24/solid";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function TelaSucesso() {
  const router = useRouter();

  return (
    <div className="bg-[#fff8f6] font-sans min-h-screen flex flex-col items-center justify-center p-5 text-center">
      <div className="bg-white rounded-3xl p-8 max-w-sm w-full shadow-sm flex flex-col items-center border border-neutral-100">
        
        <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center mb-6 text-green-500">
          <CheckCircleIcon className="w-16 h-16" />
        </div>

        <h1 className="text-2xl font-bold text-neutral-900 mb-4">Ação Concluída!</h1>
        
        <p className="text-neutral-500 mb-10 leading-relaxed px-2">
          Tudo certo. Os dados foram salvos com sucesso e já estão no sistema.
        </p>

        <button 
          onClick={() => {
            const role = localStorage.getItem("role");
            if (role === "empresa") {
              router.push("/empresa/dashboard");
            } else {
              router.push("/");
            }
          }}
          className="w-full py-4 rounded-xl font-bold text-white bg-[#000000] hover:bg-[#1f2937] transition-colors shadow-sm"
        >
          Voltar para o Painel
        </button>
      </div>
    </div>
  );
}
