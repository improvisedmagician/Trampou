# 🚀 Trampou - Central de Vagas

O **Trampou** é uma plataforma moderna e premium de recrutamento e seleção que conecta os melhores talentos às empresas inovadoras. Desenvolvida com foco num design "mobile-first", a plataforma oferece uma experiência de utilizador rápida, elegante e extremamente intuitiva.

---

## ✨ Principais Funcionalidades

### 👨‍💻 Para Candidatos
* **Mural de Vagas:** Explore vagas ativas com uma interface limpa, focada no que importa e com um sistema de pesquisa em tempo real.
* **Perfil Digital Premium:** Construa um perfil completo com foto, dados pessoais, resumo de experiência e escolaridade.
* **Candidaturas com 1 Clique:** Envie o seu currículo em PDF diretamente para a vaga pretendida.
* **Acompanhamento de Status:** Aba dedicada para "Minhas Candidaturas", onde acompanha se está *Em Análise*, em *Entrevista* ou se foi *Recusada*.
* **Notificações:** Seja notificado sempre que uma empresa avança a sua candidatura para uma nova fase.

### 🏢 Para Empresas
* **Dashboard Central:** Publique novas vagas e acompanhe facilmente quantas candidaturas cada uma recebeu.
* **Triagem de Currículos:** Visualize a lista de candidatos por vaga, faça o download dos seus currículos em PDF e altere o status de triagem com um clique.
* **Perfil Institucional:** Personalize a aparência da sua empresa, gerando confiança para atrair talentos.

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
* **HeroIcons:** Biblioteca minimalista de ícones mantida pelos criadores do Tailwind.

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

> **Nota sobre Ficheiros Estáticos (Render Free Tier):** O plano gratuito da Render utiliza discos efémeros. Isto significa que os ficheiros enviados (PDFs de currículos e Fotos de Perfil), que são atualmente gravados na pasta `/uploads`, perdem-se se a máquina virtual entrar em inatividade ou reiniciar. Numa versão de produção comercial, deve integrar um serviço como **AWS S3** ou **Cloudinary**.

---

## 🤝 Autor e Licença

Criado sob os requisitos exclusivos de design dinâmico e funcional para facilitar processos de recrutamento e seleção.

Distribuído sob licença standard.
