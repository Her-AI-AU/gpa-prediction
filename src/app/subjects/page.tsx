"use client";
import React, { useState, useEffect } from "react";
import { Header } from "@/components/header";
import { useSearchParams, useRouter } from "next/navigation";
import { ArrowLeft, Plus, Share2, X } from "lucide-react";
import SubjectCard from "@/components/subjectCard";
import { MatterBackground } from "@/components/MatterBackground";
import html2canvas from "html2canvas";

interface Subject {
  id: number;
  name: string;
  semester: string;
  hurdle?: number;
  score?: number;
  weight?: number;
  target_score?: number;
  assessments_list?: string;
  user_id: number;
}
export default function Subjects() {
  const searchParams = useSearchParams();
  const urlSemester = searchParams.get("semester");
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [selectedSemester, setSelectedSemester] = useState<string>("");
  const [semesters, setSemesters] = useState<string[]>([]);
  const [currentWAM, setCurrentWAM] = useState<number | null>(null);
  const [showSharePopup, setShowSharePopup] = useState(false);
  const [showConfirmationPopup, setShowConfirmationPopup] = useState(false);
  const router = useRouter();

  useEffect(() => {
    fetchSubjects();
  }, []);

  useEffect(() => {
    if (urlSemester && semesters.includes(urlSemester)) {
      setSelectedSemester(urlSemester);
    } else if (semesters.length > 0) {
      setSelectedSemester(semesters[0]);
    }
  }, [urlSemester, semesters]);

  useEffect(() => {
    calculateWAM();
  }, [subjects, selectedSemester]);

  const fetchSubjects = async () => {
    const user = JSON.parse(localStorage.getItem("user") || "{}");
    if (user.id) {
      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/subjects/${user.id}`
        );
        if (response.ok) {
          const data = await response.json();
          setSubjects(data.subjects);

          const uniqueSemesters = Array.from(
            new Set(data.subjects.map((subject: Subject) => subject.semester))
          ) as string[];
          setSemesters(uniqueSemesters);

          if (urlSemester && uniqueSemesters.includes(urlSemester)) {
            setSelectedSemester(urlSemester);
          } else if (uniqueSemesters.length > 0) {
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

  const calculateWAM = () => {
    let totalWeightedScore = 0;
    let totalWeight = 0;

    const semesterSubjects = selectedSemester
      ? subjects.filter((subject) => subject.semester === selectedSemester)
      : subjects;

    semesterSubjects.forEach((subject) => {
      if (subject.score !== undefined && subject.weight) {
        totalWeightedScore += subject.score * subject.weight;
        totalWeight += subject.weight;
      }
    });

    if (totalWeight > 0) {
      const wam = totalWeightedScore / totalWeight;
      setCurrentWAM(Number(wam.toFixed(2)));
    } else {
      setCurrentWAM(null);
    }
  };

  const filteredSubjects = selectedSemester
    ? subjects.filter((subject) => subject.semester === selectedSemester)
    : subjects;

  const groupedSubjects = filteredSubjects.reduce((acc, subject) => {
    if (!acc[subject.semester]) {
      acc[subject.semester] = [];
    }
    acc[subject.semester].push(subject);
    return acc;
  }, {} as Record<string, Subject[]>);

  const handleSave = async (updatedSubject: Subject) => {
    try {
      const url = `${process.env.NEXT_PUBLIC_API_URL}/subjects/${updatedSubject.id}`;
      const response = await fetch(url, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(updatedSubject),
      });
      if (response.ok) {
        await fetchSubjects();
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
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/subjects/${subjectId}`,
          {
            method: "DELETE",
          }
        );
        if (response.ok) {
          fetchSubjects();
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
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/subjects`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(newSubject),
        }
      );
      if (response.ok) {
        fetchSubjects();
      } else {
        console.error("Failed to create subject");
      }
    } catch (error) {
      console.error("Error creating subject:", error);
    }
  };

  const handleShare = () => {
    setShowSharePopup(true);
  };

  const closeSharePopup = () => {
    setShowSharePopup(false);
  };

  const handleBackNiuXiaoJiang = () => {
    router.back();
  };

  const shareViaTwitter = () => {
    const text = encodeURIComponent(
      `I use HerAI.GPA to predict my GPA. My current WAM is ${currentWAM}. Check out yoursubjects! \n ${window.location.href}`
    );
    window.open(`https://twitter.com/intent/tweet?text=${text}`, "_blank");
    closeSharePopup();
  };

  const shareViaFacebook = () => {
    const url = encodeURIComponent(window.location.href);
    const message = encodeURIComponent(
      `Check out my current WAM: ${currentWAM}. Here are my subjects: ${subjects
        .map((s) => s.name)
        .join(", ")}`
    );

    // This opens Facebook's page
    // need facebook api for create new post
    window.open(`https://www.facebook.com/`, "_blank");
    closeSharePopup();
  };

  const takeScreenshot = async () => {
    try {
      // Hide the share popup
      setShowSharePopup(false);

      // Show the content for the screenshot
      const screenshotContent = document.createElement("div");
      screenshotContent.innerHTML = `
        <div style="position: fixed; inset: 0; background-color: rgba(0, 0, 0, 0.5); display: flex; align-items: center; justify-content: center; z-index: 9999;">
          <div style="background: white; padding: 32px; border-radius: 12px; width: 90%; max-width: 540px; text-align: center; font-family: sans-serif;">
            <h2 style="font-size: 28px; font-weight: 600; margin-bottom: 24px;">HerAI.GPA</h2>
            <p style="font-size: 18px; margin-bottom: 16px;">My current WAM is ${currentWAM}</p>
            <p style="font-size: 18px; margin-bottom: 16px;">Check out your subjects!</p>
            <p style="font-size: 16px; word-break: break-all;">${window.location.href}</p>
          </div>
        </div>
      `;
      document.body.appendChild(screenshotContent);

      await new Promise((resolve) => setTimeout(resolve, 100));

      const canvas = await html2canvas(document.body);

      document.body.removeChild(screenshotContent);

      const dataUrl = canvas.toDataURL("image/png");

      const link = document.createElement("a");
      link.href = dataUrl;
      link.download = "my_subjects_screenshot.png";

      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      // Show the confirmation popup
      setShowConfirmationPopup(true);
    } catch (error) {
      console.error("Failed to take screenshot:", error);
    }
  };

  const closeConfirmationPopup = () => {
    setShowConfirmationPopup(false);
  };

  return (
    <div className="relative min-h-screen">
      <MatterBackground
        fillPercentage={currentWAM !== null ? currentWAM / 150 : 0.5}
      />
      <div className="relative z-10">
        <Header />
        <div className="container mx-auto mt-8 px-4 font-sans">
          <div className="flex justify-between items-center mb-6">
            <button
              onClick={handleBackNiuXiaoJiang}
              className="text-gray-600 hover:text-gray-800 p-2 rounded-full transition-colors duration-200"
              aria-label="Go back"
            >
              <ArrowLeft size={24} />
            </button>
            <div className="flex items-center space-x-4">
              <div className="relative">
                <select
                  id="semester-select"
                  value={selectedSemester}
                  onChange={(e) => {
                    const newSemester = e.target.value;
                    setSelectedSemester(newSemester);
                    window.history.pushState(
                      {},
                      "",
                      `/subjects?semester=${encodeURIComponent(newSemester)}`
                    );
                  }}
                  className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                >
                  <option value="">All Semesters</option>
                  {semesters.map((semester) => (
                    <option key={semester} value={semester}>
                      {semester}
                    </option>
                  ))}
                </select>
              </div>
              <button
                onClick={handleCreate}
                className="bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded-lg flex items-center transition duration-300 ease-in-out"
              >
                <Plus size={20} className="mr-2" />
                Add Subject
              </button>
              <button
                onClick={handleShare}
                className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded-lg flex items-center transition duration-300 ease-in-out"
              >
                <Share2 size={20} className="mr-2" />
                Share
              </button>
            </div>
          </div>

          <div className="bg-blue-100 bg-opacity-80 border-l-4 border-blue-500 text-blue-700 p-4 mb-6 rounded">
            <p className="font-bold">
              {selectedSemester ? `${selectedSemester} WAM:` : "Overall WAM:"}{" "}
              {currentWAM !== null ? `${currentWAM}` : "N/A"}
            </p>
          </div>

          {Object.entries(groupedSubjects).map(
            ([semester, semesterSubjects]) => (
              <div key={semester} className="mb-8">
                <h2 className="text-2xl font-semibold mb-4">{semester}</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                  {semesterSubjects.map((subject) => (
                    <SubjectCard
                      key={subject.id}
                      subject={subject}
                      onSave={handleSave}
                      onDelete={handleDelete}
                    />
                  ))}
                </div>
              </div>
            )
          )}

          {Object.keys(groupedSubjects).length === 0 && (
            <p className="text-center text-white mt-8 bg-gray-800 bg-opacity-50 p-4 rounded">
              No subjects found for the selected semester.
            </p>
          )}
        </div>
      </div>

      {/* share popup */}
      {showSharePopup && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-96 relative">
            <h2 className="text-2xl font-semibold mb-6">Share with friends</h2>
            <button
              onClick={closeSharePopup}
              className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
            >
              <X size={20} />
            </button>
            <div className="flex justify-center space-x-6 mb-6">
              <button
                onClick={shareViaFacebook}
                className="text-blue-600 hover:text-blue-800"
              >
                <svg
                  className="w-8 h-8"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M18 2h-3a5 5 0 00-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 011-1h3z"></path>
                </svg>
              </button>
              <button
                onClick={shareViaTwitter}
                className="text-blue-400 hover:text-blue-600"
              >
                <svg
                  className="w-8 h-8"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M23 3a10.9 10.9 0 01-3.14 1.53 4.48 4.48 0 00-7.86 3v1A10.66 10.66 0 013 4s-4 9 5 13a11.64 11.64 0 01-7 2c9 5 20 0 20-11.5a4.5 4.5 0 00-.08-.83A7.72 7.72 0 0023 3z"></path>
                </svg>
              </button>
              <button
                onClick={takeScreenshot}
                className="text-blue-500 hover:text-blue-700"
              >
                <svg
                  className="w-8 h-8"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M12 2C6.48 2 2 6.48 2 12c0 5.51 4.48 10 10 10s10-4.49 10-10c0-5.52-4.48-10-10-10zm3.92 13.89v.11c0 .67-.54 1.2-1.21 1.2H9.29c-.67 0-1.21-.54-1.21-1.2v-.11c0-.67.54-1.2 1.21-1.2h5.42c.67 0 1.21.54 1.21 1.2zm-6.16-5.13l1.94-2.32c.2-.24.57-.24.77 0l1.94 2.32c.18.22.01.54-.27.54H10.03c-.28.01-.45-.32-.27-.54z"></path>
                </svg>
              </button>
            </div>
            <div className="mt-4">
              <label
                htmlFor="event-url"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Event URL
              </label>
              <div className="flex">
                <input
                  type="text"
                  id="event-url"
                  className="flex-grow px-3 py-2 border border-gray-300 rounded-l-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  value={window.location.href}
                  readOnly
                />
                <button
                  onClick={() => {
                    navigator.clipboard.writeText(window.location.href);
                  }}
                  className="bg-gray-100 px-3 py-2 border border-l-0 border-gray-300 rounded-r-md hover:bg-gray-200"
                >
                  <svg
                    className="w-5 h-5 text-gray-600"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"
                    />
                  </svg>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Confirmation popup */}
      {showConfirmationPopup && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-96 relative">
            <h2 className="text-2xl font-semibold mb-6">Screenshot Saved</h2>
            <button
              onClick={closeConfirmationPopup}
              className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
            >
              <X size={20} />
            </button>
            <p className="mb-4">
              Your screenshot has been saved. Share it with your friends!
            </p>
            <button
              onClick={closeConfirmationPopup}
              className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded-lg w-full"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
