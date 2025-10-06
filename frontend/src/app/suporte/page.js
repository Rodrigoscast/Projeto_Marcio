"use client";

import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Loader2 } from "lucide-react";

export default function ChatSuporte() {
  const router = useRouter();
  const [mensagens, setMensagens] = useState([
    {
      role: "assistant",
      content: "Olá! Sou o suporte da Pé Gostoso 👣, em que posso ajudar?",
    },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);

  // callback ref (função) — evita problemas com forwarding/ref inválido
  const endRef = useRef(null);
  const setEndRef = (el) => {
    endRef.current = el;
  };

  const scrollToBottom = () => {
    // se o sentinel existir, usa scrollIntoView
    if (endRef.current && endRef.current.scrollIntoView) {
      endRef.current.scrollIntoView({ behavior: "smooth", block: "end" });
    }
  };

  useEffect(() => {
    // sempre que mensagens/loading mudarem, desce o scroll
    scrollToBottom();
  }, [mensagens, loading]);

  const enviarMensagem = async () => {
    if (!input.trim() || loading) return;

    const pergunta = input;
    setMensagens((prev) => [...prev, { role: "user", content: pergunta }]);
    setInput("");
    setLoading(true);

    const token = localStorage.getItem("token");
    if (!token) {
      router.push("/login");
      setLoading(false);
      return;
    }

    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND}/ia/chat`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ pergunta }),
      });

      if (!res.ok) throw new Error("network");

      const data = await res.json();

      if (!data) throw new Error("no-data");

      // extração segura da resposta (caso backend retorne objeto/array)
      let textoResposta = "";
      if (typeof data.resposta === "string") {
        textoResposta = data.resposta;
      } else if (data.resposta && typeof data.resposta === "object") {
        // tenta pegar campos comuns
        textoResposta =
          data.resposta.resposta ??
          data.resposta.mensagem ??
          (Array.isArray(data.resposta) ? data.resposta.join(" ") : JSON.stringify(data.resposta));
      } else {
        textoResposta = String(data.resposta);
      }

      setMensagens((prev) => [
        ...prev,
        { role: "assistant", content: textoResposta },
      ]);
    } catch (err) {
      setMensagens((prev) => [
        ...prev,
        { role: "assistant", content: "❌ Erro ao conectar com o suporte." },
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full p-4">
      <div className="p-4 flex flex-col w-full shadow-lg rounded-2xl bg-card h-[85vh]">
        <ScrollArea className="flex-1 pr-2">
          <div className="flex flex-col gap-3 p-2">
            {mensagens.map((msg, i) => (
              <div
                key={i}
                className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
              >
                <div
                  className={`px-4 py-2 rounded-2xl max-w-[75%] text-sm ${msg.role === "user"
                      ? "bg-blue-500 text-white rounded-br-none"
                      : "bg-gray-200 text-gray-900 rounded-bl-none"
                    }`}
                >
                  {msg.content}
                </div>
              </div>
            ))}

            {loading && (
              <div className="flex justify-start">
                <div className="px-4 py-2 rounded-2xl bg-gray-200 text-gray-900 flex items-center gap-2">
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Pensando...
                </div>
              </div>
            )}

            {/* sentinel usando callback ref (função) — garante validade do `ref` */}
            <div ref={setEndRef} />
          </div>
        </ScrollArea>

        <div className="flex gap-2 mt-4">
          <Input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Digite sua mensagem..."
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.preventDefault();
                enviarMensagem();
              }
            }}
          />
          <Button onClick={enviarMensagem} disabled={loading || !input.trim()}>
            {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : "Enviar"}
          </Button>
        </div>
      </div>
    </div>
  );
}
