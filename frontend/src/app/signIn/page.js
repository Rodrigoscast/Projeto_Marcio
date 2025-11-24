"use client";
import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import { useRouter } from "next/navigation";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useUser } from "@/contexts/UserContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Link from "next/link";
import Image from "next/image";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";

export default function SignIn() {
  const [login, setLogin] = useState("");
  const [senha, setSenha] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const { refreshUser } = useUser();
  const router = useRouter();

  const [open, setOpen] = useState(false);
  const [email, setEmail] = useState("");
  const [carregando, setCarregando] = useState(false);

 // 1) LOGIN: receba o evento e faça preventDefault
async function handleLogin(e) {
  e.preventDefault();
  setLoading(true);
  try {
      // faz login
      const resp = await fetch(`${process.env.NEXT_PUBLIC_BACKEND}/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email:login, password: senha }),
      });

      const data = await resp.json();

      if (!resp.ok) {
        toast.error(data?.detail || "Falha no login");
        return;
      }

      const token = data?.access_token;
      if (!token) {
        toast.error("Token não retornado.");
        return;
      }

      // guarda o token
      localStorage.setItem("token", token);

      // consulta /users/me
      const meResp = await fetch(`${process.env.NEXT_PUBLIC_BACKEND}/users/me`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      const me = await meResp.json();

      if (!meResp.ok) {
        toast.error("Não foi possível carregar dados do usuário.");
        return;
      }

      // decide rota com base no tipo
      toast.success("Login realizado!");
      if (me.tipo === 2) {
        router.push("/inicio");
      } else {
        router.push("/inicio");
      }
    } catch (err) {
      toast.error("Erro de conexão com servidor.");
    } finally {
      setLoading(false);
    }
}

// 2) ESQUECI SENHA: não use 'e' (você chama via onClick)
async function enviarEmail() {
  if (!email) return;
  setCarregando(true);
  try {
    const resp = await fetch(`${process.env.NEXT_PUBLIC_BACKEND}/auth/forgot-password`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "ngrok-skip-browser-warning": "1",
      },
      body: JSON.stringify({ email }),
    });
    const data = await resp.json();
    if (resp.ok) {
      toast.success(data?.mensagem || "Email enviado com sucesso. Verifique sua caixa de entrada.");
      setOpen(false);
    } else {
      toast.error(data?.error || "Não foi possível enviar o email.");
    }
  } catch {
    toast.error("Erro ao enviar email.");
  } finally {
    setCarregando(false);
  }
}


  async function enviarEmail() {
    if (e) e.preventDefault();
    if (!email) return;
    setCarregando(true);
    try {
      const resp = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND}/auth/forgot-password`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "ngrok-skip-browser-warning": "1",
          },
          body: JSON.stringify({ email }),
        }
      );
      const data = await resp.json();
      if (resp.ok) {
        toast.success(
          data?.mensagem ||
            "Email enviado com sucesso. Verifique sua caixa de entrada."
        );
        setOpen(false);
      } else {
        toast.error(data?.error || "Não foi possível enviar o email.");
      }
    } catch {
      toast.error("Erro ao enviar email.");
    } finally {
      setCarregando(false);
    }
  }

  function IcyPatternBG() {
    return (
      <div aria-hidden className="absolute inset-0 overflow-hidden">
        {/* base: radial branca/gelo */}
        <div
          className="absolute inset-0"
          style={{
            background:
              "radial-gradient(circle at 50% 20%, #ffffff 0%, #f7fbff 45%, #ecf5ff 80%)",
          }}
        />
        {/* glows frios (ciano/turquesa) suaves */}
        <div
          className="pointer-events-none absolute -left-1/4 top-1/2 h-[120vh] w-[120vh] -translate-y-1/2 rounded-full blur-3xl opacity-50"
          style={{
            background:
              "radial-gradient(closest-side, rgba(34,211,238,0.18), rgba(34,211,238,0.06) 40%, transparent 70%)",
          }}
        />
        <div
          className="pointer-events-none absolute right-[-20%] top-[15%] h-[70vh] w-[70vh] rounded-full blur-3xl opacity-40"
          style={{
            background:
              "radial-gradient(closest-side, rgba(20,184,166,0.16), rgba(20,184,166,0.05) 40%, transparent 70%)",
          }}
        />
        {/* linhas diagonais turquesa */}
        <svg
          className="pointer-events-none absolute inset-0 h-full w-full opacity-[0.12]"
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            <pattern
              id="icy-lines"
              width="40"
              height="40"
              patternUnits="userSpaceOnUse"
              patternTransform="rotate(45)"
            >
              <line
                x1="0"
                y1="0"
                x2="0"
                y2="40"
                stroke="#06b6d4"
                strokeWidth="1"
              />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#icy-lines)" />
        </svg>
      </div>
    );
  }

  return (
    <section className="relative isolate min-h-screen overflow-hidden text-slate-800">
      <IcyPatternBG />

      {/* container centralizado */}
      <div className="relative z-10 mx-auto grid min-h-screen w-full max-w-7xl place-items-center px-6 py-12 md:px-10">
        {/* Card do formulário - claro, minimalista */}
        <form
          onSubmit={handleLogin}
          className="w-full max-w-sm rounded-2xl border border-slate-200 bg-white/80 backdrop-blur p-6 md:p-8 shadow-xl"
        >
          <h1 className="text-xl font-semibold text-slate-900">Bem-vindo!</h1>
          <p className="mt-1 text-sm text-slate-600">Entre para continuar</p>

          {/* login */}
          <label className="mt-6 block">
            <span className="sr-only">Email ou usuário</span>
            <input
              type="text"
              placeholder="Email ou usuário"
              value={login}
              onChange={(e) => setLogin(e.target.value)}
              required
              className="h-11 w-full rounded-lg bg-white border border-slate-300 px-3 text-slate-900 placeholder-slate-400 outline-none focus:border-[#1B2A49] focus:ring-1 focus:ring-[#1B2A49] transition"
            />
          </label>

          {/* senha */}
          <label className="mt-4 block relative">
            <span className="sr-only">Senha</span>
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Senha"
              value={senha}
              onChange={(e) => setSenha(e.target.value)}
              required
              className="h-11 w-full rounded-lg bg-white border border-slate-300 px-3 pr-10 text-slate-900 placeholder-slate-400 outline-none focus:border-[#1B2A49] focus:ring-1 focus:ring-[#1B2A49] transition"
            />
            <button
              type="button"
              aria-label={showPassword ? "Ocultar senha" : "Mostrar senha"}
              className="absolute inset-y-0 right-2 my-auto inline-flex h-8 w-8 items-center justify-center rounded-md text-[#1B2A4] hover:text-slate-700"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? <Eye /> : <EyeOff />}
            </button>
          </label>

          {/* esqueci senha */}
          <div className="mt-2 w-full text-right">
            <button
              type="button"
              onClick={() => setOpen(true)}
              className="text-xs text-[#1B2A4] hover:text-cyan-900 underline-offset-4 hover:underline"
            >
              Esqueci minha senha
            </button>
          </div>

          {/* submit */}
          <button
            type="submit"
            disabled={loading}
            className={`mt-6 h-11 w-full rounded-lg font-medium text-white transition ${
              loading
                ? "bg-cyan-900 cursor-not-allowed"
                : "bg-[#1B2A49] hover:bg-cyan-700 active:bg-cyan-800"
            }`}
          >
            {loading ? "Entrando..." : "Entrar"}
          </button>
          <div className="mt-3 text-center text-xs text-slate-600">
            Ainda não tem login?{" "}
            <Link
              href="/signUp" // ajuste a rota se for diferente
              className="font-medium text-[#1B2A4] hover:text-cyan-900 underline-offset-4 hover:underline"
            >
              Cadastre-se
            </Link>
          </div>
        </form>
      </div>

      {/* dialog de esqueci senha */}
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Esqueci minha senha</DialogTitle>
            <DialogDescription>
              Informe seu e-mail para receber o link de redefinição.
            </DialogDescription>
          </DialogHeader>

          <Input
            type="email"
            placeholder="email@exemplo.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          <div className="w-full flex justify-end gap-4 pt-4">
            <Button onClick={enviarEmail} disabled={carregando || !email}>
              {carregando ? "Enviando..." : "Enviar"}
            </Button>
            <Button variant="secondary" onClick={() => setOpen(false)}>
              Cancelar
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      <ToastContainer position="top-right" autoClose={3000} />
      {/* divisor minimalista */}
      <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-cyan-400/40 to-transparent" />
    </section>
  );
}
