import { createGoogleGenerativeAI } from "@ai-sdk/google";
import { streamText, Message } from "ai";
import { NextRequest } from "next/server";
import { promises as fs } from "fs";
import path from "path";
import * as XLSX from "xlsx";

// Google Generative AI setup
const google = createGoogleGenerativeAI({
  apiKey: process.env.GOOGLE_GENERATIVE_AI_API_KEY as string,
});
export const runtime = "nodejs";
const model = google("gemini-2.0-flash");

const genid = () => Math.random().toString(36).slice(2, 15);

export async function POST(req: NextRequest) {
 
  try {
    // ─── 1. Read the STATIC Excel file from disk ─────────────────────────────
    const filePath = path.join(process.cwd(), "file", "test.xlsx");
    const fileBuffer = await fs.readFile(filePath);
    const workbook = XLSX.read(fileBuffer, { type: "buffer" });
    const sheetName = workbook.SheetNames[0];
    const sheet = workbook.Sheets[sheetName];
    const excelDataFromFile = XLSX.utils.sheet_to_json(sheet);
    const staticExcelSummary = JSON.stringify(excelDataFromFile).slice(0, 500);

    // ─── 2. Parse request body ──────────────────────────────────────────────
    const body = await req.json();
    const { messages }: { messages: Array<Message>; excelData?: any } = body;

    // Summarize user-uploaded Excel data if provided

    // ─── 3. Create the prompt array ─────────────────────────────────────────
    const prompt = (messages: Message[]): Message[] => [
     
      {
        id: genid(),
        role: "system",
        content: `You are Exella! an ai agent whose work is to automate Excel file tasks.
          you are bound to answer your query and normal talk related to execel data 
        1. You have a static Excel file:
           ${staticExcelSummary}
        2. you can hace more then one excel file

        Instructions:
        - If the static Excel data is empty, let the user know you do not have the file.
        - If you have user-uploaded data, confirm you have it.
        - If after filtering there is no data left in the Excel, return an empty array.
        - Whenever you update data, tell the user the operation performed in a concise, mathematical way.
        - never return then execel data in content always use the filebase64 feild i said never ever
        

         main task 
         - when ever a user perform a task on the execel it could me anything you have to  always return a updated json and only one json should be there in the response that will be the most updated one 
          and when every you feel like user is asking for the data that time also send him the data in single json 
         -use the most frequently  generated json of data un less and until user ask you to use the orignal defalut once 
        
          response format


       default 
       
       {
          id :"",
          content:"",
          role:"",


          
          }


          but when ever user perform some task on the data or you feel like to send data to the user back on any modification

          then use this format 
 

           add one more feild to the response the id filebase64 in which you should send only the json of data 
           and an operation field statisfying what operation you have performed on the previod form in a sort way but complete 
          
        when need to send data  
        
        {

          id :"",
          content:"",
          role:"",
          filebase64:""
          opertaion:""
          
      }

 
      any dispriction or ans in text that you want to give it to the user use the content feild
        
        
        
        
         `,



      
      },



      // You can also seed an initial user prompt if desired
      // {
      //   id: genid(),
      //   role: "user",
      //   content: "User instructions or context..."
      // },
      ...messages.map((message) => ({
        id: message.id || genid(),
        role: message.role,
        content: message.content,
        filebase64: message.filebase64,
      })),
    ];

    // ─── 4. Call Gemini and return streaming response ───────────────────────
    const result =  streamText({
      model,
      messages: prompt(messages),
      maxSteps: 5,
      temperature: 0.7,
      maxTokens: 400,
      toolCallStreaming: true,
      onFinish({ usage }) {
        console.log("Token usage:", usage);
      },
    });

    return result.toDataStreamResponse();
  } catch (error) {
    console.error("Error during chat completion:", error);
    return new Response("Error occurred while generating a response.", {
      status: 500,
    });
  }
}
