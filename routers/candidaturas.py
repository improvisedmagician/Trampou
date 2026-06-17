import os
import shutil
from fastapi import APIRouter, Depends, HTTPException, UploadFile, File, Form
from sqlalchemy.orm import Session
import schemas, models, database, auth

router = APIRouter(prefix="/candidaturas", tags=["Candidaturas"])

@router.post("/", response_model=schemas.CandidaturaOut)
def create_candidatura(
    fk_vaga: int = Form(...),
    curriculo: UploadFile = File(...),
    db: Session = Depends(database.get_db),
    current_candidato: models.Candidato = Depends(auth.get_current_candidato)
):
    if not curriculo.filename.endswith(".pdf"):
        raise HTTPException(status_code=400, detail="Apenas arquivos PDF são permitidos.")
        
    import re
    safe_filename = re.sub(r'[^A-Za-z0-9_.-]', '_', curriculo.filename)
    file_name = f"candidato_{current_candidato.id}_vaga_{fk_vaga}_{safe_filename}"
    file_path = os.path.join("uploads", file_name)
    
    with open(file_path, "wb") as buffer:
        shutil.copyfileobj(curriculo.file, buffer)
        
    db_candidatura = models.Candidatura(
        fk_candidato=current_candidato.id,
        fk_vaga=fk_vaga,
        caminho_curriculo_pdf=file_path
    )
    db.add(db_candidatura)
    db.commit()
    db.refresh(db_candidatura)

    # Notificar a empresa
    vaga = db.query(models.Vaga).filter(models.Vaga.id == fk_vaga).first()
    if vaga:
        nova_notificacao_empresa = models.NotificacaoEmpresa(
            fk_empresa=vaga.id_empresa,
            mensagem=f"O candidato {current_candidato.nome} enviou um currículo para a vaga '{vaga.titulo}'."
        )
        db.add(nova_notificacao_empresa)
        db.commit()

    from logger import log_action
    log_action("Candidaturas", f"Candidato ID {current_candidato.id} enviou currículo para a Vaga ID {fk_vaga}")

    return db_candidatura

from typing import List

@router.get("/minhas", response_model=List[schemas.CandidaturaComVaga])
def listar_minhas_candidaturas(db: Session = Depends(database.get_db), current_candidato: models.Candidato = Depends(auth.get_current_candidato)):
    return db.query(models.Candidatura).filter(models.Candidatura.fk_candidato == current_candidato.id).all()
@router.get("/vaga/{id_vaga}", response_model=List[schemas.CandidaturaDetail])
def listar_candidaturas_vaga(id_vaga: int, db: Session = Depends(database.get_db), current_empresa: models.Empresa = Depends(auth.get_current_empresa)):
    vaga = db.query(models.Vaga).filter(models.Vaga.id == id_vaga).first()
    if not vaga or vaga.id_empresa != current_empresa.id:
        raise HTTPException(status_code=403, detail="Não autorizado a ver candidaturas desta vaga")
    return db.query(models.Candidatura).filter(models.Candidatura.fk_vaga == id_vaga).all()

@router.patch("/{id}/status", response_model=schemas.CandidaturaOut)
def alterar_status_candidatura(id: int, status_update: schemas.CandidaturaStatusUpdate, db: Session = Depends(database.get_db), current_empresa: models.Empresa = Depends(auth.get_current_empresa)):
    db_candidatura = db.query(models.Candidatura).filter(models.Candidatura.id == id).first()
    if not db_candidatura:
        raise HTTPException(status_code=404, detail="Candidatura não encontrada")
    if db_candidatura.vaga.id_empresa != current_empresa.id:
        raise HTTPException(status_code=403, detail="Não autorizado a alterar o status desta candidatura")
    
    db_candidatura.status_triagem = status_update.status
    
    # Gerar notificacao para o candidato
    vaga_titulo = db_candidatura.vaga.titulo
    nova_notificacao = models.Notificacao(
        fk_candidato=db_candidatura.fk_candidato,
        mensagem=f"O status da sua candidatura para {vaga_titulo} mudou para {status_update.status}"
    )
    db.add(nova_notificacao)
    
    db.commit()
    db.refresh(db_candidatura)

    from logger import log_action
    log_action("Candidaturas", f"Empresa ID {current_empresa.id} alterou status da candidatura ID {id} para {status_update.status}")

    return db_candidatura
