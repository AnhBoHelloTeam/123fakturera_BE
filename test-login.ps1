# Test Login Script for PowerShell
$API_URL = "https://123fakturera-backend.onrender.com"

$testUsers = @(
    @{
        email = "anna@techsolutions.no"
        password = "123456"
        company = "Tech Solutions AS"
        contact = "Anna Johansson"
    },
    @{
        email = "erik@digitalinnovation.se"
        password = "123456"
        company = "Digital Innovation AB"
        contact = "Erik Andersson"
    },
    @{
        email = "maria@nordicbusiness.dk"
        password = "123456"
        company = "Nordic Business Ltd"
        contact = "Maria Hansen"
    }
)

Write-Host "🧪 Starting Login & Authentication Tests" -ForegroundColor Cyan
Write-Host "=" * 50 -ForegroundColor Cyan

$successCount = 0
$totalTests = $testUsers.Count

foreach ($user in $testUsers) {
    Write-Host "`n🔐 Testing login for: $($user.email)" -ForegroundColor Yellow
    Write-Host "   Company: $($user.company)" -ForegroundColor Gray
    Write-Host "   Contact: $($user.contact)" -ForegroundColor Gray
    
    $body = @{
        email = $user.email
        password = $user.password
    } | ConvertTo-Json
    
    try {
        $response = Invoke-RestMethod -Uri "$API_URL/api/login" -Method POST -Body $body -ContentType "application/json"
        
        if ($response.token) {
            Write-Host "   ✅ Login successful!" -ForegroundColor Green
            Write-Host "   🎫 Token received: $($response.token.Substring(0, 20))..." -ForegroundColor Gray
            Write-Host "   🔄 Redirect: $($response.redirect)" -ForegroundColor Gray
            $successCount++
            
            # Test products access
            Write-Host "`n📦 Testing products access with token..." -ForegroundColor Yellow
            try {
                $headers = @{
                    "Authorization" = "Bearer $($response.token)"
                }
                $productsResponse = Invoke-RestMethod -Uri "$API_URL/api/products" -Method GET -Headers $headers
                Write-Host "   ✅ Products access successful!" -ForegroundColor Green
                Write-Host "   📊 Found $($productsResponse.Count) products" -ForegroundColor Gray
            } catch {
                Write-Host "   ❌ Products access failed: $($_.Exception.Message)" -ForegroundColor Red
            }
        } else {
            Write-Host "   ❌ Login failed: No token received" -ForegroundColor Red
        }
    } catch {
        Write-Host "   ❌ Login failed: $($_.Exception.Message)" -ForegroundColor Red
    }
    
    Start-Sleep -Seconds 1
}

Write-Host "`n" + "=" * 50 -ForegroundColor Cyan
Write-Host "📊 TEST RESULTS SUMMARY" -ForegroundColor Cyan
Write-Host "=" * 50 -ForegroundColor Cyan
Write-Host "✅ Successful logins: $successCount/$totalTests" -ForegroundColor Green
Write-Host "❌ Failed logins: $($totalTests - $successCount)/$totalTests" -ForegroundColor Red
$successRate = [math]::Round(($successCount / $totalTests) * 100, 1)
Write-Host "📈 Success rate: $successRate%" -ForegroundColor Yellow

if ($successCount -eq $totalTests) {
    Write-Host "`n🎉 ALL TESTS PASSED! Login system is working perfectly!" -ForegroundColor Green
} else {
    Write-Host "`n⚠️  Some tests failed. Check the errors above." -ForegroundColor Yellow
}

Write-Host "`n🔗 Test URLs:" -ForegroundColor Cyan
Write-Host "   Frontend: https://123fakturera-frontend.onrender.com" -ForegroundColor Gray
Write-Host "   Backend: $API_URL" -ForegroundColor Gray
Write-Host "`n👥 Test Users:" -ForegroundColor Cyan
for ($i = 0; $i -lt $testUsers.Count; $i++) {
    $user = $testUsers[$i]
    Write-Host "   $($i + 1). $($user.email) / 123456 ($($user.company))" -ForegroundColor Gray
}
