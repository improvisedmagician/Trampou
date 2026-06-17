from fastapi.testclient import TestClient
from main import app

client = TestClient(app)

def test_read_root():
    response = client.get("/")
    assert response.status_code == 200
    assert "Bem-vindo à API do Trampou" in response.json()["message"]

def test_read_logs():
    response = client.get("/debug/logs")
    assert response.status_code == 200
    assert "logs" in response.json()

def test_listar_vagas():
    response = client.get("/vagas/")
    assert response.status_code == 200
    assert isinstance(response.json(), list)

def test_registrar_log():
    response = client.post("/debug/logs", json={
        "source": "Test",
        "message": "Teste Unitario Integracao",
        "error_details": "Nenhum"
    })
    assert response.status_code == 200
    assert response.json()["status"] == "Log registrado"
