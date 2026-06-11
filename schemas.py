from pydantic import BaseModel, EmailStr, Field
from typing import Optional, List
from datetime import datetime

class EmpresaBase(BaseModel):
    razao_social: str = Field(min_length=2, max_length=150)
    cnpj: str = Field(min_length=14, max_length=18)

class EmpresaCreate(EmpresaBase):
    senha: str = Field(min_length=6, max_length=72)

class EmpresaUpdate(BaseModel):
    nome_fantasia: Optional[str] = None
    logotipo: Optional[str] = None
    descricao: Optional[str] = None
    endereco: Optional[str] = None

class EmpresaOut(EmpresaBase):
    id: int
    nome_fantasia: Optional[str] = None
    logotipo: Optional[str] = None
    descricao: Optional[str] = None
    endereco: Optional[str] = None
    
    class Config:
        from_attributes = True

class CandidatoBase(BaseModel):
    nome: str = Field(min_length=2, max_length=100)
    cpf: str = Field(min_length=11, max_length=14)
    email: EmailStr
    resumo_profissional: Optional[str] = None
    contato: Optional[str] = None
    escolaridade: Optional[str] = None
    habilidades: Optional[str] = None

class CandidatoCreate(CandidatoBase):
    senha: str = Field(min_length=6, max_length=72)

class CandidatoUpdate(BaseModel):
    nome: Optional[str] = None
    resumo_profissional: Optional[str] = None
    contato: Optional[str] = None
    escolaridade: Optional[str] = None
    habilidades: Optional[str] = None

class CandidatoOut(CandidatoBase):
    id: int
    class Config:
        from_attributes = True

class NotificacaoOut(BaseModel):
    id: int
    mensagem: str
    lida: bool
    data_criacao: datetime

    class Config:
        orm_mode = True

class VagaBase(BaseModel):
    titulo: str = Field(min_length=5, max_length=100)
    descricao: str = Field(min_length=10)
    salario: Optional[str] = None
    cidade: Optional[str] = None

class VagaCreate(VagaBase):
    id_empresa: Optional[int] = None

class VagaOut(VagaBase):
    id: int
    id_empresa: int
    status: str
    empresa: Optional[EmpresaOut] = None
    class Config:
        from_attributes = True

class CandidaturaOut(BaseModel):
    id: int
    fk_candidato: int
    fk_vaga: int
    status_triagem: str
    caminho_curriculo_pdf: str
    class Config:
        from_attributes = True

class CandidaturaStatusUpdate(BaseModel):
    status: str

class VagaStatusUpdate(BaseModel):
    status: str

class VagaDashboardOut(VagaOut):
    candidatos_count: int

class CandidaturaDetail(CandidaturaOut):
    candidato: CandidatoOut

