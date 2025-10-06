from pydantic import BaseModel
import os
import time
from groq import Groq

client = Groq(api_key=os.getenv("GROQ_API_KEY"))

contexto = """
A Pé Gostoso Calçados & Conforto Ltda. chamada carinhosamente de Pé Gostoso nasceu em 2021 em Blumenau — SC, 
hoje somos uma marca nacional que fabrica calçados, palmilhas anatômicas e acessórios voltados ao bem-estar dos pés, 
com foco em design ergonômico e materiais sustentáveis. Nosso carro-chefe é o tênis Pé Gostoso Urban (R$ 249,90), 
que combina sola amortecida com camada de espuma reciclada e vem com 18 meses de garantia contra defeitos de fabricação; 
além disso oferecemos a linha HomeRelax (pantufas com aquecimento por microfibra) e palmilhas ortopédicas personalizadas 
sob medida a partir de R$ 89,90. Também lançamos o app Pé Tracker, um plano gratuito para registro de caminhadas e dicas de 
cuidados e uma assinatura Pé+ (R$ 9,90/mês) com avaliações de postura, lembretes de alongamento e descontos exclusivos. 
Nosso horário de atendimento ao cliente é de segunda a sábado, das 9h às 20h; fale com o time pelo e-mail contato@pegostoso.com, 
pelo telefone (47) 4002-2020 ou pelo WhatsApp +55 47 98888-2020 — temos chat humano em até 2 horas úteis e suporte especializado 
com fisioterapeuta para clientes Pro. Entregamos para todo o Brasil com prazos que variam de 2 a 10 dias úteis e opções de frete expresso; 
embalagens são 100% recicláveis e a cada compra doamos 1 par de meias para instituições locais. Nossa política de troca permite devolução 
em até 45 dias com nota fiscal e embalagem íntegra; ajustes de palmilha feitos em até 7 dias úteis nas lojas parceiras. A gestão é composta 
pelo CEO Eduardo Ramos, pela diretora de produto Marina Castro e pelo head de sustentabilidade Felipe Duarte; nossa fábrica em Santa Catarina 
emprega 120 pessoas e seguimos certificações de responsabilidade social. Aceitamos cartões (crédito e débito), boleto, transferência e PIX,
e oferecemos parcelamento em até 6x sem juros no cartão. Atualmente temos mais de 12 mil clientes ativos,
refletindo a combinação de conforto, estética e preço justo que buscamos entregar a cada passo.
"""

# Configuração inicial do sistema
BASE_SYSTEM_PROMPT = {
    "role": "system",
    "content": f"""
Você é um assistente profissional da empresa Pé Gostoso.
Use apenas as informações do contexto abaixo para responder.
Mantenha tom formal e educado e não invente informações.
Faça respostas curtas e diretas.
Se a pergunta estiver fora do contexto, responda: "Desculpe, não tenho essa informação."

Contexto da empresa:
{contexto}
"""
}

HISTORICO_MAX = 12
historico = [BASE_SYSTEM_PROMPT]
ultimo_tempo = time.time()  # marca inicial

def suporte_chat(pergunta: str) -> dict:
    global historico, ultimo_tempo

    agora = time.time()
    # se passaram mais de 5 min (300s), reseta histórico
    if agora - ultimo_tempo > 300:
        historico = [BASE_SYSTEM_PROMPT]

    ultimo_tempo = agora  # atualiza tempo da última interação

    historico.append({"role": "user", "content": pergunta})
    historico_relevante = historico[-HISTORICO_MAX:]

    resposta = client.chat.completions.create(
        model="llama-3.1-8b-instant",
        messages=historico_relevante,
        max_tokens=300
    )

    conteudo_resposta = resposta.choices[0].message.content
    historico.append({"role": "assistant", "content": conteudo_resposta})

    return {"resposta": conteudo_resposta}
