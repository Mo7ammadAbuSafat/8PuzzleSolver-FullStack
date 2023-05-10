import { AppBar, Box, Typography } from "@mui/material";
import "./App.css";
import Puzzle from "./Components/Puzzle";

function App() {
  const initialState = [1, 2, 3, 4, 5, 6, 7, 8, 0];
  return (
    <div className="App">
      <Box sx={{ width: "100%", height: "80px" }}>
        <AppBar
          position="static"
          color="primary"
          sx={{
            height: "100%",
            textAlign: "center",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Typography
            variant="h4"
            noWrap
            component="div"
            sx={{ height: "auto" }}
          >
            Welcome To My 8-Puzzle Solver
          </Typography>
        </AppBar>
      </Box>

      <Puzzle state={initialState} />
    </div>
  );
}

export default App;
