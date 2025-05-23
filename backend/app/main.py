from fastapi import FastAPI
from app.routes import auth_routes, idle_resources_routes

app = FastAPI()

# Include authentication routes
app.include_router(auth_routes.router, prefix="/auth")

# Include idle resources routes
app.include_router(idle_resources_routes.router, prefix="/resources")
