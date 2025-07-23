import React, { useState, useRef } from 'react';
import axios from 'axios';

const ChatGemini = ({ onGenerateShapes }) => {
    const [userPrompt, setUserPrompt] = useState('');
    const [image, setImage] = useState(null);
    const [loading, setLoading] = useState(false);
    const [isRecording, setIsRecording] = useState(false);
    const recognitionRef = useRef(null);

    // 🔹 Prompt base que "enseña" a Gemini cómo responder
    const basePrompt = `Dibuja una interfaz para Flutter. Devuélvela en un arreglo JSON.

Cada objeto debe tener:
- type: 'rectangle', 'circle', 'triangle', 'line', 'text', 'image'
- x, y, width, height
- fill (color de fondo)
- text (solo si es tipo 'text')
- fontSize (solo si es texto)
- fontFamily (opcional)
- stroke y strokeWidth (opcional)
- rotation (en grados, opcional)

Ejemplo:
[
  { "type": "rectangle", "x": 40, "y": 60, "width": 300, "height": 500, "fill": "#D9D9D9" },
  { "type": "text", "x": 60, "y": 80, "text": "Correo", "fontSize": 18, "fill": "#000000" },
  { "type": "rectangle", "x": 60, "y": 160, "width": 180, "height": 40, "fill": "#4CAF50" }
]`;

    const handleImageUpload = (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = () => setImage(reader.result.split(',')[1]); // Base64 puro
            reader.readAsDataURL(file);
        }
    };

    const sendPrompt = async () => {
        setLoading(true);

        const API_URL = import.meta.env.VITE_API_URL;
        const contents = [
            {
                parts: [
                    { text: `${basePrompt}\n\n${userPrompt}` }
                ]
            }
        ];

        try {
            const res = await axios.post(`${API_URL}/gemini`, {
                contents,
                image
            });

            const textResponse = res.data.candidates?.[0]?.content?.parts?.[0]?.text || "";

            // 🔹 Extraer solo el bloque JSON válido (objeto o array)
            const match = textResponse.match(/```json\s*([\s\S]*?)\s*```/) ||
                textResponse.match(/({[\s\S]*})/) ||
                textResponse.match(/(\[[\s\S]*\])/);

            if (!match) {
                alert("❌ No se encontró un bloque JSON válido.");
                return;
            }

            const cleanedText = match[1].trim();
            const parsed = JSON.parse(cleanedText);

            // Detectar si es un array directo o { elements: [...] }
            const shapes = Array.isArray(parsed)
                ? parsed
                : Array.isArray(parsed.elements)
                    ? parsed.elements
                    : null;

            if (shapes) {
                onGenerateShapes(shapes);
            } else {
                alert("❌ El JSON no tiene una estructura válida de shapes.");
            }

        } catch (err) {
            if (err.response) {
                console.error("❌ Error de respuesta:", err.response.data);
                alert(`❌ Error: ${err.response.data.error || 'Respuesta inválida de Gemini'}`);
            } else if (err.request) {
                console.error("❌ No se recibió respuesta de Gemini:", err.request);
                alert("❌ No se recibió respuesta del servidor.");
            } else {
                console.error("❌ Error general:", err.message);
                alert("❌ Error inesperado: " + err.message);
            }
        } finally {
            setLoading(false);
        }
    };

    // 🔹 Función para manejar el micrófono y la transcripción
    const handleMicClick = () => {
        // Si ya está grabando, detener
        if (isRecording) {
            recognitionRef.current && recognitionRef.current.stop();
            setIsRecording(false);
            return;
        }

        // Compatibilidad con SpeechRecognition
        const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
        if (!SpeechRecognition) {
            alert('La API de reconocimiento de voz no está soportada en este navegador. Usa Chrome o Edge.');
            return;
        }

        const recognition = new SpeechRecognition();
        recognition.lang = 'es-ES'; // Puedes cambiar el idioma si lo deseas
        recognition.interimResults = false;
        recognition.maxAlternatives = 1;

        recognition.onstart = () => {
            setIsRecording(true);
        };
        recognition.onresult = (event) => {
            const transcript = event.results[0][0].transcript;
            setUserPrompt(prev => prev + (prev ? ' ' : '') + transcript);
        };
        recognition.onerror = (event) => {
            alert('Error en el reconocimiento de voz: ' + event.error);
            setIsRecording(false);
        };
        recognition.onend = () => {
            setIsRecording(false);
        };

        recognitionRef.current = recognition;
        recognition.start();
    };

    return (
        <div className="p-4 bg-gray-700 text-white">
            <div className="flex items-center mb-2 gap-2">
                <textarea
                    rows={4}
                    className="w-full text-black"
                    placeholder="Describe tu diseño..."
                    value={userPrompt}
                    onChange={(e) => setUserPrompt(e.target.value)}
                />
                <button
                    type="button"
                    onClick={handleMicClick}
                    className={`p-2 rounded-full border-2 ${isRecording ? 'bg-red-500 border-red-700 animate-pulse' : 'bg-gray-200 border-gray-400'} text-black flex items-center justify-center`}
                    title={isRecording ? 'Detener grabación' : 'Hablar'}
                >
                    {/* Icono de micrófono SVG */}
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 18.75v2.25m0 0h3m-3 0H9m6-2.25a6 6 0 01-12 0m12 0V12a6 6 0 00-12 0v4.5" />
                        <rect x="9" y="3" width="6" height="10" rx="3" fill={isRecording ? '#ef4444' : '#a3a3a3'} />
                    </svg>
                </button>
            </div>
            <input type="file" accept="image/*" onChange={handleImageUpload} className="mb-2" />
            <button
                onClick={sendPrompt}
                className="bg-blue-600 px-4 py-2 rounded"
                disabled={loading}
            >
                {loading ? "Generando..." : "Generar Diseño"}
            </button>
        </div>
    );
};

export default ChatGemini;
