import React, { useState, useRef } from "react";
import WheelCanvas from "./components/WheelCanvas";
import GroupTable from "./components/GroupTable";
import { Button } from "./components/ui/button";
import "./App.css";
import "./index.css";
import { jsPDF } from "jspdf";
import html2canvas from "html2canvas";
import backgroundImage from "./assets/bg-5.jpg";

const groupNames = ["A", "B", "C", "D", "E", "F", "G", "H"];

const initialTeams = [
  "PATROL AIRPORT",
  "บ้านๆในหม้อง",
  "น้องนาทีXบ้านแขก​",
  "The first​ one​ JR​",
  "NONGEVALIN FC",
  "สุรินคำ​ FC​",
  "แบมบูFC",
  "ช.ชนาธิป​",
  "วัยรุ่นป่าคลอก",
  "เลดเดอร์​ อันดามัน​",
  "ทีมพี่บ่าว​ สนามบิน​",
  "น้องบอล​",
  "TIGER JUNIOR​ ACADEMY​ A​",
  "TIGER JUNIOR ACADEMY B",
  "ป.อารียา",
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
  "ชายทั้งแท่ง",
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
  "สมภาร"
];

// ระบุกลุ่มที่บังคับให้ทีมอยู่
const lockedTeams = {
  "น้องบอล​": "G",
  "น้องเอมิร่า​": "H"
  
};

// รอบที่บังคับให้ทีมออก
const lockedSchedule = {
  37: "น้องบอล​",
  43: "น้องเอมิร่า​"
};

const shuffle = (array) => {
  const arr = [...array];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
};

