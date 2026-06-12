"use client";
import { ArrowLeftIcon, BellIcon, EnvelopeIcon, BriefcaseIcon, UserPlusIcon, CheckCircleIcon, CalendarDaysIcon } from "@heroicons/react/24/solid";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function Notificacoes() {
  const router = useRouter();
  const [role, setRole] = useState(null);

  const [notificacoesCandidato, setNotificacoesCandidato] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const storedRole = localStorage.getItem("role");
    if (!storedRole) {
      router.push("/auth");
    } else {
      setRole(storedRole);
      if (storedRole === "candidato") {
        fetch('https://trampou-api.onrender.com' + "/notificacoes/me", {
          headers: { "Authorization": `Bearer ${localStorage.getItem("token")}` }
        })
          .then(res => res.json())
          .then(data => {
            if(Array.isArray(data)) {
              setNotificacoesCandidato(data);
            } else {
              setNotificacoesCandidato([]);
            }
            setLoading(false);
          })
          .catch(console.error);
      } else {
        setLoading(false);
      }
    }
  }, [router]);

  const markAsRead = async (id) => {
    if (role !== "candidato") return;
    try {
      await fetch(`${'https://trampou-api.onrender.com'}/notificacoes/${id}/lida`, {
        method: "PUT",
        headers: { "Authorization": `Bearer ${localStorage.getItem("token")}` }
      });
      setNotificacoesCandidato(prev => prev.map(n => n.id === id ? { ...n, lida: true } : n));
    } catch(err) {
      console.error(err);
    }
  };

  const notificacoesEmpresa = [
    {
      id: 1,
      icon: <BellIcon className="w-6 h-6 text-primary-500" />,
      titulo: "Nova Candidatura",
      descricao: "Você recebeu uma nova candidatura para a vaga de Senior UI Designer...",
      tempo: "há 5 min",
      lida: false
    },
    {
      id: 2,
      icon: <EnvelopeIcon className="w-6 h-6 text-primary-500" />,
      titulo: "Convite para Entrevista",
      descricao: "A empresa TechCorp agendou uma entrevista com você para amanhã...",
      tempo: "há 2 horas",
      lida: false
    },
    {
      id: 3,
      icon: <BriefcaseIcon className="w-6 h-6 text-primary-500" />,
      titulo: "Nova Vaga Compatível",
      descricao: "Uma nova vaga de Diretor de Arte foi publicada na sua área de interesse.",
      tempo: "ontem",
      lida: true
    },
    {
      id: 4,
      icon: <UserPlusIcon className="w-6 h-6 text-primary-500" />,
      titulo: "Nova Conexão",
      descricao: "Maria Fernandes aceitou seu pedido de conexão na rede Trampou.",
      tempo: "há 2 dias",
      lida: true
    }
  ];

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

      <main className="flex-1 max-w-md mx-auto w-full bg-white shadow-sm min-h-screen">
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
