"use client";
import { CheckCircleIcon } from "@heroicons/react/24/solid";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function TelaSucesso() {
  const router = useRouter();

  return (
    <div className="bg-primary-50 font-sans min-h-screen flex flex-col p-5 relative">
      <div className="flex-1 flex flex-col items-center justify-center max-w-sm mx-auto w-full text-center">
        
        {/* White rounded box with golden checkmark */}
        <div className="w-24 h-24 bg-white rounded-2xl flex items-center justify-center mb-8 shadow-[0_0_40px_rgba(242,121,24,0.15)] border border-primary-100">
          <CheckCircleIcon className="w-14 h-14 text-primary-500" />
        </div>

        <h1 className="text-3xl font-bold text-primary-700 mb-5 tracking-tight">Ação Concluída!</h1>
        
        <p className="text-neutral-700 mb-10 leading-relaxed px-4 text-base font-medium">
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
          className="w-full py-4 rounded-md font-bold text-white bg-primary-700 hover:bg-primary-600 transition-colors shadow-sm"
        >
          Voltar para o Painel
        </button>
      </div>
    </div>
  );
}
