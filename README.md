# ProbabilityPick

PCSO lotto number generator. The UI samples combinations for Lotto 6/42, Mega 6/45, Super 6/49, Grand 6/55, and Ultra 6/58 using historical weights when the API is available, and a client-side fallback when it is not.

This is a combination picker for entertainment. It does not predict draws or improve odds.

## Stack

- **Frontend:** React 18 + Vite 4 + Tailwind CSS (`client/`)
- **API:** Flask on Python 3.12 (`api/`)
- **Deploy:** Vercel (static `client/dist` + Python function at `api/index.py`)

## Project layout

```
api/                 Flask app and lottery generator (Vercel serverless entry)
  fallback_data/     Offline CSVs used when pcsodraw.com is unreachable
client/              Vite React app
server/              Local Flask runner that imports api.index
requirements.txt     Python dependencies
vercel.json          Install, build, and /api rewrite config
.python-version      3.12
```

## Local development

Requires **Python 3.12** and **Node.js 18+**.

### 1. API (port 5000)

```powershell
python -m venv .venv
.\.venv\Scripts\Activate.ps1
pip install -r requirements.txt
python api\index.py
```

On macOS/Linux:

```bash
python3 -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
python api/index.py
```

`server/app.py` is an equivalent local entrypoint.

Health check: `GET http://127.0.0.1:5000/api` → `{"message":"200, OK"}`

### 2. Frontend (port 5173)

In a second terminal:

```powershell
cd client
npm ci
npm run dev
```

Open [http://localhost:5173](http://localhost:5173). Vite proxies `/api` to `http://127.0.0.1:5000`.

Optional: set `VITE_API_BASE_URL` if the API is not on the same origin.

## API

| Method | Path | Description |
| ------ | ---- | ----------- |
| `GET` | `/api` | Health check |
| `GET` | `/api/generate/{lotto_type}?count=1` | Generate 1–10 sets |

`lotto_type` is `42`, `45`, `49`, `55`, or `58`. `count` defaults to `1` (max `10`).

Example: `GET /api/generate/42?count=3`

The generator downloads historical CSVs from [pcsodraw.com](https://www.pcsodraw.com) and falls back to `api/fallback_data/` if that request fails. The frontend also has its own offline sampler if the API times out (3.5s).

## Scripts (client)

| Command | Description |
| ------- | ----------- |
| `npm run dev` | Vite dev server |
| `npm run build` | Production build to `client/dist` |
| `npm run preview` | Preview the production build |
| `npm run lint` | ESLint |

## Vercel

Connect the GitHub repo. Root `vercel.json` already sets:

- Install: `uv pip install -r requirements.txt && cd client && npm ci`
- Build: `cd client && npm run build`
- Output: `client/dist`

Python version is pinned to **3.12** via `.python-version`. After a deploy, `/` should serve the app and `/api` should return `{"message":"200, OK"}`.

Do not add `/api` → `/api/index.py` rewrites. Vercel’s Flask preset already handles `/api/*` after static files, and those rewrites now change the path Flask sees (which triggers the internal-rewrite build warning).

## License

Private project sample. Not affiliated with PCSO.
