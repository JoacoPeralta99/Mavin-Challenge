import { NextResponse } from "next/server";
import { SerpAPI } from "@langchain/community/tools/serpapi";

export async function POST(request) {
  try {
    const { query } = await request.json();
    if (!query) {
      return NextResponse.json({ error: "No consultation provided" }, { status: 400 });
    }
    
    const serpApiTool = new SerpAPI(process.env.SERPAPI_API_KEY);
    const searchResults = await serpApiTool.call(query);

    const payload = {
      query: query,
      searchResults: searchResults
    };

    const pythonResponse = await fetch(process.env.PYTHON_SERVICE, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    if (!pythonResponse.ok) {
      const errorData = await pythonResponse.json();
      return NextResponse.json({ error: errorData.detail }, { status: pythonResponse.status });
    }

    const data = await pythonResponse.json();
    return NextResponse.json({ response: data.response });
  } catch (error) {
    console.error("Error in /api/query:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
