$API_URL = "https://123fakturera-backend.onrender.com"

Write-Host "Testing login for anna@techsolutions.no" -ForegroundColor Yellow

$body = @{
    email = "anna@techsolutions.no"
    password = "123456"
} | ConvertTo-Json

try {
    $response = Invoke-RestMethod -Uri "$API_URL/api/login" -Method POST -Body $body -ContentType "application/json"
    Write-Host "Login successful!" -ForegroundColor Green
    Write-Host "Token: $($response.token.Substring(0, 20))..." -ForegroundColor Gray
    Write-Host "Redirect: $($response.redirect)" -ForegroundColor Gray
} catch {
    Write-Host "Login failed: $($_.Exception.Message)" -ForegroundColor Red
}
