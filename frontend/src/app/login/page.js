'use client';

import { useEffect, useState } from 'react';
import { Eye, EyeOff } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useUser } from '@/contexts/UserContext';
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input';

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogTrigger
} from "@/components/ui/dialog"

export default function Home() {
  const [login, setLogin] = useState('');
  const [senha, setSenha] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const { refreshUser } = useUser();
  const [open, setOpen] = useState(false);
  const [email, setEmail] = useState("");
  const [carregando, setCarregando] = useState(false);

  const handleLogin = async (e) => {
    if (e) e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          email : login, 
          password: senha 
        }),
      });

      const data = await response.json();

      if (response.ok) {
        if (data.access_token) {
          localStorage.setItem('token', data.access_token);
        }
        await refreshUser();
        toast.success("Login feito com sucesso")
        router.push('/inicio') //Leva para a página inicial após o login
      } else {
        toast.error(data?.error || 'Usuário ou senha inválidos');
      }
    } catch (error) {
      toast.error('Erro ao conectar com o servidor.');
    } finally {
      setLoading(false);
    }
  };

  const enviarEmail = async (e) => { // Função para enviar o email de recuperação
    if (e) e.preventDefault();
    setCarregando(true);
    toast.success(data.mensagem || "Email enviado com sucesso. Verifique sua caixa de entrada.");
    setCarregando(false);    
    setLoading(false);
  };

  return (
    <div className="relative w-screen h-screen flex items-center justify-center">
      <ToastContainer position="top-right" autoClose={3000} />
      <div
        className="absolute inset-0 bg-cover bg-center blur-[3px]"
        style={{ backgroundImage: "url('/background.webp')" }}
      ></div>

      <form
        onSubmit={handleLogin}
        className="relative z-10 bg-white/90 p-8 rounded-2xl shadow-2xl flex flex-col items-center w-80"
      >
        <h1 className="text-2xl font-bold mb-2 text-gray-800">Bem Vindo!</h1>
        <h2 className="text-md mb-6 text-gray-600">Faça Login para continuar</h2>

        <input
          type="text"
          placeholder="Email ou Usuário"
          value={login}
          onChange={(e) => setLogin(e.target.value)}
          className="w-full p-2 mb-4 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-500 text-black placeholder-gray-500"
        />

        <div className="w-full relative">
          <input
            type={showPassword ? 'text' : 'password'}
            placeholder="Senha"
            value={senha}
            onChange={(e) => setSenha(e.target.value)}
            className="w-full p-2 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-500 text-black placeholder-gray-500"
          />
          <button
            type="button"
            className="absolute right-2 top-2 text-gray-600 hover:text-gray-800"
            onClick={() => setShowPassword(!showPassword)}
          >
            {showPassword ? <Eye /> : <EyeOff />}
          </button>
        </div>

        <div className="w-full flex justify-end">
          <button
            type="button"
            className="text-gray-500 hover:text-gray-700 cursor-pointer my-1"
            onClick={() => {setOpen(true)}}
          >
            Esqueci Minha Senha
          </button>
        </div>

        <button
          type="submit"
          disabled={loading}
          className={`w-full text-white py-2 mt-5 rounded-md transition ${
            loading ? 'bg-gray-400 cursor-not-allowed' : 'bg-gray-800 hover:bg-gray-900 cursor-pointer'
          }`}
        >
          {loading ? 'Entrando...' : 'Entrar'}
        </button>
      </form>
      {open == true 
        ? (
          <Dialog open={open} onOpenChange={setOpen}>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Esqueci minha senha</DialogTitle>
                <DialogDescription>Informe seu e-mail ou usuário para receber o link de redefinição.</DialogDescription>
              </DialogHeader>

              <Input
                type="text"
                placeholder="email@exemplo.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />

              <div className="w-full flex justify-end gap-4 pt-4">
                <Button type="button" className='cursor-pointer' onClick={enviarEmail} disabled={carregando || !email}>
                  {carregando ? "Enviando..." : "Enviar"}
                </Button>
                <Button type="button" variant="secondary" className='cursor-pointer' onClick={() => setOpen(false)}>
                  Cancelar
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        ) : (
            <></>
        )
      }
    </div>
  );
}
