import React, { useState } from "react";
import WheelCanvas from "./WheelCanvas";
import GroupTable from "./GroupTable";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";

const groupNames = ["A", "B", "C", "D", "E", "F", "G", "H"];
const initialTeams = [
  "Manchester United",
  "Manchester City",
  "Liverpool",
  "Chelsea",
  "Arsenal",
  "Tottenham Hotspur",
  "Leicester City",
  "Everton",
  "West Ham United",
  "Aston Villa",
  "Newcastle United",
  "Leeds United",
  "Southampton",
  "Crystal Palace",
  "Wolverhampton",
  "Brighton & Hove Albion",
  "Burnley",
  "Norwich City",
  "Watford",
  "Brentford",
  "Barcelona",
  "Real Madrid",
  "Atletico Madrid",
  "Sevilla",
  "Valencia",
  "Villarreal",
  "Real Sociedad",
  "Real Betis",
  "Athletic Bilbao",
  "Celta Vigo",
  "Espanyol",
  "Bayern Munich",
  "Borussia Dortmund",
  "RB Leipzig",
  "Bayer Leverkusen",
  "Wolfsburg",
  "Eintracht Frankfurt",
  "Inter Milan",
  "AC Milan",
  "Juventus",
  "Napoli",
  "Roma",
  "Lazio",
  "Paris Saint-Germain",
  "Lille",
  "Lyon",
  "Marseille",
  "Monaco",
  "Nice",
];

function shuffle(array) {
  const arr = [...array];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

const GroupDraw = () => {
  const [teams, setTeams] = useState(initialTeams);
  const [groups, setGroups] = useState(groupNames.map(() => []));
  const [spinning, setSpinning] = useState(false);
  const [currentAngle, setCurrentAngle] = useState(0);
  const [lastTeam, setLastTeam] = useState(null);
  const [done, setDone] = useState(false);

  const handleAutoDraw = () => {
    const shuffled = shuffle(teams);
    const newGroups = groupNames.map((_, i) =>
      shuffled.slice(i * 6, (i + 1) * 6)
    );
    setGroups(newGroups);
    setTeams([]);
    setLastTeam(null);
    setDone(true);
  };

  const handleSpin = () => {
    if (teams.length === 0 || spinning) return;
    setSpinning(true);
    const preSpinRounds = Math.floor(Math.random() * 2) + 3; // 3-4 รอบ
    const preSpinAngle = 360 * preSpinRounds;
    const preSpinDuration = 800; // ms
    const preSpinStart = performance.now();
    let preSpinLastAngle = currentAngle;
    const easeLinear = (t) => t;
    function preSpinAnimate(now) {
      const elapsed = now - preSpinStart;
      const progress = Math.min(elapsed / preSpinDuration, 1);
      const angle = preSpinLastAngle + easeLinear(progress) * preSpinAngle;
      setCurrentAngle(angle);
      if (progress < 1) {
        requestAnimationFrame(preSpinAnimate);
      } else {
        const winnerIndex = Math.floor(Math.random() * teams.length);
        const minSpins = 6,
          maxSpins = 10;
        const totalSpins =
          Math.floor(Math.random() * (maxSpins - minSpins + 1)) + minSpins;
        const segmentAngle = 360 / teams.length;
        const finalAngle =
          angle +
          360 * totalSpins -
          (winnerIndex * segmentAngle + segmentAngle / 2);
        const minDuration = 2000,
          maxDuration = 3000;
        const duration =
          Math.floor(Math.random() * (maxDuration - minDuration + 1)) +
          minDuration; // 2-3 วิ
        const start = performance.now();
        let lastAngle = angle;
        const easeOutQuart = (t) => 1 - Math.pow(1 - t, 4);
        function animate(now2) {
          const elapsed = now2 - start;
          const progress = Math.min(elapsed / duration, 1);
          const easeOut = easeOutQuart(progress);
          const angle2 = lastAngle + easeOut * (finalAngle - lastAngle);
          setCurrentAngle(angle2);
          if (progress < 1) {
            requestAnimationFrame(animate);
          } else {
            const team = teams[winnerIndex];
            const groupIdx = groups.findIndex((g) => g.length < 6);
            if (groupIdx !== -1) {
              const newGroups = groups.map((g, i) =>
                i === groupIdx ? [...g, team] : g
              );
              setGroups(newGroups);
            }
            const newTeams = teams.filter((_, i) => i !== winnerIndex);
            setTeams(newTeams);
            setLastTeam(team);
            setSpinning(false);
            if (newTeams.length === 0) {
              setDone(true);
            }
          }
        }
        requestAnimationFrame(animate);
      }
    }
    requestAnimationFrame(preSpinAnimate);
  };

  return (
    <div className="w-screen h-screen flex items-center justify-center bg-gradient-to-br from-blue-100 via-white to-blue-200 dark:from-gray-900 dark:via-gray-950 dark:to-blue-900/80">
      <div className="flex flex-col items-center justify-center w-full max-w-4xl mx-auto p-8 gap-8">
        <div className="flex flex-col items-center w-full">
          <WheelCanvas
            names={teams}
            spinDegree={currentAngle}
            onSpin={handleSpin}
            isSpinning={spinning}
          />
          <div className="bg-white/90 dark:bg-gray-900/90 rounded-3xl shadow-2xl p-8 border-2 border-blue-200 dark:border-blue-800 flex flex-col items-center w-full max-w-md mx-auto mt-8 transition-all duration-500">
            {!done ? (
              <>
                <Button
                  className="mt-2 px-10 py-4 rounded-2xl font-extrabold bg-gradient-to-r from-blue-500 via-blue-400 to-blue-600 dark:from-blue-700 dark:via-blue-800 dark:to-blue-900 hover:from-blue-600 hover:to-blue-700 text-white shadow-xl transition w-full text-xl tracking-wide border-2 border-blue-400 dark:border-blue-700"
                  onClick={handleSpin}
                  disabled={spinning || teams.length === 0}
                >
                  หมุนวอสุ่มทีม
                </Button>
                <Button
                  className="mt-5 px-8 py-3 rounded-2xl bg-gradient-to-r from-green-500 via-green-400 to-green-600 dark:from-green-700 dark:via-green-800 dark:to-green-900 hover:from-green-600 hover:to-green-700 text-white font-bold shadow-lg transition w-full text-lg border-2 border-green-400 dark:border-green-700"
                  onClick={handleAutoDraw}
                  disabled={teams.length === 0}
                >
                  สุ่มจัดกลุ่มอัตโนมัติ
                </Button>
              </>
            ) : (
              <div className="mt-8 text-2xl font-bold text-green-600 dark:text-green-400 drop-shadow">
                ครบเรียบร้อย 🎉
              </div>
            )}
            <div className="mt-8 text-lg text-blue-900 dark:text-blue-100 min-h-[32px] font-medium">
              {lastTeam && !done && (
                <span>
                  ทีมที่เพิ่งจับได้: <b>{lastTeam}</b>
                </span>
              )}
            </div>
            <div className="mt-2 text-gray-600 dark:text-gray-300">
              ทีมที่เหลือ: {teams.length}
            </div>
          </div>
        </div>
        <div className="w-full">
          <div className="py-4 text-3xl font-extrabold text-blue-800 dark:text-blue-200 text-center tracking-tight drop-shadow-lg">
            สุ่มแบ่ง 48 ทีมเป็น 8 กรุ๊ป
          </div>
          <GroupTable groups={groups} groupNames={groupNames} />
        </div>
      </div>
    </div>
  );
};

export default GroupDraw;
