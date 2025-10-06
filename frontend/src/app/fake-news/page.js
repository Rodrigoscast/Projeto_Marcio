"use client"; // use isso se estiver no App Router (app/)
import { useEffect, useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2, CheckCircle2, XCircle } from "lucide-react";

export default function FakeNewsChecker() {
  const [question, setQuestion] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!question.trim()) return;

    setLoading(true);
    setResult('');

    const token = localStorage.getItem('token')
    if (!token) {
      router.push('/login')
      return
    }

    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND}/ia/fake-news`, {
        method: 'POST',
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
          "pergunta": question
        })
      })

      if (!res.ok) throw new Error()

      const data = await res.json()

      if (!data) {
        throw new Error()
      }

      setResult(data.resposta);

    } catch (err) {
      console.error(err);
      setResult("error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (question === '') {
      setResult('')
    }
  }, [question])

  return (
    <div className="flex p-8 min-h-[89vh]">
      <Card className="w-full h-full shadow-xl rounded-2xl border-0">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-bold text-indigo-700 dark:text-indigo-300">
            Verificador de Fake News
          </CardTitle>
          <p className="text-gray-600 dark:text-gray-400 text-sm">
            Digite uma notícia ou informação e veja se ela é confiável.
          </p>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <Input
              type="text"
              placeholder="Ex: Vacina causa autismo?"
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
              className="p-6 text-base"
            />
            <Button type="submit" className={'cursor-pointer'} disabled={loading}>
              {loading ? (
                <Loader2 className="animate-spin mr-2 h-5 w-5" />
              ) : (
                "Verificar"
              )}
            </Button>
          </form>

          {result != '' && (
            <div className="mt-6 flex justify-center">
              {result.includes("Informação Confiável!") && (
                <div className="flex flex-col items-center text-green-600 dark:text-green-400">
                  <CheckCircle2 className="h-12 w-12 mb-2" />
                  <p className="font-semibold">Cotícia Confiável</p>
                  <p className="text-center">{result.match(/\[(.*?)\]/)[1]}</p>
                </div>
              )}
              {result.includes("Fake News!") && (
                <div className="flex flex-col items-center text-red-600 dark:text-red-400">
                  <XCircle className="h-12 w-12 mb-2" />
                  <p className="font-semibold">Fake News</p>
                  <p className="text-center">{result.match(/\[(.*?)\]/)[1]}</p>
                </div>
              )}
              {result.includes("Informação Incompleta!") && (
                <div className="flex flex-col items-center text-red-600 dark:text-red-400">
                  <XCircle className="h-12 w-12 mb-2" />
                  <p className="font-semibold">Informação Incompleta</p>
                  <p className="text-center">{result.match(/\[(.*?)\]/)[1]}</p>
                </div>
              )}
              {result.includes("Boato!") && (
                <div className="flex flex-col items-center text-red-600 dark:text-red-400">
                  <XCircle className="h-12 w-12 mb-2" />
                  <p className="font-semibold">Boato</p>
                  <p className="text-center">{result.match(/\[(.*?)\]/)[1]}</p>
                </div>
              )}
              {result === "error" && (
                <p className="text-red-500">Erro ao verificar. Tente novamente.</p>
              )}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
