"use client";

import { useState } from "react";
import { uploadResume } from "@/services/resumeService";

// Chart.js (Bar Graph)
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Tooltip,
  Legend
} from "chart.js";

import { Bar } from "react-chartjs-2";

ChartJS.register(CategoryScale, LinearScale, BarElement, Tooltip, Legend);

// Circular Progress
import { CircularProgressbar } from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";

export default function UploadPage() {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [result, setResult] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Handle file
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.length) {
      setSelectedFile(e.target.files[0]);
    }
  };

  // Analyze
  const handleAnalyze = async () => {
    if (!selectedFile) {
      setError("Please select a file first.");
      return;
    }

    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const response = await uploadResume(selectedFile);
      setResult(response);
    } catch (err) {
      console.error(err);
      setError("Backend error. Check server.");
    } finally {
      setLoading(false);
    }
  };

  // Skill chart data
  const skillData = result
    ? {
        labels: ["Python", "ML", "SQL", "AWS", "Docker", "React"],
        datasets: [
          {
            label: "Skill Level",
            data: [
              result?.strengths?.includes("Python") ? 80 : 20,
              result?.strengths?.includes("Machine Learning") ? 80 : 20,
              result?.strengths?.includes("Sql") ? 80 : 20,
              result?.strengths?.includes("Aws") ? 80 : 20,
              result?.strengths?.includes("Docker") ? 80 : 20,
              result?.strengths?.includes("React") ? 80 : 20
            ],
            backgroundColor: "rgba(34,197,94,0.7)",
            borderRadius: 8
          }
        ]
      }
    : null;

  return (
    <main className="flex min-h-screen items-center justify-center bg-black text-white p-6">

      <div className="w-full max-w-2xl space-y-6 bg-gray-900 p-6 rounded-xl shadow-lg">

        {/* TITLE */}
        <h1 className="text-3xl font-bold text-center">
          🚀 AI Resume Analyzer
        </h1>

        {/* UPLOAD */}
        <div className="border-2 border-dashed border-gray-600 p-6 rounded-lg text-center space-y-4">

          <p className="text-gray-400">
            Upload your resume (.pdf)
          </p>

          <input
            type="file"
            accept=".pdf"
            onChange={handleFileChange}
            className="block w-full text-sm text-gray-400
            file:mr-4 file:py-2 file:px-4 file:rounded-lg
            file:border-0 file:bg-white file:text-black"
          />

          <button
            onClick={handleAnalyze}
            disabled={loading}
            className="w-full bg-green-500 py-2 rounded-lg font-semibold hover:bg-green-600"
          >
            {loading ? "Analyzing..." : "Analyze Resume"}
          </button>
        </div>

        {/* ERROR */}
        {error && (
          <div className="bg-red-500/20 text-red-400 p-3 rounded-lg">
            {error}
          </div>
        )}

        {/* RESULT */}
        {result && (
          <div className="bg-gray-800 p-6 rounded-xl space-y-6">

            <p><strong>Filename:</strong> {result.filename}</p>
            <p><strong>Word Count:</strong> {result.word_count}</p>
            <p><strong>Skill Match:</strong> {result.skill_match}%</p>

            {/* SKILL BAR GRAPH */}
            {skillData && (
              <div className="bg-gray-900 p-4 rounded-lg">
                <h3 className="font-bold mb-2">📊 Skill Analysis</h3>

                <Bar
                  data={skillData}
                  options={{
                    responsive: true,
                    plugins: { legend: { display: false } },
                    scales: {
                      y: {
                        beginAtZero: true,
                        max: 100,
                        ticks: { color: "#ccc" }
                      },
                      x: {
                        ticks: { color: "#ccc" }
                      }
                    }
                  }}
                />
              </div>
            )}

            {/* ATS SCORE */}
            <div className="w-40 mx-auto">
              <CircularProgressbar
                value={result.score || 0}
                text={`${result.score || 0}%`}
              />
            </div>

            <p className="text-center font-semibold">
              {result.score >= 70
                ? "Excellent resume ✅"
                : result.score >= 40
                ? "Average resume ⚠ Improve it"
                : "Poor resume ❌ Needs work"}
            </p>

            {/* STRENGTHS */}
            <div>
              <p className="text-green-400 font-semibold">🚀 Strengths</p>
              <ul className="list-disc ml-6">
                {result?.strengths?.map((s: string, i: number) => (
                  <li key={i}>{s}</li>
                ))}
              </ul>
            </div>

            {/* ROLES */}
            <div>
              <p className="text-purple-400 font-semibold">🎯 Best Roles</p>
              <ul className="list-disc ml-6">
                {result?.predicted_roles?.map((r: string, i: number) => (
                  <li key={i}>{r}</li>
                ))}
              </ul>
            </div>

            {/* SKILL GAP */}
            <div>
              <p className="text-red-400 font-semibold">📉 Skill Gap</p>
              <ul className="list-disc ml-6">
                {result?.skill_gap?.map((s: string, i: number) => (
                  <li key={i}>{s}</li>
                ))}
              </ul>
            </div>

            {/* SUGGESTIONS */}
            <div>
              <p className="text-blue-400 font-semibold">💡 Suggestions</p>
              <ul className="list-disc ml-6">
                {result?.suggestions?.map((s: string, i: number) => (
                  <li key={i}>{s}</li>
                ))}
              </ul>
            </div>

            {/* AI FEEDBACK */}
            <div className="bg-white/5 p-4 rounded-lg">
              <h3 className="font-bold mb-2">AI Review</h3>
              <pre className="text-sm whitespace-pre-wrap">
                {result?.ai_feedback}
              </pre>
            </div>

            {/* IMPROVED RESUME */}
            {result?.improved_resume && (
              <div className="bg-blue-500/10 p-4 rounded-lg">
                <h3 className="font-bold mb-2">
                  ✨ Improved Resume
                </h3>
                <pre className="text-sm whitespace-pre-wrap">
                  {result.improved_resume}
                </pre>
              </div>
            )}

          </div>
        )}

      </div>

    </main>
  );
}