from copy import deepcopy


DIRECTIONS = {"U": [-1, 0], "D": [1, 0], "L": [0, -1], "R": [0, 1]}
END = [[1, 2, 3], [4, 5, 6], [7, 8, 0]]

class Node:
    def __init__(self, current_node, previous_node, g, h):
        self.current_node = current_node
        self.previous_node = previous_node
        self.g = g
        self.h = h

    def f(self, algorithm_type):
        if algorithm_type == "A*":
            return self.g + self.h
        elif algorithm_type == "Greedy Best First Search":
            return self.h
        elif algorithm_type == "Uniform Cost Search":
            return self.g
        else:
            return self.g + self.h


class Puzzle:
    def __init__(self,  algorithm_type, heuristic_function_type):
        self.algorithm_type = algorithm_type
        self.heuristic_function_type = heuristic_function_type

    def get_pos(self, current_state, element):
        for row in range(len(current_state)):
            if element in current_state[row]:
                return row, current_state[row].index(element)

    def heuristic_function(self, current_state):
        cost = 0
        if self.heuristic_function_type == "Manhattan distance":
            for row in range(len(current_state)):
                for col in range(len(current_state[0])):
                    pos = self.get_pos(END, current_state[row][col])
                    cost += abs(row - pos[0]) + abs(col - pos[1])
        elif self.heuristic_function_type == "Euclidean distance":
            for row in range(len(current_state)):
                for col in range(len(current_state[0])):
                    pos = self.get_pos(END, current_state[row][col])
                    cost += ((row - pos[0]) ** 2 + (col - pos[1]) ** 2) ** 0.5
        else:
            for row in range(len(current_state)):
                for col in range(len(current_state[0])):
                    if END[row][col] != current_state[row][col]:
                        cost += 1
        return cost

    def getAdjNode(self, node):
        listNode = []
        emptyPos = self.get_pos(node.current_node, 0)

        for dir in DIRECTIONS.keys():
            newPos = (emptyPos[0] + DIRECTIONS[dir][0], emptyPos[1] + DIRECTIONS[dir][1])
            if 0 <= newPos[0] < len(node.current_node) and 0 <= newPos[1] < len(node.current_node[0]):
                newState = deepcopy(node.current_node)
                newState[emptyPos[0]][emptyPos[1]] = node.current_node[newPos[0]][newPos[1]]
                newState[newPos[0]][newPos[1]] = 0
                listNode.append(Node(newState, node.current_node, node.g + 1, self.heuristic_function(newState)))

        return listNode

    def getBestNode(self, openSet):
        firstIter = True

        for node in openSet.values():
            if firstIter or node.f(self.algorithm_type) < bestF:
                firstIter = False
                bestNode = node
                bestF = bestNode.f(self.algorithm_type)
        return bestNode


    def buildPath(self, closedSet):
        node = closedSet[str(END)]
        branch = list()

        while node.g != 0:
            branch.append({
                'node': node.current_node
            })
            node = closedSet[str(node.previous_node)]
        branch.append({
            'node': node.current_node
        })
        branch.reverse()

        return branch

    def is_solvable(self, puzzle):
        inversions = 0
        puzzle = [tile for row in puzzle for tile in row]
        for i in range(8):
            for j in range(i + 1, 9):
                if puzzle[i] and puzzle[j] and puzzle[i] > puzzle[j]:
                    inversions += 1
        return inversions % 2 == 0

    def solve(self, puzzle):
        if not self.is_solvable(puzzle):
            return [], 0, False
        open_set = {str(puzzle): Node(puzzle, puzzle, 0, self.heuristic_function(puzzle))}
        closed_set = {}
        iterations = 0
        while True:
            iterations += 1
            test_node = self.getBestNode(open_set)
            closed_set[str(test_node.current_node)] = test_node

            if test_node.current_node == END:
                return self.buildPath(closed_set), iterations, True

            adj_node = self.getAdjNode(test_node)
            for node in adj_node:
                if str(node.current_node) in closed_set.keys() or str(node.current_node) in open_set.keys() and open_set[str(node.current_node)].f(self.algorithm_type) < node.f(self.algorithm_type):
                    continue
                open_set[str(node.current_node)] = node

            del open_set[str(test_node.current_node)]


def get_solution(puzzle, algorithm_type, heuristic_function_type):
    puzzleObject = Puzzle(algorithm_type, heuristic_function_type)
    puzzle2 = [[int(puzzle[i + j*3]) for i in range(3)] for j in range(3)]
    solution, iterations, isSolvable = puzzleObject.solve(puzzle2)
    list_str=[]
    for i in solution:
        list2 = sum(i['node'], [])
        list_str.append("".join(str(a) for a in list2))

    return list_str, iterations, isSolvable
