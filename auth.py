from datetime import datetime, timedelta, timezone
from typing import Optional
from fastapi import Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer
import jwt
# import removido
from sqlalchemy.orm import Session
from database import settings, get_db
import models

# Passlib substituída por bcrypt direto
# Como temos dois tipos de usuários, podemos usar dois tokens bearers ou um só, 
# mas vamos usar um OAuth2PasswordBearer genérico para extrair o token do cabeçalho
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="auth/login/candidato", auto_error=False) # tokenUrl é apenas para o Swagger UI

import bcrypt

def verify_password(plain_password, hashed_password):
    try:
        # bcrypt requires bytes
        hashed_bytes = hashed_password.encode('utf-8')
        plain_bytes = plain_password.encode('utf-8')[:72]
        return bcrypt.checkpw(plain_bytes, hashed_bytes)
    except Exception:
        # Fallback para senhas velhas sem hash (antes de implementarmos segurança)
        return plain_password == hashed_password

def get_password_hash(password):
    password_bytes = password.encode('utf-8')[:72]
    salt = bcrypt.gensalt()
    return bcrypt.hashpw(password_bytes, salt).decode('utf-8')

def create_access_token(data: dict, expires_delta: Optional[timedelta] = None):
    to_encode = data.copy()
    if expires_delta:
        expire = datetime.now(timezone.utc) + expires_delta
    else:
        expire = datetime.now(timezone.utc) + timedelta(minutes=settings.access_token_expire_minutes)
    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(to_encode, settings.secret_key, algorithm=settings.algorithm)
    return encoded_jwt

def get_current_user_token(token: str = Depends(oauth2_scheme)):
    if not token:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Não autenticado",
            headers={"WWW-Authenticate": "Bearer"},
        )
    try:
        payload = jwt.decode(token, settings.secret_key, algorithms=[settings.algorithm])
        return payload
    except jwt.ExpiredSignatureError:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Token expirado",
            headers={"WWW-Authenticate": "Bearer"},
        )
    except jwt.PyJWTError:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Token inválido",
            headers={"WWW-Authenticate": "Bearer"},
        )

def get_current_empresa(payload: dict = Depends(get_current_user_token), db: Session = Depends(get_db)):
    role = payload.get("role")
    if role != "empresa":
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Acesso negado: requer perfil de empresa")
    
    empresa_id = payload.get("sub")
    if empresa_id is None:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Token inválido")
        
    empresa = db.query(models.Empresa).filter(models.Empresa.id == int(empresa_id)).first()
    if empresa is None:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Empresa não encontrada")
    return empresa

def get_current_candidato(payload: dict = Depends(get_current_user_token), db: Session = Depends(get_db)):
    role = payload.get("role")
    if role != "candidato":
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Acesso negado: requer perfil de candidato")
    
    candidato_id = payload.get("sub")
    if candidato_id is None:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Token inválido")
        
    candidato = db.query(models.Candidato).filter(models.Candidato.id == int(candidato_id)).first()
    if candidato is None:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Candidato não encontrado")
    return candidato
