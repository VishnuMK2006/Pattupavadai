from typing import Dict
import os
import secrets

from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from motor.motor_asyncio import AsyncIOMotorClient
from pydantic import BaseModel, EmailStr
from passlib.context import CryptContext

app = FastAPI(title="Pattupavadai Auth API", version="0.1.0")

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
    record = await get_user(payload.email)
    if not record or not verify_password(payload.password, record["password_hash"]):
        raise HTTPException(status_code=401, detail="Invalid credentials")

    token = issue_token()
    await users_col.update_one({"email": payload.email}, {"$set": {"token": token}})
    record["token"] = token
    return {"user": serialize_user(record)}


@app.post("/orders", status_code=201)
async def create_order(payload: OrderRequest):
    # Verify user exists
    user = await get_user(payload.user_email)
    if not user:
        raise HTTPException(status_code=404, detail="User not found")

    order_doc = payload.dict()
    # Ensure items are stored as list of dicts for mongo
    order_doc["items"] = [item.dict() for item in payload.items]
    
    result = await orders_col.insert_one(order_doc)
    return {"message": "Order created successfully", "orderId": str(result.inserted_id)}


@app.get("/orders/{user_email}")
async def get_user_orders(user_email: EmailStr):
    # Retrieve all orders for this user, sorted by date (newest first)
    cursor = orders_col.find({"user_email": user_email}).sort("order_date", -1)
    orders = await cursor.to_list(length=100)
    
    # Convert ObjectId to string for JSON serialization
    for order in orders:
        order["_id"] = str(order["_id"])
        
    return orders
