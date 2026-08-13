import os
import pkgutil
import sys

# Python 3.14 removed pkgutil.get_loader, which Flask relies on when resolving
# a package's root path. Restore it so the app still boots on Python 3.14.
if not hasattr(pkgutil, 'get_loader'):
    import importlib

    def _compat_get_loader(name):
        try:
            module = importlib.import_module(name)
        except Exception:
            return None
        return getattr(module, '__loader__', None)

    pkgutil.get_loader = _compat_get_loader

from flask import Flask
from flask_restful import Api, Resource
from flask_cors import CORS

try:
    from .LotteryGenerator import LotteryGenerator
except ImportError:
    from api.LotteryGenerator import LotteryGenerator

app = Flask(__name__)
CORS(app)
api = Api(app)


class App(Resource):
    def get(self):
        return {'message': '200, OK'}


api.add_resource(App, '/', '/api')
api.add_resource(LotteryGenerator, '/generate/<int:lotto_type>', '/api/generate/<int:lotto_type>')


if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000, debug=False)

