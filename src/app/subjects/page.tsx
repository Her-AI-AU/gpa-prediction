"use client";
import { useState, useEffect } from "react";
import { Header } from "@/components/header";

interface Subject {
  id: number;
  name: string;
  semester: string;
  hurdle?: number;
  score?: number;
  assessments_list?: string;
  user_id: number;
}

export default function Subjects() {
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [selectedSemester, setSelectedSemester] = useState<string>("");
  const [semesters, setSemesters] = useState<string[]>([]);
  const [expandedSubject, setExpandedSubject] = useState<number | null>(null);
  const [editingSubject, setEditingSubject] = useState<Subject | null>(null);
  const [isCreating, setIsCreating] = useState(false);

  useEffect(() => {
    fetchSubjects();
  }, []);

  const fetchSubjects = async () => {
    const user = JSON.parse(localStorage.getItem("user") || "{}");
    if (user.id) {
      try {
        const response = await fetch(`http://localhost:5001/subjects/${user.id}`);
        if (response.ok) {
          const data = await response.json();
          setSubjects(data.subjects);

          const uniqueSemesters = Array.from(new Set(data.subjects.map((subject: Subject) => subject.semester)));
          setSemesters(uniqueSemesters);

          if (uniqueSemesters.length > 0) {
            setSelectedSemester(uniqueSemesters[0]);
          }
        } else {
          console.error("Failed to fetch subjects");
        }
      } catch (error) {
        console.error("Error fetching subjects:", error);
      }
    }
  };

  const filteredSubjects = subjects.filter(
    (subject) => subject.semester === selectedSemester
  );

  const toggleSubjectDetails = (subjectId: number) => {
    setExpandedSubject(expandedSubject === subjectId ? null : subjectId);
  };

  const handleEdit = (subject: Subject) => {
    setEditingSubject(subject);
    setIsCreating(false);
  };

  const handleDelete = async (subjectId: number) => {
    if (window.confirm("Are you sure you want to delete this subject?")) {
      try {
        const response = await fetch(`http://localhost:5001/subjects/${subjectId}`, {
          method: "DELETE",
        });
        if (response.ok) {
          fetchSubjects(); // Refresh the subject list
        } else {
          console.error("Failed to delete subject");
        }
      } catch (error) {
        console.error("Error deleting subject:", error);
      }
    }
  };

  const handleSave = async (updatedSubject: Subject) => {
    try {
      const user = JSON.parse(localStorage.getItem("user") || "{}");
      const url = isCreating
        ? "http://localhost:5001/subjects"
        : `http://localhost:5001/subjects/${updatedSubject.id}`;
      const method = isCreating ? "POST" : "PUT";

      const body = isCreating
        ? { name: updatedSubject.name, semester: updatedSubject.semester, user_id: user.id }
        : updatedSubject;

      const response = await fetch(url, {
        method: method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(body),
      });
      if (response.ok) {
        fetchSubjects(); // Refresh the subject list
        setEditingSubject(null);
        setIsCreating(false);
      } else {
        console.error("Failed to update subject");
      }
    } catch (error) {
      console.error("Error updating subject:", error);
    }
  };

  const handleCreate = () => {
    const user = JSON.parse(localStorage.getItem("user") || "{}");
    setEditingSubject({
      id: 0, // This will be assigned by the server
      name: "",
      semester: selectedSemester,
      user_id: user.id,
    });
    setIsCreating(true);
  };

  return (
    <>
      <Header />
      <div className="container mx-auto mt-8">
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-2xl font-bold">Your Subjects</h1>
          <button
            onClick={handleCreate}
            className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded"
          >
            Create Subject
          </button>
        </div>

        <div className="mb-4">
          <label
            htmlFor="semester-select"
            className="block text-sm font-medium text-gray-700"
          >
            Select Semester:
          </label>
          <select
            id="semester-select"
            value={selectedSemester}
            onChange={(e) => setSelectedSemester(e.target.value)}
            className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
          >
            {semesters.map((semester) => (
              <option key={semester} value={semester}>
                {semester}
              </option>
            ))}
          </select>
        </div>

        {filteredSubjects.length > 0 ? (
          <ul className="space-y-2">
            {filteredSubjects.map((subject) => (
              <li
                key={subject.id}
                className="bg-white shadow overflow-hidden sm:rounded-lg"
              >
                <div
                  className="p-4 cursor-pointer flex justify-between items-center"
                  onClick={() => toggleSubjectDetails(subject.id)}
                >
                  <h3 className="text-lg leading-6 font-medium text-gray-900">
                    {subject.name}
                  </h3>
                  <div>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleEdit(subject);
                      }}
                      className="text-blue-600 hover:text-blue-800 mr-2"
                    >
                      Edit
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDelete(subject.id);
                      }}
                      className="text-red-600 hover:text-red-800 mr-2"
                    >
                      Delete
                    </button>
                    <span className="text-gray-400">
                      {expandedSubject === subject.id ? "▲" : "▼"}
                    </span>
                  </div>
                </div>
                {expandedSubject === subject.id && (
                  <div className="px-4 py-2 border-t border-gray-200">
                    <p className="text-sm text-gray-500">
                      Semester: {subject.semester}
                    </p>
                    {subject.hurdle && (
                      <p className="text-sm text-gray-500">
                        Hurdle: {subject.hurdle}
                      </p>
                    )}
                    {subject.score && (
                      <p className="text-sm text-gray-500">
                        Score: {subject.score}
                      </p>
                    )}
                    {subject.assessments_list && (
                      <p className="text-sm text-gray-500">
                        Assessments: {subject.assessments_list}
                      </p>
                    )}
                  </div>
                )}
              </li>
            ))}
          </ul>
        ) : (
          <p>No subjects found for the selected semester.</p>
        )}
      </div>

      {editingSubject && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full">
          <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
            <h3 className="text-lg font-medium leading-6 text-gray-900 mb-2">
              {isCreating ? "Create Subject" : "Edit Subject"}
            </h3>
            <input
              type="text"
              value={editingSubject.name}
              onChange={(e) => setEditingSubject({ ...editingSubject, name: e.target.value })}
              placeholder="Subject Name"
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
            />
            <input
              type="text"
              value={editingSubject.semester}
              onChange={(e) => setEditingSubject({ ...editingSubject, semester: e.target.value })}
              placeholder="Semester"
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
            />
            {!isCreating && (
              <>
                <input
                  type="number"
                  value={editingSubject.hurdle || ""}
                  onChange={(e) => setEditingSubject({ ...editingSubject, hurdle: Number(e.target.value) })}
                  placeholder="Hurdle"
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                />
                <input
                  type="number"
                  value={editingSubject.score || ""}
                  onChange={(e) => setEditingSubject({ ...editingSubject, score: Number(e.target.value) })}
                  placeholder="Score"
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                />
                <input
                  type="text"
                  value={editingSubject.assessments_list || ""}
                  onChange={(e) => setEditingSubject({ ...editingSubject, assessments_list: e.target.value })}
                  placeholder="Assessments List"
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                />
              </>
            )}
            <div className="mt-4">
              <button
                onClick={() => handleSave(editingSubject)}
                className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                {isCreating ? "Create" : "Save"}
              </button>
              <button
                onClick={() => {
                  setEditingSubject(null);
                  setIsCreating(false);
                }}
                className="ml-2 inline-flex justify-center py-2 px-4 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
