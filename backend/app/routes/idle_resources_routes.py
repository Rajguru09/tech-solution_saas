# backend/app/routes/idle_resources_routes.py #
from fastapi import APIRouter, HTTPException
from typing import List, Dict
from pydantic import BaseModel

from app.services.aws_resources import ec2, ebs, s3, eip, snapshots # import others as needed

router = APIRouter()

class AWSCredentials(BaseModel):
    access_key: str
    secret_key: str

@router.post("/idle-resources", response_model=Dict[str, List[Dict]])
async def get_idle_resources(creds: AWSCredentials):
    credentials = creds.dict()
    try:
        ec2_idle = ec2.get_idle_ec2_instances(credentials)
        ebs_idle = ebs.get_idle_ebs_volumes(credentials)
        s3_idle = s3.get_idle_s3_buckets(credentials)
        return {
            "ec2": ec2_idle,
            "ebs": ebs_idle,
            "s3": s3_idle,
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error fetching idle resources: {str(e)}")

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
        elif resource_type == "s3":
            s3.delete_s3_bucket(resource_id, credentials)
        else:
            raise HTTPException(status_code=400, detail="Unknown resource type")
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Deletion failed: {str(e)}")

    return {"message": f"{resource_type} resource {resource_id} deleted successfully."}
