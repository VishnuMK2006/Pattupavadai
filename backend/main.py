from typing import Dict
import os
import secrets
import base64
import uuid
import shutil
import httpx

import bcrypt
# Fix for passlib/bcrypt issue
if not hasattr(bcrypt, "__about__"):
    bcrypt.__about__ = type("bcrypt_about", (), {"__version__": bcrypt.__version__})

from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from motor.motor_asyncio import AsyncIOMotorClient
from pydantic import BaseModel, EmailStr
from passlib.context import CryptContext
from dotenv import load_dotenv
from openai import OpenAI
import asyncio
import traceback
from google.oauth2 import id_token
from google.auth.transport import requests as google_requests


load_dotenv()


app = FastAPI(title="Pattupavadai Auth API", version="0.1.0")

_default_frontend_origins = [
    "http://localhost:5173",
    "http://127.0.0.1:5173",
    "http://localhost:3000",
    "http://127.0.0.1:3000",
]

_configured_origins = [
    origin.strip()
    for origin in os.environ.get("FRONTEND_ORIGINS", "").split(",")
    if origin.strip()
]

allowed_origins = _configured_origins or _default_frontend_origins

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "http://127.0.0.1:5173",
        "http://localhost:3000",
        "http://127.0.0.1:3000",
        "http://localhost:8000",
        "http://127.0.0.1:8000",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Serve order images
app.mount("/images", StaticFiles(directory="../frontend/public/images"), name="images")

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

MONGO_URI = os.environ.get("MONGO_URI", "mongodb://localhost:27017/")
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


class GoogleLoginRequest(BaseModel):
    token: str  # ID Token from Google
    email: EmailStr
    name: str
    picture: str = None


class UserResponse(BaseModel):
    email: EmailStr
    name: str
    shipping_address: str
    contact_details: str
    token: str


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
    image_name: str | None = None

class OrderRequest(BaseModel):
    user_email: EmailStr
    items: list[OrderItem]
    total_amount: float
    order_date: str

class PreviewRequest(BaseModel):
    product_name: str
    fabric_type: str
    top_style: str | None = None
    bottom_style: str | None = None
    dress_type: str
    sleeve_type: str
    neck_design: str
    border_design: str
    top_color: str
    bottom_color: str
    accent: str | None = None
    user_email: str



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
    return {"user": serialize_user( record)}


