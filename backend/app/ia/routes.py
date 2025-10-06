from fastapi import APIRouter, HTTPException, Depends
from pydantic import BaseModel
from app.auth.dependencies import get_current_user, require_role
from app.services.fake_news import verificar_noticia
from app.services.suporte import suporte_chat

router = APIRouter(prefix="/ia", tags=["Inteligência Artificial"])

class PerguntaRequest(BaseModel):
    pergunta: str

@router.post("/fake-news")
def fake_news(
    req: PerguntaRequest,
    user: dict = Depends(require_role("authenticated"))
):
    try:
        resposta = verificar_noticia(req.pergunta)
        return {"resposta": resposta}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
        
@router.post("/chat")
def chat_route(
    req: PerguntaRequest,
    user: dict = Depends(require_role("authenticated"))
):
    try:
        resposta = suporte_chat(req.pergunta)
        return {"resposta": resposta}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))