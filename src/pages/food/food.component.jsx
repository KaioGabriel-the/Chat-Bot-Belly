import React, { useState, useEffect, useRef } from 'react';
import { GoogleGenerativeAI } from "@google/generative-ai";
import './food.component.css';

export default function Food({ name, months  }) {
  const [input, setInput] = useState('');
  const [image, setImage] = useState(null);
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);

  const messagesEndRef = useRef(null);
  const genAI = new GoogleGenerativeAI("CHAVE-API-GEMINI"); // Lembre-se: não exponha isso em produção

  // Mensagem inicial automática
  useEffect(() => {
    setMessages([
      {
        from: 'bot',
        text: `Oi, mamãe querida! 🌸 Eu sou a Belly, sua ajudante amiga. Pode me mandar uma perguntinha ou até uma foto do alimento que você quiser analisar. Estou aqui pertinho para cuidar de você e do seu bebê, sempre que precisar! 💖`,
      },
    ]);
  }, [name, months]);
  // Scroll automático
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollTop = messagesEndRef.current.scrollHeight;
    }
  }, [messages]);

  // Converte imagem para o formato do Gemini
  async function fileToGenerativePart(file) {
    const base64EncodedDataPromise = new Promise((resolve) => {
      const reader = new FileReader();
      reader.onloadend = () => resolve(reader.result.split(',')[1]);
      reader.readAsDataURL(file);
    });
    
    return {
      inlineData: { 
        data: await base64EncodedDataPromise,
        mimeType: file.type
      }
    };
  }
    function cleanResponse(text) {
    return text
      .replace(/\*\*(.*?)\*\*/g, '$1')
      .replace(/\*(.*?)\*/g, '$1')
      .replace(/^\s*[\-*+]\s*/gm, '• ')
      .replace(/\n\s*\n/g, '\n\n');
    }
  // Envia mensagem para o Gemini
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
      const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
      
      // Adiciona contexto sobre o bebê no prompt
      const fullPrompt = `Usuário com bebê de ${months} meses chamado ${name}. Pergunta(As perguntas são especificas para o contexto nutricional do bebê. responda com linguagem simples.): ${input}`;
      
      let result;
      if (image) {
        const imagePart = await fileToGenerativePart(image);
        result = await model.generateContent([fullPrompt, imagePart]);
      } else {
        result = await model.generateContent(fullPrompt);
      }

      const response = await result.response;
      const cleanText = cleanResponse(response.text());

      
      setMessages((msgs) => [
        ...msgs,
        { from: 'bot', text: cleanText },
      ]);
    } catch (error) {
      console.error(error);
      setMessages((msgs) => [
        ...msgs,
        { from: 'bot', text: 'Ocorreu um erro ao processar sua mensagem.' },
      ]);
    } finally {
      setInput('');
      setImage(null);
      setLoading(false);
    }
  }

  // [Restante do código permanece igual]
  function handleKeyDown(e) {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  }

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