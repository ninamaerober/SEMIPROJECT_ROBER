import supabase from "./supabaseClient";
import { GoogleGenAI } from "@google/genai";

export async function studentsAnalyzer(subjectId) {
  try {
    
    const { data, error } = await supabase
      .from("grades")
      .select(`
        id,
        student_id,
        prelim,
        midterm,
        semifinal,
        final,
        subjects (
          id,
          name
        ),
        students (
          id,
          name,
          section
        )
      `)
      .eq("subject_id", subjectId);

    if (error) throw error;

    if (!data || data.length === 0) {
      return { message: "No students or grades found for this subject." };
    }

    
    const formattedData = data
      .map(
        (g) =>
          `Student: ${g.students.name} (${g.students.section}) | Prelim: ${g.prelim}, Midterm: ${g.midterm}, Semifinal: ${g.semifinal}, Final: ${g.final}`
      )
      .join("\n");

    
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    const prompt = `
      Analyze the following students' grades for subject ID ${subjectId}.
      Provide insights such as:
      - Class average
      - Top-performing and struggling students
      - Suggestions for improvement
      
      Return the output in JSON format with fields:
      {
        "classAverage": number,
        "topStudents": [ { "name": string, "average": number } ],
        "strugglingStudents": [ { "name": string, "average": number } ],
        "recommendations": string
      }

      Here are the data:
      ${formattedData}
    `;

    const result = await model.generateContent(prompt);
    const text = await result.response.text();

    
    try {
      const json = JSON.parse(text);
      return json;
    } catch {
      return { rawResponse: text }; 
    }
  } catch (err) {
    console.error("Error in studentsAnalyzer:", err.message);
    return { error: err.message };
  }
}
