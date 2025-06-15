from fastapi import FastAPI, WebSocket, WebSocketDisconnect, HTTPException, status, Depends, UploadFile, File, Form, Query
from fastapi.staticfiles import StaticFiles
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from pydantic import BaseModel
from typing import Annotated, Optional
from datetime import datetime, timedelta

from sqlalchemy import create_engine, or_
from sqlalchemy.orm import sessionmaker

from sqlalchemy import Column, Integer, String, ForeignKey, ARRAY, Float

from sqlalchemy.orm import Session,declarative_base,relationship

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

URL_db = 'postgresql://postgres:password@localhost:5432/Inventory Management System' 

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
    role:str

class Categories(Base):
    __tablename__ = 'Categories'
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, index=True)
    parent = Column(String, index=True)
    products = relationship("Products", back_populates="category_obj")

class CategoryInfo(BaseModel):
    name:str
    parent:str

class Products(Base):
    __tablename__ = 'Products'
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, index=True)
    description = Column(String, index=True)
    category = Column(Integer, ForeignKey("Categories.id"), index=True)
    price = Column(Float, index=True)
    image_url = Column(String, index=True)
    category_obj = relationship("Categories", back_populates="products")

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
    db_user = db.query(Users).filter(Users.email==user.email, Users.role==user.role).first()
    if db_user:
        raise HTTPException(status_code=302,detail="Account already exists with this email.")
    db_user_password = pwd_context.hash(user.password)
    db_user = Users(email=user.email,password=db_user_password,role=user.role)
    db.add(db_user)
    db.commit()
    db.refresh(db_user)
    return{"message":"User created successfully."}

@app.post("/login",status_code=status.HTTP_200_OK)
async def login(user:UserInfo, db:db_dependency):
    db_user = db.query(Users).filter(Users.email==user.email, Users.role==user.role).first()
    if db_user:
        if pwd_context.verify(user.password,db_user.password):
            return{"message":"logged in sucessfully.","user_id":db_user.id}
        raise HTTPException(status_code=404,detail="Invalid email or password.")
    raise HTTPException(status_code=404,detail="Invalid email or password.")

all_otp = {}

@app.post("/generate-code",status_code=status.HTTP_201_CREATED)
async def generate_code(email:str):
     code = f"{random.randint(0, 999999):06}"
     all_otp[email] = {"code":code, "expires":datetime.now()+timedelta(minutes=2)}
     service = Service(executable_path="chromedriver.exe")
     driver = webdriver.Chrome(service=service)
     driver.get("https://accounts.google.com/v3/signin/identifier?continue=https%3A%2F%2Fmail.google.com%2Fmail%2Fu%2F0%2F&emr=1&followup=https%3A%2F%2Fmail.google.com%2Fmail%2Fu%2F0%2F&ifkv=AXH0vVt86mt7i6bhv8EZvXuyaR7kWN4K4-u8q61I6qnUga4y-0zTJljpaLm3qOEfkFS8TLm4BwzwFQ&osid=1&passive=1209600&service=mail&flowName=GlifWebSignIn&flowEntry=ServiceLogin&dsh=S68860218%3A1742620308666354")
     input_email = WebDriverWait(driver,10).until(EC.presence_of_element_located((By.ID,"identifierId")))
     input_email.send_keys("emailid"+Keys.ENTER)
     input_password = WebDriverWait(driver,10).until(EC.element_to_be_clickable((By.NAME,"Passwd")))
     input_password.send_keys("password"+Keys.ENTER)
     compose_button = WebDriverWait(driver,10).until(EC.presence_of_element_located((By.XPATH, "//div[contains(@class, 'T-I') and text()='Compose']")))
     compose_button.click()
     input_to = WebDriverWait(driver,10).until(EC.presence_of_element_located((By.CLASS_NAME,"agP")))
     input_to.send_keys(email)
     input_subject = driver.find_element(By.NAME,"subjectbox")
     input_subject.send_keys("One Time Code for Password Reset")
     input_text = driver.find_element(By.XPATH, "//div[@aria-label='Message Body']")
     input_text.send_keys(code+Keys.CONTROL+Keys.ENTER)
     time.sleep(2)
     driver.quit()
     return{"message":"Code Sent"}

