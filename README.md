# YouTube Downloader

مشروع لتحميل مقاطع الفيديو والصوت من YouTube باستخدام React و TypeScript في الواجهة الأمامية و Node.js في الخلفية.

## الميزات
- تحميل الفيديو من YouTube
- تحميل الصوت من YouTube
- واجهة مستخدم احترافية باستخدام Tailwind CSS
- دعم اللغة العربية

## كيفية التشغيل محليًا

1. تأكد من تثبيت Node.js على جهازك
2. قم بتنزيل المشروع أو استنساخه
3. افتح الطرفية في مجلد المشروع
4. نفذ الأمر التالي لتثبيت الاعتمادات:
   ```
   npm install
   ```
5. انتقل إلى مجلد backend:
   ```
   cd backend
   ```
6. نفذ الأمر التالي لتثبيت اعتمادات الخلفية:
   ```
   npm install
   ```
7. ارجع إلى المجلد الرئيسي ونفذ الأمر التالي لتشغيل الخادم:
   ```
   cd ..
   npm run dev
   ```
8. في طرفية أخرى، انتقل إلى مجلد backend ونفذ الأمر التالي لتشغيل الخادم:
   ```
   cd backend
   npm start
   ```

## كيفية النشر على Vercel

1. قم بإنشاء حساب على [Vercel](https://vercel.com/)
2. اربط حسابك بـ GitHub
3. استنساخ هذا المشروع إلى حسابك على GitHub
4. من لوحة تحكم Vercel، قم بإنشاء مشروع جديد
5. اختر هذا المستودع
6. قم بضبط الإعدادات كما يلي:
   - Framework Preset: `Other`
   - Root Directory: اتركه فارغًا
   - Build Command: `npm run build`
   - Output Directory: `dist`
   - Install Command: `npm install`
7. انقر على Deploy

## كيفية نشر الـ Backend على Render

1. قم بإنشاء حساب على [Render](https://render.com/)
2. اربط حسابك بـ GitHub
3. من لوحة تحكم Render، قم بإنشاء خدمة Web Service جديدة
4. اختر هذا المستودع
5. قم بضبط الإعدادات كما يلي:
   - Name: اختر اسماً لخدمة الـ backend
   - Runtime: `Node`
   - Build Command: `npm install`
   - Start Command: `npm start`
   - Root Directory: `backend`
   
   أو يمكنك استخدام ملف `render.yaml` المتوفر في المشروع والذي يحتوي على جميع الإعدادات المطلوبة.
6. انقر على Create Web Service

7. بعد اكتمال النشر، ستحصل على عنوان URL للخدمة. يجب عليك تحديث ملف `src/App.tsx` في المشروع الرئيسي لاستخدام هذا العنوان بدلاً من العنوان المحلي:

   ```typescript
   // استبدل هذا السطر:
   const response = await fetch('/api/download', {
   
   // بهذا السطر (استبدل YOUR_RENDER_URL بعنوان URL الذي حصلت عليه من Render):
   const response = await fetch('YOUR_RENDER_URL/api/download', {
   ```

ملاحظة: إذا كنت تواجه مشكلة في الوصول إلى الـ API من الواجهة الأمامية بسبب سياسة CORS، يمكنك إضافة عنوان URL لمشروع Vercel إلى قائمة السماح في ملف `backend/server.js`:

```javascript
app.use(cors({
  origin: ['http://localhost:5173', 'YOUR_VERCEL_URL']
}));
```

## التقنيات المستخدمة
- React
- TypeScript
- Tailwind CSS
- Node.js
- Express
- youtube-dl-exec

## المطور
[Mugahed Motaz](https://www.linkedin.com/in/mugahed-motaz/)
