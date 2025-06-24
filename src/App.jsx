import React, { useState } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Home from './pages/home/home.component';
import InfoForm from './pages/infoform/infoform.component';
import Menu from './pages/menu/menu.component';
import Food from './pages/food/food.component';


function App() {
  const [babyInfo, setBabyInfo] = useState({ name: "", months: "" });

  const handleBabyInfoSubmit = (info) => {
    setBabyInfo(info);
    console.log(info);
  };

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route
          path="/info"
          element={<InfoForm onSubmit={handleBabyInfoSubmit} />}
        />
        <Route path='/menu'
        element={<Menu/>}
        />
         <Route path='/food'
        element={<Food name={babyInfo.name} months={babyInfo.months} />}
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