@app.post("/verify-code",status_code=status.HTTP_200_OK)
async def verify_code(code:str,email:str):
    current_otp = all_otp.get(email)
    if not current_otp:
        raise HTTPException(status_code=404,detail="Time has expired")
    if datetime.now()>current_otp["expires"]:
        del all_otp[email]
        raise HTTPException(status_code=404,detail="Time has expired")
    if current_otp["code"]==code:
        del all_otp[email]
        return{"message":"success"}
    raise HTTPException(status_code=400,detail="Invalid Code")

@app.post("/reset-password",status_code=status.HTTP_200_OK)
async def reset_password(user:UserInfo, db:db_dependency):
    db_user = db.query(Users).filter(Users.email==user.email,Users.role==user.role).first()
    db_user_password = pwd_context.hash(user.password)
    db_user.password = db_user_password
    db.commit()
    db.refresh(db_user)
    return{"Message":"Password reset successfully"}

@app.post("/create-category",status_code=status.HTTP_201_CREATED)
async def create_category(user:CategoryInfo,db:db_dependency):
    db_category_name_exists = db.query(Categories).filter(Categories.name==user.name).first()
    if db_category_name_exists:
        raise HTTPException(status_code=302,detail="Category name already exists.")
    db_category = Categories(name=user.name,parent=user.parent)
    db.add(db_category)
    db.commit()
    db.refresh(db_category)
    return{"message":f"category '{user.name}' added successfully","parent":user.parent}

@app.get("/all-categories",status_code=status.HTTP_200_OK)
async def all_categories(db:db_dependency,category:Optional[str]=Query(None)):
    if category:
        db_categories = db.query(Categories).filter(Categories.parent==category).order_by(Categories.id.asc()).all()
    else:
        db_categories = db.query(Categories).order_by(Categories.id.asc()).all()
    return [{"name":category.name,"parent":category.parent,"id":category.id} for category in db_categories]

app.mount("/pictures", StaticFiles(directory="pictures"), name="pictures")

@app.post("/create-product",status_code=status.HTTP_201_CREATED)
async def create_product(db:db_dependency,name:str=Form(...),categoryID:int=Form(...),price:float=Form(...),description:Optional[str]=Form(None),image:Optional[UploadFile]=File(None)):
    db_product_exists = db.query(Products).filter(Products.name==name,Products.category==categoryID).first()
    if db_product_exists:
        raise HTTPException(status_code=302,detail="Product already exists.")
    db_product = Products(name=name,category=categoryID,price=price)
    if description:
        db_product.description=description
    if image:
        file_location = f"pictures/{image.filename}"
        with open(file_location, "wb") as buffer:
            shutil.copyfileobj(image.file, buffer)
        db_product.image_url=file_location
    db.add(db_product)
    db.commit()
    db.refresh(db_product)
    return{"message":f"Product '{name}' added successfully"}

@app.get("/all-products",status_code=status.HTTP_200_OK)
async def all_products(db:db_dependency, category:Optional[str]=Query(None)):
    if category:
        db_products = db.query(Products).join(Products.category_obj).filter(Categories.name==category).order_by(Products.id.asc()).all()
    else:
        db_products = db.query(Products).order_by(Products.id.asc()).all()
    return[{"name":product.name,"category":product.category_obj.name if product.category_obj else None,"price":product.price} for product in db_products]

@app.delete("/delete-product",status_code=status.HTTP_200_OK)
async def delete_product(name:str,category:str,db:db_dependency):
    db_product = db.query(Products).join(Products.category_obj).filter(Products.name==name,Categories.name==category).first()
    db.delete(db_product)
    db.commit()
    return{"message":f"Product '{name}' deleted successfully."}

@app.delete("/delete-category",status_code=status.HTTP_200_OK)
async def delete_category(name:str,parent:str,db:db_dependency):
    products = db.query(Products).join(Products.category_obj).filter(Categories.name==name).all()
    for product in products:
        db.delete(product)
    db_category = db.query(Categories).filter(Categories.name==name,Categories.parent==parent).first()
    db.delete(db_category)
    db.commit()
    return{"message":f"Category '{name}' deleted successfully."}

@app.get("/delete-count",status_code=status.HTTP_200_OK)
async def delete_count(name:str,db:db_dependency):
    count = db.query(Products).join(Products.category_obj).filter(Categories.name==name).count()
    return{"count":count}
