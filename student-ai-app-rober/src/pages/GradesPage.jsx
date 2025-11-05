import { useState, useEffect } from "react";
import supabase from "../lib/supabase";
import { toast } from "react-hot-toast";
import { PDFViewer, PDFDownloadLink } from "@react-pdf/renderer";
import StudentsReportDocument from "../pdfTemplates/StudentsReportDocument";

export default function GradesPage() {
  const [subjects, setSubjects] = useState([]);
  const [selectedSubject, setSelectedSubject] = useState("");
  const [students, setStudents] = useState([]);
  const [grades, setGrades] = useState({});
  const [showReport, setShowReport] = useState(false);

  // Fetch all subjects
  useEffect(() => {
    async function fetchSubjects() {
      const { data, error } = await supabase
        .from("subjects")
        .select("*")
        .order("id");

      if (error) toast.error(error.message);
      else setSubjects(data);
    }
    fetchSubjects();
  }, []);

  // Fetch students + their saved grades for the selected subject
  useEffect(() => {
    if (!selectedSubject) return;

    async function fetchStudentsAndGrades() {
      // 1️⃣ Fetch students
      const { data: studentsData, error: studentError } = await supabase
        .from("students")
        .select("*")
        .order("student_number");

      if (studentError) {
        toast.error(studentError.message);
        return;
      }

      setStudents(studentsData);

      // 2️⃣ Fetch grades for selected subject
      const { data: gradesData, error: gradesError } = await supabase
        .from("grades")
        .select("*")
        .eq("subject_id", selectedSubject);

      if (gradesError) {
        toast.error(gradesError.message);
        return;
      }

      // 3️⃣ Merge fetched grades with students
      const initialGrades = {};
      studentsData.forEach((student) => {
        const studentGrade = gradesData.find((g) => g.student_id === student.id);
        initialGrades[student.id] = {
          prelim: studentGrade?.prelim || "",
          midterm: studentGrade?.midterm || "",
          semifinal: studentGrade?.semifinal || "",
          final: studentGrade?.final || "",
        };
      });

      setGrades(initialGrades);
    }

    fetchStudentsAndGrades();
  }, [selectedSubject]);

  const handleGradeChange = (studentId, field, value) => {
    setGrades((prev) => ({
      ...prev,
      [studentId]: { ...prev[studentId], [field]: value },
    }));
  };

  const saveGrades = async () => {
    const gradeEntries = Object.keys(grades).map((studentId) => ({
      student_id: studentId,
      subject_id: selectedSubject,
      ...grades[studentId],
    }));

    const { error } = await supabase.from("grades").upsert(gradeEntries);

    if (error) toast.error(error.message);
    else toast.success("Grades saved successfully!");
  };

  const computeAverage = (g) => {
    if (!g) return "";
    const { prelim, midterm, semifinal, final } = g;
    if (!prelim && !midterm && !semifinal && !final) return "";
    return (
      (Number(prelim || 0) +
        Number(midterm || 0) +
        Number(semifinal || 0) +
        Number(final || 0)) /
      4
    ).toFixed(2);
  };

  return (
    <div className="p-8 bg-gray-200 min-h-screen">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-800">Grades</h1>
      </div>

      {/* Subject Selection */}
      <div className="mb-6">
        <label className="mr-2 font-medium">Select Subject:</label>
        <select
          value={selectedSubject}
          onChange={(e) => setSelectedSubject(e.target.value)}
          className="border border-gray-300 px-3 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-400"
        >
          <option value="">-- Select --</option>
          {subjects.map((subj) => (
            <option key={subj.id} value={subj.id}>
              {subj.subject_code} - {subj.subject_name}
            </option>
          ))}
        </select>
      </div>

      {/* Students Table */}
      {selectedSubject && students.length > 0 && (
        <div className="overflow-x-auto shadow-md rounded-lg bg-white">
          <table className="min-w-full text-left text-sm text-gray-700">
            <thead className="bg-indigo-100 uppercase text-gray-700 text-xs">
              <tr>
                <th className="px-4 py-3">Student Number</th>
                <th className="px-4 py-3">Name</th>
                <th className="px-4 py-3">Prelim</th>
                <th className="px-4 py-3">Midterm</th>
                <th className="px-4 py-3">Semifinal</th>
                <th className="px-4 py-3">Final</th>
                <th className="px-4 py-3">Average</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-300">
              {students.map((s) => (
                <tr key={s.id} className="hover:bg-gray-50 transition">
                  <td className="px-4 py-2">{s.student_number}</td>
                  <td className="px-4 py-2">{s.first_name} {s.last_name}</td>
                  {["prelim", "midterm", "semifinal", "final"].map((field) => (
                    <td key={field} className="px-4 py-2">
                      <input
                        type="number"
                        value={grades[s.id]?.[field] || ""}
                        onChange={(e) => handleGradeChange(s.id, field, e.target.value)}
                        className="w-16 border px-2 py-1 rounded focus:outline-none focus:ring-2 focus:ring-indigo-400"
                      />
                    </td>
                  ))}
                  <td className="px-4 py-2 font-medium">{computeAverage(grades[s.id])}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Buttons */}
      {selectedSubject && (
        <div className="mt-6 flex gap-4">
          <button
            onClick={saveGrades}
            className="bg-indigo-600 text-white px-6 py-2 rounded-lg hover:bg-indigo-700 transition"
          >
            Save Grades
          </button>
          <button
            onClick={() => setShowReport(true)}
            className="bg-green-500 text-white px-6 py-2 rounded-lg hover:bg-green-600 transition"
          >
            Generate AI Analysis Report
          </button>
        </div>
      )}

      {/* PDF Viewer */}
      {showReport && (
        <div className="mt-8 h-[800px] border">
          <PDFViewer width="100%" height="100%">
            <StudentsReportDocument
              students={students}
              grades={grades}
              subjectName={subjects.find((s) => s.id == selectedSubject)?.subject_name}
            />
          </PDFViewer>
          <div className="mt-4 flex justify-end">
            <PDFDownloadLink
              document={
                <StudentsReportDocument
                  students={students}
                  grades={grades}
                  subjectName={subjects.find((s) => s.id == selectedSubject)?.subject_name}
                />
              }
              fileName="students_ai_report.pdf"
              className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
            >
              {({ loading }) => (loading ? "Generating PDF..." : "Download PDF")}
            </PDFDownloadLink>
          </div>
        </div>
      )}
    </div>
  );
}
