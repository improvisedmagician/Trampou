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
