from fastapi import APIRouter, HTTPException
from app.db import supabase
from .schemas import ProdutoBase, ProdutoOut, ProdutoUpdate, ProdutoCreate

router = APIRouter(prefix="/produtos", tags=["Produtos"])

@router.post("/", response_model=ProdutoOut)
def criar_produto(produto: ProdutoCreate):
    response = supabase.table("produtos").insert(produto.dict()).execute()
    if not response.data:
        raise HTTPException(status_code=400, detail="Erro ao criar produto")
    return response.data[0]

@router.get("/", response_model=list[ProdutoOut])
def listar_produtos():
    response = supabase.table("produtos").select("*").execute()
    return response.data

@router.get("/{produto_id}", response_model=ProdutoOut)
def buscar_produto(produto_id: int):
    response = supabase.table("produtos").select("*").eq("id", produto_id).single().execute()
    if not response.data:
        raise HTTPException(status_code=404, detail="Produto não encontrado")
    return response.data

@router.put("/{produto_id}", response_model=ProdutoOut)
def atualizar_produto(produto_id: int, produto: ProdutoUpdate):
    updates = {k: v for k, v in produto.dict().items() if v is not None}
    if not updates:
        raise HTTPException(status_code=400, detail="Nenhum campo enviado para atualizar")

    response = supabase.table("produtos").update(updates).eq("id", produto_id).execute()
    if not response.data:
        raise HTTPException(status_code=404, detail="Produto não encontrado")
    return response.data[0]

@router.delete("/{produto_id}")
def deletar_produto(produto_id: int):
    response = supabase.table("produtos").delete().eq("id", produto_id).execute()
    if not response.data:
        raise HTTPException(status_code=404, detail="Produto não encontrado")
    return {"ok": True}
