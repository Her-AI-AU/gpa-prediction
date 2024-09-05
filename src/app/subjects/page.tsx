"use client";
import { useState } from "react";
import SubjectInfo from "../subjects-info/page";
import { Header } from "@/components/header";

const subjectDetails = {
  "Math 101": {
    name: "Math 101",
    hurdle: "Pass in all assessments",
    description: "Introduction to basic mathematics principles.",
    time: "MWF 10:00 - 11:00",
    assessments: "Midterm, Final Exam",
  },
  "English 101": {
    name: "English 101",
    hurdle: "Complete all assignments",
    description: "Basics of English grammar and composition.",
    time: "TTh 09:00 - 10:30",
    assessments: "Essay, Oral Presentation",
  },
  "History 101": {
    name: "History 101",
    hurdle: "Minimum 50% in final exam",
    description: "Overview of ancient civilizations.",
    time: "MWF 11:00 - 12:00",
    assessments: "Research Paper, Final Exam",
  },
  "Math 102": {
    name: "Math 102",
    hurdle: "Pass in all assessments",
    description: "Advanced mathematics topics building on Math 101.",
    time: "MWF 09:00 - 10:00",
    assessments: "Midterm, Final Exam",
  },
  "English 102": {
    name: "English 102",
    hurdle: "Complete all assignments",
    description: "Advanced English grammar and composition.",
    time: "TTh 10:30 - 12:00",
    assessments: "Essay, Oral Presentation",
  },
  "Biology 101": {
    name: "Biology 101",
    hurdle: "Minimum 60% in final exam",
    description: "Introduction to biological sciences.",
    time: "MWF 12:00 - 13:00",
    assessments: "Lab Reports, Final Exam",
  },
  "Math 201": {
    name: "Math 201",
    hurdle: "Minimum 60% in final exam",
    description: "Multivariable calculus and linear algebra.",
    time: "MWF 08:00 - 09:00",
    assessments: "Midterm, Final Exam",
  },
  "Physics 101": {
    name: "Physics 101",
    hurdle: "Pass in all assessments",
    description: "Fundamentals of classical mechanics.",
    time: "TTh 08:30 - 10:00",
    assessments: "Quizzes, Final Exam",
  },
  "Chemistry 101": {
    name: "Chemistry 101",
    hurdle: "Complete all lab work",
    description: "Basics of chemistry and laboratory techniques.",
    time: "MWF 13:00 - 14:00",
    assessments: "Lab Reports, Final Exam",
  },
};

const semesterData = {
  "Semester 1": ["Math 101", "English 101", "History 101"],
  "Semester 2": ["Math 102", "English 102", "Biology 101"],
  "Semester 3": ["Math 201", "Physics 101", "Chemistry 101"],
};

export default function Subjects() {
  const [selectedSemester, setSelectedSemester] = useState("");
  const [subjects, setSubjects] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newSubject, setNewSubject] = useState({
    name: "",
    hurdle: "",
    description: "",
    time: "",
    assessments: "",
  });

  const handleSemesterChange = (event) => {
    const semester = event.target.value;
    setSelectedSemester(semester);
    setSubjects(semesterData[semester] || []);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewSubject((prev) => ({ ...prev, [name]: value }));
  };

  const handleAddSubject = () => {
    if (newSubject.name.trim()) {
      // Update subjects and subjectDetails dynamically
      setSubjects((prevSubjects) => [...prevSubjects, newSubject.name]);
      subjectDetails[newSubject.name] = { ...newSubject };
      setNewSubject({
        name: "",
        hurdle: "",
        description: "",
        time: "",
        assessments: "",
      });
      setIsModalOpen(false);
    }
  };

  return (
    <>
      <Header />
      <div className="p-8">
        <h1 className="text-2xl font-bold mb-6">Calculator Page</h1>

        <div className="mb-6">
          <label htmlFor="semester" className="block text-gray-700 mb-2">
            Choose a Semester:
          </label>
          <select
            id="semester"
            className="w-full p-2 border border-gray-300 rounded"
            value={selectedSemester}
            onChange={handleSemesterChange}
          >
            <option value="">Select a semester</option>
            {Object.keys(semesterData).map((semester) => (
              <option key={semester} value={semester}>
                {semester}
              </option>
            ))}
          </select>
        </div>

        {selectedSemester && (
          <div className="mt-4">
            <h2 className="text-xl font-semibold mb-4">
              Subjects for {selectedSemester}:
            </h2>
            <ul className="list-disc pl-6">
              {subjects.map((subject, index) => (
                <li key={index} className="mb-2">
                  <SubjectInfo {...subjectDetails[subject]} />
                </li>
              ))}
            </ul>
            <button
              className="bg-green-500 text-white py-2 px-4 rounded hover:bg-green-600 transition-colors duration-200 mt-4"
              onClick={() => setIsModalOpen(true)}
            >
              Add New Subject
            </button>
          </div>
        )}

        {isModalOpen && (
          <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
            <div className="bg-white rounded-lg p-6 w-80">
              <h2 className="text-xl font-bold mb-4">Add New Subject</h2>
              <div className="mb-4">
                <label className="block text-gray-700 mb-2">Subject Name</label>
                <input
                  type="text"
                  name="name"
                  className="w-full p-2 border border-gray-300 rounded"
                  value={newSubject.name}
                  onChange={handleInputChange}
                />
              </div>
              <div className="mb-4">
                <label className="block text-gray-700 mb-2">Hurdle</label>
                <input
                  type="text"
                  name="hurdle"
                  className="w-full p-2 border border-gray-300 rounded"
                  value={newSubject.hurdle}
                  onChange={handleInputChange}
                />
              </div>
              <div className="mb-4">
                <label className="block text-gray-700 mb-2">Description</label>
                <input
                  type="text"
                  name="description"
                  className="w-full p-2 border border-gray-300 rounded"
                  value={newSubject.description}
                  onChange={handleInputChange}
                />
              </div>
              <div className="mb-4">
                <label className="block text-gray-700 mb-2">Time</label>
                <input
                  type="text"
                  name="time"
                  className="w-full p-2 border border-gray-300 rounded"
                  value={newSubject.time}
                  onChange={handleInputChange}
                />
              </div>
              <div className="mb-4">
                <label className="block text-gray-700 mb-2">Assessments</label>
                <input
                  type="text"
                  name="assessments"
                  className="w-full p-2 border border-gray-300 rounded"
                  value={newSubject.assessments}
                  onChange={handleInputChange}
                />
              </div>
              <div className="flex justify-end">
                <button
                  className="bg-gray-300 text-gray-700 py-2 px-4 rounded mr-2 hover:bg-gray-400 transition-colors duration-200"
                  onClick={() => setIsModalOpen(false)}
                >
                  Cancel
                </button>
                <button
                  className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 transition-colors duration-200"
                  onClick={handleAddSubject}
                >
                  Add Subject
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
}
