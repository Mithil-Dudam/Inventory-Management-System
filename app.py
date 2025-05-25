from fastapi import FastAPI, WebSocket, WebSocketDisconnect, HTTPException, status, Depends, UploadFile, File, Form
from fastapi.staticfiles import StaticFiles
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from pydantic import BaseModel
from typing import Annotated, Optional
from datetime import datetime, timedelta

from sqlalchemy import create_engine, or_
from sqlalchemy.orm import sessionmaker

from sqlalchemy import Column, Integer, String, ForeignKey, ARRAY

from sqlalchemy.orm import Session,declarative_base

from passlib.context import CryptContext

from selenium import webdriver
from selenium.webdriver.chrome.service import Service
from selenium.webdriver.common.by import By
from selenium.webdriver.common.keys import Keys
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
import time
import random
import shutil

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

URL_db = 'postgresql://postgres:password@localhost:5432/Inventory-Management-System' 

engine = create_engine(URL_db)
sessionLocal = sessionmaker(autocommit=False,autoflush=False,bind=engine)
Base=declarative_base()

class Users(Base):
    __tablename__ = 'Users'
    id = Column(Integer, primary_key=True, index=True)
    email = Column(String,index=True)
    password = Column(String,index=True)
    role = Column(String, index=True)

class UserInfo(BaseModel):
    email:str
    password:str

class Categories(Base):
    __tablename__ = 'Categories'
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, index=True)
    parent = Column(String, index=True)

class Products(Base):
    __tablename__ = 'Products'
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, index=True)
    description = Column(String, index=True)
    category = Column(String, ForeignKey("Categories.name"), index=True)
    price = Column(float, index=True)
    image_url = Column(String, index=True)

Base.metadata.create_all(bind=engine)

def get_db():
    db=sessionLocal()
    try:
        yield db
    finally:
        db.close()

db_dependency=Annotated[Session,Depends(get_db)]

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

@app.post("/register",status_code=status.HTTP_201_CREATED)
async def register(user:UserInfo, db:db_dependency):
    db_user = db.query(Users).filter(Users.email==user.email).first()
    if db_user:
        raise HTTPException(status_code=302,detail="Account already exists with this email.")
    db_user_password = pwd_context.hash(user.password)
    db_user = Users(email=user.email,password=db_user_password)
    db.add(db_user)
    db.commit()
    db.refresh(db_user)
    return{"message":"User created successfully."}

@app.post("/login",status_code=status.HTTP_200_OK)
async def login(user:UserInfo, db:db_dependency):
    db_user = db.query(Users).filter(Users.email==user.email).first()
    if db_user:
        if pwd_context.verify(user.password,db_user.password):
            return{"message":"logged in sucessfully.","user_id":db_user.id, "role":db_user.role}
        raise HTTPException(status_code=404,detail="Invalid email or password.")
    raise HTTPException(status_code=404,detail="Invalid email or password.")