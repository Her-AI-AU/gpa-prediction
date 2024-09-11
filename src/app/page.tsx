import { Header } from "@/components/header";
import Link from "next/link";

export default function Home() {
  return (
    <>
      <Header />
      <div className="flex flex-col items-center p-8">
        <div className="flex flex-wrap justify-center gap-8 w-full max-w-4xl">
          <Link
            className="bg-white shadow-md rounded-lg p-6 text-center w-80"
            href="/subjects"
          >
            <h2 className="text-2xl font-semibold mb-4">Subjects</h2>
            <p className="text-gray-600 mb-6">
              View your subjects and their scores.
            </p>
          </Link>

          <Link
            className="bg-white shadow-md rounded-lg p-6 text-center w-80"
            href="/predict"
          >
            <h2 className="text-2xl font-semibold mb-4">Predict</h2>
            <p className="text-gray-600 mb-6">
              Use our predict tool to control scores based on current scores.
            </p>
          </Link>
        </div>
      </div>
    </>
  );
}
