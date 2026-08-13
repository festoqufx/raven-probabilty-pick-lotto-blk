import requests
import csv
import io
import random
from pathlib import Path
from collections import Counter

# Define the column names in the CSV file
COLUMN_NAMES = ["No.", "Dates", "One", "Two", "Three", "Four", "Five", "Six"]
NUMBER_COLUMNS = COLUMN_NAMES[2:]
FALLBACK_DATA_DIR = Path(__file__).resolve().parent / 'fallback_data'

def get_filename(lotto_type):
    """Get the filename based on the lotto type."""
    lotto_types = {
        42: 'lotto_6_42',
        45: 'mega_lotto_6_45',
        49: 'super_lotto_6_49',
        55: 'grand_lotto_6_55',
        58: 'ultra_lotto_6_58'
    }
    
    return lotto_types.get(lotto_type)

def download_lotto_csv(lotto_type):
    """
    Download lottery numbers CSV file for the specified lotto type.

    If the file is not available, a fallback data file will be used.
    """
    filename = get_filename(lotto_type)
    if filename is None:
        raise ValueError('Invalid lotto type')

    link = f"https://www.pcsodraw.com/download/{filename}.csv"

    try:
        response = requests.get(link, timeout=3)
        response.raise_for_status()
        rows = _parse_lotto_rows(response.text)
    except Exception:
        fallback_file = FALLBACK_DATA_DIR / f'{filename}.csv'
        rows = _parse_lotto_rows(fallback_file.read_text(encoding='utf-8'))

    if not rows:
        raise ValueError('No valid lotto data available')

    return _build_lottery_columns(rows)


def _parse_lotto_rows(csv_text):
    """Parse CSV rows and return valid six-number lotto rows."""
    rows = []
    reader = csv.reader(io.StringIO(csv_text))

    for row in reader:
        if len(row) < 8:
            continue

        raw_numbers = [value.strip() for value in row[2:8]]
        if any(value.lower() == 'xx' or value == '' for value in raw_numbers):
            continue

        try:
            parsed_numbers = [int(value) for value in raw_numbers]
        except ValueError:
            continue

        rows.append(parsed_numbers)

    return rows


def _build_lottery_columns(rows):
    lottery_numbers = {column: [] for column in NUMBER_COLUMNS}

    for row in rows:
        for index, column in enumerate(NUMBER_COLUMNS):
            lottery_numbers[column].append(row[index])

    return lottery_numbers

def get_probabilities(lottery_numbers):
    """
    Calculate probabilities of each number being drawn in the lottery.

    Returns a dictionary containing the probabilities for each number column.
    """
    probabilities = {}

    for column in NUMBER_COLUMNS:
        values = lottery_numbers[column]
        total_count = len(values)
        value_counts = Counter(values)

        probabilities[column] = {
            'population': list(value_counts.keys()),
            'weights': [count / total_count for count in value_counts.values()]
        }

    return probabilities

def has_duplicates(arr):
    """Check if a list of numbers has any duplicates."""
    unique_elements = set(arr)
    return len(arr) != len(unique_elements)

def generate_lottery_numbers(probabilities):
    """
    Generate a set of lottery numbers with no duplicates based on probabilities.

    Returns a list containing the generated lottery numbers.
    """
    while True:
        random_numbers = []

        for column in NUMBER_COLUMNS:
            distribution = probabilities[column]
            random_number = random.choices(
                population=distribution['population'],
                weights=distribution['weights'],
                k=1
            )[0]

            random_numbers.append(random_number)

        if not has_duplicates(random_numbers):
            break

    return random_numbers