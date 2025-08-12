import React, { useState, useRef } from "react";
import WheelCanvas from "./components/WheelCanvas";
import GroupTable from "./components/GroupTable";
import { Button } from "./components/ui/button";
import "./App.css";
import "./index.css"; // ต้องมี @tailwind ... อยู่ข้างใน
import { jsPDF } from "jspdf";
import html2canvas from "html2canvas";

const groupNames = ["A", "B", "C", "D", "E", "F", "G", "H"];
const initialTeams = [
  "PATROL AIRPORT",
  "บ้านๆในหม้อง",
  "asron testtool",
  "The first​ one​ JR​",
  "NONGEVALIN FC",
  "สุรินคำ​ FC​",
  "แบมบูFC",
  "ช.ชนาธิป​",
  "บังแมนบางโรง​",
  "บังซีดบางโรง​",
  "ทีมพี่บ่าว​ สนามบิน​",
  "น้องบอล​",
  "TIGER JUNIOR​ ACADEMY​ A​",
  "TIGER JUNIOR ACADEMY B",
  "TIGER JUNIOR ACADEMY C",
  "น้องอัสรอน​",
  "รวมเพื่อน53",
  "ปางช้างA​",
  "ปางช้างB",
  "สหายน้องออมสิน​A",
  "สหายน้องออมสิน​B",
  "Kohyao sun smile",
  "รัษฎายนต์​",
  "บางโรง​ JR​",
  "ค่ายไก่ ศ.รายาสกุล ฟาร์ม",
  "รักษ์พารา",
  "กองทุนแม่บ้านพาราA",
  "กองทุนแม่บ้านพาราB",
  "ฒ.ผู้เฒ่าทีม​",
  "กะเลยทุย",
  "น้องเอมิร่า​",
  "วัยรุ่น​รางน้ำบางโรง​",
  "วัยรุ่นน้ำแข็งบางโรงxควันหลง​",
  "Sabye Sbye",
  "สาธรณสุข​ อบจ.ภูเก็ต​",
  "จับปัวะByท้ายซอย",
  "น้องคอดีญะห์​",
  "Samkok",
  "สกุลศาสน์  A​",
  "สกุลศาสน์  B",
  "ชุมชนท่าสัก",
  "ครัวบารอกัตบางโรง",
  "มาดามผึ้ง",
  "ทายาทเมืองคอน",
  "ทีมขายาว",
  "ทีเด็ดบางโรง1",
  "ทีเด็ดบางโรง2",
  "สมพาน",
];

const shuffle = (array) => {
  const arr = [...array];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
};

const findAvailableGroup = (groups, teamName, maxGroupSize = 6) =>
  groups.findIndex((g) => g.length < maxGroupSize && !g.includes(teamName));

