# النسخة العربية من تطبيق الجوال (CodexQuota)

هذا الفورك يضيف ترجمة عربية لواجهة تطبيق الأندرويد وبرنامج ويندوز وتطبيق السوار.

## الملفات
- `strings-zh-to-ar.json`: جدول الترجمة من الصيني للعربي (130 نصاً).
- `align.py`: أداة محاذاة ملف الـ APK قبل التوقيع.

## طريقة البناء
الترجمة مطبّقة على ملف الـ APK الجاهز (الإصدار 0.6.4) وليس على الكود المصدري:
1. فك الملف: `apktool d -r CodexQuota-0.6.4.apk -o dec`
2. استبدال النصوص في ملفات smali حسب `strings-zh-to-ar.json`
3. إعادة البناء: `apktool b dec -o unsigned.apk`
4. المحاذاة: `python3 align.py unsigned.apk aligned.apk`
5. التوقيع بـ `apksigner`

## ملاحظات
- الملف موقّع بمفتاح مختلف عن الأصلي، فلازم تحذف النسخة الأصلية قبل التثبيت.

## التحميل
الملف الجاهز: [`dist/CodexQuota-0.6.4-ar.apk`](dist/CodexQuota-0.6.4-ar.apk)

SHA-256: `b43f5525c3c9ef298d59b879eb58e6cc7446be876ff055923f71af76d265d7e1`

## برنامج ويندوز

- `windows-zh-to-ar.json`: جدول ترجمة برنامج ويندوز (180 نصاً).
- الكود المترجم موجود في فرع [`arabic-0.6.4`](https://github.com/joky711/codex-quota-band-AR/tree/arabic-0.6.4)، وهو مبني على الإصدار 0.6.4 من المشروع الأصلي.
- الملف الجاهز: [`dist/CodexQuota-Setup-0.6.4-ar.exe`](dist/CodexQuota-Setup-0.6.4-ar.exe)

SHA-256: `8aeb0372579b6dc59f7f361b57c9e4622c96f5e0c2f53de26b0dbbdf4c08c3f4`

تم بناؤه من لينكس للهدف `x86_64-pc-windows-gnu` باستخدام MinGW وNSIS، ونجحت كل الاختبارات (80 اختباراً) تحت Wine.

## تطبيق السوار (RPK)

- `band-zh-to-ar.json`: جدول ترجمة تطبيق السوار (50 نصاً)، مع ضبط بسيط لعرض بعض العناصر عشان يناسب النص العربي شاشة 212 بكسل.
- الكود المترجم في نفس الفرع [`arabic-0.6.4`](https://github.com/joky711/codex-quota-band-AR/tree/arabic-0.6.4)، داخل مجلد `band-app`.
- الملف الجاهز: [`dist/CodexQuota-0.6.4-ar.rpk`](dist/CodexQuota-0.6.4-ar.rpk)

SHA-256: `2daa1af32d9bd2a0b344fefe2f575a99bce1dfbbe9db0b3b1165d6e7c5d52535`

تم بناؤه بأداة `aiot-toolkit` الرسمية من شاومي، ونجحت كل اختبارات تطبيق السوار (28 اختباراً).
