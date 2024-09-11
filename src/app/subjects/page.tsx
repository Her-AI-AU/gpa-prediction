"use client"
import React, { useState, useEffect } from "react";
import { Header } from "@/components/header";
import SubjectCard from "@/components/subjectCard";
import { Plus, ChartLine } from 'lucide-react';
import { useRouter } from 'next/navigation';

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
  const router = useRouter();

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

  const handleSave = async (updatedSubject: Subject) => {
    try {
      const url = `http://localhost:5001/subjects/${updatedSubject.id}`;
      const response = await fetch(url, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(updatedSubject),
      });
      if (response.ok) {
        fetchSubjects(); // Refresh the subject list
      } else {
        console.error("Failed to update subject");
      }
    } catch (error) {
      console.error("Error updating subject:", error);
    }
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

  const handleCreate = async () => {
    const user = JSON.parse(localStorage.getItem("user") || "{}");
    const newSubject = {
      name: "New Subject",
      semester: selectedSemester,
      user_id: user.id,
    };

    try {
      const response = await fetch("http://localhost:5001/subjects", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newSubject),
      });
      if (response.ok) {
        fetchSubjects(); // Refresh the subject list
      } else {
        console.error("Failed to create subject");
      }
    } catch (error) {
      console.error("Error creating subject:", error);
    }
  };

  const handlePredict = () => {
    router.push(`/predict?semester=${selectedSemester}`);
  };

  return (
    <>
      <Header />
      <div className="container mx-auto mt-8 px-4">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-gray-800">Your Subjects</h1>
          <div className="flex space-x-4">
            <button
              onClick={handlePredict}
              className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded-full flex items-center transition duration-300 ease-in-out"
            >
              <ChartLine size={20} className="mr-2" />
              Predict This Semester
            </button>
            <button
              onClick={handleCreate}
              className="bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded-full flex items-center transition duration-300 ease-in-out"
            >
              <Plus size={20} className="mr-2" />
              Add Subject
            </button>
          </div>
        </div>

        <div className="mb-6">
          <label htmlFor="semester-select" className="block text-sm font-medium text-gray-700 mb-2">
            Select Semester:
          </label>
          <select
            id="semester-select"
            value={selectedSemester}
            onChange={(e) => setSelectedSemester(e.target.value)}
            className="block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
          >
            {semesters.map((semester) => (
              <option key={semester} value={semester}>
                {semester}
              </option>
            ))}
          </select>
        </div>

        {filteredSubjects.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {filteredSubjects.map((subject) => (
              <SubjectCard
                key={subject.id}
                subject={subject}
                onSave={handleSave}
                onDelete={handleDelete}
              />
            ))}
          </div>
        ) : (
          <p className="text-center text-gray-500 mt-8">No subjects found for the selected semester.</p>
        )}
      </div>
    </>
  );
}