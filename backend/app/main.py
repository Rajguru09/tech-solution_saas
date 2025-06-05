from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.routes.auth_routes import router as auth_router
from app.routes.idle_resources_routes import router as idle_resources_router

app = FastAPI(
    title="CleanCloud Backend API",
    description="API for managing and auditing AWS idle resources",
    version="1.0.0"
)

# Enable CORS for your frontend domains (adjust origins as needed)
origins = [
    "http://localhost:3000",  # React dev server
    "https://your-frontend-domain.com",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Root endpoint for health check or welcome message
@app.get("/", tags=["Root"])
async def root():
    return {"message": "Welcome to CleanCloud Backend API"}

# Include authentication routes
app.include_router(auth_router, prefix="/auth", tags=["Authentication"])

# Include idle resources routes
app.include_router(idle_resources_router, prefix="/resources", tags=["Idle Resources"])
