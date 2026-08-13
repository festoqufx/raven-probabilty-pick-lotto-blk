import os
import sys

_API_DIR = os.path.dirname(os.path.abspath(__file__))
_ROOT_DIR = os.path.dirname(_API_DIR)
if _API_DIR not in sys.path:
    sys.path.insert(0, _API_DIR)
if _ROOT_DIR not in sys.path:
    sys.path.insert(0, _ROOT_DIR)

from flask import jsonify, request

try:
    from main_functions import download_lotto_csv, get_probabilities, generate_lottery_numbers
except ImportError:
    try:
        from .main_functions import download_lotto_csv, get_probabilities, generate_lottery_numbers
    except ImportError:
        from api.main_functions import download_lotto_csv, get_probabilities, generate_lottery_numbers


def handle_lottery_generator(lotto_type):
    try:
        count = request.args.get('count', default=1, type=int)
        count = max(1, min(10, count))
        lottery_numbers = download_lotto_csv(lotto_type)
        probabilities = get_probabilities(lottery_numbers)

        sets = []
        for _ in range(count):
            result = generate_lottery_numbers(probabilities)
            sets.append([int(item) for item in result])

        if count == 1:
            return jsonify(sets[0])
        return jsonify(sets)
    except Exception:
        return jsonify({'error': 'Probability is not available right now.'}), 503
