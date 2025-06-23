import { useState } from "react";
import "./Login.css";
import usuariosJson from "../../data/usarios.json"

export default function Login({OnLogin}){
  const [usuario, setUsuario] = useState("");
  const [senha, setSenha] = useState("");
  const [erro, setErro] = useState("");

  const handleLogin = () => {
    const usuarios = usuariosJson; // Pegando do JSON importado

    if (usuarios[usuario] && usuarios[usuario].senha === senha) {
      onLogin(usuario);
    } else {
      setErro("Usuário ou senha incorretos");
    }
};

  return (
    <div className="login-container">
      <h2>Login</h2>
      <div className="login-dados">
        <input
          placeholder="Usuário"
          value={usuario}
          onChange={(event) => setUsuario(event.target.value)}
        />
        <input
        type="password"
        placeholder="Senha"
        value={senha}
        onChange={(event) => setSenha(event.target.value)}
        />
         <button onClick={handleLogin}>Entrar</button>
          {erro && <p className="error">{erro}</p>}
      </div>
    </div>
  );
}