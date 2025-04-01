from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from typing import Optional, Dict, Any, Union
import requests
import json

app = FastAPI()

class QueryRequest(BaseModel):
    query: str
    searchResults: Optional[Union[Dict[str, Any], str]] = None

def call_ollama(prompt: str) -> str:
    url = "http://localhost:11434/api/generate"
    headers = {"Content-Type": "application/json"}
    payload = {
        "model": "llama3",     
        "prompt": prompt,
        "stream": False      
    }
    response = requests.post(url, headers=headers, json=payload)
    if response.ok:
        return response.json().get("response", "")
    else:
        raise Exception(f"Error calling Ollama: {response.text}")

@app.post("/llm")
async def process_query(request: QueryRequest):
    try:
        query_text = request.query
        search_results = request.searchResults or {}
        if isinstance(search_results, str):
            try:
                search_results = json.loads(search_results)
            except Exception as parse_err:
                search_results = {}
        prompt = (
            f"Ask: {query_text}\n"
            f"Search results: {search_results}\n"
            "Provide your final answer in English."
        )
        final_answer = call_ollama(prompt)
        return {"response": final_answer}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/")
def read_root():
    return {"message": "Hello from the Python AI service!"}
