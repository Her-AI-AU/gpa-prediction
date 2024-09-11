import React, { useState } from 'react';
import { Edit, Save, X } from 'lucide-react';

interface SubjectProps {
  subject: {
    id: number;
    name: string;
    semester: string;
    hurdle?: number;
    score?: number;
    assessments_list?: string;
  };
  onSave: (updatedSubject: SubjectProps['subject']) => void;
  onDelete: (id: number) => void;
}

const SubjectCard: React.FC<SubjectProps> = ({ subject, onSave, onDelete }) => {
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
    setEditedSubject(prev => ({ ...prev, [name]: value }));
  };

  return (
    <div className="bg-white shadow-lg rounded-lg p-6 hover:shadow-xl transition-shadow duration-300">
      {isEditing ? (
        <>
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
            value={editedSubject.hurdle || ''}
            onChange={handleChange}
            className="w-full mb-2 p-2 border rounded"
            placeholder="Hurdle"
          />
          <input
            type="number"
            name="score"
            value={editedSubject.score || ''}
            onChange={handleChange}
            className="w-full mb-2 p-2 border rounded"
            placeholder="Score"
          />
          <input
            type="text"
            name="assessments_list"
            value={editedSubject.assessments_list || ''}
            onChange={handleChange}
            className="w-full mb-2 p-2 border rounded"
            placeholder="Assessments List"
          />
          <div className="flex justify-end mt-4">
            <button onClick={handleSave} className="mr-2 text-green-600 hover:text-green-800">
              <Save size={20} />
            </button>
            <button onClick={handleCancel} className="text-red-600 hover:text-red-800">
              <X size={20} />
            </button>
          </div>
        </>
      ) : (
        <>
          <h3 className="text-xl font-semibold mb-2">{subject.name}</h3>
          <p className="text-gray-600 mb-1">Semester: {subject.semester}</p>
          {subject.hurdle !== undefined && (
            <p className="text-gray-600 mb-1">Hurdle: {subject.hurdle}</p>
          )}
          {subject.score !== undefined && (
            <p className="text-gray-600 mb-1">Score: {subject.score}</p>
          )}
          {subject.assessments_list && (
            <p className="text-gray-600 mb-1">Assessments: {subject.assessments_list}</p>
          )}
          <div className="flex justify-end mt-4">
            <button onClick={handleEdit} className="mr-2 text-blue-600 hover:text-blue-800">
              <Edit size={20} />
            </button>
            <button onClick={() => onDelete(subject.id)} className="text-red-600 hover:text-red-800">
              <X size={20} />
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default SubjectCard;