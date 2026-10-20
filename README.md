# เว็บแอปถาม-ตอบจิตวิทยาการกีฬา (React + Vite + Firebase)

## ติดตั้งและใช้งาน
1. `npm install`
2. สร้าง Firebase Project → เปิด **Authentication (Email/Password)** และ **Realtime Database**
3. Realtime Database → เมนู ⋮ → **Import JSON** → เลือก `database.json`
4. แท็บ Rules → วางเนื้อหาจาก `database.rules.json` → Publish
5. คัดลอก `.env.example` เป็น `.env` แล้วใส่ค่าจาก Project settings → Your apps (Web)
6. `npm run dev`

> บัญชีตัวอย่างใน `database.json` (U0001, U0002) เป็นข้อมูลสาธิต ใช้ล็อกอินไม่ได้ ให้กด "สมัครสมาชิก" สร้างบัญชีนักกีฬาและผู้เชี่ยวชาญใหม่เพื่อทดสอบ

## Flow การทดสอบหลัก
นักกีฬา: สมัคร → เลือกหมวดหมู่ → ส่งคำถาม → เข้าแชท
ผู้เชี่ยวชาญ (อีกเบราว์เซอร์): สมัครเป็นผู้เชี่ยวชาญ → รับคำถามในคิว → ตอบในแชท → ปิดคำถาม
นักกีฬา: เห็นแจ้งเตือน → ให้คะแนน

## Git
`git init && git add . && git commit -m "init project" && git remote add origin <URL> && git push -u origin main`
(`.env` อยู่ใน `.gitignore` แล้ว ห้าม commit)

## Deploy (Firebase Hosting)
`npm run build && npm i -g firebase-tools && firebase login && firebase init hosting` (public = dist, SPA = yes) → `firebase deploy`
เพิ่มโดเมนที่ deploy ใน Authentication → Settings → Authorized domains

## ตารางบันทึกผลทดสอบ
| กรณีทดสอบ | ผลที่คาดหวัง | ผ่าน/ไม่ผ่าน |
|---|---|---|
| ล็อกอินรหัสผิด | แสดงข้อความผิดพลาด | |
| ส่งคำถามสั้นกว่า 10 ตัวอักษร | แจ้งเตือนและไม่ส่ง | |
| นักกีฬาเข้า /expert/dashboard | ถูกพากลับหน้าหลัก | |
| แชทสองฝั่งเรียลไทม์ | ข้อความขึ้นทันที | |
| ค้นหา FAQ ไม่มีผลลัพธ์ | แสดง "ไม่พบคำถาม" | |
| หน้าจอ 375px | Sidebar เป็นแถบบน ไม่มี scroll แนวนอน | |
