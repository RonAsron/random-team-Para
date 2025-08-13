# Rendom Para - Team Lottery & Group Assignment

## Overview

**Rendom Para** เป็นโปรเจค React ที่ช่วยในการ **จับสลากทีมและแบ่งกลุ่ม** สำหรับการแข่งขันหรือกิจกรรมต่าง ๆ โดยรองรับ:

* การจับสลากแบบสุ่ม
* การล็อกทีมให้เข้ากลุ่มที่กำหนด
* การกำหนดรอบที่ทีมต้องออก
* การแสดงผลลัพธ์แบบเรียลไทม์
* การบันทึกผลลัพธ์เป็น **PNG** หรือ **PDF**

---

## Features

* 🎯 **Random Team Draw**: สุ่มจับทีมจากรายชื่อทั้งหมด
* 🔒 **Locked Teams & Schedule**: กำหนดทีมให้เข้ากลุ่มเฉพาะ หรือให้จับในรอบที่กำหนด
* 📊 **Group Table**: แสดงตารางกลุ่มแบบเรียลไทม์
* 🖼️ **Save Results**: บันทึกผลลัพธ์เป็นรูปภาพ (PNG) หรือ PDF
* ✨ **Animated Wheel**: วงล้อสุ่มทีมพร้อม animation
* 🌗 **Dark Mode Support**: รองรับธีมมืดและสว่าง

---

## Installation

1. ติดตั้ง **Node.js** และ **npm**
2. Clone โปรเจค:

```bash
git clone https://github.com/yourusername/rendom-para.git
cd rendom-para
```

3. ติดตั้ง dependencies:

```bash
npm install
```

4. เริ่มเซิร์ฟเวอร์สำหรับพัฒนา:

```bash
npm start
```

5. เปิดเบราว์เซอร์

---

## Usage

1. คลิกปุ่ม **Spin** เพื่อจับทีมแบบสุ่ม
2. ดูทีมที่จับได้บนวงล้อและในตารางกลุ่ม
3. เมื่อจับครบทุกทีม สามารถบันทึกผลลัพธ์ได้ด้วยปุ่ม **Save as Image** หรือ **Save as PDF**
4. ใช้ปุ่ม **Auto Draw** เพื่อจับทีมทั้งหมดโดยอัตโนมัติ
5. ใช้ปุ่ม **Reset** เพื่อล้างผลลัพธ์และเริ่มจับทีมใหม่

---
* **Maximum group size**: กำหนดขนาดสูงสุดของแต่ละกลุ่ม (เช่น 6 คนต่อกลุ่ม)

---

## Folder Structure

```
src/
 ├─ components/
 │   ├─ WheelCanvas.jsx      # วงล้อสุ่มทีม
 │   ├─ GroupTable.jsx       # ตารางกลุ่ม
 │   └─ ui/
 │       └─ button.jsx       # ปุ่ม UI
 ├─ assets/
 │   └─ bg-5.jpg             # ภาพพื้นหลัง
 ├─ App.jsx
 ├─ index.css
 └─ App.css
```

---

## Dependencies

* React
* TailwindCSS
* jspdf
* html2canvas

---

## License

โปรเจคนี้ใช้ **MIT License**
ดูรายละเอียดเพิ่มเติมได้ที่ไฟล์ `LICENSE`
