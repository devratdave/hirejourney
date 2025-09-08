from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.routers import user, job, auth

app = FastAPI(title="Job Tracker AI")

# CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Health check
@app.get("/health")
def health_check():
    return {"status": "ok", "message": "FastAPI backend is running 🚀"}

# Routers
app.include_router(auth.router)
app.include_router(user.router)
app.include_router(job.router)