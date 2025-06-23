// src/App.jsx
import { useState } from "react";
import Login from "./pages/Login/Login";

function App() {
  const [usuarioLogado, setUsuarioLogado] = useState(null);

  const handleLogin = (usuario) => {
    setUsuarioLogado(usuario);
  };

  return (
    <div>
      {usuarioLogado ? (
        <h1>Bem-vindo, {usuarioLogado}!</h1>
      ) : (
        <Login onLogin={handleLogin} />
      )}
    </div>
  );
}

export default App;
