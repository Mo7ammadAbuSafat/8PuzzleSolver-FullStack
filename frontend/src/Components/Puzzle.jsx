import {
  Box,
  Button,
  CircularProgress,
  Grid,
  MenuItem,
  Select,
  Stack,
  Typography,
} from "@mui/material";
import "../App.css";
import React, { useState } from "react";
import axios from "axios";

const Puzzle = ({ state }) => {
  const [board, setBoard] = useState(state);
  const [cost, setCost] = useState(0);
  const [numOfIterations, setNumOfIterations] = useState(0);
  const [algorithm, setAlgorithm] = useState(`A*`);
  const [heuristicType, setHeuristicType] = useState("Euclidean");
  const [isLoading, setIsLoading] = useState(false);
  const [isDisabled, setIsDisabled] = useState(false);

  const handleChangeAlgorithm = (event) => {
    setAlgorithm(event.target.value);
  };

  const handleChangeHeuristicType = (event) => {
    setHeuristicType(event.target.value);
  };

  const handleClick = (index) => {
    const blankIndex = board.indexOf(0);

    if (
      (index === blankIndex - 3 && blankIndex >= 3) ||
      (index === blankIndex + 3 && blankIndex <= 5) ||
      (index === blankIndex - 1 && blankIndex % 3 !== 0) ||
      (index === blankIndex + 1 && blankIndex % 3 !== 2)
    ) {
      const newBoard = [...board];

      const temp = newBoard[index];
      newBoard[index] = newBoard[blankIndex];
      newBoard[blankIndex] = temp;

      setBoard(newBoard);
    }
  };

  const handleSolveClick = async () => {
    setIsLoading(true);
    setIsDisabled(true);
    setCost(0);
    setNumOfIterations(0);
    let x = [];
    let isSolvable = true;
    await axios
      .get(`http://127.0.0.1:5000/solve-puzzle`, {
        params: {
          puzzle: board.join(""),
          algorithm: algorithm,
          heuristic: heuristicType,
        },
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
      })
      .then((response) => {
        x = response.data.solution;
        setNumOfIterations(response.data.iterations);
        setCost(response.data.solution.length);
        isSolvable = response.data.isSolvable;
      })
      .catch((err) => console.log(err));

    if (!isSolvable) {
      alert("not solvable");
      setIsLoading(false);
      setIsDisabled(false);
      return;
    }
    let counter = 1;

    let intervalId = setInterval(function () {
      setBoard(x[counter - 1].split("").map((z) => parseInt(z)));
      setCost(counter - 1);
      counter++;

      if (counter === x.length + 1) {
        setIsDisabled(false);
        clearInterval(intervalId);
      }
    }, 400);
    setIsLoading(false);
  };

  // Generate the tile components for the puzzle board
  const tiles = board.map((tile, index) => {
    return (
      <Box
        sx={{
          width: "calc(100% /3)",
          height: "100px",
        }}
        key={index}
        className={`tile ${tile === 0 ? "blank" : ""}`}
        onClick={() => handleClick(index)}
      >
        {tile > 0 ? tile : ""}
      </Box>
    );
  });

  return (
    <Stack
      width={300}
      padding={"40px 40px 20px 40px"}
      boxShadow={12}
      margin={"20px auto"}
    >
      <Stack direction={"row"} flexWrap={"wrap"}>
        {tiles}
      </Stack>
      <Grid container m={"30px 0 0 0"}>
        <Grid item xs={6} p={1}>
          <Stack
            justifyContent={"center"}
            alignItems={"center"}
            sx={{
              backgroundColor: "#757575",
              borderRadius: "3px",
              width: "100%",
              height: "40px",
              color: "white",
            }}
          >
            Cost: {cost}
          </Stack>
        </Grid>
        <Grid item xs={6} p={1}>
          <Stack
            justifyContent={"center"}
            alignItems={"center"}
            sx={{
              backgroundColor: "#757575",
              borderRadius: "3px",
              width: "100%",
              height: "40px",
              color: "white",
            }}
          >
            # Iterations: {numOfIterations}
          </Stack>
        </Grid>
        <Grid item xs={12} p={1}>
          <Select
            value={algorithm}
            onChange={handleChangeAlgorithm}
            sx={{ width: "100%", height: "40px" }}
          >
            <MenuItem value={"A*"}>A* Search</MenuItem>
            <MenuItem value={"Greedy Best First Search"}>
              Greedy Best First Search
            </MenuItem>
            <MenuItem value={"Uniform Cost Search"}>
              Uniform Cost Search
            </MenuItem>
          </Select>
        </Grid>
        <Grid item xs={12} p={1}>
          <Select
            value={heuristicType}
            onChange={handleChangeHeuristicType}
            sx={{ width: "100%", height: "40px" }}
          >
            <MenuItem value={"Euclidean"}>Euclidean distance</MenuItem>
            <MenuItem value={"Manhattan"}>Manhattan distance</MenuItem>
            <MenuItem value={"True False"}>Right Place or Not</MenuItem>
          </Select>
        </Grid>
        <Grid item xs={12} p={1}>
          <Button
            sx={{
              width: "100%",
              height: "42px",
              textTransform: "none",
              background: "#4489f8",
              margin: "10px 0",
            }}
            variant="contained"
            size="large"
            onClick={handleSolveClick}
            disabled={isDisabled}
          >
            {isLoading ? (
              <CircularProgress
                color="inherit"
                size={16}
                sx={{ marginRight: "5px" }}
              />
            ) : (
              "Solve"
            )}
          </Button>
        </Grid>
      </Grid>
    </Stack>
  );
};

export default Puzzle;
