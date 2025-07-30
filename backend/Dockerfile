# استخدم صورة تحتوي على Node.js و Python معًا
FROM node:18-bullseye

# تثبيت python3 و ffmpeg و yt-dlp (مطلوب لليوتيوب-دي إل)
RUN apt-get update && apt-get install -y \
    python3 \
    python3-pip \
    ffmpeg \
    && pip3 install yt-dlp

# إنشاء مجلد العمل
WORKDIR /app

# نسخ ملفات package أولاً للاستفادة من Docker layer caching
COPY package*.json ./

# تثبيت الحزم
RUN npm ci --only=production

# نسخ باقي الملفات
COPY . .

# تشغيل التطبيق
CMD ["npm", "start"]
