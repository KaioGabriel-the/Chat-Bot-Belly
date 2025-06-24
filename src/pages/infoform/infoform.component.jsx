import React, { useState } from "react";
import '../infoform/infoform.component.css'
import { useNavigate } from "react-router-dom";

export default function InfoForm({ onSubmit }) {
  const [name, setName] = useState("");
  const [months, setMonths] = useState("");
  const navigate = useNavigate();


  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit({ name, months });
    navigate('/menu');
  };

  return (
    <form onSubmit={handleSubmit} className="form-baby-info">
      <h1>Informe os dados do bebê</h1>
      <label>Nome do bebê:</label><br />
      <input
        type="text"
        value={name}
        onChange={(e) => setName(e.target.value)}
        required
      />
      <br />
      <label>Meses:</label><br />
      <input
        type="number"
        value={months}
        onChange={(e) => setMonths(e.target.value)}
        min="0"
        required
      />
      <br />
      <button type="submit">Salvar</button>
    </form>
  );
}
