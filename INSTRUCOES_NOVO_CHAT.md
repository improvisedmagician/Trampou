# Trampou - Documentação de Handover

Bem-vindo ao projeto **Trampou**! Este documento serve para contextualizar o estado atual do projeto, a stack tecnológica utilizada e os próximos passos para que possas continuar o desenvolvimento a partir daqui num novo chat.

## 🚀 Visão Geral
O Trampou é uma plataforma moderna de recrutamento e seleção (tipo LinkedIn/Gupy), que liga Empresas (que publicam vagas) a Candidatos (que submetem os seus currículos em PDF).

**Pasta Raiz do Projeto:** `C:\Users\PC\Documents\trampou-api`

## 🛠 Stack Tecnológica
- **Backend:** Python 3.12+, FastAPI, SQLAlchemy (ORM), Pydantic.
- **Base de Dados:** SQLite (`trampou_local.db`) gerido nativamente pelo SQLAlchemy (O Alembic está instalado para futuras migrações).
- **Armazenamento:** `python-multipart` para guardar ficheiros PDF na pasta local `uploads/`.
- **Frontend:** React / Next.js 15 (App Router).
- **Estilização:** Tailwind CSS v4 com paleta personalizada injetada no `globals.css` (Cores: Castanho `#4B2E2A`, Dourado `#D4AF37`, Creme `#FDFBF7` e Taupe `#8C7A78`).

## ✅ O que já está feito (MVP Concluído)
1. **Backend Base:** Modelos e Schemas criados com relacionamentos (`Empresas` <-> `Vagas` <-> `Candidaturas` <-> `Candidatos`).
2. **Endpoints Funcionais:**
   - `POST /empresas/` e `POST /candidatos/` para registo.
   - `POST /vagas/`, `GET /vagas/`, `GET /vagas/empresa/{id_empresa}` e `PATCH /vagas/{id}/status` para gestão de vagas.
   - `POST /candidaturas/` com suporte a Upload de Arquivos (.pdf).
3. **Frontend Integrado (fetch para localhost:8000):**
   - **`/auth`**: Formulários de registo separados por Candidato e Empresa.
   - **`/` (Mural)**: Lista vagas ativas e permite candidatura com *upload* interativo de ficheiro.
   - **`/empresa/dashboard`**: Dashboard da empresa com contagem dinâmica de candidatos e opção para "Encerrar" (Pausar) vagas.
   - **`/empresa/publicar-vaga`**: Formulário que interage com o backend para criar novas oportunidades.
   - **`/candidato/perfil`**: Interface visual construída para gestão futura do perfil.

## 🚧 O que falta fazer (Próximos Passos)
Para elevar o projeto de "MVP" para "Produto Completo", estas são as prioridades para o próximo desenvolvedor:

1. **Autenticação Real (JWT):** 
   Atualmente, o frontend está a simular os IDs (ex: usa o `id_empresa: 1` e `fk_candidato: 1` nos requests `POST`). É necessário implementar o login via token JWT no FastAPI e usar *Cookies* ou *Local Storage* no Next.js para enviar o Bearer Token no cabeçalho dos *fetches*.

2. **Visualizar Candidatos no Painel da Empresa:**
   O endpoint `GET /candidaturas/vaga/{id_vaga}` já existe no backend, mas o frontend do Painel da Empresa (`dashboard/page.js`) precisa de uma secção para a empresa clicar numa vaga, ver a lista dos candidatos (nome/email) e um botão para fazer o download do currículo PDF gerado.

3. **Completar Lógica do Perfil do Candidato:**
   O ecrã `app/candidato/perfil/page.js` está bonito visualmente mas não está a fazer `GET` dos dados do candidato na base de dados, nem a permitir atualizá-los (`PUT`).

4. **Tratamento de Erros e Validações:**
   Melhorar os `try/catch` no Frontend usando, por exemplo, o *React Toastify* em vez de alertas simples (`alert()`), e adicionar mais segurança nos ficheiros enviados (tamanho máximo de ficheiro no backend).

## 🏃 Como executar o projeto localmente

Deves abrir **dois terminais** na pasta `C:\Users\PC\Documents\trampou-api`.

**Terminal 1 (Backend):**
```bash
# Ativar ambiente virtual
.\venv\Scripts\activate
# Iniciar servidor FastAPI
uvicorn main:app --reload --port 8000
```

**Terminal 2 (Frontend):**
```bash
cd frontend
npm run dev
# Estará disponível em http://localhost:3000
```
