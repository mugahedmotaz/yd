# استخدم صورة Node.js الرسمية المبنية على Debian
FROM node:18

# تثبيت Python3 وأدوات أخرى
RUN apt-get update && apt-get install -y python3 python3-pip ffmpeg

# تعيين مجلد العمل
WORKDIR /app

# نسخ ملفات المشروع
COPY . .

# تثبيت الحزم
RUN npm install

# تعيين المنفذ
EXPOSE 8080

# تشغيل التطبيق
CMD ["npm", "start"]
