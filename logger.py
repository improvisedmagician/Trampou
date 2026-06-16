import datetime

def log_action(source: str, action: str):
    try:
        with open("system_logs.txt", "a", encoding="utf-8") as f:
            timestamp = datetime.datetime.now().isoformat()
            f.write(f"[{timestamp}] [{source}] {action}\n")
    except Exception as e:
        pass
