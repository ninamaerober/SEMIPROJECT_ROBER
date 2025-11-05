import { useState, useEffect } from "react";
import { toast } from "react-hot-toast";
import supabase from "../lib/supabase";

export default function StudentsPage() {
  const [students, setStudents] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    student_number: "",
    first_name: "",
    last_name: "",
    course: "",
    year_level: "",
  });
  const [editId, setEditId] = useState(null);

  
  useEffect(() => {
    fetchStudents();
  }, []);

  const fetchStudents = async () => {
    const { data, error } = await supabase
      .from("students")
      .select("*")
      .order("id", { ascending: true });

    if (error) {
      toast.error("Failed to fetch students");
      console.error(error);
    } else {
      setStudents(data);
    }
  };

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleAddOrUpdate = async () => {
    const { student_number, first_name, last_name, course, year_level } = formData;
    if (!student_number || !first_name || !last_name || !course || !year_level) {
      toast.error("Please fill all fields!");
      return;
    }

    if (editId) {
     
      const { error } = await supabase
        .from("students")
        .update(formData)
        .eq("id", editId);

      if (error) {
        toast.error("Failed to update student");
        console.error(error);
      } else {
        toast.success("Student updated!");
        fetchStudents();
      }
    } else {
     
      const { error } = await supabase.from("students").insert([formData]);

      if (error) {
        toast.error("Failed to add student");
        console.error(error);
      } else {
        toast.success("Student added!");
        fetchStudents();
      }
    }

    setFormData({
      student_number: "",
      first_name: "",
      last_name: "",
      course: "",
      year_level: "",
    });
    setEditId(null);
    setModalOpen(false);
  };

  const handleEdit = (student) => {
    setFormData({ ...student });
    setEditId(student.id);
    setModalOpen(true);
  };

  const handleDelete = async (id) => {
    if (confirm("Are you sure you want to delete this student?")) {
      const { error } = await supabase.from("students").delete().eq("id", id);
      if (error) {
        toast.error("Failed to delete student");
        console.error(error);
      } else {
        toast.success("Student deleted!");
        fetchStudents();
      }
    }
  };

  return (
    <div className="p-8 bg-gray-200 min-h-screen">
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-800">Students</h1>
        <button
          onClick={() => setModalOpen(true)}
          className="bg-red-200 text-black px-6 py-2 rounded-lg shadow-lg hover:bg-red-300 transition"
        >
          + Add Student
        </button>
      </div>

      {/* Table */}
      <div className="overflow-x-auto shadow-md rounded-lg bg-white">
        <table className="min-w-full text-left text-sm text-gray-700">
          <thead className="bg-indigo-100 uppercase text-gray-700 text-xs">
            <tr>
              <th className="px-4 py-3">ID</th>
              <th className="px-4 py-3">Student Number</th>
              <th className="px-4 py-3">First Name</th>
              <th className="px-4 py-3">Last Name</th>
              <th className="px-4 py-3">Course</th>
              <th className="px-4 py-3">Year Level</th>
              <th className="px-4 py-3">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {students.map((student) => (
              <tr key={student.id} className="hover:bg-gray-50 transition">
                <td className="px-4 py-2">{student.id}</td>
                <td className="px-4 py-2">{student.student_number}</td>
                <td className="px-4 py-2">{student.first_name}</td>
                <td className="px-4 py-2">{student.last_name}</td>
                <td className="px-4 py-2">{student.course}</td>
                <td className="px-4 py-2">{student.year_level}</td>
                <td className="px-4 py-2 flex gap-2">
                  <button
                    onClick={() => handleEdit(student)}
                    className="text-indigo-600 border border-indigo-600 px-3 py-1 rounded hover:bg-indigo-50 transition"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(student.id)}
                    className="text-red-600 border border-red-600 px-3 py-1 rounded hover:bg-red-50 transition"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Modal */}
      {modalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white p-6 rounded-xl shadow-2xl w-96 animate-fadeIn">
            <h2 className="text-2xl font-semibold mb-5 text-gray-800">
              {editId ? "Edit Student" : "Add Student"}
            </h2>
            <div className="flex flex-col gap-4">
              <input
                type="text"
                name="student_number"
                placeholder="Student Number"
                value={formData.student_number}
                onChange={handleInputChange}
                className="border border-gray-300 px-3 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-400"
              />
              <input
                type="text"
                name="first_name"
                placeholder="First Name"
                value={formData.first_name}
                onChange={handleInputChange}
                className="border border-gray-300 px-3 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-400"
              />
              <input
                type="text"
                name="last_name"
                placeholder="Last Name"
                value={formData.last_name}
                onChange={handleInputChange}
                className="border border-gray-300 px-3 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-400"
              />
              <input
                type="text"
                name="course"
                placeholder="Course"
                value={formData.course}
                onChange={handleInputChange}
                className="border border-gray-300 px-3 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-400"
              />
              <input
                type="text"
                name="year_level"
                placeholder="Year Level"
                value={formData.year_level}
                onChange={handleInputChange}
                className="border border-gray-300 px-3 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-400"
              />
            </div>
            <div className="flex justify-end gap-3 mt-5">
              <button
                onClick={() => setModalOpen(false)}
                className="px-4 py-2 border rounded-lg hover:bg-gray-100 transition"
              >
                Cancel
              </button>
              <button
                onClick={handleAddOrUpdate}
                className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition"
              >
                {editId ? "Update" : "Add"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
