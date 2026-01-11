from typing import Dict
import os
import secrets
import base64

from fastapi import FastAPI, HTTPException, BackgroundTasks
from fastapi.middleware.cors import CORSMiddleware
from motor.motor_asyncio import AsyncIOMotorClient
from pydantic import BaseModel, EmailStr
from passlib.context import CryptContext
import httpx
from openai import OpenAI
from dotenv import load_dotenv
import asyncio

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

MONGO_URI = os.environ.get("MONGO_URI", "mongodb+srv://vishnumanikandant23cse_db_user:Jzi0LQxVFRN5O9Df@cluster0.l1aeyju.mongodb.net/")
client = AsyncIOMotorClient(MONGO_URI)
db = client["pattupavadai"]
users_col = db["users"]
orders_col = db["orders"]


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


from pydantic import BaseModel, EmailStr

# From Rojitha branch
class AnalyzeRequest(BaseModel):
    image: str

# From main branch
class OrderItem(BaseModel):
    product_id: str
    product_name: str
    fabric_type: str | None = None
    top_style: str | None = None
    bottom_style: str | None = None
    dress_type: str | None = None
    sleeve_type: str | None = None
    neck_design: str | None = None
    border_design: str | None = None
    top_color: str | None = None
    bottom_color: str | None = None
    accent: str | None = None
    # Deprecated/Optional fields
    fabric_id: str | None = None
    fabric_name: str | None = None

class OrderRequest(BaseModel):
    user_email: EmailStr
    items: list[OrderItem]
    total_amount: float
    order_date: str



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


from fastapi import FastAPI, HTTPException, BackgroundTasks
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, EmailStr
from openai import OpenAI
import os
import httpx
import asyncio

app = FastAPI(title="Pattupavadai Auth API", version="0.1.0")

# Example CORS setup
origins = [
    "http://localhost:5173",
    "http://127.0.0.1:5173",
]
app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ---------------------------
# Pydantic Models
# ---------------------------
class AnalyzeRequest(BaseModel):
    image: str

class OrderItem(BaseModel):
    product_id: str
    product_name: str
    fabric_type: str | None = None
    top_style: str | None = None
    bottom_style: str | None = None
    dress_type: str | None = None
    sleeve_type: str | None = None
    neck_design: str | None = None
    border_design: str | None = None
    top_color: str | None = None
    bottom_color: str | None = None
    accent: str | None = None
    # Deprecated/Optional fields
    fabric_id: str | None = None
    fabric_name: str | None = None

class OrderRequest(BaseModel):
    user_email: EmailStr
    items: list[OrderItem]
    total_amount: float
    order_date: str

# ---------------------------
# Analyze Dress Endpoint
# ---------------------------
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
        full_image_url = image_data if image_data.startswith("data:") else f"data:image/jpeg;base64,{image_data}"

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
                {"role": "system", "content": "You are a computer vision fashion attribute extractor. Return only JSON."},
                {"role": "user", "content": [
                    {"type": "text", "text": prompt},
                    {"type": "image_url", "image_url": {"url": full_image_url}}
                ]},
            ],
            temperature=0,
            response_format={"type": "json_object"}
        )
        return {"analysis": response.choices[0].message.content}
    except Exception as e:
        print(f"Error in analyze_dress: {e}")
        raise HTTPException(status_code=500, detail=f"AI Error: {str(e)}")

# ---------------------------
# Orders Endpoints
# ---------------------------
@app.post("/orders", status_code=201)
async def create_order(payload: OrderRequest, background_tasks: BackgroundTasks):
    # Example placeholder: replace with actual user check
    user = await get_user(payload.user_email)  # Implement get_user()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")

    order_doc = payload.dict()
    order_doc["items"] = [item.dict() for item in payload.items]
    result = await orders_col.insert_one(order_doc)  # Implement orders_col (MongoDB collection)
    order_id = str(result.inserted_id)

    for index, item in enumerate(payload.items):
        background_tasks.add_task(generate_and_save_image, order_id, index, item)

    return {"message": "Order created successfully", "orderId": order_id}

async def generate_and_save_image(order_id: str, index: int, item: OrderItem):
    try:
        api_key = os.environ.get("OPENAI_API_KEY")
        if not api_key:
            print("OPENAI_API_KEY not set, skipping image generation")
            return

        client = OpenAI(api_key=api_key)
        
        prompt = f"""
        A high-quality, photorealistic fashion design illustration of a {item.product_name}.
        Details:
        - Fabric: {item.fabric_type or 'Silk'} ({item.fabric_name or ''})
        - Dress Type: {item.dress_type or 'Standard'}
        - Top Style: {item.top_style}
        - Bottom Style: {item.bottom_style}
        - Colors: Top is {item.top_color}, Bottom is {item.bottom_color} with accent {item.accent}
        - Sleeve: {item.sleeve_type}
        - Neck: {item.neck_design}
        - Border: {item.border_design}
        """

        response = client.images.generate(
            model="dall-e-3",
            prompt=prompt,
            size="1024x1024",
            quality="standard",
            n=1,
        )

        image_url = response.data[0].url
        
        if image_url:
            async with httpx.AsyncClient() as http_client:
                r = await http_client.get(image_url)
                if r.status_code == 200:
                    save_path = f"../frontend/public/images/{order_id}_{index}.png"
                    os.makedirs(os.path.dirname(save_path), exist_ok=True)
                    with open(save_path, "wb") as f:
                        f.write(r.content)
                    print(f"Saved image for order {order_id} item {index}")
                else:
                    print(f"Failed to download image for {order_id} item {index}")
    except Exception as e:
        print(f"Error generating image for {order_id} item {index}: {e}")

@app.get("/orders/{user_email}")
async def get_user_orders(user_email: EmailStr):
    cursor = orders_col.find({"user_email": user_email}).sort("order_date", -1)
    orders = await cursor.to_list(length=100)
    for order in orders:
        order["_id"] = str(order["_id"])
    return orders
