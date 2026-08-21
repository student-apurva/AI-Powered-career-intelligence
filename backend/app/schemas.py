from pydantic import BaseModel, EmailStr

class RegisterUser(BaseModel):

    fullName: str
    email: EmailStr
    mobile: str
    password: str
    role: str


class LoginUser(BaseModel):

    email: EmailStr
    password: str