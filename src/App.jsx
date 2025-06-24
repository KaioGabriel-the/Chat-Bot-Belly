import React, { useState } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Home from './pages/home/home.component';
import InfoForm from './pages/infoform/infoform.component';

function App() {
  const [babyInfo, setBabyInfo] = useState({ name: "", months: "" });

  const handleBabyInfoSubmit = (info) => {
    setBabyInfo(info);
    console.log("Dados do bebê:", info);
  };

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route
          path="/info"
          element={<InfoForm onSubmit={handleBabyInfoSubmit} />}
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
