import React from "react";
import { Route, Routes } from "react-router-dom";
import Home from "./pages/Home";
import ChatsHome from "./pages/ChatsHome"

import "./App.css"

const App = () => {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/Chats" element={<ChatsHome />} />
    </Routes>
  );
};

export default App;
