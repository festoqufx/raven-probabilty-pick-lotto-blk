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


class VercelPathFixMiddleware:
    """Keep Flask routes aligned with the public URL after Vercel rewrites."""

    def __init__(self, wsgi_app):
        self.wsgi_app = wsgi_app

    def __call__(self, environ, start_response):
        path = environ.get('PATH_INFO', '') or ''
        original = self._original_path(environ)

        if self._is_entrypoint(path):
            if original.startswith('/api') and not self._is_entrypoint(original):
                environ['PATH_INFO'] = original
            else:
                environ['PATH_INFO'] = self._strip_entrypoint(path)

        return self.wsgi_app(environ, start_response)

    @staticmethod
    def _is_entrypoint(path):
        return (
            path == '/api/index.py'
            or path == '/api/index'
            or path.startswith('/api/index.py/')
            or path.startswith('/api/index/')
        )

    @staticmethod
    def _strip_entrypoint(path):
        if path.startswith('/api/index.py'):
            return path[13:] or '/'
        if path.startswith('/api/index'):
            return path[10:] or '/'
        return path or '/'

    @staticmethod
    def _original_path(environ):
        for key in (
            'HTTP_X_FORWARDED_URI',
            'HTTP_X_INVOKE_PATH',
            'HTTP_X_VERCEL_ORIGINAL_PATH',
            'REQUEST_URI',
        ):
            value = environ.get(key) or ''
            if value:
                return value.split('?', 1)[0]
        return ''


app.wsgi_app = VercelPathFixMiddleware(app.wsgi_app)


@app.route('/')
@app.route('/api')
@app.route('/api/index')
@app.route('/api/index.py')
def index():
    return jsonify({'message': '200, OK'})


@app.route('/generate/<int:lotto_type>')
@app.route('/api/generate/<int:lotto_type>')
def generate(lotto_type):
    return handle_lottery_generator(lotto_type)


if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000, debug=False)

