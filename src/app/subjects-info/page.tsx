import Link from "next/link";

interface SubjectInfoProps {
  name: string;
  hurdle: string;
  description: string;
  time: string;
  assessments: string;
}

const SubjectInfo: React.FC<SubjectInfoProps> = ({
  name,
  hurdle,
  description,
  time,
  assessments,
}) => {
  return (
    <Link href="/insemester-assessment">
      <div className="bg-white shadow-md rounded-lg p-4 mb-4">
        <h2 className="text-xl font-bold mb-2">{name}</h2>
        <p className="text-gray-700 mb-2">
          <strong>Hurdle:</strong> {hurdle}
        </p>
        <p className="text-gray-700 mb-2">
          <strong>Description:</strong> {description}
        </p>
        <p className="text-gray-700 mb-2">
          <strong>Time:</strong> {time}
        </p>
        <p className="text-gray-700 mb-2">
          <strong>Assessments:</strong> {assessments}
        </p>
      </div>
    </Link>
  );
};

export default SubjectInfo;
