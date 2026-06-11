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
    return empresa_atual
