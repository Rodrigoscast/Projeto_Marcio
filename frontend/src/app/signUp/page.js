"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Stethoscope, User, Eye, EyeOff } from "lucide-react";
import { useRouter } from "next/navigation";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";


const ROLE_MAP = {
  usuario: 1, // type 1
  medico: 2, // type 2 (auditoria)
};



export default function SignUp() {
  const router = useRouter();
  const [nome, setNome] = useState("");  
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [confirmar, setConfirmar] = useState("");
  const [showPass, setShowPass] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [role, setRole] = useState("usuario"); // "usuario" | "medico"
  const [loading, setLoading] = useState(false);

  const canSubmit = !!(email && senha && confirmar && senha === confirmar);

 async function handleSubmit(e) {
    e.preventDefault();

    if (!canSubmit) {
      toast.error("Preencha tudo corretamente.");
      return;
    }

    setLoading(true);
    try {
      const typeInt = ROLE_MAP[role];
      const resp = await fetch(`${process.env.NEXT_PUBLIC_BACKEND}/auth/register`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "ngrok-skip-browser-warning": "1",
        },
        body: JSON.stringify({ nome, email, password: senha, tipo: typeInt }),
      });

      const data = await resp.json();

      if (resp.ok) {
        // guarda token se vier
        if (data?.access_token) {
          try {
            localStorage.setItem("access_token", data.access_token);
          } catch {}
        }

        // tenta descobrir o tipo retornado pelo backend; fallback no selecionado no UI
        const tipoFromBackend =
          data?.user?.tipo ?? data?.tipo ?? data?.profile?.tipo ?? null;
        const tipo = Number.isInteger(tipoFromBackend) ? Number(tipoFromBackend) : typeInt;

        toast.success("Conta criada! Redirecionando…");
        router.push("/inicio");
      } else {
        toast.error(data?.detail || data?.error || "Não foi possível criar a conta.");
      }
    } catch (err) {
      toast.error("Erro ao conectar com o servidor.");
    } finally {
      setLoading(false);
    }
  }


  function IcyPatternBG() {
    return (
      <div aria-hidden className="absolute inset-0 overflow-hidden">
        {" "}
        <div
          className="absolute inset-0"
          style={{
            background:
              "radial-gradient(circle at 50% 20%, #ffffff 0%, #f7fbff 45%, #ecf5ff 80%)",
          }}
        />{" "}
        <div
          className="pointer-events-none absolute -left-1/4 top-1/2 h-[120vh] w-[120vh] -translate-y-1/2 rounded-full blur-3xl opacity-50"
          style={{
            background:
              "radial-gradient(closest-side, rgba(34,211,238,0.18), rgba(34,211,238,0.06) 40%, transparent 70%)",
          }}
        />{" "}
        <div
          className="pointer-events-none absolute right-[-20%] top-[15%] h-[70vh] w-[70vh] rounded-full blur-3xl opacity-40"
          style={{
            background:
              "radial-gradient(closest-side, rgba(20,184,166,0.16), rgba(20,184,166,0.05) 40%, transparent 70%)",
          }}
        />{" "}
        <svg
          className="pointer-events-none absolute inset-0 h-full w-full opacity-[0.12]"
          xmlns="http://www.w3.org/2000/svg"
        >
          {" "}
          <defs>
            {" "}
            <pattern
              id="icy-lines"
              width="40"
              height="40"
              patternUnits="userSpaceOnUse"
              patternTransform="rotate(45)"
            >
              {" "}
              <line
                x1="0"
                y1="0"
                x2="0"
                y2="40"
                stroke="#06b6d4"
                strokeWidth="1"
              />{" "}
            </pattern>{" "}
          </defs>{" "}
          <rect width="100%" height="100%" fill="url(#icy-lines)" />{" "}
        </svg>{" "}
      </div>
    );
  }
  return (
    <section className="relative isolate min-h-screen overflow-hidden text-slate-800">
      <IcyPatternBG />

      <div className="relative z-10 mx-auto grid min-h-screen w-full max-w-7xl place-items-center px-6 py-12 md:px-10">
        <form
          onSubmit={handleSubmit}
          className="w-full max-w-md rounded-2xl border border-slate-200 bg-white/80 backdrop-blur p-6 md:p-8 shadow-xl"
        >
         

          <h1 className="mt-4 text-xl font-semibold text-slate-900 text-center">
            Crie sua conta
          </h1>
          <p className="mt-1 text-sm text-slate-600 text-center">
            Defina seu perfil e dados de acesso
          </p>

          <div className="mt-6 space-y-2">
            <label className="text-sm font-medium text-slate-700">Nome</label>
            <input
              type="text"
              placeholder="Seu nome"
              value={nome}
              onChange={(e) => setNome(e.target.value)}
              required
              className="h-12 w-full rounded-lg bg-white border border-slate-300 px-3 text-slate-900 placeholder-slate-400 outline-none focus:border-[#1B2A49] focus:ring-1 focus:ring-[#1B2A49] transition"
            />
          </div>
          <div className="mt-6 space-y-2">
            <label className="text-sm font-medium text-slate-700">E-mail</label>
            <input
              type="email"
              placeholder="voce@exemplo.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="h-12 w-full rounded-lg bg-white border border-slate-300 px-3 text-slate-900 placeholder-slate-400 outline-none focus:border-[#1B2A49] focus:ring-1 focus:ring-[#1B2A49] transition"
            />
          </div>

          
          <div className="mt-4 space-y-2">
            <label className="text-sm font-medium text-slate-700">Senha</label>
            <div className="relative">
              <input
                type={showPass ? "text" : "password"}
                placeholder="••••••••"
                value={senha}
                onChange={(e) => setSenha(e.target.value)}
                required
                className="h-12 w-full rounded-lg bg-white border border-slate-300 px-3 pr-10 text-slate-900 placeholder-slate-400 outline-none focus:border-[#1B2A49] focus:ring-1 focus:ring-[#1B2A49] transition"
              />
              <button
                type="button"
                onClick={() => setShowPass(!showPass)}
                aria-label={showPass ? "Ocultar senha" : "Mostrar senha"}
                className="absolute inset-y-0 right-2 my-auto inline-flex h-8 w-8 items-center justify-center rounded-md text-slate-500 hover:text-slate-700"
              >
                {showPass ? <Eye /> : <EyeOff />}
              </button>
            </div>
          </div>

          
          <div className="mt-4 space-y-2">
            <label className="text-sm font-medium text-slate-700">
              Confirmar senha
            </label>
            <div className="relative">
              <input
                type={showConfirm ? "text" : "password"}
                placeholder="••••••••"
                value={confirmar}
                onChange={(e) => setConfirmar(e.target.value)}
                required
                className="h-12 w-full rounded-lg bg-white border border-slate-300 px-3 pr-10 text-slate-900 placeholder-slate-400 outline-none focus:border-[#1B2A49] focus:ring-1 focus:ring-[#1B2A49] transition"
              />
              <button
                type="button"
                onClick={() => setShowConfirm(!showConfirm)}
                aria-label={
                  showConfirm ? "Ocultar confirmação" : "Mostrar confirmação"
                }
                className="absolute inset-y-0 right-2 my-auto inline-flex h-8 w-8 items-center justify-center rounded-md text-slate-500 hover:text-slate-700"
              >
                {showConfirm ? <Eye /> : <EyeOff />}
              </button>
            </div>
            {senha && confirmar && senha !== confirmar && (
              <p className="text-xs text-rose-600">As senhas não conferem.</p>
            )}
          </div>

         
          <button
            type="submit"
            disabled={!canSubmit || loading}
            className={[
              "mt-6 h-12 w-full rounded-xl text-base font-semibold text-white transition",
              loading
                ? "bg-cyan-900 cursor-not-allowed"
                : "bg-[#1B2A49] hover:bg-[#1B2A49] active:bg-cyan-800",
            ].join(" ")}
          >
            {loading ? "Criando conta..." : "Continuar"}
          </button>

          
          <div className="relative my-5">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t border-slate-200" />
            </div>
            <div className="relative flex justify-center">
              <span className="bg-white/80 px-3 text-xs text-slate-500">
                ou
              </span>
            </div>
          </div>

         
          <div className="text-center text-sm text-slate-600">
            Já tem conta?{" "}
            <Link
              href="/signIn"
              className="font-medium text-[#1B2A49] hover:text-cyan-900 underline-offset-4 hover:underline"
            >
              Entrar
            </Link>
          </div>
        </form>
      </div>

      <ToastContainer position="top-right" autoClose={3000} />
      <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-cyan-400/40 to-transparent" />
    </section>
  );
}
