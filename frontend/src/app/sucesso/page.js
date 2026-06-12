"use client";
import { CheckCircleIcon } from "@heroicons/react/24/solid";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function TelaSucesso() {
  const router = useRouter();

  return (
    <div className="bg-[#ffffff] font-sans min-h-screen flex flex-col p-5 relative">
      <div className="flex-1 flex flex-col items-center justify-center max-w-sm mx-auto w-full text-center">
        
        <div className="w-32 h-32 bg-[#22c55e] rounded-full flex items-center justify-center mb-8 shadow-md">
          <CheckCircleIcon className="w-20 h-20 text-white" />
        </div>

        <h1 className="text-3xl font-bold text-neutral-900 mb-5 tracking-tight">Ação Concluída!</h1>
        
        <p className="text-neutral-600 mb-10 leading-relaxed px-4 text-base font-medium">
          Tudo certo. Os dados foram salvos com sucesso e já estão no sistema.
        </p>
      </div>

      <div className="w-full max-w-md mx-auto mt-auto pb-4">
        <button 
          onClick={() => {
            const role = localStorage.getItem("role");
            if (role === "empresa") {
              router.push("/empresa/dashboard");
            } else {
              router.push("/");
            }
          }}
          className="w-full py-4 rounded-xl font-bold text-white bg-primary-600 hover:bg-primary-700 transition-colors shadow-sm"
        >
          Voltar para o Painel
        </button>
      </div>
    </div>
  );
}
