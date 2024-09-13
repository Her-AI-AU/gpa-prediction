import React, { useState } from "react";
import { Edit, Save, X } from "lucide-react";
import Link from "next/link";

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

interface SubjectCardProps {
  subject: Subject;
  onSave: (subject: Subject) => void;
  onDelete: (id: number) => void;
}

const SubjectCard: React.FC<SubjectCardProps> = ({ subject, onSave, onDelete }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editedSubject, setEditedSubject] = useState(subject);

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleSave = () => {
    onSave(editedSubject);
    setIsEditing(false);
  };

  const handleCancel = () => {
    setEditedSubject(subject);
    setIsEditing(false);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setEditedSubject((prev) => ({ ...prev, [name]: value }));
  };

  return (
    <div className="bg-white shadow-lg rounded-lg p-6 hover:shadow-xl transition-shadow duration-300 flex flex-col justify-between">
      {isEditing ? (
        <>
          <div className="flex-grow overflow-y-auto">
            <input
              type="text"
              name="name"
              value={editedSubject.name}
              onChange={handleChange}
              className="w-full mb-2 p-2 border rounded"
              placeholder="Subject Name"
            />
            <input
              type="text"
              name="semester"
              value={editedSubject.semester}
              onChange={handleChange}
              className="w-full mb-2 p-2 border rounded"
              placeholder="Semester"
            />
            <input
              type="number"
              name="hurdle"
              value={editedSubject.hurdle || ""}
              onChange={handleChange}
              className="w-full mb-2 p-2 border rounded"
              placeholder="Hurdle"
            />
            <input
              type="number"
              name="score"
              value={editedSubject.score || ""}
              onChange={handleChange}
              className="w-full mb-2 p-2 border rounded"
              placeholder="Score"
            />
            <input
              type="number"
              name="weight"
              value={editedSubject.weight || ""}
              onChange={handleChange}
              className="w-full mb-2 p-2 border rounded"
              placeholder="Weight"
            />
            <input
              type="number"
              name="target_score"
              value={editedSubject.target_score || ""}
              onChange={handleChange}
              className="w-full mb-2 p-2 border rounded"
              placeholder="Target Score"
            />
          </div>
          <div className="flex justify-end mt-4">
            <button
              onClick={handleSave}
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
          <div className="flex-grow overflow-y-auto">
            <h3 className="text-xl font-semibold mb-2">{subject.name}</h3>
            <p className="text-gray-600 mb-1">Semester: {subject.semester}</p>
            {subject.hurdle !== undefined && (
              <p className="text-gray-600 mb-1">Hurdle: {subject.hurdle}</p>
            )}
            {subject.score !== undefined && (
              <p className="text-gray-600 mb-1">Score: {subject.score}</p>
            )}
            {subject.weight !== undefined && (
              <p className="text-gray-600 mb-1">Weight: {subject.weight}</p>
            )}
            {subject.target_score !== undefined && (
              <p className="text-gray-600 mb-1">Target Score: {subject.target_score}</p>
            )}
          </div>
          <div className="mt-4 flex justify-between items-center">
            <Link
              href={`/subject-assessments?id=${subject.id}`}
              className="text-blue-500 hover:text-blue-600"
            >
              View Assessments
            </Link>
            <div>
              <button
                onClick={() => setIsEditing(true)}
                className="mr-2 text-blue-600 hover:text-blue-800"
              >
                <Edit size={20} />
              </button>
              <button
                onClick={() => onDelete(subject.id)}
                className="text-red-600 hover:text-red-800"
              >
                <X size={20} />
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default SubjectCard;
