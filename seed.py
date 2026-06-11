import urllib.request
import urllib.parse
import json
import os

API_URL = os.environ.get("API_URL", "http://localhost:10000")

def post_data(endpoint, data, token=None):
    url = f"{API_URL}{endpoint}"
    headers = {'Content-Type': 'application/json'}
    if token:
        headers['Authorization'] = f'Bearer {token}'
    req = urllib.request.Request(url, data=json.dumps(data).encode('utf-8'), headers=headers)
    try:
        urllib.request.urlopen(req)
    except Exception as e:
        print(f"Erro ao inserir em {url}: {e}")

# 1. Criar Empresa Mock
empresa = {
    "razao_social": "Tech Solutions Lda",
    "cnpj": "99999999000199",
    "senha": "password123"
}
post_data("/empresas/", empresa)

# 1.5. Criar Candidato Mock
candidato = {
    "nome": "João Silva",
    "cpf": "11122233344",
    "email": "joao@teste.com",
    "senha": "password123",
    "resumo_profissional": "Desenvolvedor Backend com paixão por Python."
}
post_data("/candidatos/", candidato)

# 1.8 Fazer Login Empresa para pegar Token
login_payload = {'cnpj': '99999999000199', 'senha': 'password123'}
req = urllib.request.Request(
    f"{API_URL}/auth/login/empresa",
    data=json.dumps(login_payload).encode('utf-8'),
    headers={'Content-Type': 'application/json'}
)
token = None
try:
    with urllib.request.urlopen(req) as response:
        token_data = json.loads(response.read().decode())
        token = token_data.get("access_token")
except Exception as e:
    print(f"Erro no login da empresa: {e}")

# 2. Criar Vagas Diversificadas
vagas = [
    {
        "titulo": "Desenvolvedor Full-Stack (Next.js & Python)",
        "descricao": "Procuramos um talento para construir interfaces fantásticas com Tailwind e backends de alta performance com FastAPI. É necessário ter experiência com Bases de Dados Relacionais.",
        "salario": "8000",
        "cidade": "São Paulo"
    },
    {
        "titulo": "Engenheiro de Software Backend (Sênior)",
        "descricao": "Junte-se à nossa equipa focada em dados e escalabilidade. Experiência avançada em Python 3.12, SQLAlchemy e arquitetura de microsserviços.",
        "salario": "12000",
        "cidade": "Rio de Janeiro"
    },
    {
        "titulo": "Desenvolvedor Frontend Júnior",
        "descricao": "Ótima oportunidade para quem domina HTML, CSS, JavaScript (React) e procura crescer num ambiente ágil e dinâmico.",
        "salario": "4000",
        "cidade": "Remoto"
    },
    {
        "titulo": "Product Designer (UI/UX)",
        "descricao": "Procuramos um designer apaixonado por criar experiências de utilizador incríveis. Necessário domínio do Figma e criação de protótipos interativos.",
        "salario": "7500",
        "cidade": "Remoto"
    },
    {
        "titulo": "Analista de Dados (Pleno)",
        "descricao": "Irá trabalhar com grandes volumes de dados para extrair insights. Conhecimento em SQL, Python (Pandas) e ferramentas de BI (PowerBI/Tableau).",
        "salario": "9000",
        "cidade": "Belo Horizonte"
    },
    {
        "titulo": "Especialista em Marketing Digital",
        "descricao": "Responsável por campanhas de performance (Google Ads, Meta Ads) e estratégias de SEO para alavancar a plataforma.",
        "salario": "6500",
        "cidade": "São Paulo"
    },
    {
        "titulo": "Gestor de Recursos Humanos",
        "descricao": "Buscamos um líder para o setor de RH. Experiência com recrutamento tech, cultura organizacional e retenção de talentos.",
        "salario": "10000",
        "cidade": "Curitiba"
    },
    {
        "titulo": "Engenheiro DevOps",
        "descricao": "Manutenção da infraestrutura Cloud (AWS/Render). Automação de CI/CD, Docker e Kubernetes são habilidades essenciais.",
        "salario": "14000",
        "cidade": "Remoto"
    }
]

for vaga in vagas:
    post_data("/vagas/", vaga, token)

print("Vagas diversificadas criadas com sucesso!")
