"use client";
import { BriefcaseIcon } from "@heroicons/react/24/outline";

export default function MinhasVagas() {
  return (
    <div className="bg-[#fff8f6] font-sans min-h-screen flex flex-col p-5">
      <header className="py-4 border-b border-neutral-100 flex items-center justify-between mb-8">
        <h1 className="text-xl font-bold text-neutral-900">Minhas Vagas</h1>
      </header>

      <main className="flex-1 max-w-md mx-auto w-full flex flex-col items-center justify-center text-center pb-20">
        <div className="w-20 h-20 bg-primary-100 rounded-full flex items-center justify-center mb-4 text-primary-500">
          <BriefcaseIcon className="w-10 h-10" />
        </div>
        <h2 className="text-lg font-bold text-neutral-900 mb-2">Ainda não tem candidaturas</h2>
        <p className="text-sm text-neutral-500 mb-6">Você ainda não se candidatou a nenhuma vaga. Explore o Mural de Vagas para encontrar a sua próxima oportunidade!</p>
        
        <a href="/" className="bg-primary-600 text-white px-6 py-3 rounded-lg font-bold hover:bg-primary-700 transition-colors">
          Explorar Vagas
        </a>
      </main>
    </div>
  );
}
