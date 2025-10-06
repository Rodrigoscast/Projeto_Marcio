import os
from groq import Groq

# Cria cliente Groq uma vez só
client = Groq(api_key=os.getenv("GROQ_API_KEY"))

def verificar_noticia(pergunta: str) -> str:
    """
    Usa a IA da Groq para verificar se a notícia é Fake, Boato, etc.
    Retorna apenas o texto da resposta.
    """
    completion = client.chat.completions.create(
        model="groq/compound",
        messages=[
            {
                "role": "system",
                "content": """Seu único objetivo é verificar se uma notícia é fake news ou não, 
                me retorne apenas uma das alternativas, exatamente nesse formato:

                Fake News! [Justificativa com fonte]
                Boato! [Justificativa com fonte]
                Informação Incompleta! [Justificativa com fonte]
                Informação Confiável! [Justificativa com fonte]
                
                confiável é se toda a informação for completamente verdade, incompleta é se algum detalhe importante tiver sido deixado de fora, 
                boato é se foi uma informação mal interpretada e fake news é se foi uma mentira feita para enganar"""
            },
            {"role": "user", "content": pergunta}
        ],
        temperature=1,
        max_completion_tokens=1024,
        top_p=1,
    )

    return completion.choices[0].message.content
