from typing import Dict
import os
import secrets
import base64

from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from motor.motor_asyncio import AsyncIOMotorClient
from pydantic import BaseModel, EmailStr
from passlib.context import CryptContext
from openai import OpenAI
from dotenv import load_dotenv

load_dotenv()

app = FastAPI(title="Pattupavadai Auth API", version="0.1.0")

origins = [
    "http://localhost:5173",
    "http://127.0.0.1:5173",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://127.0.0.1:5173", "http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

MONGO_URI = os.environ.get("MONGO_URI", "mongodb://localhost:27017")
client = AsyncIOMotorClient(MONGO_URI)
db = client["pattupavadai"]
users_col = db["users"]


class SignupRequest(BaseModel):
    email: EmailStr
    name: str
    shipping_address: str
    contact_details: str
    password: str


class LoginRequest(BaseModel):
    email: EmailStr
    password: str


class UserResponse(BaseModel):
    email: EmailStr
    name: str
    shipping_address: str
    contact_details: str
    token: str


class AnalyzeRequest(BaseModel):
    image: str


def hash_password(password: str) -> str:
    return pwd_context.hash(password)


def verify_password(plain_password: str, hashed_password: str) -> bool:
    return pwd_context.verify(plain_password, hashed_password)


def issue_token() -> str:
    return secrets.token_hex(16)


def serialize_user(record: Dict[str, str]) -> UserResponse:
    return UserResponse(
        email=record["email"],
        name=record["name"],
        shipping_address=record["shipping_address"],
        contact_details=record["contact_details"],
        token=record["token"],
    )


@app.on_event("startup")
async def init_indexes() -> None:
    await users_col.create_index("email", unique=True)
    if os.environ.get("OPENAI_API_KEY"):
        print("OpenAI API Key loaded successfully")
    else:
        print("WARNING: OpenAI API Key NOT found in environment")


async def get_user(email: str) -> Dict[str, str] | None:
    return await users_col.find_one({"email": email})


@app.get("/health")
async def healthcheck() -> Dict[str, str]:
    return {"status": "ok"}


@app.post("/auth/signup", response_model=Dict[str, UserResponse])
async def signup(payload: SignupRequest):
    existing = await get_user(payload.email)
    if existing:
        raise HTTPException(status_code=400, detail="Email already registered")

    token = issue_token()
    user_doc: Dict[str, str] = {
        "email": payload.email,
        "name": payload.name,
        "shipping_address": payload.shipping_address,
        "contact_details": payload.contact_details,
        "password_hash": hash_password(payload.password),
        "token": token,
    }

    await users_col.insert_one(user_doc)

    return {"user": serialize_user(user_doc)}


@app.post("/auth/login", response_model=Dict[str, UserResponse])
async def login(payload: LoginRequest):
    # Hardcoded admin check
    if payload.email == "admin@gmail.com" and payload.password == "admin123@":
        token = issue_token()
        admin_user = {
            "email": "admin@gmail.com",
            "name": "Administrator",
            "shipping_address": "Admin Office",
            "contact_details": "Admin Support",
            "token": token
        }
        return {"user": UserResponse(**admin_user)}

    record = await get_user(payload.email)
    if not record or not verify_password(payload.password, record["password_hash"]):
        raise HTTPException(status_code=401, detail="Invalid credentials")

    token = issue_token()
    await users_col.update_one({"email": payload.email}, {"$set": {"token": token}})
    record["token"] = token
    return {"user": serialize_user(record)}


@app.post("/analyze-dress")
async def analyze_dress(payload: AnalyzeRequest):
    print("Received analyze-dress request")
    image_data = payload.image
    if not image_data:
        raise HTTPException(status_code=400, detail="No image data provided")

    if "," in image_data:
        image_data = image_data.split(",")[1]

    api_key = os.environ.get("OPENAI_API_KEY")
    if not api_key:
        print("Error: OPENAI_API_KEY not found in environment")
        raise HTTPException(status_code=500, detail="OpenAI API key not configured")

    client = OpenAI(api_key=api_key)

    try:
        # Robustly handle image data
        if image_data.startswith("data:"):
             # It already has the prefix
             full_image_url = image_data
        else:
             # Basic base64 payload, assume jpeg
             full_image_url = f"data:image/jpeg;base64,{image_data}"

        print(f"Sending request to OpenAI... Payload size: {len(full_image_url)}")

        prompt = """
Analyze the given clothing image (Pattupavadai/South Indian traditional wear) and extract the following attributes:

- dress_type (e.g., Pattupavadai, Langa Voni, Ethnic Frock)
- sleeve_type (e.g., puff sleeves, half sleeves, sleeveless)
- neck_design (e.g., round neck, square neck, sweetheart neck)
- border_design (e.g., zari border, temple border, floral border)
- color_palette (list dominant colors)
- fabric_type (e.g., silk, cotton, organza)

Return the result strictly in this JSON format:

{
  "dress_type": "",
  "sleeve_type": "",
  "neck_design": "",
  "border_design": "",
  "color_palette": "",
  "fabric_type": ""
}
"""

        response = client.chat.completions.create(
            model="gpt-4o-mini",
            messages=[
                {
                    "role": "system",
                    "content": "You are a computer vision fashion attribute extractor. Return only JSON."
                },
                {
                    "role": "user",
                    "content": [
                        {"type": "text", "text": prompt},
                        {
                            "type": "image_url",
                            "image_url": {
                                "url": full_image_url
                            },
                        },
                    ],
                }
            ],
            temperature=0,
            response_format={"type": "json_object"}
        )
        print("Successfully received response from OpenAI")
        return {"analysis": response.choices[0].message.content}
    except Exception as e:
        print(f"CRITICAL Error in analyze_dress: {str(e)}")
        raise HTTPException(status_code=500, detail=f"AI Error: {str(e)}")
