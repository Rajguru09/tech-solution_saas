# backend/app/routes/idle_resources_routes.py
from fastapi import APIRouter, HTTPException, Depends, Request
from typing import List, Dict
from pydantic import BaseModel

from app.services.aws_resources import ebs, ec2, eip, s3, snapshots

router = APIRouter()

class AWSCredentials(BaseModel):
    access_key: str
    secret_key: str

# Helper to extract AWS creds from headers or request
def get_aws_credentials(request: Request) -> AWSCredentials:
    # For example, from headers (you can adapt as needed)
    access_key = request.headers.get("X-AWS-Access-Key")
    secret_key = request.headers.get("X-AWS-Secret-Key")
    if not access_key or not secret_key:
        raise HTTPException(status_code=400, detail="AWS credentials missing")
    return AWSCredentials(access_key=access_key, secret_key=secret_key)

@router.post("/idle-resources", response_model=Dict[str, List[Dict]])
async def get_idle_resources(creds: AWSCredentials):
    credentials = creds.dict()

    # Parallel or sequential scan all resource types
    ebs_idle = ebs.get_idle_ebs_volumes(credentials)
    ec2_idle = ec2.get_idle_ec2_instances(credentials)
    eip_idle = eip.get_idle_eips(credentials)
    s3_idle = s3.get_idle_s3_buckets(credentials)
    snapshots_idle = snapshots.get_idle_snapshots(credentials)
    # Similar calls to ec2.get_idle_ec2_instances(credentials), eip.get_idle_eips(credentials), etc.
    # For demo, just ebs included here

    return {
        "ebs": ebs_idle,
        "ec2": ec2_idle,
        "eip": eip_idle,
        "s3": s3_idle,
        "snapshots": snapshots_idle,
    }

@router.delete("/idle-resources/{resource_type}/{resource_id}")
async def delete_idle_resource(
    resource_type: str,
    resource_id: str,
    creds: AWSCredentials,
    region: str
):
    credentials = creds.dict()

    try:
        if resource_type == "ebs":
            ebs.delete_ebs_volume(resource_id, credentials, region)
        elif resource_type == "ec2":
            ec2.delete_ec2_instance(resource_id, credentials, region)
        elif resource_type == "eip":
            eip.delete_eip(resource_id, credentials, region)
        elif resource_type == "s3":
            s3.delete_s3_bucket(resource_id, credentials)
        elif resource_type == "snapshots":
            snapshots.delete_snapshot(resource_id, credentials, region)
        else:
            raise HTTPException(status_code=400, detail="Unknown resource type")

    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Deletion failed: {str(e)}")

    return {"message": f"{resource_type} resource {resource_id} deleted successfully."}
