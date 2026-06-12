# 🚀 Trampou - Central de Vagas

O **Trampou** é uma plataforma moderna e premium de recrutamento e seleção que conecta os melhores talentos às empresas inovadoras. Desenvolvida com foco num design "mobile-first", a plataforma oferece uma experiência de utilizador rápida, elegante e extremamente intuitiva.

---

## 📖 Como a Plataforma Funciona (Guia de Utilização)

A plataforma tem dois lados principais: o **Candidato** e a **Empresa**. Eis como funciona cada um:

### 🏢 Fluxo da Empresa (Recrutador)
1. **Cadastro e Login:** A empresa acede à página inicial, clica no menu superior direito (ícone de pessoa) e seleciona **Cadastro -> Sou Empresa**. Aqui insere os seus dados (com validação automática de CNPJ).
2. **Perfil da Empresa:** No Dashboard, a empresa clica no ícone "Perfil" na barra inferior. Aqui pode **fazer upload do seu logótipo** e editar informações públicas (Endereço, Descrição da cultura, etc.).
3. **Publicação de Vagas:** De volta ao Dashboard, clica em "+ Publicar Nova Vaga". Define título, descrição, salário e cidade.
4. **Triagem de Candidatos:** No painel principal, a empresa vê a tabela com as vagas ativas. Ao clicar no número de candidatos (ex: "3"), abre-se a lista de pessoas que se candidataram.
5. **Gestão de Processos:** Na lista de candidatos, a empresa pode:
   - Clicar em **Ver PDF** para abrir o currículo original.
   - Usar o **Drop-down de Status** para mudar a fase do candidato de *Em Análise* para *Entrevista*, *Aprovado* ou *Reprovado*. Essa alteração emite um aviso automático ao candidato!
6. **Controlo da Vaga:** O botão de ação permite colocar uma vaga em modo "Pausada" (deixa de aparecer para os candidatos) ou "Ativa".

### 👨‍💻 Fluxo do Candidato
1. **Cadastro e Login:** O candidato regista-se escolhendo **Cadastro -> Sou Candidato**, usando um CPF válido e e-mail.
2. **Perfil Digital Premium:** Acedendo ao ícone "Perfil" no menu de baixo, o candidato pode fazer **upload de uma fotografia de perfil** e preencher a sua experiência, contacto e habilidades. O fundo do ecrã mostrará o "placard" das suas estatísticas de aprovação.
3. **Mural e Candidatura:** Na página inicial (Início), o candidato vê todas as vagas ativas do momento.
   - Clica numa vaga para ver os detalhes.
   - Clica em "Candidatar-se", envia um anexo (o seu Currículo em `.pdf`) e confirma.
4. **Gestão de Vagas:** Na aba "Vagas" do menu inferior, o candidato vê a lista de todas as vagas a que enviou o currículo e o respetivo estado atualizado pela empresa (ex: *Em Análise*).
5. **Notificações em Tempo Real:** Na aba "Notificações" (ícone do sino), recebe avisos automáticos se a sua candidatura avançar para "Entrevista" ou se o status for alterado.

---

## ✨ Principais Funcionalidades Técnicas

* **Formatação Inteligente de Dados:** O sistema formata e limpa automaticamente caracteres especiais de CPFs e CNPJs para manter integridade estrutural na base de dados.
* **Sistema de Uploads (Multipart Form-Data):** Processamento limpo de imagens (Avatar/Logos) e documentos PDF no lado do servidor.
* **Segurança JWT:** Sistema de Tokens (Bearer Token) que garante que Empresas não acedem a recursos de Candidatos e vice-versa.
* **CORS Universal:** Configurado para aceitar pedidos da rede Frontend hospedada na Vercel com máxima compatibilidade.

---

## 🛠️ Tecnologias Utilizadas

Este projeto está dividido em duas frentes que comunicam entre si via API REST.

**Backend (API)**
* **Python 3.10+**
* **FastAPI:** Framework de altíssimo desempenho para a criação das rotas e documentação interativa (Swagger).
* **SQLAlchemy:** ORM para interação com a base de dados.
* **PostgreSQL:** Base de dados relacional (em ambiente de produção na Render) / SQLite (ambiente local).
* **PyJWT & Passlib:** Segurança, encriptação de palavras-passe e autenticação de Tokens.

**Frontend (Client)**
* **Next.js 14+ (React):** Framework para geração de UI veloz e navegação fluída.
* **Tailwind CSS:** Para toda a estilização, com paletas de cores customizadas focadas em estética Premium.
* **HeroIcons:** Biblioteca minimalista de ícones.

---

## 🚀 Como Correr Localmente

Siga estes passos para configurar e executar a aplicação no seu computador:

### 1. Clonar o Repositório
```bash
git clone https://github.com/improvisedmagician/Trampou.git
cd Trampou
```

### 2. Configurar o Backend (FastAPI)
```bash
# 1. Crie e ative o ambiente virtual
python -m venv venv
# No Windows:
venv\Scripts\activate
# No Mac/Linux:
source venv/bin/activate

# 2. Instale as dependências
pip install -r requirements.txt

# 3. Inicie o servidor FastAPI (a base de dados SQLite é gerada automaticamente)
uvicorn main:app --reload --port 8000
```
> O backend estará a correr em: `http://localhost:8000`
> Pode aceder à documentação interativa (Swagger) em: `http://localhost:8000/docs`

### 3. Configurar o Frontend (Next.js)
Abra uma **nova** janela de terminal:
```bash
# 1. Navegue para a pasta do frontend
cd frontend

# 2. Instale as dependências do Node
npm install

# 3. Inicie o servidor de desenvolvimento
npm run dev
```
> O frontend estará a correr em: `http://localhost:3000`

---

## 🌍 Deploy na Nuvem (Produção)

A plataforma já está configurada e hospedada de forma gratuita e escalável.

* **Backend:** Alojado na [Render](https://render.com). Conta com base de dados PostgreSQL. (O ficheiro `render.yaml` dita as regras do deploy).
* **Frontend:** Alojado na [Vercel](https://vercel.com), ligado diretamente a este repositório do GitHub. Qualquer nova subida (`git push`) faz deploy automático do frontend num minuto.

> **Nota sobre Ficheiros Estáticos (Render Free Tier):** O plano gratuito da Render utiliza discos efémeros. Isto significa que os ficheiros enviados (PDFs de currículos e Fotos de Perfil), que são atualmente gravados na pasta `/uploads`, perdem-se se a máquina virtual entrar em inatividade profunda ou reiniciar. Numa versão de produção comercial definitiva, deve integrar um serviço como **AWS S3** ou **Cloudinary**.

---

## 🤝 Autor e Licença

Criado sob os requisitos exclusivos de design dinâmico e funcional para facilitar processos de recrutamento e seleção.

Distribuído sob licença standard.
