import os
import sys

# Local development entrypoint. The real Flask app lives in api/index.py so
# that Vercel can bundle and run it as a self-contained serverless function.
ROOT_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
if ROOT_DIR not in sys.path:
    sys.path.insert(0, ROOT_DIR)

from api.index import app

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000, debug=False)
