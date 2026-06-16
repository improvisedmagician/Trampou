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
    <div className="bg-primary-50 font-sans min-h-screen flex flex-col relative pb-20">
      <header className="bg-primary-50 px-4 py-4 flex items-center border-b border-neutral-200 sticky top-0 z-10">
        <button onClick={() => router.back()} className="mr-4 text-primary-700 p-2">
          <ArrowLeftIcon className="w-6 h-6" />
        </button>
        <h1 className="text-xl font-bold text-primary-700 flex-1 pr-10 text-center">Notificações</h1>
      </header>

      <main className="flex-1 w-full min-h-screen flex flex-col items-center">
        {loading ? (
          <div className="p-5 text-center text-neutral-500 w-full">A carregar notificações...</div>
        ) : (
          <div className="flex flex-col w-full max-w-2xl mx-auto">
            {notificacoes.map((notif, index) => {
              // Parse message to get icon and title
              const msg = notif.mensagem.toLowerCase();
              let Icon = BellIcon;
              let titulo = "Notificação";

              if (msg.includes("candidatura") || msg.includes("candidato")) {
                Icon = BellIcon;
                titulo = "Nova Candidatura";
              } else if (msg.includes("entrevista")) {
                Icon = EnvelopeIcon;
                titulo = "Convite para Entrevista";
              } else if (msg.includes("vaga")) {
                Icon = BriefcaseIcon;
                titulo = "Nova Vaga";
              } else if (msg.includes("conexão") || msg.includes("conexao") || msg.includes("aceitou")) {
                Icon = UserPlusIcon;
                titulo = "Nova Conexão";
              }

              // Parse date to a friendly string (mockup style)
              let dateStr = notif.data_criacao;
              if (dateStr && !dateStr.endsWith('Z')) {
                // Ensure the browser interprets the naive datetime from the DB as UTC
                dateStr += 'Z';
              }
              const date = new Date(dateStr);
              const now = new Date();
              let diffMs = now - date;
              if (diffMs < 0) diffMs = 0; // Prevent negative times if slight clock sync differences
              
              const diffMins = Math.floor(diffMs / 60000);
              const diffHours = Math.floor(diffMins / 60);
              const diffDays = Math.floor(diffHours / 24);
              
              let timeStr = "agora";
              if (diffMins === 0) timeStr = "agora";
              else if (diffMins < 60) timeStr = `há ${diffMins} min`;
              else if (diffHours < 24) timeStr = `há ${diffHours} hora${diffHours > 1 ? 's' : ''}`;
              else if (diffDays === 1) timeStr = "ontem";
              else timeStr = `há ${diffDays} dias`;

              return (
                <div 
                  key={notif.id} 
                  onClick={() => !notif.lida ? markAsRead(notif.id) : null}
                  className={`flex items-start gap-4 p-5 cursor-pointer transition-colors ${notif.lida ? 'opacity-60' : 'hover:bg-primary-100'} ${index !== notificacoes.length - 1 ? "border-b border-neutral-200" : ""}`}
                >
                  <div className="pt-1 flex-shrink-0">
                    <Icon className="w-6 h-6 text-primary-500" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-base font-bold text-primary-700 mb-1">{titulo}</h3>
                    <p className="text-sm text-neutral-600 leading-snug pr-2">{notif.mensagem}</p>
                  </div>
                  <div className="flex flex-col items-end gap-2 pt-1 flex-shrink-0">
                    <span className="text-sm text-neutral-500 text-right whitespace-nowrap">
                      {timeStr}
                    </span>
                    {!notif.lida && (
                      <div className="w-2.5 h-2.5 rounded-full bg-primary-500 mt-1"></div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </main>
    </div>
  );
}
