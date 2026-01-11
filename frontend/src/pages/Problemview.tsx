import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { motion } from "framer-motion";
import { ArrowLeft, Play, Send } from "lucide-react";

// CodeMirror 6
import CodeMirror from "@uiw/react-codemirror";
import { javascript } from "@codemirror/lang-javascript";
import { python } from "@codemirror/lang-python";
import { cpp } from "@codemirror/lang-cpp";
import { oneDark } from "@codemirror/theme-one-dark";

/* ================= TYPES ================= */

interface TestCase {
    id: number;
    input: string;
    output: string;
}

interface Problem {
    id: number;
    title: string;
    description: string;
    difficulty: "Easy" | "Medium" | "Hard";
    slug: string;
    testCases: TestCase[];
}

interface Submission {
    id: number;
    language: string;
    status: string;
    createdAt: string;
}

type Tab = "description" | "testcases" | "submissions";

/* ================= CONFIG ================= */

const containerVariants = {
    hidden: { opacity: 0 },
    show: { opacity: 1 }
};

const languageExtensions: Record<string, any> = {
    javascript: javascript(),
    python: python(),
    cpp: cpp()
};

const defaultTemplates: Record<string, string> = {
    javascript: "// Write your JavaScript solution here\n",
    python: "# Write your Python solution here\n",
    cpp: `#include <bits/stdc++.h>
using namespace std;

int main() {
    // Write your C++ solution here
    return 0;
}
`
};

/* ================= COMPONENT ================= */

