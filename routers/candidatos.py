from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
import schemas, models, database, auth

router = APIRouter(prefix="/candidatos", tags=["Candidatos"])

@router.post("/", response_model=schemas.CandidatoOut)
def create_candidato(candidato: schemas.CandidatoCreate, db: Session = Depends(database.get_db)):
    db_candidato = models.Candidato(
        nome=candidato.nome,
        cpf=candidato.cpf,
        email=candidato.email,
        resumo_profissional=candidato.resumo_profissional,
        contato=candidato.contato,
        senha_hash=auth.get_password_hash(candidato.senha)
    )
    db.add(db_candidato)
    db.commit()
    db.refresh(db_candidato)
    return db_candidato

@router.put("/me", response_model=schemas.CandidatoOut)
def update_candidato_me(candidato_update: schemas.CandidatoUpdate, db: Session = Depends(database.get_db), candidato_atual: models.Candidato = Depends(auth.get_current_candidato)):
    if candidato_update.nome is not None:
        candidato_atual.nome = candidato_update.nome
    if candidato_update.resumo_profissional is not None:
        candidato_atual.resumo_profissional = candidato_update.resumo_profissional
    if candidato_update.contato is not None:
        candidato_atual.contato = candidato_update.contato
    if candidato_update.escolaridade is not None:
        candidato_atual.escolaridade = candidato_update.escolaridade
    if candidato_update.habilidades is not None:
        candidato_atual.habilidades = candidato_update.habilidades

    db.commit()
    db.refresh(candidato_atual)
    return candidato_atual

@router.get("/me")
def read_candidato_me(db: Session = Depends(database.get_db), candidato_atual: models.Candidato = Depends(auth.get_current_candidato)):
    em_analise = db.query(models.Candidatura).filter(
        models.Candidatura.fk_candidato == candidato_atual.id, 
        models.Candidatura.status_triagem == "Em Análise"
    ).count()
    
    entrevista = db.query(models.Candidatura).filter(
        models.Candidatura.fk_candidato == candidato_atual.id, 
        models.Candidatura.status_triagem == "Entrevista"
    ).count()
    
    recusada = db.query(models.Candidatura).filter(
        models.Candidatura.fk_candidato == candidato_atual.id, 
        models.Candidatura.status_triagem == "Recusada"
    ).count()
    
    return {
        "id": candidato_atual.id,
        "nome": candidato_atual.nome,
        "email": candidato_atual.email,
        "resumo_profissional": candidato_atual.resumo_profissional,
        "contato": candidato_atual.contato,
        "escolaridade": candidato_atual.escolaridade,
        "habilidades": candidato_atual.habilidades,
        "stats": {
            "em_analise": em_analise,
            "entrevista": entrevista,
            "recusada": recusada
        }
    }