@app.post("/auth/google", response_model=Dict[str, UserResponse])
async def google_auth(payload: GoogleLoginRequest):
    """
    Handles Google Social Login with Server-side verification.
    """
    try:
        # Verify the ID token with Google
        # The 'token' in payload should be the credential string from GSI
        google_client_id = os.environ.get("VITE_GOOGLE_CLIENT_ID")
        id_info = id_token.verify_oauth2_token(
            payload.token, 
            google_requests.Request(), 
            google_client_id,
            clock_skew_in_seconds=300
        )

        # ID token is valid. Check info.
        email = id_info['email']
        name = id_info.get('name', 'Google User')
        picture = id_info.get('picture')

        # Check if user already exists
        record = await get_user(email)
        
        token = issue_token()
        
        if not record:
            # Create new user for first-time social login
            user_doc = {
                "email": email,
                "name": name,
                "shipping_address": "Not provided (Social Login)",
                "contact_details": "Not provided (Social Login)",
                "password_hash": "SOCIAL_AUTH", # No password for social login
                "token": token,
                "picture": picture,
                "auth_provider": "google"
            }
            await users_col.insert_one(user_doc)
            record = user_doc
        else:
            # Update existing user's token
            await users_col.update_one({"email": email}, {"$set": {"token": token}})
            record["token"] = token

        return {"user": serialize_user(record)}
        
    except ValueError as e:
        # Invalid token
        print(f"Google Token Verification Failed: {str(e)}")
        raise HTTPException(status_code=401, detail="Invalid Google token")
    except Exception as e:
        print(f"Social Auth Error: {str(e)}")
        raise HTTPException(status_code=500, detail="Authentication server error")


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

    client = OpenAI(api_key=os.environ.get("OPENAI_API_KEY"))
    try:
        full_image_url = image_data if image_data.startswith("data:") else f"data:image/jpeg;base64,{image_data}"

        prompt = """
Analyze the given clothing image of a South Indian traditional dress (Pattupavadai).

Extract the following attributes strictly based on visual appearance. 
If an attribute is not clearly visible, return null.

Return the result strictly in valid JSON format.

Attributes to extract:

Dress Details:
- dress_type (e.g., Pattupavadai, Langa Voni, Ethnic Frock)
- traditional_style (e.g., South Indian, Festive wear)
- occasion (e.g., festival, wedding, casual)

Top (Blouse) Details:
- top_color
- top_secondary_color
- top_pattern (plain, floral, embroidered, brocade)
- sleeve_type (puff sleeves, half sleeves, sleeveless)
- hand_puff (yes or no)
- hand_puff_color (if hand_puff is yes)
- neck_design (round neck, square neck, V neck, sweetheart neck)
- neck_embellishment (zari, embroidery, beads, none)

Bottom (Skirt / Pavadai) Details:
- bottom_color
- bottom_secondary_color
- skirt_length (short, ankle-length, full-length)
- skirt_flare (low, medium, high)
- bottom_pattern
- skirt_border_present (yes or no)
- skirt_border_type (zari border, temple border, floral border)
- skirt_border_pattern (temple motifs, floral, geometric)
- skirt_border_color
- skirt_border_width (thin, medium, broad)

Fabric & Material:
- fabric_type_top (silk, cotton, organza, mixed)
- fabric_type_bottom
- fabric_finish (matte, glossy, shimmer)

Decorative Elements:
- zari_work_present (yes or no)
- embroidery_present (yes or no)
- motif_type (peacock, floral, temple, abstract)

Color Analysis:
- color_palette (list of dominant colors)
- contrast_style (high contrast or low contrast)


Return output strictly in this JSON structure:
{
  "dress_details": {
    "dress_type": "",
    "traditional_style": "",
    "occasion": ""
  },
  "top_details": {
    "top_color": "",
    "top_secondary_color": "",
    "top_pattern": "",
    "sleeve_type": "",
    "hand_puff": "",
    "hand_puff_color": "",
    "neck_design": "",
    "neck_embellishment": ""
  },
  "bottom_details": {
    "bottom_color": "",
    "bottom_secondary_color": "",
    "skirt_length": "",
    "skirt_flare": "",
    "bottom_pattern": "",
    "skirt_border_present": "",
    "skirt_border_type": "",
    "skirt_border_pattern": "",
    "skirt_border_color": "",
    "skirt_border_width": ""
  },
  "fabric_material": {
    "fabric_type_top": "",
    "fabric_type_bottom": "",
    "fabric_finish": ""
  },
  "decorative_elements": {
    "zari_work_present": "",
    "embroidery_present": "",
    "motif_type": ""
  },
  "color_analysis": {
    "color_palette": [],
    "contrast_style": ""
  }
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


@app.post("/preview-image")
async def generate_preview_image(payload: PreviewRequest) -> Dict[str, str]:
    print(f"Incoming preview request for: {payload.user_email}")
    # Use the key from image_gen.py as fallback if env not set
    api_key = os.environ.get("OPENAI_API_KEY")
    if not api_key:
        print("Key nahi")
        raise HTTPException(status_code=500, detail="OpenAI API key not configured")

    client = OpenAI(api_key=api_key)

    prompt = f"""
    A high-quality, photorealistic fashion design illustration of a {payload.product_name}.
    Details:
    - Fabric: {payload.fabric_type}
    - Dress Type: {payload.dress_type}
    - Top Style: {payload.top_style or 'Classic'}
    - Bottom Style: {payload.bottom_style or 'Standard'}
    - Colors: Top is {payload.top_color}, Bottom is {payload.bottom_color}
    - Sleeve: {payload.sleeve_type}
    - Neck: {payload.neck_design}
    - Border: {payload.border_design}
    - Accent: {payload.accent or 'None'}
    Rendered as a professional catalog photo on a mannequin with studio lighting.
    """

    try:
        # Using synchronous call wrapped in asyncio.to_thread for safety in async endpoint
        import asyncio
        response = client.images.generate(
        model="dall-e-3",      # Use DALL-E 3
        prompt=prompt,
        size="1024x1024",      # Supported sizes: 1024x1024, 1792x1024, etc.
        response_format="b64_json"
        )
        
        image_base64 = response.data[0].b64_json
        
        # Save unique image
        image_uuid = str(uuid.uuid4())
        filename = f"temp_{payload.user_email.replace('@', '_').replace('.', '_')}_{image_uuid}.png"
        
        save_dir = "../frontend/public/images/temp"
        os.makedirs(save_dir, exist_ok=True)
        save_path = os.path.join(save_dir, filename)
        
        with open(save_path, "wb") as f:
            f.write(base64.b64decode(image_base64))
            
        return {
            "image_base64": image_base64,
            "image_name": filename
        }
    except Exception as exc:
        err_msg = str(exc)
        print(f"Preview generation failed: {err_msg}")
        traceback.print_exc()
        raise HTTPException(status_code=500, detail=f"DALL-E Error: {err_msg}")

# ---------------------------
# Orders Endpoints
# ---------------------------
@app.post("/orders", status_code=201)
async def create_order(payload: OrderRequest):
    print(f"Incoming order request for: {payload.user_email}")
    user = await get_user(payload.user_email)
    if not user:
        raise HTTPException(status_code=404, detail="User not found")

    order_doc = payload.dict()
    order_doc["items"] = [item.dict() for item in payload.items]
    result = await orders_col.insert_one(order_doc)
    order_id = str(result.inserted_id)

    # Move images from temp to orders folder
    temp_dir = "../frontend/public/images/temp"
    orders_dir = "../frontend/public/images/orders"
    os.makedirs(orders_dir, exist_ok=True)

    for index, item in enumerate(payload.items):
        if item.image_name:
            old_path = os.path.join(temp_dir, item.image_name)
            new_filename = f"{order_id}_{index}.png"
            new_path = os.path.join(orders_dir, new_filename)
            
            if os.path.exists(old_path):
                shutil.move(old_path, new_path)
                print(f"Moved image for order {order_id} item {index}")
            else:
                print(f"Warning: Temp image {item.image_name} not found for order {order_id}")

    return {"message": "Order created successfully", "orderId": order_id}


@app.get("/orders/{user_email}")
async def get_user_orders(user_email: EmailStr):
    cursor = orders_col.find({"user_email": user_email}).sort("order_date", -1)
    orders = await cursor.to_list(length=100)
    for order in orders:
        order["_id"] = str(order["_id"])
    return orders


@app.get("/admin/orders")
async def get_all_orders():
    # Fetch all orders regardless of user
    cursor = orders_col.find({}).sort("order_date", -1)
    orders = await cursor.to_list(length=1000)
    for order in orders:
        order["_id"] = str(order["_id"])
    return orders


# Chatbot proxy endpoint to bypass CORS
class ChatbotQueryRequest(BaseModel):
    query: str


@app.post("/chatbot/query")
async def chatbot_query(request: ChatbotQueryRequest):
    """
    Proxy endpoint for chatbot queries to external RAG API
    """
    try:
        async with httpx.AsyncClient(timeout=30.0) as client:
            response = await client.post(
                "https://rag-medical.onrender.com/query",
                json={"query": request.query},
                headers={"Content-Type": "application/json"}
            )
            
            if response.status_code == 200:
                return response.json()
            else:
                raise HTTPException(
                    status_code=response.status_code,
                    detail="Failed to get response from chatbot service"
                )
    except httpx.TimeoutException:
        raise HTTPException(status_code=504, detail="Chatbot service timeout")
    except Exception as e:
        print(f"Chatbot query error: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Chatbot service error: {str(e)}")
