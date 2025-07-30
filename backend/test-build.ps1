# اختبار بناء وتشغيل YouTube Downloader Backend

Write-Host "🚀 اختبار بناء Docker image..." -ForegroundColor Green

# بناء الصورة
Write-Host "📦 بناء الصورة..." -ForegroundColor Yellow
try {
    docker build -t youtube-downloader-backend .
    Write-Host "✅ تم بناء الصورة بنجاح!" -ForegroundColor Green
} catch {
    Write-Host "❌ فشل في بناء الصورة" -ForegroundColor Red
    exit 1
}

# اختبار Python
Write-Host "🐍 اختبار Python..." -ForegroundColor Yellow
try {
    docker run --rm youtube-downloader-backend python --version
    Write-Host "✅ Python يعمل بشكل صحيح" -ForegroundColor Green
} catch {
    Write-Host "❌ Python غير متوفر" -ForegroundColor Red
    exit 1
}

# اختبار yt-dlp
Write-Host "📺 اختبار yt-dlp..." -ForegroundColor Yellow
try {
    docker run --rm youtube-downloader-backend yt-dlp --version
    Write-Host "✅ yt-dlp يعمل بشكل صحيح" -ForegroundColor Green
} catch {
    Write-Host "❌ yt-dlp غير متوفر" -ForegroundColor Red
    exit 1
}

# اختبار Node.js
Write-Host "🟢 اختبار Node.js..." -ForegroundColor Yellow
try {
    docker run --rm youtube-downloader-backend node --version
    Write-Host "✅ Node.js يعمل بشكل صحيح" -ForegroundColor Green
} catch {
    Write-Host "❌ Node.js غير متوفر" -ForegroundColor Red
    exit 1
}

Write-Host "🎉 جميع الاختبارات نجحت! التطبيق جاهز للتشغيل." -ForegroundColor Green

# تشغيل التطبيق (اختياري)
$response = Read-Host "هل تريد تشغيل التطبيق؟ (y/n)"
if ($response -eq "y" -or $response -eq "Y") {
    Write-Host "🚀 تشغيل التطبيق على المنفذ 3000..." -ForegroundColor Green
    docker run -p 3000:3000 youtube-downloader-backend
}