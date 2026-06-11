import urllib.request
import urllib.parse
import json

def post_data(url, data, token=None):
    headers = {'Content-Type': 'application/json'}
    if token:
        headers['Authorization'] = f'Bearer {token}'
    req = urllib.request.Request(url, data=json.dumps(data).encode('utf-8'), headers=headers)
    try:
        urllib.request.urlopen(req)
    except Exception as e:
        print(f"Erro ao inserir: {e}")

# 1. Criar Empresa Mock
empresa = {
    "razao_social": "Tech Solutions Lda",
    "cnpj": "99999999000199",
    "senha": "password123"
}
post_data("http://localhost:8000/empresas/", empresa)

# 1.5. Criar Candidato Mock
candidato = {
    "nome": "João Silva",
    "cpf": "11122233344",
    "email": "joao@teste.com",
    "senha": "password123",
    "resumo_profissional": "Desenvolvedor Backend com paixão por Python."
}
post_data("http://localhost:8000/candidatos/", candidato)

# 1.8 Fazer Login Empresa para pegar Token
login_payload = {'cnpj': '99999999000199', 'senha': 'password123'}
req = urllib.request.Request(
    "http://localhost:8000/auth/login/empresa",
    data=json.dumps(login_payload).encode('utf-8'),
    headers={'Content-Type': 'application/json'}
)
try:
    with urllib.request.urlopen(req) as response:
        token_data = json.loads(response.read().decode())
        token = token_data.get("access_token")
except Exception as e:
    print(f"Erro no login: {e}")
    token = None

# 2. Criar Vagas de Desenvolvimento
vagas = [
    {
        "titulo": "Desenvolvedor Full-Stack (Next.js & Python)",
        "descricao": "Procuramos um talento para construir interfaces fantásticas com Tailwind e backends de alta performance com FastAPI. É necessário ter experiência com Bases de Dados Relacionais.",
        "salario": "8000",
        "cidade": "São Paulo"
    },
    {
        "titulo": "Engenheiro de Software Backend (Sénior)",
        "descricao": "Junta-te à nossa equipa focada em dados e escalabilidade. Experiência avançada em Python 3.12, SQLAlchemy e arquitetura de microsserviços.",
        "salario": "12000",
        "cidade": "Rio de Janeiro"
    },
    {
        "titulo": "Desenvolvedor Frontend Júnior",
        "descricao": "Ótima oportunidade para quem domina HTML, CSS, JavaScript (React) e procura crescer num ambiente ágil e dinâmico.",
        "salario": "4000",
        "cidade": "Remoto"
    }
]

for vaga in vagas:
    post_data("http://localhost:8000/vagas/", vaga, token)

print("Vagas criadas com sucesso!")
