import { NextResponse } from "next/server";
import { Ollama } from "@langchain/ollama";
import { SerpAPI } from "@langchain/community/tools/serpapi";

export async function POST(request) {
  try {
    const { query } = await request.json();
    if (!query) {
      return NextResponse.json({ error: "No se proporcionó consulta" }, { status: 400 });
    }

    const serpApiTool = new SerpAPI(process.env.SERPAPI_API_KEY);
    // 1. Hacer la búsqueda
    const searchResults = await serpApiTool.call(query);

    // 2. Invocar a Ollama con un prompt final
    const llm = new Ollama({ 
    baseUrl: process.env.OLLAMA_BASE_URL,
    model: "llama3" });
    const finalAnswer = await llm.invoke(`
Pregunta: ${query}
Resultados de la búsqueda: ${JSON.stringify(searchResults)}

Dame tu respuesta final en español, por favor.
    `);

    // 3. Devolver la respuesta final
    return NextResponse.json({ response: finalAnswer });
  } catch (error) {
    console.error("Error en /api/query:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
