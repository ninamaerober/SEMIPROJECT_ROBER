import { useState, useEffect } from "react";
import { toast } from "react-hot-toast";
import supabase from "../lib/supabase";

export default function SubjectsPage() {
  const [subjects, setSubjects] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    subject_code: "",
    subject_name: "",
    instructor: "",
  });
  const [editId, setEditId] = useState(null);

  useEffect(() => {
    fetchSubjects();
  }, []);

  const fetchSubjects = async () => {
    const { data, error } = await supabase
      .from("subjects")
      .select("*")
      .order("id", { ascending: true });

    if (error) {
      toast.error("Failed to fetch subjects");
      console.error(error);
    } else {
      setSubjects(data);
    }
  };

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleAddOrUpdate = async () => {
    const { subject_code, subject_name, instructor } = formData;
    if (!subject_code || !subject_name || !instructor) {
      toast.error("Please fill all fields!");
      return;
    }

    if (editId) {
     
      const { error } = await supabase
        .from("subjects")
        .update(formData)
        .eq("id", editId);

      if (error) {
        toast.error("Failed to update subject");
        console.error(error);
      } else {
        toast.success("Subject updated!");
        fetchSubjects();
      }
    } else {
     
      const { error } = await supabase.from("subjects").insert([formData]);

      if (error) {
        toast.error("Failed to add subject");
        console.error(error);
      } else {
        toast.success("Subject added!");
        fetchSubjects();
      }
    }

    setFormData({ subject_code: "", subject_name: "", instructor: "" });
    setEditId(null);
    setModalOpen(false);
  };

  const handleEdit = (subject) => {
    setFormData({ ...subject });
    setEditId(subject.id);
    setModalOpen(true);
  };

  const handleDelete = async (id) => {
    if (confirm("Are you sure you want to delete this subject?")) {
      const { error } = await supabase.from("subjects").delete().eq("id", id);
      if (error) {
        toast.error("Failed to delete subject");
        console.error(error);
      } else {
        toast.success("Subject deleted!");
        fetchSubjects();
      }
    }
  };

  return (
    <div className="p-8 bg-gray-200 min-h-screen">
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-800">Subjects</h1>
        <button
          onClick={() => setModalOpen(true)}
          className="bg-red-200 text-black px-6 py-2 rounded-lg shadow-lg hover:bg-red-300 transition"
        >
          + Add Subject
        </button>
      </div>

      {/* Table */}
      <div className="overflow-x-auto shadow-md rounded-lg bg-white">
        <table className="min-w-full text-left text-sm text-gray-700">
          <thead className="bg-indigo-100 uppercase text-gray-700 text-xs">
            <tr>
              <th className="px-4 py-3">ID</th>
              <th className="px-4 py-3">Subject Code</th>
              <th className="px-4 py-3">Subject Name</th>
              <th className="px-4 py-3">Instructor</th>
              <th className="px-4 py-3">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {subjects.map((subject) => (
              <tr key={subject.id} className="hover:bg-gray-50 transition">
                <td className="px-4 py-2">{subject.id}</td>
                <td className="px-4 py-2">{subject.subject_code}</td>
                <td className="px-4 py-2">{subject.subject_name}</td>
                <td className="px-4 py-2">{subject.instructor}</td>
                <td className="px-4 py-2 flex gap-2">
                  <button
                    onClick={() => handleEdit(subject)}
                    className="text-indigo-600 border border-indigo-600 px-3 py-1 rounded hover:bg-indigo-50 transition"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(subject.id)}
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
              {editId ? "Edit Subject" : "Add Subject"}
            </h2>
            <div className="flex flex-col gap-4">
              <input
                type="text"
                name="subject_code"
                placeholder="Subject Code"
                value={formData.subject_code}
                onChange={handleInputChange}
                className="border border-gray-300 px-3 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-400"
              />
              <input
                type="text"
                name="subject_name"
                placeholder="Subject Name"
                value={formData.subject_name}
                onChange={handleInputChange}
                className="border border-gray-300 px-3 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-400"
              />
              <input
                type="text"
                name="instructor"
                placeholder="Instructor"
                value={formData.instructor}
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
