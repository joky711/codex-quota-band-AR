# النسخة العربية من تطبيق الجوال (CodexQuota)

هذا الفورك يضيف ترجمة عربية لواجهة تطبيق الأندرويد وبرنامج ويندوز.

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
- الترجمة تشمل تطبيق الجوال فقط، وبرنامج ويندوز وتطبيق السوار ما زالا بالصيني.

## التحميل
الملف الجاهز: [`dist/CodexQuota-0.6.4-ar.apk`](dist/CodexQuota-0.6.4-ar.apk)

SHA-256: `b43f5525c3c9ef298d59b879eb58e6cc7446be876ff055923f71af76d265d7e1`

## برنامج ويندوز

- `windows-zh-to-ar.json`: جدول ترجمة برنامج ويندوز (180 نصاً).
- الكود المترجم موجود في فرع [`arabic-windows-0.6.4`](https://github.com/joky711/codex-quota-band-AR/tree/arabic-windows-0.6.4)، وهو مبني على الإصدار 0.6.4 من المشروع الأصلي.
- الملف الجاهز: [`dist/CodexQuota-Setup-0.6.4-ar.exe`](dist/CodexQuota-Setup-0.6.4-ar.exe)

SHA-256: `4229dd664fbe1c2ba1bcd83755d25c3d09eaa3b4f6a93b62d968a96e7c6ee091`

تم بناؤه من لينكس للهدف `x86_64-pc-windows-gnu` باستخدام MinGW وNSIS، ونجحت كل الاختبارات (80 اختباراً) تحت Wine.
