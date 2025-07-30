# استخدم صورة تحتوي على Node.js و Python معًا
FROM node:18-bullseye

# تثبيت python3 و ffmpeg (مطلوب لليوتيوب-دي إل)
RUN apt-get update && apt-get install -y \
    python3 \
    python3-pip \
    ffmpeg

# إنشاء مجلد العمل
WORKDIR /app

# نسخ الملفات إلى داخل الحاوية
COPY . .

# تثبيت الحزم
RUN npm install

# تشغيل التطبيق
CMD ["npm", "start"]
