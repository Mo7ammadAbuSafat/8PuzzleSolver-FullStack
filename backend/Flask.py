from flask import Flask, jsonify, request
from flask_cors import CORS
from Puzzle import get_solution

app = Flask(__name__)
CORS(app)


@app.route('/solve-puzzle', methods=['GET'])
def hello_world():
    puzzle = request.args.get('puzzle')
    algorithm_type = request.args.get('algorithm')
    heuristic_function_type = request.args.get('heuristic')
    solution, iterations, isSolvable = get_solution(puzzle, algorithm_type, heuristic_function_type)
    return jsonify(solution=solution, iterations=iterations, isSolvable=isSolvable)


if __name__ == '__main__':
    app.run()
