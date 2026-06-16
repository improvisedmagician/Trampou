"use client";
import { ArrowLeftIcon, BellIcon, EnvelopeIcon, BriefcaseIcon, UserPlusIcon, CheckCircleIcon, CalendarDaysIcon } from "@heroicons/react/24/solid";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function Notificacoes() {
  const router = useRouter();
  const [role, setRole] = useState(null);

  const [notificacoesCandidato, setNotificacoesCandidato] = useState([]);
  const [notificacoesEmpresa, setNotificacoesEmpresa] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const storedRole = localStorage.getItem("role");
    if (!storedRole) {
      router.push("/auth");
    } else {
      setRole(storedRole);
      const url = storedRole === "empresa" 
        ? 'https://trampou-api.onrender.com/notificacoes/empresa/me'
        : 'https://trampou-api.onrender.com/notificacoes/me';

      fetch(url, {
        headers: { "Authorization": `Bearer ${localStorage.getItem("token")}` }
      })
        .then(res => res.json())
        .then(data => {
          if(Array.isArray(data)) {
            if (storedRole === "empresa") {
              setNotificacoesEmpresa(data);
            } else {
              setNotificacoesCandidato(data);
            }
          } else {
            setNotificacoesEmpresa([]);
            setNotificacoesCandidato([]);
          }
          setLoading(false);
        })
        .catch(console.error);
    }
  }, [router]);

  const markAsRead = async (id) => {
    try {
      const url = role === "empresa" 
        ? `https://trampou-api.onrender.com/notificacoes/empresa/${id}/lida`
        : `https://trampou-api.onrender.com/notificacoes/${id}/lida`;

      await fetch(url, {
        method: "PUT",
        headers: { "Authorization": `Bearer ${localStorage.getItem("token")}` }
      });
      
      if (role === "empresa") {
        setNotificacoesEmpresa(prev => prev.map(n => n.id === id ? { ...n, lida: true } : n));
      } else {
        setNotificacoesCandidato(prev => prev.map(n => n.id === id ? { ...n, lida: true } : n));
      }
    } catch(err) {
      console.error(err);
    }
  };

  if (!role) return null;

  const notificacoes = role === "empresa" ? notificacoesEmpresa : notificacoesCandidato;

  return (
    <div className="bg-[#fff8f6] font-sans min-h-screen flex flex-col relative pb-20">
      <header className="bg-white px-4 py-4 flex items-center shadow-sm sticky top-0 z-10">
        <button onClick={() => router.back()} className="mr-4 text-neutral-900 hover:bg-neutral-100 p-2 rounded-full transition-colors">
          <ArrowLeftIcon className="w-6 h-6" />
        </button>
        <h1 className="text-xl font-bold text-neutral-900 flex-1 text-center pr-10">Notificações</h1>
      </header>

      <main className="flex-1 max-w-md md:max-w-3xl lg:max-w-5xl mx-auto w-full bg-white shadow-sm min-h-screen">
        {loading ? (
          <div className="p-5 text-center text-neutral-500">A carregar notificações...</div>
        ) : (
          <div className="flex flex-col">
            {notificacoes.map((notif, index) => (
              <div 
                key={notif.id} 
                onClick={() => !notif.lida ? markAsRead(notif.id) : null}
                className={`flex items-start gap-4 p-5 cursor-pointer ${notif.lida ? 'opacity-60' : ''} ${index !== notificacoes.length - 1 ? "border-b border-neutral-100" : ""}`}
              >
                <div className="bg-neutral-100 p-3 rounded-full flex-shrink-0">
                  {notif.icon || <BellIcon className="w-6 h-6 text-blue-500" />}
                </div>
                <div className="flex-1 pt-1">
                  <h3 className="text-base font-bold text-neutral-900 mb-1">{notif.titulo || "Atualização de Status"}</h3>
                  <p className="text-sm text-neutral-500 leading-snug pr-4">{notif.mensagem || notif.descricao}</p>
                </div>
                <div className="flex flex-col items-end gap-2 pt-1 flex-shrink-0">
                  <span className="text-xs text-neutral-400 font-medium text-right w-16">
                    {notif.tempo || new Date(notif.data_criacao).toLocaleDateString()}
                  </span>
                  {!notif.lida && (
                    <div className={`w-3 h-3 rounded-full ${role === "empresa" ? "bg-primary-500" : "bg-blue-600"}`}></div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
