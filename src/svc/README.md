# AICRM Lite - Service (FastAPI)

## Run (local)
1. Create venv and install deps
   - python -m venv .venv
   - source .venv/bin/activate
   - pip install -r requirements.txt

2. Setup env
   - cp .env.example .env

3. Start server
   - uvicorn app.main:app --reload --host 0.0.0.0 --port 8000

## API Base
- http://localhost:8000
- Swagger: /docs
