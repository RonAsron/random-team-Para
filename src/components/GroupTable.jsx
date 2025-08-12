import React from "react";
import bgImage from "../assets/bg-1.png";

const GroupTable = ({ groups, groupNames }) => {
  const displayGroups = [
    { group: groups[0], name: groupNames[0] },
    { group: groups[4], name: groupNames[4] },
    { group: groups[1], name: groupNames[1] },
    { group: groups[5], name: groupNames[5] },
    { group: groups[2], name: groupNames[2] },
    { group: groups[6], name: groupNames[6] },
    { group: groups[3], name: groupNames[3] },
    { group: groups[7], name: groupNames[7] },
  ];

  return (
<div
  className="relative w-full h-full min-h-0 flex flex-col items-center justify-start mt-12"
  style={{
    backgroundImage: `url(${bgImage})`,
    backgroundSize: "contain",          // หรือ "cover" ขึ้นกับความต้องการ
    backgroundPosition: "center",
    backgroundRepeat: "no-repeat",
    backgroundOrigin: "content-box",    // ถ้าต้องการให้พื้นหลังอยู่ในเนื้อที่ของเนื้อหา
  }}
>

      <div className="mt-[10vh] mb-6 w-full flex items-center justify-center">
        <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[100vw] h-[100vw] md:w-[65vw] md:h-[65vw] rounded-full bg-gradient-to-br from-blue-200/40 via-blue-100/60 to-pink-100/40 dark:from-blue-900/40 dark:via-blue-800/60 dark:to-fuchsia-900/30 blur-2xl opacity-70 animate-pulse" />
        <div className="absolute left-1/3 top-1/4 w-[32vw] h-[32vw] rounded-full bg-gradient-to-tr from-pink-200/30 via-blue-100/20 to-blue-300/20 dark:from-fuchsia-900/20 dark:via-blue-900/20 dark:to-blue-700/10 blur-lg opacity-50 animate-pulse" />
      </div>

      <div className="flex flex-col gap-5 w-full px-4">
        {displayGroups.map((item, idx) => {
          const isRightGroup = ["E", "F", "G", "H"].includes(item.name);
          return (
            <div
              key={item.name}
              className={`flex ${isRightGroup ? "justify-end" : "justify-start"}`}
            >
              <div className="relative w-[43rem] h-[3.8rem]">
                <div
                  className="absolute top-[4.5rem] w-[7rem] h-[1.75rem] bg-[#4058A9] blur-sm"
                  style={isRightGroup ? { right: "0.6rem" } : { left: "0.6rem" }}
                ></div>

                <div
                  className="absolute font-['Kokoro'] text-white text-[1.25rem] leading-[2rem] top-[4.5rem]"
                  style={isRightGroup ? { right: "3.2rem" } : { left: "0.6rem" }}
                >
                  GROUP
                </div>

                <div
                  className="absolute font-['Kokoro'] text-white text-[3.25rem] leading-[2.75rem] top-[3.4rem]"
                  style={isRightGroup ? { right: "1.0rem" } : { left: "5.3rem" }}
                >
                  {item.name}
                </div>

                <div
                  className="absolute top-[6.4rem] w-[95%] h-[5.1rem] rounded-[1.4rem_0_1.3rem_0] bg-gradient-to-t from-[#00AFEF] to-transparent border border-[#00AFEF]"
                  style={isRightGroup ? { right: "0.75rem" } : { left: "0.75rem" }}
                ></div>

                <div
                  className="absolute top-[6.6rem] grid grid-cols-3 gap-x-3 gap-y-2"
                  style={
                    isRightGroup
                      ? { right: "1rem", width: "calc(95% - 1rem)" }
                      : { left: "1rem", width: "calc(95% - 1rem)" }
                  }
                >
                  {Array.from({ length: 6 }).map((_, teamIdx) => (
                    <div
                      key={teamIdx}
                      className="h-[2rem] bg-white rounded-[1rem_0.3rem_0.7rem_0.3rem] flex items-center justify-center p-1 shadow-sm"
                    >
                      <span className="font-['Kokoro'] text-[0.99rem] leading-[1.5rem] text-center text-black overflow-hidden whitespace-nowrap">
                        {item.group[teamIdx] || "-"}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default GroupTable;
