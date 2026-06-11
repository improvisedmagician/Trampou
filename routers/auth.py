from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from pydantic import BaseModel
import database, models, auth

router = APIRouter(prefix="/auth", tags=["Autenticação"])

class LoginEmpresa(BaseModel):
    cnpj: str
    senha: str

class LoginCandidato(BaseModel):
    email: str
    senha: str

class TokenResponse(BaseModel):
    access_token: str
    token_type: str
    role: str
    user_id: int
    nome: str

@router.post("/login/empresa", response_model=TokenResponse)
def login_empresa(credentials: LoginEmpresa, db: Session = Depends(database.get_db)):
    empresa = db.query(models.Empresa).filter(models.Empresa.cnpj == credentials.cnpj).first()
    if not empresa or not auth.verify_password(credentials.senha, empresa.senha_hash):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="CNPJ ou senha incorretos",
        )
    
    access_token = auth.create_access_token(data={"sub": str(empresa.id), "role": "empresa"})
    return {
        "access_token": access_token, 
        "token_type": "bearer", 
        "role": "empresa", 
        "user_id": empresa.id, 
        "nome": empresa.razao_social
    }

@router.post("/login/candidato", response_model=TokenResponse)
def login_candidato(credentials: LoginCandidato, db: Session = Depends(database.get_db)):
    candidato = db.query(models.Candidato).filter(models.Candidato.email == credentials.email).first()
    if not candidato or not auth.verify_password(credentials.senha, candidato.senha_hash):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="E-mail ou senha incorretos",
        )
    
    access_token = auth.create_access_token(data={"sub": str(candidato.id), "role": "candidato"})
    return {
        "access_token": access_token, 
        "token_type": "bearer", 
        "role": "candidato", 
        "user_id": candidato.id, 
        "nome": candidato.nome
    }

class RecuperarSenhaRequest(BaseModel):
    email: str

@router.post("/recuperar-senha")
def recuperar_senha(req: RecuperarSenhaRequest):
    # Mock endpoint para o requisito RF-01.
    # Em produção, usaria SMTP para enviar um link de recuperação.
    return {"message": "Instruções de recuperação enviadas para o seu e-mail."}