export const ProblemView = () => {
    const { slug } = useParams<{ slug: string }>();
    const navigate = useNavigate();

    const [problem, setProblem] = useState<Problem | null>(null);
    const [loading, setLoading] = useState(true);

    const [language, setLanguage] = useState("javascript");
    const [code, setCode] = useState(defaultTemplates.javascript);
    const [submitting, setSubmitting] = useState(false);
    const [result, setResult] = useState<string | null>(null);

    const [submissions, setSubmissions] = useState<Submission[]>([]);
    const [loadingSubs, setLoadingSubs] = useState(true);

    const [activeTab, setActiveTab] = useState<Tab>("description");

    /* ===== Fetch problem ===== */
    useEffect(() => {
        const fetchProblem = async () => {
            try {
                const res = await axios.get(
                    `http://localhost:4444/api/problems/${slug}`,
                    { withCredentials: true }
                );
                setProblem(res.data.problem ?? res.data);
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        };

        fetchProblem();
    }, [slug]);

    /* ===== Fetch submissions ===== */
    useEffect(() => {
        if (!problem) return;

        const fetchSubmissions = async () => {
            try {
                const res = await axios.get(
                    "http://localhost:4444/api/submissions/my",
                    { withCredentials: true }
                );

                // Filter submissions for THIS problem only
                const filtered = res.data.submissions.filter(
                    (s: any) => s.problemId === problem.id
                );

                setSubmissions(filtered);
            } catch (err) {
                console.error(err);
            } finally {
                setLoadingSubs(false);
            }
        };


        fetchSubmissions();
    }, [problem]);

    /* ===== Submit ===== */
    const handleSubmit = async () => {
        if (!problem) return;

        setSubmitting(true);
        setResult(null);

        try {
            const res = await axios.post(
                "http://localhost:4444/api/submissions",
                { problemId: problem.id, language, code },
                { withCredentials: true }
            );
            setResult(res.data.status || "Submitted");
        } catch (err) {
            console.error(err);
            setResult("Submission failed");
        } finally {
            setSubmitting(false);
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center text-[#8C8375]">
                Loading problem...
            </div>
        );
    }

    if (!problem) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                Problem not found
            </div>
        );
    }

    return (
        <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="show"
            className="min-h-screen text-[#E8DCC4] px-6 md:px-10 pt-36 pb-10"
        >
            <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-8">

                {/* ================= LEFT PANEL ================= */}
{/* ================= LEFT PANEL ================= */}
<div className="bg-[#161210] border border-[#2A2420] rounded-2xl p-6 flex flex-col h-[calc(100vh-200px)]">

  {/* BACK */}
  <button
    onClick={() => navigate(-1)}
    className="flex items-center gap-2 text-sm text-[#8C8375] hover:text-amber-400 mb-4"
  >
    <ArrowLeft size={16} /> Back
  </button>

  {/* TABS */}
  <div className="flex gap-6 border-b border-[#2A2420] mb-4 text-sm font-semibold">
    {["description", "testcases", "submissions"].map((tab) => (
      <button
        key={tab}
        onClick={() => setActiveTab(tab as Tab)}
        className={`pb-2 ${
          activeTab === tab
            ? "text-amber-400 border-b-2 border-amber-400"
            : "text-[#8C8375] hover:text-[#E8DCC4]"
        }`}
      >
        {tab === "description" && "Description"}
        {tab === "testcases" && "Testcases"}
        {tab === "submissions" && "Submissions"}
      </button>
    ))}
  </div>

  {/* ===== SCROLLABLE CONTENT (THIS FIXES BLACK SCREEN) ===== */}
  <div className="flex-1 overflow-y-auto pr-2">

    {/* DESCRIPTION */}
    {activeTab === "description" && (
      <>
        <h1 className="text-3xl font-bold mb-2 text-[#FAF6F0]">
          {problem.title}
        </h1>
        <DifficultyBadge level={problem.difficulty} />
        <div className="mt-6 text-sm leading-relaxed text-[#D6CFC7] whitespace-pre-line">
          {problem.description}
        </div>
      </>
    )}

    {/* TESTCASES */}
    {activeTab === "testcases" && (
      <div className="space-y-4">
        {problem.testCases.map((tc, idx) => (
          <div
            key={tc.id}
            className="bg-[#1A1512] border border-[#2A2420] rounded-xl p-4 text-xs"
          >
            <div className="mb-2 font-bold text-[#8C8375]">
              Case {idx + 1}
            </div>
            <div>
              <b>Input</b>
              <pre className="mt-1 whitespace-pre-wrap">{tc.input}</pre>
            </div>
            <div className="mt-2">
              <b>Output</b>
              <pre className="mt-1 whitespace-pre-wrap">{tc.output}</pre>
            </div>
          </div>
        ))}
      </div>
    )}

    {/* SUBMISSIONS */}
    {activeTab === "submissions" && (
      <>
        {loadingSubs ? (
          <p className="text-sm text-[#8C8375]">Loading...</p>
        ) : submissions.length === 0 ? (
          <p className="text-sm text-[#8C8375]">No submissions yet.</p>
        ) : (
          <div className="space-y-3">
            {submissions.map((sub) => (
              <div
                key={sub.id}
                className="flex justify-between bg-[#1A1512] border border-[#2A2420] rounded-xl px-4 py-3 text-sm"
              >
                <span className="font-mono">
                  {sub.language.toUpperCase()}
                </span>
                <span
                  className={
                    sub.status === "Accepted"
                      ? "text-emerald-400"
                      : "text-rose-400"
                  }
                >
                  {sub.status}
                </span>
              </div>
            ))}
          </div>
        )}
      </>
    )}

  </div>
</div>


                {/* ================= RIGHT PANEL (EDITOR) ================= */}
                <div className="bg-[#161210] border border-[#2A2420] rounded-2xl p-6 flex flex-col h-[calc(100vh-200px)]">

                    <div className="flex justify-between items-center mb-4">
                        <select
                            value={language}
                            onChange={(e) => {
                                const lang = e.target.value;
                                setLanguage(lang);
                                setCode(defaultTemplates[lang]);
                            }}
                            className="bg-[#1A1512] border border-[#2A2420] rounded-xl px-3 py-2 text-sm"
                        >
                            <option value="javascript">JavaScript</option>
                            <option value="python">Python</option>
                            <option value="cpp">C++</option>
                        </select>

                        <div className="flex gap-3">
                            <button className="flex items-center gap-2 px-4 py-2 bg-[#1A1512] border border-[#2A2420] rounded-xl">
                                <Play size={18} /> Run
                            </button>
                            <button
                                onClick={handleSubmit}
                                disabled={submitting}
                                className="flex items-center gap-2 px-4 py-2 bg-amber-600 text-black font-bold rounded-xl"
                            >
                                <Send size={16} /> Submit
                            </button>
                        </div>
                    </div>

                    <div className="flex-1 overflow-hidden border border-[#2A2420] rounded-xl">
                        <CodeMirror
                            value={code}
                            height="100%"
                            theme={oneDark}
                            extensions={[languageExtensions[language]]}
                            onChange={(value) => setCode(value)}
                        />
                    </div>

                    {result && (
                        <div className="mt-4 text-sm text-amber-400">
                            Result: {result}
                        </div>
                    )}
                </div>
            </div>
        </motion.div>
    );
};

/* ================= BADGE ================= */

const DifficultyBadge = ({ level }: { level: string }) => {
    const styles = {
        Easy: "bg-emerald-900/10 text-emerald-400 border-emerald-900/20",
        Medium: "bg-amber-900/10 text-amber-400 border-amber-900/20",
        Hard: "bg-rose-950/10 text-rose-400 border-rose-900/20"
    };

    return (
        <span className={`inline-flex mt-2 px-3 py-1 rounded-md text-xs font-bold border ${styles[level as keyof typeof styles]}`}>
            {level}
        </span>
    );
};
