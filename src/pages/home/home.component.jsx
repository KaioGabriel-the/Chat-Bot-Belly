import React from "react";
import '../home/home.component.css'
import { useNavigate } from "react-router-dom";

export default function Home() {
  const navigate = useNavigate();

  const irMenu = () => {
    navigate('/info');
  };

  return (
    <div className="container-home">
      <h2>Bem-vindo ao Baby Bite</h2>
      <h3>
        O Baby Bite é uma ferramenta para auxiliar as mães com a alimentação dos bebês e outros cuidados.
      </h3>
      <h3>
        Entre e explore mais a nossa ferramenta!
      </h3>
      <button onClick={irMenu}>Entrar</button>
    </div>
  );
}
