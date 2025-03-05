// App.js - Updated with additional routes
import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import List from "./components/List";
import Create from "./components/Create";
import Edit from "./components/Edit";
import Detail from "./components/Detail";
import Navbar from "./components/Navbar";

function App() {
  return (
    <Router>
      <Navbar />
      <div className="container mt-5">
        <Routes>
          <Route path="/" element={<Navigate to="/notes" />} />
          <Route path="/notes" element={<List />} />
          <Route path="/notes/create" element={<Create />} />
          <Route path="/notes/:id" element={<Detail />} />
          <Route path="/notes/:id/edit" element={<Edit />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
