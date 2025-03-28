import { NextResponse } from "next/server";
import { Ollama } from "@langchain/ollama";
import { SerpAPI } from "@langchain/community/tools/serpapi";

export async function POST(request) {
  try {
    const { query } = await request.json();
    if (!query) {
      return NextResponse.json({ error: "No consultation provided" }, { status: 400 });
    }

    const serpApiTool = new SerpAPI(process.env.SERPAPI_API_KEY);
    const searchResults = await serpApiTool.call(query);

    const llm = new Ollama({ 
    baseUrl: process.env.OLLAMA_BASE_URL,
    model: "llama3" });
    const finalAnswer = await llm.invoke(`
Ask: ${query}
Search results: ${JSON.stringify(searchResults)}

Give me your final answer in English, please.
    `);

    return NextResponse.json({ response: finalAnswer });
  } catch (error) {
    console.error("Error en /api/query:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
