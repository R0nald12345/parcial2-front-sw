import React, { useState } from 'react';
import { GoogleGenerativeAI } from '@google/generative-ai';

function GeminiChat() {
  const [input, setInput] = useState('');
  const [response, setResponse] = useState('');
  const [loading, setLoading] = useState(false);

  const API_KEY = import.meta.env.VITE_GEMINI_API_KEY;

  const contextPrompt = `
You are a GrapesJS component expert. When asked to create components, respond with JSON that follows this exact structure:
{
  "id": "temp-${Date.now()}-${Math.floor(Math.random() * 1000)}",
  "tipo": "[component type]",
  "datos": "{stringified component data}",
  "html": "[component HTML]",
  "style": "{stringified CSS styles}",
  "creado_en": null,
  "id_proyecto": 1
}

Key requirements:
1. Generate unique IDs using timestamp and random number
2. Include proper HTML attributes and classes
3. Follow GrapesJS component structure
4. Provide complete style definitions
5. Ensure JSON is properly escaped

Example for a styled button:
{
  "id": "temp-1748143223220-968",
  "tipo": "text",
  "datos": "{\\"tagName\\":\\"button\\",\\"type\\":\\"text\\",\\"classes\\":[\\"comp-ie1c\\"],\\"attributes\\":{\\"type\\":\\"button\\",\\"data-id-db\\":\\"temp-1748143223220-968\\"},\\"components\\":[{\\"type\\":\\"textnode\\",\\"content\\":\\"Click Me\\"}]}",
  "html": "<button type=\\"button\\" data-id-db=\\"temp-1748143223220-968\\" class=\\"comp-ie1c\\">Click Me</button>",
  "style": "{\\"comp-ie1c\\":{\\"color\\":\\"black\\",\\"border\\":\\"0 solid black\\",\\"background-color\\":\\"#cd3131\\",\\"width\\":\\"100px\\",\\"height\\":\\"100px\\"}}",
  "creado_en": null,
  "id_proyecto": 1
}

Provide the complete JSON response when asked to create components.`;

  const generateResponse = async () => {
    if (!input.trim()) return;

    try {
      setLoading(true);
      const genAI = new GoogleGenerativeAI(API_KEY);
      const model = genAI.getGenerativeModel({
    model: "gemini-2.0-flash",
    contents: "Explain how AI works in a few words",
  });

      const fullPrompt = `${contextPrompt}\n\nUser request: ${input.trim()}\nGenerate the complete component JSON:`;
      const result = await model.generateContent(fullPrompt);
      const text = await result.response.text();

      try {
        const jsonResponse = JSON.parse(text);
        setResponse(JSON.stringify(jsonResponse, null, 2));
      } catch {
        setResponse(text);
      }
    } catch (error) {
      console.error('Error:', error);
      setResponse('Error al generar el componente. Por favor, intenta de nuevo.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="gemini-chat" style={{ 
      padding: '20px',
      maxWidth: '1000px',
      margin: '0 auto',
      fontFamily: 'monospace'
    }}>
      <h2 style={{
        color: '#1a73e8',
        borderBottom: '2px solid #1a73e8',
        paddingBottom: '10px'
      }}>GrapesJS Component Generator</h2>

      <div style={{
        backgroundColor: '#f0f7ff',
        padding: '15px',
        borderRadius: '8px',
        marginBottom: '20px',
        fontSize: '14px'
      }}>
        <p><strong>💡 Ejemplos de solicitudes:</strong></p>
        <ul style={{ marginLeft: '20px' }}>
          <li>Crea un botón rojo con bordes redondeados</li>
          <li>Genera un input de texto con placeholder personalizado</li>
          <li>Crea un label con estilo moderno</li>
          <li>Diseña un botón con gradiente y animación hover</li>
        </ul>
      </div>

      <div className="chat-container">
        <textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Describe el componente que deseas crear..."
          style={{
            width: '100%',
            height: '100px',
            marginBottom: '10px',
            padding: '12px',
            borderRadius: '8px',
            border: '1px solid #ccc',
            fontSize: '14px',
            fontFamily: 'monospace',
            resize: 'vertical'
          }}
        />
        <button 
          onClick={generateResponse}
          disabled={loading}
          style={{
            padding: '12px 24px',
            backgroundColor: '#1a73e8',
            color: 'white',
            border: 'none',
            borderRadius: '24px',
            fontSize: '14px',
            cursor: loading ? 'not-allowed' : 'pointer',
            opacity: loading ? 0.7 : 1,
            transition: 'all 0.3s ease'
          }}
        >
          {loading ? 'Generando componente...' : 'Generar Componente'}
        </button>
        
        {response && (
          <div className="response" style={{
            marginTop: '20px',
            padding: '20px',
            backgroundColor: '#f8f9fa',
            borderRadius: '12px',
            boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
          }}>
            <h3 style={{ color: '#1a73e8', marginBottom: '12px' }}>Componente Generado:</h3>
            <pre style={{
              whiteSpace: 'pre-wrap',
              backgroundColor: '#2d2d2d',
              color: '#e6e6e6',
              padding: '15px',
              borderRadius: '8px',
              overflow: 'auto',
              fontSize: '14px'
            }}>{response}</pre>
          </div>
        )}
      </div>
    </div>
  );
}

export default GeminiChat;