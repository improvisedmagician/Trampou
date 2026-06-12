from database import engine
from sqlalchemy import text

try:
    with engine.connect() as conn:
        conn.execute(text("ALTER TABLE candidatos ADD COLUMN foto_perfil VARCHAR(255)"))
        conn.commit()
    print("Column foto_perfil added successfully.")
except Exception as e:
    print(f"Error: {e}")
