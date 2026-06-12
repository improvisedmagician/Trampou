from sqlalchemy import Column, Integer, String, Text, ForeignKey, Boolean, DateTime
from sqlalchemy.orm import relationship
from database import Base
from datetime import datetime
from database import Base

class Empresa(Base):
    __tablename__ = "tb_empresas"

    id = Column(Integer, primary_key=True, autoincrement=True, index=True)
    razao_social = Column(String(150), nullable=False)
    cnpj = Column(String(14), unique=True, index=True, nullable=False)
    senha_hash = Column(String, nullable=False)
    nome_fantasia = Column(String(150), nullable=True)
    logotipo = Column(String(255), nullable=True)
    descricao = Column(Text, nullable=True)
    endereco = Column(String(255), nullable=True)

    vagas = relationship("Vaga", back_populates="empresa")


class Candidato(Base):
    __tablename__ = "tb_candidatos"

    id = Column(Integer, primary_key=True, autoincrement=True, index=True)
    nome = Column(String(100), nullable=False)
    cpf = Column(String(11), unique=True, index=True, nullable=False)
    email = Column(String(100), unique=True, index=True, nullable=False)
    resumo_profissional = Column(Text, nullable=True)
    contato = Column(String(50), nullable=True)
    escolaridade = Column(String(200), nullable=True)
    habilidades = Column(Text, nullable=True)
    senha_hash = Column(String, nullable=False)
    foto_perfil = Column(String(255), nullable=True)

    candidaturas = relationship("Candidatura", back_populates="candidato")


class Vaga(Base):
    __tablename__ = "tb_vagas"

    id = Column(Integer, primary_key=True, autoincrement=True, index=True)
    id_empresa = Column(Integer, ForeignKey("tb_empresas.id"), nullable=False)
    titulo = Column(String(100), nullable=False)
    descricao = Column(Text, nullable=False)
    salario = Column(String(50), nullable=True)
    cidade = Column(String(100), nullable=True)
    status = Column(String(20), default="Ativa", nullable=False)

    empresa = relationship("Empresa", back_populates="vagas")
    candidaturas = relationship("Candidatura", back_populates="vaga")


class Candidatura(Base):
    __tablename__ = "tb_candidatura"

    id = Column(Integer, primary_key=True, autoincrement=True, index=True)
    fk_candidato = Column(Integer, ForeignKey("tb_candidatos.id"), nullable=False)
    fk_vaga = Column(Integer, ForeignKey("tb_vagas.id"), nullable=False)
    status_triagem = Column(String(30), default="Em Análise", nullable=False)
    caminho_curriculo_pdf = Column(String, nullable=False)

    candidato = relationship("Candidato", back_populates="candidaturas")
    vaga = relationship("Vaga", back_populates="candidaturas")

class Notificacao(Base):
    __tablename__ = "notificacoes"

    id = Column(Integer, primary_key=True, index=True)
    fk_candidato = Column(Integer, ForeignKey("tb_candidatos.id"), nullable=False)
    mensagem = Column(String(500), nullable=False)
    lida = Column(Boolean, default=False)
    data_criacao = Column(DateTime, default=datetime.utcnow)

    candidato = relationship("Candidato")
