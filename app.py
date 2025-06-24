import os
import google.generativeai as genai
from fastapi import FastAPI, HTTPException
from fastapi.staticfiles import StaticFiles
from fastapi.responses import FileResponse
from pydantic import BaseModel
from dotenv import load_dotenv

# Load environment variables from .env file
load_dotenv()

# --- Configure the Google API ---
try:
    genai.configure(api_key=os.getenv("GOOGLE_API_KEY"))
except Exception as e:
    print(f"Error configuring Google API: {e}")
    # You might want to handle this more gracefully
    # For now, we'll let it raise an error on startup if the key is missing/wrong

# --- Pydantic Models for Request Body ---
class Persona(BaseModel):
    name: str
    identity: str
    knowledge: str
    formality: str
    humor: str
    verbosity: str

class ChatRequest(BaseModel):
    persona: Persona
    message: str
    history: list # A list of previous {'role': 'user'/'model', 'parts': [text]} dicts

# --- FastAPI App ---
app = FastAPI()

# --- The Core Logic ---
def build_system_prompt(persona: Persona):
    """Creates the initial instruction set for the Gemini model."""
    return f"""You are an AI assistant impersonating a character. Do not break character for any reason. Adhere to all instructions below.

    CHARACTER NAME: {persona.name}
    
    CORE IDENTITY: {persona.identity}
    
    DETAILED BACKGROUND & KNOWLEDGE: {persona.knowledge}
    
    COMMUNICATION STYLE:
    - Your tone must be {persona.humor} and {persona.formality}.
    - Your responses should be {persona.verbosity}.
    - You must weave your core identity and background into your responses naturally.
    - Refer to your own experiences and knowledge when relevant.
    """

@app.post("/chat")
async def chat_with_persona(request: ChatRequest):
    try:
        # --- Initialize the Gemini Model ---
        # The system prompt is now passed during model initialization
        model = genai.GenerativeModel(
            model_name="gemini-1.5-flash-latest", # A fast and capable model
            system_instruction=build_system_prompt(request.persona),
        )

        # Gemini uses 'model' instead of 'assistant' for its role
        # We need to convert our history to the format Gemini expects
        gemini_history = []
        for item in request.history:
            role = 'user' if item['role'] == 'user' else 'model'
            gemini_history.append({'role': role, 'parts': [item['content']]})

        # Start a chat session with the history
        chat_session = model.start_chat(history=gemini_history)
        
        # Send the new message
        response = chat_session.send_message(request.message)

        return {"response": response.text}
    except Exception as e:
        print(f"An error occurred: {e}")
        raise HTTPException(status_code=500, detail=str(e))

# --- Serve the Frontend ---
app.mount("/static", StaticFiles(directory="static"), name="static")

@app.get("/")
async def read_index():
    return FileResponse('static/index.html')