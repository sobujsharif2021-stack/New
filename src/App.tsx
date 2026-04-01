import { useState } from 'react';
import { GoogleGenAI } from '@google/genai';
import { Send } from 'lucide-react';

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY! });

export default function App() {
  const [messages, setMessages] = useState<{ role: 'user' | 'ai'; text: string }[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSend = async () => {
    if (!input.trim()) return;

    const userMessage = { role: 'user' as const, text: input };
    setMessages((prev) => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: `Respond in Bangla. User says: ${input}`,
      });
      
      const aiMessage = { role: 'ai' as const, text: response.text || 'দুঃখিত, আমি কিছু বুঝতে পারিনি।' };
      setMessages((prev) => [...prev, aiMessage]);
    } catch (error) {
      console.error(error);
      setMessages((prev) => [...prev, { role: 'ai', text: 'দুঃখিত, একটি সমস্যা হয়েছে।' }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-screen bg-gray-100 p-4">
      <h1 className="text-2xl font-bold mb-4 text-center">আমার সাথে চ্যাট করুন</h1>
      <div className="flex-1 overflow-y-auto mb-4 bg-white p-4 rounded-lg shadow">
        {messages.map((msg, index) => (
          <div key={index} className={`mb-2 ${msg.role === 'user' ? 'text-right' : 'text-left'}`}>
            <span className={`inline-block p-2 rounded-lg ${msg.role === 'user' ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}>
              {msg.text}
            </span>
          </div>
        ))}
        {isLoading && <div className="text-left text-gray-500">লিখছি...</div>}
      </div>
      <div className="flex gap-2">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && handleSend()}
          className="flex-1 p-2 border rounded-lg"
          placeholder="এখানে লিখুন..."
        />
        <button onClick={handleSend} className="p-2 bg-blue-500 text-white rounded-lg">
          <Send size={20} />
        </button>
      </div>
    </div>
  );
}

