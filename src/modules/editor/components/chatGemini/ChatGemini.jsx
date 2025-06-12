import React, { useState } from 'react';
import axios from 'axios';

const ChatGemini = ({ onGenerateShapes }) => {
    const [userPrompt, setUserPrompt] = useState('');
    const [image, setImage] = useState(null);
    const [loading, setLoading] = useState(false);

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

    return (
        <div className="p-4 bg-gray-700 text-white">
            <textarea
                rows={4}
                className="w-full text-black mb-2"
                placeholder="Describe tu diseño..."
                value={userPrompt}
                onChange={(e) => setUserPrompt(e.target.value)}
            />
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
