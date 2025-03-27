"use client";
import { useSearchParams } from "next/navigation";
import Image from "next/image";

export default function ResultsPage() {
  const searchParams = useSearchParams();
  const response = searchParams.get("response");

  return (
    <div className="min-h-screen bg-black flex items-center justify-center p-4">
      <div 
        className="bg-gray-900 p-8 rounded shadow-md w-full max-w-2xl border-l-4 border-r-4 border-transparent hover:border-green-500 focus-within:border-green-500 transition-colors duration-200"
      >
        <div className="flex justify-center mb-6">
        <Image src="/image.png" alt="Ollama image" width={200} height={200} />
        </div>
        <h1 className="text-3xl font-bold text-center text-green-500 mb-6">
        Ollama Response
        </h1>
        <p className="text-gray-300 text-lg">
          {response || "No hay resultados para mostrar."}
        </p>
      </div>
    </div>
  );
}
