from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.auth.routes import router as auth_router
from app.users.routes import router as users_router
from app.produtos.routes import router as produtos_router
from app.ia.routes import router as ia_router

app = FastAPI()

origins = [
    "http://localhost:3000",
    "http://localhost:8081",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/ping")
def ping():
    return "pong"

# Rotas
app.include_router(auth_router)
app.include_router(users_router)
app.include_router(produtos_router)
app.include_router(ia_router)