import Box from "@mui/material/Box/Box";
import { SxProps } from "@mui/system/styleFunctionSx/styleFunctionSx";
import { Theme } from "@mui/system/createTheme/createTheme";

import React from "react";
import "./App.css";

import { BrowserRouter as Router, Route, Routes } from "react-router-dom";

import { WatcherProvider } from "./WatcherContext";
import Sender from "./pages/Sender";
import Receiver from "./pages/Receiver";
import { SocketProvider } from "./SocketContext";
import Home from "./pages/Home";

const App = () => {
  const sx: SxProps<Theme> = {};

  return (
    <Router>
      <WatcherProvider>
        <SocketProvider>
          <Box sx={sx}>
            <Routes>
              <Route path="/receive" element={<Receiver />} />
              <Route path="/send" element={<Sender />} />
              <Route path="/" element={<Home />} />
            </Routes>
          </Box>
        </SocketProvider>
      </WatcherProvider>
    </Router>
  );
};

export default App;
