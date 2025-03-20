'use client'

import { useState } from "react";
import Chat from "./_components/chat";
import DisplayExecel from "./_components/display-execel";

export default function Home() {
  const [excelData, setExcelData] = useState<string>("");


  return (
   <div className="flex h-full overflow-hidden justify-between ">
     {/* @ts-ignore */}
    <DisplayExecel excelData={excelData}  />
    <Chat excelData={excelData}  setExcelData={setExcelData} />
   </div>
  );
}
