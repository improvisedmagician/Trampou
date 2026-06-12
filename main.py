import os
from fastapi import FastAPI
from database import engine, Base
from routers import empresas, candidatos, vagas, candidaturas
from routers import auth as auth_router
import models

# Garante que a pasta de uploads exista
os.makedirs("uploads", exist_ok=True)

# Cria as tabelas no banco de dados automaticamente no arranque (SQLite)
Base.metadata.create_all(bind=engine)

app = FastAPI(title="Trampou API", description="API para plataforma de recrutamento e seleção Trampou")

from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Monta o diretório de uploads para servir PDFs estaticamente
app.mount("/uploads", StaticFiles(directory="uploads"), name="uploads")

from fastapi.exceptions import RequestValidationError
from fastapi.responses import JSONResponse
from sqlalchemy.exc import IntegrityError
from fastapi import Request

@app.exception_handler(RequestValidationError)
async def validation_exception_handler(request: Request, exc: RequestValidationError):
    errors = exc.errors()
    msg = errors[0].get("msg") if errors else "Erro de validação nos campos."
    field = errors[0].get("loc")[-1] if errors and errors[0].get("loc") else "Desconhecido"
    return JSONResponse(
        status_code=422,
        content={"detail": f"Campo '{field}': {msg}"}
    )

@app.exception_handler(IntegrityError)
async def integrity_exception_handler(request: Request, exc: IntegrityError):
    return JSONResponse(
        status_code=400,
        content={"detail": "E-mail, CPF ou CNPJ já está cadastrado em nosso sistema."}
    )

app.include_router(auth_router.router)
app.include_router(empresas.router)
app.include_router(candidatos.router)
app.include_router(vagas.router)
app.include_router(candidaturas.router)

@app.get("/")
def read_root():
    return {"message": "Bem-vindo à API do Trampou! As tabelas foram criadas com sucesso."}

from pydantic import BaseModel
import datetime

class LogEntry(BaseModel):
    source: str
    message: str
    error_details: str = ""

@app.post("/debug/logs")
def registrar_log(entry: LogEntry):
    with open("system_logs.txt", "a", encoding="utf-8") as f:
        timestamp = datetime.datetime.now().isoformat()
        f.write(f"[{timestamp}] [{entry.source}] {entry.message} | Details: {entry.error_details}\n")
    return {"status": "Log registrado"}

@app.get("/debug/logs")
def ler_logs():
    try:
        with open("system_logs.txt", "r", encoding="utf-8") as f:
            return {"logs": f.readlines()}
    except FileNotFoundError:
        return {"logs": ["Nenhum log encontrado ainda."]}
