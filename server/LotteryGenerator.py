from flask import jsonify, request
from flask_restful import Resource

try:
    from .main_functions import download_lotto_csv, get_probabilities, generate_lottery_numbers
except ImportError:
    from server.main_functions import download_lotto_csv, get_probabilities, generate_lottery_numbers

class LotteryGenerator(Resource):
    def get(self, lotto_type):
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
            return {'error': 'Probability is not available right now.'}, 503