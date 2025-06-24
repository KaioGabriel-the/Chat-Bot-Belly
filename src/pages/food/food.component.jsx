import React, { useState, useEffect, useRef } from 'react';
import './food.component.css';

export default function Food({name, monthes}) {
  const [input, setInput] = useState('');
  const [image, setImage] = useState(null);
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);

  const messagesEndRef = useRef(null);

  // Mensagem inicial automática
  useEffect(() => {
    setMessages([
      {
        from: 'bot',
        text: 'Oi, mamãe querida! 🌸 Eu sou a Belly, sua ajudante amiga. Pode me mandar uma perguntinha ou até uma foto do alimento que você quiser analisar. Estou aqui pertinho para cuidar de você e do seu bebê, sempre que precisar! 💖',
      },
    ]);
  }, []);

  // Scroll para a última mensagem ao atualizar mensagens
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollTop = messagesEndRef.current.scrollHeight;
    }
  }, [messages]);

  // Converte imagem para base64 (sem prefixo)
  async function convertToBase64(file) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => {
        const base64 = reader.result.split(',')[1]; // remove "data:image/jpeg;base64,"
        resolve(base64);
      };
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  }

  // Envia para o backend
  async function sendMessage() {
    if (!input.trim() && !image) return;

    const userMsg = {
      from: 'user',
      text: input,
      image: image ? URL.createObjectURL(image) : null,
    };
    setMessages((msgs) => [...msgs, userMsg]);
    setLoading(true);

    try {
      const payload = {
        prompt: input,
      };

      if (image) {
        const base64Image = await convertToBase64(image);
        payload.image = base64Image;
      }

      const response = await fetch('http://localhost:5000/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const data = await response.json();

      setMessages((msgs) => [
        ...msgs,
        { from: 'bot', text: data.response || 'Sem resposta.' },
      ]);
    } catch (error) {
      console.error(error);
      setMessages((msgs) => [
        ...msgs,
        { from: 'bot', text: 'Erro ao se comunicar com o servidor.' },
      ]);
    } finally {
      setInput('');
      setImage(null);
      setLoading(false);
    }
  }

  // Enviar com Enter
  function handleKeyDown(e) {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  }

  // Atualiza imagem quando selecionada no input file
  function handleImageUpload(e) {
    if (e.target.files && e.target.files[0]) {
      setImage(e.target.files[0]);
    }
  }

  return (
    <div className="chat-container">
      <div className="chat-box">
        <div className="messages" ref={messagesEndRef}>
          {messages.map((msg, i) => (
            <div key={i} className={`message ${msg.from}`}>
              <div>{msg.text}</div>
              {msg.image && <img src={msg.image} alt="Enviado" />}
            </div>
          ))}
        </div>

        <div className="input-area">
          <textarea
            className="chat-input"
            rows={2}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Digite sua mensagem..."
            disabled={loading}
            onKeyDown={handleKeyDown}
          />

          <label htmlFor="file-upload" className="upload-button" title="Enviar imagem">
            📎
          </label>
          <input
            id="file-upload"
            type="file"
            accept="image/*"
            className="file-input"
            onChange={handleImageUpload}
            disabled={loading}
          />

          <button
            className="send-button"
            onClick={sendMessage}
            disabled={loading || (!input.trim() && !image)}
          >
            Enviar
          </button>
        </div>
      </div>
    </div>
  );
}
