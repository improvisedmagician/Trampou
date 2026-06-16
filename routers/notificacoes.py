from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
import schemas, models, database, auth

router = APIRouter(prefix="/notificacoes", tags=["Notificacoes"])

@router.get("/me", response_model=List[schemas.NotificacaoOut])
def listar_notificacoes(db: Session = Depends(database.get_db), current_candidato: models.Candidato = Depends(auth.get_current_candidato)):
    return db.query(models.Notificacao).filter(
        models.Notificacao.fk_candidato == current_candidato.id
    ).order_by(models.Notificacao.data_criacao.desc()).all()

@router.get("/unread_count")
def unread_count(db: Session = Depends(database.get_db), current_candidato: models.Candidato = Depends(auth.get_current_candidato)):
    count = db.query(models.Notificacao).filter(
        models.Notificacao.fk_candidato == current_candidato.id,
        models.Notificacao.lida == False
    ).count()
    return {"unread_count": count}

@router.put("/{id}/lida")
def marcar_como_lida(id: int, db: Session = Depends(database.get_db), current_candidato: models.Candidato = Depends(auth.get_current_candidato)):
    notificacao = db.query(models.Notificacao).filter(models.Notificacao.id == id).first()
    if not notificacao:
        raise HTTPException(status_code=404, detail="Notificação não encontrada")
    if notificacao.fk_candidato != current_candidato.id:
        raise HTTPException(status_code=403, detail="Não autorizado")
    
    notificacao.lida = True
    db.commit()
    return {"message": "Notificação marcada como lida"}

@router.get("/empresa/me", response_model=List[schemas.NotificacaoOut])
def listar_notificacoes_empresa(db: Session = Depends(database.get_db), current_empresa: models.Empresa = Depends(auth.get_current_empresa)):
    return db.query(models.NotificacaoEmpresa).filter(
        models.NotificacaoEmpresa.fk_empresa == current_empresa.id
    ).order_by(models.NotificacaoEmpresa.data_criacao.desc()).all()

@router.get("/empresa/unread_count")
def unread_count_empresa(db: Session = Depends(database.get_db), current_empresa: models.Empresa = Depends(auth.get_current_empresa)):
    count = db.query(models.NotificacaoEmpresa).filter(
        models.NotificacaoEmpresa.fk_empresa == current_empresa.id,
        models.NotificacaoEmpresa.lida == False
    ).count()
    return {"unread_count": count}

@router.put("/empresa/{id}/lida")
def marcar_como_lida_empresa(id: int, db: Session = Depends(database.get_db), current_empresa: models.Empresa = Depends(auth.get_current_empresa)):
    notificacao = db.query(models.NotificacaoEmpresa).filter(models.NotificacaoEmpresa.id == id).first()
    if not notificacao:
        raise HTTPException(status_code=404, detail="Notificação não encontrada")
    if notificacao.fk_empresa != current_empresa.id:
        raise HTTPException(status_code=403, detail="Não autorizado")
    
    notificacao.lida = True
    db.commit()
    return {"message": "Notificação marcada como lida"}
