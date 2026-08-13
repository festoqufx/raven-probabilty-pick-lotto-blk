import os
import sys
import pkgutil

# Python 3.14 removed pkgutil.get_loader, which older Flask relies on.
if not hasattr(pkgutil, 'get_loader'):
    import importlib

    def _compat_get_loader(name):
        try:
            module = importlib.import_module(name)
        except Exception:
            return None
        return getattr(module, '__loader__', None)

    pkgutil.get_loader = _compat_get_loader

_API_DIR = os.path.dirname(os.path.abspath(__file__))
_ROOT_DIR = os.path.dirname(_API_DIR)
if _API_DIR not in sys.path:
    sys.path.insert(0, _API_DIR)
if _ROOT_DIR not in sys.path:
    sys.path.insert(0, _ROOT_DIR)

from flask import Flask, jsonify
from flask_cors import CORS

try:
    from LotteryGenerator import handle_lottery_generator
except ImportError:
    try:
        from .LotteryGenerator import handle_lottery_generator
    except ImportError:
        from api.LotteryGenerator import handle_lottery_generator

app = Flask(__name__)
CORS(app)


@app.route('/')
@app.route('/api')
def index():
    return jsonify({'message': '200, OK'})


@app.route('/generate/<int:lotto_type>')
@app.route('/api/generate/<int:lotto_type>')
def generate(lotto_type):
    return handle_lottery_generator(lotto_type)


if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000, debug=False)
