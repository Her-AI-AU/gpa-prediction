"use client";
import { Header } from "@/components/header";
import Link from "next/link";
import { useEffect, useState } from "react";

interface Subject {
  id: number;
  name: string;
  semester: string;
  score?: number;
  weight: number;
}

export default function Home() {
  const [subjectsBySemester, setSubjectsBySemester] = useState<Record<string, Subject[]>>({});

  useEffect(() => {
    fetchSubjects();
  }, []);

  const fetchSubjects = async () => {
    const user = JSON.parse(localStorage.getItem("user") || "{}");
    if (user.id) {
      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/subjects/${user.id}`);
        if (response.ok) {
          const data = await response.json();
          const grouped = data.subjects.reduce((acc: Record<string, Subject[]>, subject: Subject) => {
            if (!acc[subject.semester]) {
              acc[subject.semester] = [];
            }
            acc[subject.semester].push(subject);
            return acc;
          }, {});
          setSubjectsBySemester(grouped);
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
      <div className="flex flex-col items-center p-8">
        <div className="w-full max-w-6xl">
          {Object.entries(subjectsBySemester).map(([semester, subjects]) => (
            <div key={semester} className="mb-8">
              <h2 className="text-2xl font-semibold mb-4">{semester}</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {subjects.map((subject) => (
                  <Link
                    key={subject.id}
                    href={`/subjects?semester=${encodeURIComponent(semester)}`}
                    className="bg-white shadow-md rounded-lg p-6 text-center hover:shadow-lg transition-shadow"
                  >
                    <h3 className="text-xl font-semibold mb-2">{subject.name}</h3>
                    <p className="text-gray-600 mb-2">Score: {subject.score ?? 'N/A'}</p>
                    <p className="text-gray-600">Weight: {subject.weight}</p>
                  </Link>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}
