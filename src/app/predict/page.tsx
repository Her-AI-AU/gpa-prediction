"use client"
import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
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

export default function PredictPage() {
  const searchParams = useSearchParams();
  const semester = searchParams.get('semester');
  const [subjects, setSubjects] = useState<Subject[]>([]);

  useEffect(() => {
    if (semester) {
      fetchSubjectsForSemester(semester);
    }
  }, [semester]);

  const fetchSubjectsForSemester = async (sem: string) => {
    const user = JSON.parse(localStorage.getItem("user") || "{}");
    if (user.id) {
      try {
        const response = await fetch(`http://localhost:5001/subjects/${user.id}`);
        if (response.ok) {
          const data = await response.json();
          const filteredSubjects = data.subjects.filter((subject: Subject) => subject.semester === sem);
          setSubjects(filteredSubjects);
        } else {
          console.error("Failed to fetch subjects");
        }
      } catch (error) {
        console.error("Error fetching subjects:", error);
      }
    }
  };

  return (
    <>
      <Header />
      <div className="container mx-auto mt-8 px-4">
        <h1 className="text-3xl font-bold text-gray-800 mb-6">Predict Semester: {semester}</h1>
        {subjects.length > 0 ? (
          <div>
            {/* Add your prediction logic and UI here */}
            <p>Subjects in this semester:</p>
            <ul>
              {subjects.map(subject => (
                <li key={subject.id}>{subject.name}</li>
              ))}
            </ul>
            {/* You can add more complex prediction UI and logic here */}
          </div>
        ) : (
          <p>No subjects found for this semester.</p>
        )}
      </div>
    </>
  );
}