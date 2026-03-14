import os
from dotenv import load_dotenv
from langchain_google_genai import ChatGoogleGenerativeAI
from langchain_core.messages import HumanMessage

# Load from backend/.env
load_dotenv('d:/Mandi_Hacks/Mandi-hacks/autonomarket/backend/.env')

API_KEY = os.getenv("GOOGLE_API_KEY")

try:
    print(f"Testing key ending in ...{API_KEY[-4:] if API_KEY else 'NONE'}")
    llm = ChatGoogleGenerativeAI(
        model="gemini-1.5-flash",
        google_api_key=API_KEY
    )
    
    response = llm.invoke([HumanMessage(content="Hello")])
    print("SUCCESS! Output:", response.content)
except Exception as e:
    print(f"FAILED: {e}")
