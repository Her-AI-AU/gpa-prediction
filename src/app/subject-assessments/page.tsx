"use client"
import React, { useState, useEffect } from "react";
import { Header } from "@/components/header";
import { useSearchParams, useRouter } from 'next/navigation';
import { ArrowLeft, Plus, Edit, Save, X } from "lucide-react";

interface Assessment {
  id: number;
  name: string;
  description: string;
  hurdle?: number;
  rate?: number;
  score?: number;
  subject_id: number;
}

interface Subject {
  name: string;
  target_score?: number;
}

export default function SubjectAssessments() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const id = searchParams.get('id');
  const [assessments, setAssessments] = useState<Assessment[]>([]);
  const [subject, setSubject] = useState<Subject | null>(null);
  const [editingAssessment, setEditingAssessment] = useState<number | null>(null);
  const [totalScore, setTotalScore] = useState<number>(0);

  useEffect(() => {
    if (id) {
      fetchSubjectAndAssessments();
    }
  }, [id]);

  useEffect(() => {
    calculateTotalScore();
  }, [assessments]);

  const fetchSubjectAndAssessments = async () => {
    try {
      const subjectResponse = await fetch(`http://localhost:5001/subject/${id}`);
      const assessmentsResponse = await fetch(`http://localhost:5001/assessments/${id}`);
      
      if (subjectResponse.ok && assessmentsResponse.ok) {
        const subjectData = await subjectResponse.json();
        const assessmentsData = await assessmentsResponse.json();
        setSubject(subjectData.subject[0]);
        setAssessments(assessmentsData.assessments);
      } else {
        console.error("Failed to fetch subject or assessments");
      }
    } catch (error) {
      console.error("Error fetching subject and assessments:", error);
    }
  };

  const calculateTotalScore = () => {
    const score = assessments.reduce((total, assessment) => {
      if (assessment.rate && assessment.score) {
        return total + (assessment.rate / 100) * assessment.score;
      }
      return total;
    }, 0);
    setTotalScore(Number(score.toFixed(2)));
  };

  const handleEdit = (assessmentId: number) => {
    setEditingAssessment(assessmentId);
  };

  const handleSave = async (assessment: Assessment) => {
    try {
      const response = await fetch(`http://localhost:5001/assessments/${assessment.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(assessment),
      });

      if (response.ok) {
        setEditingAssessment(null);
        fetchSubjectAndAssessments();
      } else {
        console.error("Failed to update assessment");
      }
    } catch (error) {
      console.error("Error updating assessment:", error);
    }
  };

  const handleCancel = () => {
    setEditingAssessment(null);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>, assessment: Assessment) => {
    const { name, value } = e.target;
    const updatedAssessment = { ...assessment, [name]: value };
    setAssessments(assessments.map(a => a.id === assessment.id ? updatedAssessment : a));
  };

  const handleBack = () => {
    router.back();
  };

  const handleDelete = async (assessmentId: number) => {
    if (window.confirm("Are you sure you want to delete this assessment?")) {
      try {
        const response = await fetch(`http://localhost:5001/assessments/${assessmentId}`, {
          method: 'DELETE',
        });

        if (response.ok) {
          // Remove the deleted assessment from the state
          setAssessments(assessments.filter(assessment => assessment.id !== assessmentId));
        } else {
          console.error("Failed to delete assessment");
        }
      } catch (error) {
        console.error("Error deleting assessment:", error);
      }
    }
  };

  const handleAddAssessment = async () => {
    if (!id) return;

    const newAssessment: Partial<Assessment> = {
      name: "New Assessment",
      description: "",
      hurdle: 0,
      rate: 0,
      score: 0,
      subject_id: parseInt(id)
    };

    try {
      const response = await fetch('http://localhost:5001/assessments', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newAssessment),
      });

      if (response.ok) {
        const addedAssessment = await response.json();
        setAssessments([...assessments, addedAssessment]);
        setEditingAssessment(addedAssessment.id); // Start editing the new assessment
      } else {
        console.error("Failed to add assessment");
      }
    } catch (error) {
      console.error("Error adding assessment:", error);
    }
  };

  if (!id) {
    return <div>Please select a subject to view its assessments.</div>;
  }

  return (
    <>
      <Header />
      <div className="container mx-auto mt-8 px-4">
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center">
            <button
              onClick={handleBack}
              className="text-gray-600 hover:text-gray-800 p-2 rounded-full transition-colors duration-200 mr-4"
              aria-label="Go back"
            >
              <ArrowLeft size={24} />
            </button>
            <h1 className="text-3xl font-bold text-gray-800">{subject?.name} Assessments</h1>
          </div>
          <button
            onClick={handleAddAssessment}
            className="bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded-full flex items-center transition duration-300 ease-in-out"
          >
            <Plus size={20} className="mr-2" />
            Add Assessment
          </button>
        </div>
        <div className="bg-yellow-100 border-l-4 border-yellow-500 text-yellow-700 p-4 mb-6">
          <p className="font-bold">Target Score: {subject?.target_score}</p>
        </div>
        <div className="bg-blue-100 border-l-4 border-blue-500 text-blue-700 p-4 mb-6">
          <p className="font-bold">Total Score: {totalScore}</p>
        </div>
        {assessments.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {assessments.map((assessment) => (
              <div key={assessment.id} className="bg-white shadow-md rounded-lg p-4">
                {editingAssessment === assessment.id ? (
                  <>
                    <div className="mb-4">
                      <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                        Assessment Name
                      </label>
                      <input
                        id="name"
                        type="text"
                        name="name"
                        value={assessment.name}
                        onChange={(e) => handleChange(e, assessment)}
                        className="w-full p-2 border rounded"
                        placeholder="Enter assessment name"
                      />
                    </div>

                    <div className="mb-4">
                      <label htmlFor="hurdle" className="block text-sm font-medium text-gray-700 mb-1">
                        Hurdle (%)
                      </label>
                      <input
                        id="hurdle"
                        type="number"
                        name="hurdle"
                        value={assessment.hurdle || ""}
                        onChange={(e) => handleChange(e, assessment)}
                        className="w-full p-2 border rounded"
                        placeholder="Enter hurdle percentage"
                      />
                    </div>

                    <div className="mb-4">
                      <label htmlFor="rate" className="block text-sm font-medium text-gray-700 mb-1">
                        Rate (%)
                      </label>
                      <input
                        id="rate"
                        type="number"
                        name="rate"
                        value={assessment.rate || ""}
                        onChange={(e) => handleChange(e, assessment)}
                        className="w-full p-2 border rounded"
                        placeholder="Enter rate percentage"
                      />
                    </div>

                    <div className="mb-4">
                      <label htmlFor="score" className="block text-sm font-medium text-gray-700 mb-1">
                        Score
                      </label>
                      <input
                        id="score"
                        type="number"
                        name="score"
                        value={assessment.score || ""}
                        onChange={(e) => handleChange(e, assessment)}
                        className="w-full p-2 border rounded"
                        placeholder="Enter score"
                      />
                    </div>

                    <div className="mb-4">
                      <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
                        Description
                      </label>
                      <textarea
                        id="description"
                        name="description"
                        value={assessment.description}
                        onChange={(e) => handleChange(e, assessment)}
                        className="w-full p-2 border rounded"
                        placeholder="Enter assessment description"
                        rows={3}
                      />
                    </div>

                    <div className="flex justify-end mt-4">
                      <button
                        onClick={() => handleSave(assessment)}
                        className="mr-2 text-green-600 hover:text-green-800"
                      >
                        <Save size={20} />
                      </button>
                      <button
                        onClick={handleCancel}
                        className="text-red-600 hover:text-red-800"
                      >
                        <X size={20} />
                      </button>
                    </div>
                  </>
                ) : (
                  <>
                    <h2 className="text-xl font-semibold mb-2">{assessment.name}</h2>
                    <p className="text-sm">Hurdle: {assessment.hurdle}</p>
                    <p className="text-sm">Rate: {assessment.rate}%</p>
                    <p className="text-sm">Score: {assessment.score}</p>
                    <p className="text-gray-600 mb-2">{assessment.description}</p>
                    <div className="flex justify-end mt-4">
                      <button
                        onClick={() => handleEdit(assessment.id)}
                        className="text-blue-600 hover:text-blue-800 mr-2"
                      >
                        <Edit size={20} />
                      </button>
                      <button
                        onClick={() => handleDelete(assessment.id)}
                        className="text-red-600 hover:text-red-800"
                      >
                        <X size={20} />
                      </button>
                    </div>
                  </>
                )}
              </div>
            ))}
          </div>
        ) : (
          <p className="text-center text-gray-500 mt-8">No assessments found for this subject.</p>
        )}
      </div>
    </>
  );
}