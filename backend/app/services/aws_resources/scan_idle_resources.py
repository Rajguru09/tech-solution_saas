from .ec2 import scan_ec2
from .s3 import scan_s3
from .ebs import scan_ebs
from .eip import scan_eip
from .snapshot import scan_snapshots

def scan_all_resources(session, resource_types: list):
    result = {}

    if "EC2" in resource_types:
        result["ec2"] = scan_ec2(session)
    if "S3" in resource_types:
        result["s3"] = scan_s3(session)
    if "EBS" in resource_types:
        result["ebs"] = scan_ebs(session)
    if "EIP" in resource_types:
        result["eip"] = scan_eip(session)
    if "Snapshots" in resource_types:
        result["snapshots"] = scan_snapshots(session)

    return result
