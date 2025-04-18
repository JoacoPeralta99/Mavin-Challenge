"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";

export default function HomePage() {
  const [query, setQuery] = useState("");
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const res = await fetch("/api/query", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ query }),
    });
    const data = await res.json();
    router.push(`/results?response=${encodeURIComponent(data.response)}`);
  };

  return (
    <div className="min-h-screen bg-black flex items-center justify-center">
      <form 
        onSubmit={handleSubmit} 
        
        className="bg-gray-900 p-8 rounded shadow-md w-full max-w-md border-l-4 border-r-4 border-transparent hover:border-green-800 focus-within:border-green-800 transition-colors duration-200"
      >
        <div className="flex justify-center mb-6">
          <Image src="/image.png" alt="Ollama image" width={200} height={200} />
          </div>
        <h1 className="text-2xl font-bold mb-4 text-center text-green-800">
          enter your question
        </h1>
        <input 
          type="text"
          placeholder="Write your consult here"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
       
          className="w-full p-3 border border-gray-700 rounded mb-4 focus:outline-none focus:ring-2 focus:ring-green-800"
          required
        />
        <button 
          type="submit" 
          className="w-full bg-green-700 hover:bg-green-800 text-white p-3 rounded font-bold"
        >
          Send
        </button>
      </form>
    </div>
  );
}
