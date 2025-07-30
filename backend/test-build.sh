#!/bin/bash

echo "🚀 اختبار بناء Docker image..."

# بناء الصورة
echo "📦 بناء الصورة..."
docker build -t youtube-downloader-backend . || {
    echo "❌ فشل في بناء الصورة"
    exit 1
}

echo "✅ تم بناء الصورة بنجاح!"

# اختبار Python
echo "🐍 اختبار Python..."
docker run --rm youtube-downloader-backend python --version || {
    echo "❌ Python غير متوفر"
    exit 1
}

# اختبار yt-dlp
echo "📺 اختبار yt-dlp..."
docker run --rm youtube-downloader-backend yt-dlp --version || {
    echo "❌ yt-dlp غير متوفر"
    exit 1
}

# اختبار Node.js
echo "🟢 اختبار Node.js..."
docker run --rm youtube-downloader-backend node --version || {
    echo "❌ Node.js غير متوفر"
    exit 1
}

echo "🎉 جميع الاختبارات نجحت! التطبيق جاهز للتشغيل."

# تشغيل التطبيق (اختياري)
read -p "هل تريد تشغيل التطبيق؟ (y/n): " -n 1 -r
echo
if [[ $REPLY =~ ^[Yy]$ ]]; then
    echo "🚀 تشغيل التطبيق على المنفذ 3000..."
    docker run -p 3000:3000 youtube-downloader-backend
fi
