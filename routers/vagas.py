from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
import schemas, models, database, auth

router = APIRouter(prefix="/vagas", tags=["Vagas"])

@router.post("/", response_model=schemas.VagaOut)
def create_vaga(vaga: schemas.VagaCreate, db: Session = Depends(database.get_db), current_empresa: models.Empresa = Depends(auth.get_current_empresa)):
    db_vaga = models.Vaga(
        id_empresa=current_empresa.id,
        titulo=vaga.titulo,
        descricao=vaga.descricao,
        salario=vaga.salario,
        cidade=vaga.cidade
    )
    db.add(db_vaga)
    db.commit()
    db.refresh(db_vaga)
    return db_vaga

@router.get("/", response_model=List[schemas.VagaOut])
def listar_vagas(q: str = None, db: Session = Depends(database.get_db)):
    query = db.query(models.Vaga).filter(models.Vaga.status == "Ativa")
    if q:
        query = query.filter(models.Vaga.titulo.ilike(f"%{q}%"))
    return query.all()

@router.get("/empresa/{id_empresa}", response_model=List[schemas.VagaDashboardOut])
def listar_vagas_empresa(id_empresa: int, db: Session = Depends(database.get_db), current_empresa: models.Empresa = Depends(auth.get_current_empresa)):
    if current_empresa.id != id_empresa:
        raise HTTPException(status_code=403, detail="Não autorizado a ver vagas de outra empresa")
    vagas = db.query(models.Vaga).filter(models.Vaga.id_empresa == id_empresa).all()
    resultado = []
    for vaga in vagas:
        count = db.query(models.Candidatura).filter(models.Candidatura.fk_vaga == vaga.id).count()
        vaga_dict = vaga.__dict__.copy()
        vaga_dict["candidatos_count"] = count
        resultado.append(vaga_dict)
    return resultado

@router.patch("/{id}/status", response_model=schemas.VagaOut)
def alterar_status_vaga(id: int, status_update: schemas.VagaStatusUpdate, db: Session = Depends(database.get_db), current_empresa: models.Empresa = Depends(auth.get_current_empresa)):
    db_vaga = db.query(models.Vaga).filter(models.Vaga.id == id).first()
    if not db_vaga:
        raise HTTPException(status_code=404, detail="Vaga não encontrada")
    if db_vaga.id_empresa != current_empresa.id:
        raise HTTPException(status_code=403, detail="Não autorizado a alterar status desta vaga")
    db_vaga.status = status_update.status
    db.commit()
    db.refresh(db_vaga)
    return db_vaga
