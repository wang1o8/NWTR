import React, { useState, useRef, useEffect } from 'react';
import { GoogleGenAI } from '@google/genai';

export default function ChatBot({ onClose }) {
  const [messages, setMessages] = useState([
    { role: 'assistant', text: 'Chào người lữ hành. Tôi là người hướng dẫn AI. Hãy hỏi tôi bất cứ điều gì về các thế giới.' }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim()) return;
    
    const userMsg = input.trim();
    setMessages(prev => [...prev, { role: 'user', text: userMsg }]);
    setInput('');
    setIsLoading(true);

    try {
      const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
      const response = await ai.models.generateContent({
        model: 'gemini-3.1-pro-preview',
        contents: userMsg,
        config: {
          systemInstruction: "Bạn là một người hướng dẫn AI trong một trò chơi Visual Novel RPG. Bạn biết về các thế giới khác nhau như Hư Vô (Void), Aethelgard (fantasy), và Neo-Tokyo 21XX (sci-fi). Hãy trả lời các câu hỏi của người chơi bằng giọng điệu bí ẩn và hữu ích. Hãy trả lời bằng tiếng Việt."
        }
      });
      
      setMessages(prev => [...prev, { role: 'assistant', text: response.text }]);
    } catch (error) {
      console.error("AI Error:", error);
      setMessages(prev => [...prev, { role: 'assistant', text: 'Kết nối của tôi với Nexus bị gián đoạn. Vui lòng thử lại sau.' }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="chatbot-modal">
      <div className="chatbot-content">
        <div className="chatbot-header">
          <h2>Hướng dẫn AI</h2>
          <button className="close-btn" onClick={onClose}>X</button>
        </div>
        
        <div className="chatbot-messages">
          {messages.map((msg, i) => (
            <div key={i} className={`chat-msg ${msg.role}`}>
              {msg.text}
            </div>
          ))}
          {isLoading && <div className="chat-msg assistant">Đang suy nghĩ...</div>}
          <div ref={messagesEndRef} />
        </div>
        
        <div className="chatbot-input">
          <input 
            type="text" 
            value={input} 
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
            placeholder="Hỏi người hướng dẫn..."
          />
          <button onClick={handleSend} disabled={isLoading}>Gửi</button>
        </div>
      </div>
    </div>
  );
}
