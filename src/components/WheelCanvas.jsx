import React, { useEffect, useRef } from "react";

const WheelCanvas = ({ names, spinDegree, onSpin, isSpinning }) => {
  const canvasRef = useRef(null);

  // ฟังก์ชันคำนวณ segment index ที่ชนะ (ลูกศรชี้ขวาสุด)
  // หมายเหตุ: ฟังก์ชันนี้ไม่ได้ถูกใช้ใน logic การทำงานหลักของ App.jsx

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const dpr = window.devicePixelRatio || 1;
    const size = 520;
    canvas.width = size * dpr;
    canvas.height = size * dpr;
    canvas.style.width = `${size}px`;
    canvas.style.height = `${size}px`;

    const ctx = canvas.getContext("2d");
    ctx.setTransform(1, 0, 0, 1, 0, 0);
    ctx.scale(dpr, dpr);
    ctx.imageSmoothingEnabled = true;

    const centerX = size / 2;
    const centerY = size / 2;
    const radius = centerX - 20;

    ctx.clearRect(0, 0, size, size);

    // ถ้าไม่มีชื่อวาดแค่ pointer
    if (!names.length) {
      drawPointer(ctx, centerX, centerY, radius);
      return;
    }

    const segmentAngle = (2 * Math.PI) / names.length;
    const offset = -Math.PI / 2; // ชดเชย -90 องศา ให้ segment 0 อยู่บนสุด

    ctx.save();
    ctx.translate(centerX, centerY);
    ctx.rotate((spinDegree * Math.PI) / 180 + offset);

    // วาดแต่ละ segment
    names.forEach((name, index) => {
      const startAngle = index * segmentAngle;
      const endAngle = startAngle + segmentAngle;
      const hue = Math.round((index / names.length) * 360);

      ctx.fillStyle = `hsl(${hue}, 85%, 55%)`;

      ctx.beginPath();
      ctx.moveTo(0, 0);
      ctx.arc(0, 0, radius, startAngle, endAngle);
      ctx.closePath();
      ctx.fill();

      // ขอบ segment
      ctx.strokeStyle = '#222';
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.arc(0, 0, radius, startAngle, endAngle);
      ctx.stroke();

      // วาดข้อความชื่อตรงกลางแต่ละ segment
      ctx.save();
      ctx.rotate(startAngle + segmentAngle / 2);

      // font ขนาดอัตโนมัติ
      let fontSize = 22;
      if (names.length > 40) fontSize = 11;
      else if (names.length > 32) fontSize = 13;
      else if (names.length > 24) fontSize = 15;
      else if (names.length > 16) fontSize = 18;

      ctx.font = `bold ${fontSize}px Segoe UI, Arial`;
      ctx.fillStyle = "#fff";
      ctx.textAlign = "right";
      ctx.textBaseline = "middle";
      ctx.fillText(name, radius - 20, 0);
      ctx.restore();
    });

    // ขอบวงนอก
    ctx.lineWidth = 6;
    ctx.strokeStyle = '#111';
    ctx.beginPath();
    ctx.arc(0, 0, radius, 0, 2 * Math.PI);
    ctx.stroke();

    // วาดจุดกลางวงล้อ
    ctx.beginPath();
    ctx.arc(0, 0, 48, 0, 2 * Math.PI);
    ctx.fillStyle = '#fff';
    ctx.fill();
    ctx.lineWidth = 5;
    ctx.strokeStyle = '#3498db';
    ctx.stroke();

    ctx.font = 'bold 24px Segoe UI, Arial';
    ctx.fillStyle = '#3498db';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText('SPIN', 0, 0);

    ctx.restore();

    // วาด pointer ลูกศรชี้ขวา
    drawPointer(ctx, centerX, centerY, radius);

  }, [names, spinDegree]);

  // ฟังก์ชันวาดลูกศร pointer ชี้ที่ขวาสุด
  const drawPointer = (ctx, centerX, centerY, radius) => {
    ctx.save();
    ctx.translate(centerX, centerY);
    ctx.rotate(0);
    ctx.beginPath();
    ctx.moveTo(radius - 8, 0); // ปลายลูกศร
    ctx.lineTo(radius + 16, -22);
    ctx.lineTo(radius + 16, 22);
    ctx.closePath();
    ctx.fillStyle = '#e74c3c';
    ctx.shadowBlur = 0;
    ctx.fill();
    ctx.lineWidth = 2;
    ctx.strokeStyle = '#fff';
    ctx.stroke();
    ctx.restore();
  };

  // กดหมุน
  const handleClick = () => {
    if (typeof onSpin === "function" && !isSpinning && names.length > 0) {
      onSpin();
    }
  };

  return (
    <canvas
      ref={canvasRef}
      width={520}
      height={520}
      className={`bg-white rounded-full block mx-auto shadow-md transition-shadow duration-200 ${
        !isSpinning && names.length > 0 ? "cursor-pointer hover:shadow-xl" : "cursor-default"
      }`}
      onClick={handleClick}
      title={!isSpinning && names.length > 0 ? "คลิกเพื่อหมุนวงล้อ" : ""}
    />
  );
};

export default WheelCanvas;
