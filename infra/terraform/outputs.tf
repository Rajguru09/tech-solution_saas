output "user_pool_id" {
  value = aws_cognito_user_pool.tech_solution_pool.id
}

output "user_pool_client_id" {
  value = aws_cognito_user_pool_client.tech_solution_client.id
}

output "identity_pool_id" {
  value = aws_cognito_identity_pool.tech_solution_identity_pool.id
}

output "authenticated_role_arn" {
  value = aws_iam_role.tech_solution_assume_role.arn
}
