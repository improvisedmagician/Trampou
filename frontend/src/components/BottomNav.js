"use client";
import { BriefcaseIcon, BellIcon, UserIcon, HomeIcon } from "@heroicons/react/24/solid";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

export default function BottomNav() {
  const pathname = usePathname();
  const [role, setRole] = useState(null);

  useEffect(() => {
    setRole(localStorage.getItem("role"));
  }, [pathname]); // Re-check role on navigation

  // Define which paths should show the bottom nav
  const showOnPaths = ["/", "/empresa/dashboard", "/notificacoes", "/candidato/perfil", "/candidato/vagas"];
  if (!showOnPaths.includes(pathname)) return null;

  const isActive = (path) => pathname === path;

  // Determine Vagas link based on role
  const vagasLink = role === "empresa" ? "/empresa/dashboard" : "/candidato/vagas";
  const isVagasActive = isActive("/empresa/dashboard") || isActive("/candidato/vagas");
  
  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-neutral-200 py-3 px-6 flex justify-between items-center max-w-md mx-auto shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.05)] z-50">
      <Link href="/" className={`flex flex-col items-center gap-1 ${isActive("/") ? "text-[#f27918]" : "text-neutral-400 hover:text-[#f27918]"}`}>
        <HomeIcon className="w-6 h-6" />
        <span className="text-[10px] font-semibold uppercase tracking-wider">Início</span>
      </Link>
      
      <Link href={vagasLink} className={`flex flex-col items-center gap-1 ${isVagasActive ? "text-[#f27918]" : "text-neutral-400 hover:text-[#f27918]"}`}>
        <BriefcaseIcon className="w-6 h-6" />
        <span className="text-[10px] font-semibold uppercase tracking-wider">Vagas</span>
      </Link>
      
      <Link href="/notificacoes" className={`flex flex-col items-center gap-1 relative ${isActive("/notificacoes") ? "text-[#f27918]" : "text-neutral-400 hover:text-[#f27918]"}`}>
        <BellIcon className="w-6 h-6" />
        {/* Fake unread dot */}
        <div className="absolute top-0 right-1 w-2 h-2 bg-[#f27918] rounded-full border border-white"></div>
        <span className="text-[10px] font-semibold uppercase tracking-wider">Notificações</span>
      </Link>
      
      <Link href="/candidato/perfil" className={`flex flex-col items-center gap-1 ${isActive("/candidato/perfil") ? "text-[#f27918]" : "text-neutral-400 hover:text-[#f27918]"}`}>
        <UserIcon className="w-6 h-6" />
        <span className="text-[10px] font-semibold uppercase tracking-wider">Perfil</span>
      </Link>
    </div>
  );
}