function App() {
  // แยกทีมล็อกออกจาก teams ปกติ
const [teams, setTeams] = useState(initialTeams.filter(t => !lockedTeams[t]));
const [pendingLocked, setPendingLocked] = useState(Object.keys(lockedTeams));

  const [groups, setGroups] = useState(groupNames.map(() => []));
  const [spinning, setSpinning] = useState(false);
  const [currentAngle, setCurrentAngle] = useState(0);
  const [lastTeam, setLastTeam] = useState(null);
  const [done, setDone] = useState(false);
  const [showPopup, setShowPopup] = useState(false);
  const groupTableRef = useRef(null);
  const popupTimeout = useRef(null);
const [spinCount, setSpinCount] = useState(0);

const findAvailableGroup = (groups, teamName, maxGroupSize = 6) => {
  if (lockedTeams[teamName]) {
    const idx = groupNames.indexOf(lockedTeams[teamName]);
    return groups[idx]?.length < maxGroupSize ? idx : -1;
  }
  return groups.findIndex((g) => g.length < maxGroupSize && !g.includes(teamName));
};


  const handleSaveImage = () => {
    if (!groupTableRef.current) return;
    html2canvas(groupTableRef.current, { scale: 2 }).then((canvas) => {
      const link = document.createElement("a");
      link.download = "group-result.png";
      link.href = canvas.toDataURL("image/png");
      link.click();
    });
  };

  const handleSavePdf = () => {
    if (!groupTableRef.current) return;
    html2canvas(groupTableRef.current, { scale: 2 }).then((canvas) => {
      const imgData = canvas.toDataURL("image/png");
      const pdf = new jsPDF({
        orientation: "landscape",
        unit: "pt",
        format: [canvas.width, canvas.height],
      });

      pdf.addImage(imgData, "PNG", 0, 0, canvas.width, canvas.height);
      pdf.save("group-result.pdf");
    });
  };

  const handleAutoDraw = () => {
    let allTeams = [...teams, ...pendingLocked]; // รวมทีมล็อกเข้าด้วย
    const shuffled = shuffle(allTeams);
    const newGroups = groupNames.map(() => []);
    const groupSize = Math.ceil(shuffled.length / groupNames.length);

    for (const team of shuffled) {
      const groupIdx = findAvailableGroup(newGroups, team, groupSize);
      if (groupIdx !== -1) {
        newGroups[groupIdx].push(team);
      }
    }

    setGroups(newGroups);
    setTeams([]);
    setPendingLocked([]);
    setLastTeam(null);
    setDone(true);
  };

  const handleReset = () => {
    setTeams(initialTeams.filter(t => !lockedTeams[t]));
    setPendingLocked(Object.keys(lockedTeams));
    setGroups(groupNames.map(() => []));
    setSpinning(false);
    setCurrentAngle(0);
    setLastTeam(null);
    setDone(false);
    setShowPopup(false);
    if (popupTimeout.current) clearTimeout(popupTimeout.current);
  };

const handleSpin = () => {
  if (teams.length === 0 && pendingLocked.length === 0) return;
  if (spinning) return;

  const nextSpin = spinCount + 1;
  setSpinCount(nextSpin);

  let winnerName;

  // ถ้ารอบนี้เป็นรอบล็อก
  if (lockedSchedule[nextSpin]) {
    winnerName = lockedSchedule[nextSpin];
    // ลบออกจาก pendingLocked ถ้ามี
    setPendingLocked(prev => prev.filter(t => t !== winnerName));
  } else {
    // สุ่มปกติจากทีมที่เหลือ
    const availableTeams = [...teams];
    const winnerIndex = Math.floor(Math.random() * availableTeams.length);
    winnerName = availableTeams[winnerIndex];
  }

  setSpinning(true);

  // คำนวณมุมเพื่อให้ไปหยุดที่ winnerName
  const allNames = [...teams, ...pendingLocked].filter(
    (t) => t === winnerName || (!lockedSchedule[nextSpin] && !lockedTeams[t])
  );
  const winnerIndex = allNames.indexOf(winnerName);
  const segmentAngle = 360 / allNames.length;
  const pointerAngle = 0;
  const totalSpins = Math.floor(Math.random() * 2) + 3;
  const finalAngle =
    360 * totalSpins +
    pointerAngle +
    90 -
    (winnerIndex * segmentAngle + segmentAngle / 2);

  const duration = Math.floor(Math.random() * 500) + 1000;
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

      if (!lockedTeams[winnerName]) {
        setTeams((prev) => prev.filter((t) => t !== winnerName));
      }

      setLastTeam(winnerName);
      setShowPopup(true);
      if (popupTimeout.current) clearTimeout(popupTimeout.current);
      popupTimeout.current = setTimeout(() => setShowPopup(false), 1500);

      setSpinning(false);
      if (teams.length === 0 && pendingLocked.length === 0) setDone(true);
    }
  };

  requestAnimationFrame(animate);
};

  return (
<div
  className="
    w-[1920px] h-[1080px] overflow-hidden mx-auto 
    bg-gradient-to-br from-blue-50 via-white to-blue-100 
    dark:from-gray-900 dark:via-black dark:to-gray-800 
    bg-cover bg-center relative
    shadow-inner shadow-[rgba(255,255,255,0.2)] 
  "
  style={{
    backgroundImage: `url(${backgroundImage})`,
  }}
>
  <div className="absolute inset-0 bg-[radial-gradient(circle,rgba(255,255,255,0.3),transparent)] animate-spin-slow opacity-20"></div>

  <div className="absolute inset-0 backdrop-blur-sm"></div>

  <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(ellipse_at_center,transparent,rgba(0,0,0,0.5))]"></div>
      <div className="flex flex-row w-full h-full relative z-10">
        <div className="w-4/5" ref={groupTableRef}>
          <GroupTable groups={groups} groupNames={groupNames} />
        </div>

        <div className="w-1.2/5 relative z-10">
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
              ทีมที่เหลือ: <b>{teams.length + pendingLocked.length}</b>
            </div>

            <div className="flex flex-col items-center justify-center w-full gap-4 mt-8">
            
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
