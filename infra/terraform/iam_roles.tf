# IAM Role for authenticated Cognito users
resource "aws_iam_role" "tech_solution_assume_role" {
  name = "TechSolutionAssumeRole"

  assume_role_policy = jsonencode({
    Version = "2012-10-17",
    Statement = [
      {
        Effect = "Allow",
        Principal = {
          Federated = "cognito-identity.amazonaws.com"
        },
        Action = "sts:AssumeRoleWithWebIdentity",
        Condition = {
          StringEquals = {
            "cognito-identity.amazonaws.com:aud" = aws_cognito_identity_pool.tech_solution_identity_pool.id
          },
          "ForAnyValue:StringLike" = {
            "cognito-identity.amazonaws.com:amr" = "authenticated"
          }
        }
      }
    ]
  })
}

# Attach permissions (use custom policy if needed)
resource "aws_iam_role_policy_attachment" "tech_solution_policy_attachment" {
  role       = aws_iam_role.tech_solution_assume_role.name
  policy_arn = "arn:aws:iam::aws:policy/ReadOnlyAccess"
}

# Connect IAM role to Identity Pool via Role Attachment
resource "aws_cognito_identity_pool_roles_attachment" "tech_solution_roles" {
  identity_pool_id = aws_cognito_identity_pool.tech_solution_identity_pool.id

  roles = {
    authenticated = aws_iam_role.tech_solution_assume_role.arn
  }

  role_mapping {
    identity_provider = "cognito-idp.ap-south-1.amazonaws.com/${aws_cognito_user_pool.tech_solution_pool.id}:${aws_cognito_user_pool_client.tech_solution_client.id}"
    type              = "Token"
    ambiguous_role_resolution = "AuthenticatedRole"
  }
}