function App() {
  const [teams, setTeams] = useState(initialTeams);
  const [groups, setGroups] = useState(groupNames.map(() => []));
  const [spinning, setSpinning] = useState(false);
  const [currentAngle, setCurrentAngle] = useState(0);
  const [lastTeam, setLastTeam] = useState(null);
  const [done, setDone] = useState(false);
  const [showPopup, setShowPopup] = useState(false);
  const groupTableRef = useRef(null);

  const popupTimeout = useRef(null);
const handleSaveImage = () => {
  if (!groupTableRef.current) return;
  html2canvas(groupTableRef.current).then((canvas) => {
    const link = document.createElement("a");
    link.download = "group-result.png";
    link.href = canvas.toDataURL("image/png");
    link.click();
  });
};


  const handleSavePdf = () => {
    const doc = new jsPDF();

    doc.setFontSize(18);
    doc.text("ผลการจับทีม", 14, 22);

    const startX = 14;
    let startY = 32;
    const lineHeight = 10;

    groups.forEach((group, idx) => {
      doc.setFontSize(14);
      doc.text(`Group ${groupNames[idx]}:`, startX, startY);
      startY += lineHeight;

      if (group.length === 0) {
        doc.setFontSize(12);
        doc.text("ไม่มีทีม", startX + 10, startY);
        startY += lineHeight;
      } else {
        group.forEach((team) => {
          doc.setFontSize(12);
          doc.text(`- ${team}`, startX + 10, startY);
          startY += lineHeight;
        });
      }
      startY += lineHeight / 2;

      // ถ้าใกล้สุดหน้ากระดาษ ขึ้นหน้าใหม่
      if (startY > 270) {
        doc.addPage();
        startY = 20;
      }
    });

    doc.save("group-result.pdf");
  };

  const handleAutoDraw = () => {
    const shuffled = shuffle(teams);
    const newGroups = groupNames.map(() => []);
    const groupSize = Math.ceil(shuffled.length / groupNames.length);

    for (const team of shuffled) {
      for (let i = 0; i < groupNames.length; i++) {
        if (newGroups[i].length < groupSize && !newGroups[i].includes(team)) {
          newGroups[i].push(team);
          break;
        }
      }
    }

    setGroups(newGroups);
    setTeams([]);
    setLastTeam(null);
    setDone(true);
  };

  const handleReset = () => {
    setTeams(initialTeams);
    setGroups(groupNames.map(() => []));
    setSpinning(false);
    setCurrentAngle(0);
    setLastTeam(null);
    setDone(false);
    setShowPopup(false);

    if (popupTimeout.current) clearTimeout(popupTimeout.current);
  };

  const handleSpin = () => {
    if (teams.length === 0 || spinning) return;

    const availableTeams = teams.filter(
      (team) => findAvailableGroup(groups, team) !== -1
    );

    if (availableTeams.length === 0) {
      setSpinning(false);
      setDone(true);
      return;
    }

    setSpinning(true);

    const winnerIndex = Math.floor(Math.random() * availableTeams.length);
    const winnerName = availableTeams[winnerIndex];
    const segmentAngle = 360 / availableTeams.length;
    const pointerAngle = 90;

    const totalSpins = Math.floor(Math.random() * 5) + 6; // 6-10 รอบ
    const finalAngle =
      360 * totalSpins +
      pointerAngle -
      (winnerIndex * segmentAngle + segmentAngle / 2);

    const duration = Math.floor(Math.random() * 1500) + 3500; // 3500-5000 ms

    const start = performance.now();

    const easeInOutCubic = (t) =>
      t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;

    const animate = (now) => {
      const elapsed = now - start;
      const progress = Math.min(elapsed / duration, 1);
      const easedProgress = easeInOutCubic(progress);

      const angle = easedProgress * finalAngle;
      setCurrentAngle(angle % 360);

      if (progress < 1) {
        requestAnimationFrame(animate);
      } else {
        const groupIdx = findAvailableGroup(groups, winnerName);

        if (groupIdx !== -1) {
          const newGroups = groups.map((g, i) =>
            i === groupIdx ? [...g, winnerName] : g
          );
          setGroups(newGroups);
        }

        const newTeams = teams.filter((t) => t !== winnerName);
        setTeams(newTeams);
        setLastTeam(winnerName);

        setShowPopup(true);
        if (popupTimeout.current) clearTimeout(popupTimeout.current);
        popupTimeout.current = setTimeout(() => setShowPopup(false), 1500);

        setSpinning(false);
        if (newTeams.length === 0) setDone(true);
      }
    };

    requestAnimationFrame(animate);
  };

  // ฟังก์ชันบันทึกผลกลุ่มทีมเป็นไฟล์ JSON
  const handleSave = () => {
    const dataStr = JSON.stringify(groups, null, 2);
    const blob = new Blob([dataStr], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "groups.json";
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="w-[1920px] h-[1080px] overflow-hidden mx-auto bg-gradient-to-br from-blue-50 via-white to-blue-100 dark:from-gray-900 dark:via-black dark:to-gray-800">
      <div className="flex flex-row w-full h-full">
        <div className="w-4/5" ref={groupTableRef}>
          <GroupTable groups={groups} groupNames={groupNames} />
        </div>

        <div className="w-1.2/5">
          <div className="flex flex-col items-center justify-center w-full h-full ">
            <div className="relative w-full flex items-center justify-center">
              <WheelCanvas
                names={teams}
                spinDegree={currentAngle}
                onSpin={handleSpin}
                isSpinning={spinning}
              />

              {showPopup && lastTeam && (
                <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-40 pointer-events-none select-none">
                  <div className="bg-white dark:bg-gray-800 px-8 py-6 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700">
                    <h3 className="text-2xl font-bold text-gray-800 dark:text-white mb-2">
                      {lastTeam}
                    </h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      ทีมที่จับได้
                    </p>
                  </div>
                </div>
              )}
            </div>

            <div className="p-4 rounded-xl bg-blue-50 dark:bg-blue-900/30 text-xl text-blue-900 dark:text-blue-100 font-semibold mt-4 shadow-sm transition">
              {lastTeam && !done && (
                <span>
                  ทีมที่เพิ่งจับได้: <b className="text-2xl">{lastTeam}</b>
                </span>
              )}
            </div>

            <div className="mt-2 p-3 rounded-lg bg-gray-100 dark:bg-gray-800/40 text-gray-700 dark:text-gray-300 text-lg shadow-sm">
              ทีมที่เหลือ: <b>{teams.length}</b>
            </div>

            <div className="flex flex-col items-center justify-center w-full gap-4 mt-8">
              <Button
                onClick={handleSpin}
                disabled={spinning || done || teams.length === 0}
                className="w-full"
              >
                {spinning ? "กำลังสุ่ม..." : "สุ่ม"}
              </Button>
              <Button
                onClick={handleAutoDraw}
                disabled={spinning || done}
                className="w-full"
                variant="outline"
              >
                สุ่มอัตโนมัติ
              </Button>
              <Button
                onClick={handleReset}
                variant="outline"
                className="w-full text-red-500 border-red-500 hover:bg-red-100 hover:text-red-600 dark:text-red-400 dark:border-red-400 dark:hover:bg-red-900/40"
              >
                รีเซ็ต
              </Button>

              {/* ปุ่มบันทึกผล เมื่อจับครบทีม */}
              {done && (
                <>
                  <button
                    onClick={handleSavePdf}
                    className="w-full mt-4 px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
                  >
                    บันทึกผลการจับทีม (PDF)
                  </button>

                  <button
                    onClick={handleSaveImage}
                    className="w-full mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                  >
                    บันทึกผลการจับทีม (รูปภาพ)
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
