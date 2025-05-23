import boto3
from botocore.exceptions import ClientError
from fastapi import HTTPException
from app.utils.config import COGNITO_CLIENT_ID, COGNITO_REGION

client = boto3.client("cognito-idp", region_name=COGNITO_REGION)

def sign_up_user(username: str, password: str, email: str):
    try:
        response = client.sign_up(
            ClientId=COGNITO_CLIENT_ID,
            Username=username,
            Password=password,
            UserAttributes=[
                {"Name": "email", "Value": email}
            ]
        )
        return response
    except ClientError as e:
        raise HTTPException(status_code=400, detail=e.response['Error']['Message'])

def confirm_sign_up(username: str, confirmation_code: str):
    try:
        response = client.confirm_sign_up(
            ClientId=COGNITO_CLIENT_ID,
            Username=username,
            ConfirmationCode=confirmation_code,
        )
        return response
    except ClientError as e:
        raise HTTPException(status_code=400, detail=e.response['Error']['Message'])

def login_user(username: str, password: str):
    try:
        response = client.initiate_auth(
            ClientId=COGNITO_CLIENT_ID,
            AuthFlow="USER_PASSWORD_AUTH",
            AuthParameters={
                "USERNAME": username,
                "PASSWORD": password
            }
        )
        return response['AuthenticationResult']
    except ClientError as e:
        raise HTTPException(status_code=400, detail=e.response['Error']['Message'])
