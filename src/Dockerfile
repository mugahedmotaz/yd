# استخدم صورة node الرسمية
FROM node:20

# تحديث النظام وتثبيت Python 3 و ffmpeg
RUN apt-get update && \
    apt-get install -y python3 python3-pip ffmpeg && \
    apt-get clean

# تحديد مجلد العمل داخل الحاوية
WORKDIR /app

# نسخ ملفات المشروع
COPY . .

# تثبيت الحزم
RUN npm install

# تشغيل التطبيق
CMD ["node", "backend/server.js"]
