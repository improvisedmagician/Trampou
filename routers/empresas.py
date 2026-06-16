from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
import schemas, models, database, auth

router = APIRouter(prefix="/empresas", tags=["Empresas"])

@router.post("/", response_model=schemas.EmpresaOut)
def create_empresa(empresa: schemas.EmpresaCreate, db: Session = Depends(database.get_db)):
    db_empresa = models.Empresa(
        razao_social=empresa.razao_social,
        cnpj=empresa.cnpj,
        senha_hash=auth.get_password_hash(empresa.senha)
    )
    db.add(db_empresa)
    db.commit()
    db.refresh(db_empresa)
    
    from logger import log_action
    log_action("Auth", f"Nova empresa registada: {empresa.cnpj}")

    return db_empresa

@router.get("/me", response_model=schemas.EmpresaOut)
def read_empresa_me(empresa_atual: models.Empresa = Depends(auth.get_current_empresa)):
    return empresa_atual

@router.put("/me", response_model=schemas.EmpresaOut)
def update_empresa_me(empresa_update: schemas.EmpresaUpdate, db: Session = Depends(database.get_db), empresa_atual: models.Empresa = Depends(auth.get_current_empresa)):
    
    if empresa_update.nome_fantasia is not None:
        empresa_atual.nome_fantasia = empresa_update.nome_fantasia
    if empresa_update.logotipo is not None:
        empresa_atual.logotipo = empresa_update.logotipo
    if empresa_update.descricao is not None:
        empresa_atual.descricao = empresa_update.descricao
    if empresa_update.endereco is not None:
        empresa_atual.endereco = empresa_update.endereco

    db.commit()
    db.refresh(empresa_atual)

    from logger import log_action
    log_action("Perfil", f"Empresa ID {empresa_atual.id} atualizou o perfil")

    return empresa_atual

import os
import shutil
from fastapi import UploadFile, File

@router.post("/me/logotipo", response_model=schemas.EmpresaOut)
def upload_logotipo_empresa(
    foto: UploadFile = File(...),
    db: Session = Depends(database.get_db),
    empresa_atual: models.Empresa = Depends(auth.get_current_empresa)
):
    if not foto.content_type.startswith("image/"):
        raise HTTPException(status_code=400, detail="Apenas imagens são permitidas.")

    os.makedirs("uploads", exist_ok=True)
    file_extension = foto.filename.split(".")[-1]
    file_name = f"empresa_{empresa_atual.id}_logo.{file_extension}"
    file_path = os.path.join("uploads", file_name)

    with open(file_path, "wb") as buffer:
        shutil.copyfileobj(foto.file, buffer)

    empresa_atual.logotipo = f"https://trampou-api.onrender.com/uploads/{file_name}"
    db.commit()
    db.refresh(empresa_atual)
    
    return empresa_atual
