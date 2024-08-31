"use client";
import { useState } from "react";

interface Assessment {
  id: number;
  name: string;
  totalWeighted: number;
  fullMark: number;
  minPassRequirement: number;
  scoreGained: number;
}

export default function InSemesterAssessment() {
  const [assessments, setAssessments] = useState<Assessment[]>([]);
  const [isEditing, setIsEditing] = useState<{ [key: number]: boolean }>({});
  const [newAssessment, setNewAssessment] = useState<Assessment>({
    id: Date.now(),
    name: "",
    totalWeighted: 0,
    fullMark: 100,
    minPassRequirement: 0,
    scoreGained: 0,
  });

  const handleInputChange = (id: number, field: string, value: string | number) => {
    setAssessments((prevAssessments) =>
      prevAssessments.map((assessment) =>
        assessment.id === id ? { ...assessment, [field]: value } : assessment
      )
    );
  };

  const handleAddAssessment = () => {
    setAssessments((prev) => [...prev, { ...newAssessment, id: Date.now() }]);
    setNewAssessment({
      id: Date.now(),
      name: "",
      totalWeighted: 0,
      fullMark: 100,
      minPassRequirement: 0,
      scoreGained: 0,
    });
  };

  const toggleEdit = (id: number) => {
    setIsEditing((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-6">In-Semester Assessment Page</h1>

      <div className="mb-4">
        <h2 className="text-xl font-semibold mb-4">Assessments</h2>
        {assessments.map((assessment) => (
          <div key={assessment.id} className="bg-white p-4 rounded-lg shadow-md mb-4">
            <div className="flex items-center justify-between mb-2">
              {isEditing[assessment.id] ? (
                <>
                  <input
                    type="text"
                    className="border border-gray-300 rounded px-2 py-1 w-full"
                    value={assessment.name}
                    onChange={(e) =>
                      handleInputChange(assessment.id, "name", e.target.value)
                    }
                    placeholder="Exam Name"
                  />
                  <button
                    className="ml-2 text-blue-500"
                    onClick={() => toggleEdit(assessment.id)}
                  >
                    Save
                  </button>
                </>
              ) : (
                <>
                  <p className="font-semibold">{assessment.name || "Unnamed Exam"}</p>
                  <button
                    className="ml-2 text-blue-500"
                    onClick={() => toggleEdit(assessment.id)}
                  >
                    Edit
                  </button>
                </>
              )}
            </div>

            <div className="grid grid-cols-2 gap-4">
              {isEditing[assessment.id] ? (
                <>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Total Weighted
                    </label>
                    <input
                      type="number"
                      className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                      value={assessment.totalWeighted}
                      onChange={(e) =>
                        handleInputChange(assessment.id, "totalWeighted", parseInt(e.target.value) || 0)
                      }
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Full Mark
                    </label>
                    <input
                      type="number"
                      className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                      value={assessment.fullMark}
                      onChange={(e) =>
                        handleInputChange(assessment.id, "fullMark", parseInt(e.target.value) || 100)
                      }
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Min Pass Requirement
                    </label>
                    <input
                      type="number"
                      className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                      value={assessment.minPassRequirement}
                      onChange={(e) =>
                        handleInputChange(assessment.id, "minPassRequirement", parseInt(e.target.value) || 0)
                      }
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Score Gained
                    </label>
                    <input
                      type="number"
                      className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                      value={assessment.scoreGained}
                      onChange={(e) =>
                        handleInputChange(assessment.id, "scoreGained", parseInt(e.target.value) || 0)
                      }
                    />
                  </div>
                </>
              ) : (
                <>
                  <div>
                    <p className="text-sm font-medium text-gray-700">
                      Total Weighted: {assessment.totalWeighted}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-700">
                      Full Mark: {assessment.fullMark}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-700">
                      Min Pass Requirement: {assessment.minPassRequirement}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-700">
                      Score Gained: {assessment.scoreGained}
                    </p>
                  </div>
                </>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Add New Assessment */}
      <div className="bg-white p-4 rounded-lg shadow-md">
        <h2 className="text-lg font-semibold mb-2">Add New Assessment</h2>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Exam Name</label>
            <input
              type="text"
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
              value={newAssessment.name}
              onChange={(e) => setNewAssessment({ ...newAssessment, name: e.target.value })}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Total Weighted</label>
            <input
              type="number"
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
              value={newAssessment.totalWeighted}
              onChange={(e) =>
                setNewAssessment({ ...newAssessment, totalWeighted: parseInt(e.target.value) || 0 })
              }
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Full Mark</label>
            <input
              type="number"
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
              value={newAssessment.fullMark}
              onChange={(e) =>
                setNewAssessment({ ...newAssessment, fullMark: parseInt(e.target.value) || 100 })
              }
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Min Pass Requirement</label>
            <input
              type="number"
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
              value={newAssessment.minPassRequirement}
              onChange={(e) =>
                setNewAssessment({ ...newAssessment, minPassRequirement: parseInt(e.target.value) || 0 })
              }
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Score Gained</label>
            <input
              type="number"
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
              value={newAssessment.scoreGained}
              onChange={(e) =>
                setNewAssessment({ ...newAssessment, scoreGained: parseInt(e.target.value) || 0 })
              }
            />
          </div>
        </div>
        <button
          className="bg-green-500 text-white py-2 px-4 rounded hover:bg-green-600 transition-colors duration-200 mt-4"
          onClick={handleAddAssessment}
        >
          Add Assessment
        </button>
      </div>
    </div>
  );
}
