from pydantic import BaseModel
from datetime import datetime

class JobBase(BaseModel):
    title: str
    company: str
    status: str = "applied"

class JobCreate(JobBase):
    pass

class JobOut(JobBase):
    id: int
    applied_at: datetime
    user_id: int

    class Config:
        orm_mode = True