provider "aws" {
  region = "ap-south-1"
}

# Cognito User Pool
resource "aws_cognito_user_pool" "tech_solution_pool" {
  name = "tech-solution-user-pool"
}

# Cognito User Pool Client
resource "aws_cognito_user_pool_client" "tech_solution_client" {
  name         = "tech-solution-client"
  user_pool_id = aws_cognito_user_pool.tech_solution_pool.id

  generate_secret = false

  explicit_auth_flows = [
    "ALLOW_USER_PASSWORD_AUTH",
    "ALLOW_REFRESH_TOKEN_AUTH",
    "ALLOW_ADMIN_USER_PASSWORD_AUTH"
  ]

  allowed_oauth_flows_user_pool_client = true
  allowed_oauth_flows = [
    "code",
    "implicit"
  ]
  allowed_oauth_scopes = [
    "phone",
    "email",
    "openid",
    "profile",
    "aws.cognito.signin.user.admin"
  ]

  callback_urls = ["https://www.techsolution.com/callback"]
  logout_urls   = ["https://www.techsolution.com/logout"]

  supported_identity_providers = ["COGNITO"]
}

# Cognito Identity Pool
resource "aws_cognito_identity_pool" "tech_solution_identity_pool" {
  identity_pool_name               = "tech-solution-identity-pool"
  allow_unauthenticated_identities = false

  cognito_identity_providers {
    client_id               = aws_cognito_user_pool_client.tech_solution_client.id
    provider_name           = "cognito-idp.ap-south-1.amazonaws.com/${aws_cognito_user_pool.tech_solution_pool.id}"
    server_side_token_check = false
  }
}
