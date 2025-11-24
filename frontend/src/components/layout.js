'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { ToastContainer, toast } from 'react-toastify'
import { AnimatePresence, motion } from 'framer-motion'
import { Moon, Sun, User } from 'lucide-react'
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Loader2Icon, Eye, EyeOff } from "lucide-react";
import { ThemeToggle } from '@/components/ThemeToggle'
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuItem,
  DropdownMenuSeparator
} from "@/components/ui/dropdown-menu"
import 'react-toastify/dist/ReactToastify.css'
import { useIsMobile } from "@/hooks/use-mobile";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogTrigger
} from "@/components/ui/dialog"
import { supabase } from '@/lib/supabaseClient'
import dynamic from "next/dynamic";

import { SidebarProvider, SidebarTrigger } from '@/components/ui/sidebar'
import { AppSidebar } from '@/components/app-sidebar'

import { usePathname } from 'next/navigation'

import { useUser} from "@/contexts/UserContext";

export default function Layout({ children }) {
  const { user, setUser } = useUser();
  const router = useRouter()
  const pathname = usePathname()
  const [urlsPermitidas, setUrlsPermitidas] = useState([])
  const [novaSenha, setNovaSenha] = useState(false)
  const [senhaButton, setSenhaButton] = useState(false); 
  const [confirmar, setConfirmar] = useState("");
  const [podeCadastrar, setPodeCadastrar] = useState(false);
  const [erro, setErro] = useState("");
  const [senha, setSenha] = useState("");
  const [showSenha, setShowSenha] = useState(false);
  const [showConfirmar, setShowConfirmar] = useState(false);
  const [isTop, setIsTop] = useState(true);
  const isMobile = useIsMobile();
  const [isMounted, setIsMounted] = useState(false)

  useEffect(() => {
    setIsMounted(true)
  }, [])

  useEffect(() => {
    const handleScroll = () => {
      setIsTop(window.scrollY === 0);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Verifica token e permissões
  useEffect(() => {
    const validarSessao = async () => {
      const token = localStorage.getItem('token')
      if (!token) {
        router.push('/signIn')
        return
      }

      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND}/users/me`, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        })

        if (!res.ok) throw new Error()

        const data = await res.json()

        if (!data) {
          throw new Error()
        }

      } catch (err) {
        toast.error('Sessão expirada. Faça login novamente.')
        localStorage.removeItem('token')
        router.push('/signIn')
      }
    }

    validarSessao()
  }, [router])

  const logout = async() => {
    const { error } = await supabase.auth.signOut()

    if(!error){
      localStorage.removeItem('token')
      router.push('/signIn')
    }    
  }

  if (!isMounted) return null

  return (
    <SidebarProvider>
      <div className="flex h-full bg-gray-100 dark:bg-sidebar text-gray-800 dark:text-gray-100 w-full">
        <AppSidebar permissoes={urlsPermitidas} />
        <div className="flex-1 flex flex-col">
        <header
          className={`sticky top-0 z-20 w-full flex justify-between items-center p-4 bg-white dark:bg-gray-800 shadow-md transition-transform duration-300 ${
            isMobile ? isTop ? "translate-y-0" : "-translate-y-full" : "translate-y-0"
          }`}
        >
            <SidebarTrigger className='cursor-pointer' />
            <div className="flex items-center gap-4">
              <ThemeToggle />

              {/* Dropdown do usuário */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <button className="rounded-full bg-gray-400 dark:bg-gray-200 w-10 h-10 flex items-center justify-center text-xl cursor-pointer">
                    <User className='text-white dark:text-black' />
                  </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuLabel>{user?.nome ?? 'Usuário'}</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={logout}>
                    Sair
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </header>
          <main className='h-full'>
            {children}
          </main>
        </div>
      </div>
      {novaSenha == true 
        ? (
          <Dialog open={novaSenha} onOpenChange={setNovaSenha}>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Cadastre sua nova senha</DialogTitle>
                <DialogDescription>
                  Defina sua senha que será usada a partir de agora
                </DialogDescription>
              </DialogHeader>

              <div className="grid gap-4 py-2">
                {/* Campo senha */}
                <div className="relative w-full">
                  <Input
                    type={showSenha ? "text" : "password"}
                    placeholder="Nova senha"
                    value={senha}
                    onChange={(e) => setSenha(e.target.value)}
                    className="pr-10"
                  />
                  <button
                    type="button"
                    className="absolute right-2 top-2 text-muted-foreground hover:text-foreground"
                    onClick={() => setShowSenha((prev) => !prev)}
                  >
                    {showSenha ? <Eye size={18} /> : <EyeOff size={18} />}
                  </button>
                </div>

                {/* Campo confirmar senha */}
                <div className="relative w-full">
                  <Input
                    type={showConfirmar ? "text" : "password"}
                    placeholder="Confirme a senha"
                    value={confirmar}
                    onChange={(e) => setConfirmar(e.target.value)}
                    className="pr-10"
                  />
                  <button
                    type="button"
                    className="absolute right-2 top-2 text-muted-foreground hover:text-foreground"
                    onClick={() => setShowConfirmar((prev) => !prev)}
                  >
                    {showConfirmar ? <Eye size={18} /> : <EyeOff size={18} />}
                  </button>
                </div>

                {erro && <p className="text-sm text-red-500 -mt-2">{erro}</p>}

                <p className="text-xs text-muted-foreground mt-2">
                  Esta senha é <strong className="text-red-500">definitiva</strong>, escolha com cuidado.
                </p>
              </div>

              <div className="w-full flex justify-end pt-4">
                {senhaButton ? (
                  <Button disabled>
                    <Loader2Icon className="animate-spin mr-2 h-4 w-4" />
                    Por favor, aguarde
                  </Button>
                ) : (
                  <Button type="button" onClick={handleCadastra} disabled={!podeCadastrar}>
                    Cadastrar
                  </Button>
                )}
              </div>
            </DialogContent>
          </Dialog>
        ) : (
            <></>
        )
    }
    </SidebarProvider>
  )
}
