import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { motion, AnimatePresence, type Variants } from "framer-motion";
import {
  ArrowLeft,
  Play,
  Send,
  CheckCircle,
  AlertCircle,
  Terminal,
  Code2,
  List,
  FileText,
} from "lucide-react";

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

const containerVariants: Variants = {
  hidden: { opacity: 0, y: 20 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.4, ease: "easeOut" },
  },
};

// NEW: Variants for the toast animation (Left In -> Right Out)
const toastVariants: Variants = {
  hidden: { x: -50, opacity: 0 }, // Start off-screen left
  visible: {
    x: 0,
    opacity: 1,
    transition: { type: "spring", stiffness: 300, damping: 25 },
  },
  exit: {
    x: 50, // Move off-screen right
    opacity: 0,
    transition: { duration: 0.3, ease: "easeIn" },
  },
};

const languageExtensions: Record<string, any> = {
  javascript: javascript(),
  python: python(),
  cpp: cpp(),
};

// Helper to get specific starter code based on the problem slug
const getStarterCode = (slug: string, lang: string) => {
  if (lang === "javascript")
    return `// Write your JavaScript solution here\nconsole.log('Hello World');`;
  if (lang === "python")
    return `# Write your Python solution here\nprint('Hello World')`;

  // C++ Logic
  if (lang === "cpp") {
    // 1. Template for "Two Sum" or "Maximum Subarray" (Array Input)
    if (slug === "maximum-subarray" || slug === "two-sum") {
      return `#include <bits/stdc++.h>
using namespace std;

int main() {
    string line;
    getline(cin, line); // Read the array string
    
    // Clean and Parse the array
    for (char &c : line) if (!isdigit(c) && c != '-') c = ' ';
    stringstream ss(line);
    int val;
    vector<int> nums;
    while (ss >> val) nums.push_back(val);

    // Your Logic Here
    // ...

    cout << 0; // Return result
    return 0;
}`;
    }

    // 2. Template for "Valid Parentheses" (String Input)
    if (slug === "valid-parentheses") {
      return `#include <bits/stdc++.h>
using namespace std;

int main() {
    string s;
    cin >> s; // Read the single string input
    
    // Your Logic Here
    // ...

    cout << "true"; // Return "true" or "false"
    return 0;
}`;
    }

    // 3. Generic Fallback
    return `#include <bits/stdc++.h>
using namespace std;

int main() {
    // Generic Template
    // Read inputs using cin >> ...
    return 0;
}`;
  }
  return "";
};

/* ================= COMPONENT ================= */

export const ProblemView = () => {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();

  const [problem, setProblem] = useState<Problem | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshKey, setRefreshKey] = useState(0);

  const [runResults, setRunResults] = useState<
    Record<number, { output: string; isError: boolean }>
  >({});
  const [running, setRunning] = useState(false);

  const [language, setLanguage] = useState("cpp");
  const [code, setCode] = useState(getStarterCode(slug || "", "cpp"));
  const [submitting, setSubmitting] = useState(false);
  const [result, setResult] = useState<string | null>(null);

  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [loadingSubs, setLoadingSubs] = useState(true);

  const [activeTab, setActiveTab] = useState<Tab>("description");

  /* ===== Auto-dismiss Toast after 3 seconds ===== */
  useEffect(() => {
    if (result) {
      const timer = setTimeout(() => {
        setResult(null);
      }, 3000); // 3 seconds

      return () => clearTimeout(timer);
    }
  }, [result]);

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
  // Reset the code editor when the Problem (slug) changes
  useEffect(() => {
    setCode(getStarterCode(slug || "", language));
  }, [slug, language]);

  /* ===== Fetch submissions ===== */
  useEffect(() => {
    if (!problem) return;

    const fetchSubmissions = async () => {
      try {
        const res = await axios.get(
          "http://localhost:4444/api/submissions/my",
          { withCredentials: true }
        );
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
  }, [problem, refreshKey]);

  /* ===== Run Code (Example Test Cases) ===== */
  const handleRun = async () => {
    if (!problem) return;

    setRunning(true);
    setActiveTab("testcases");
    setRunResults({});

    const examples = problem.testCases.slice(0, 3);

    for (const tc of examples) {
      try {
        const res = await axios.post("http://localhost:4444/api/execute", {
          language,
          code,
          input: tc.input,
        });

        const { output, error, exitCode } = res.data;
        const isError = exitCode !== 0;

        setRunResults((prev) => ({
          ...prev,
          [tc.id]: {
            output: isError ? error : output.trim(),
            isError,
          },
        }));
      } catch (err) {
        console.error(err);
        setRunResults((prev) => ({
          ...prev,
          [tc.id]: { output: "Server Error", isError: true },
        }));
      }
    }
    setRunning(false);
  };

  /* ===== Submit Code (All Test Cases) ===== */
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

      const status = res.data.status || "Submitted";
      setResult(status);

      if (res.status === 200 || res.status === 201) {
        setRefreshKey((prev) => prev + 1);
        setActiveTab("submissions");
      }
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
        <div className="flex flex-col items-center gap-3">
          <div className="w-8 h-8 border-4 border-amber-500/30 border-t-amber-500 rounded-full animate-spin"></div>
          <span className="text-sm font-medium">Loading Problem...</span>
        </div>
      </div>
    );
  }

  if (!problem) {
    return (
      <div className="min-h-screen flex items-center justify-center text-rose-500">
        <div className="flex items-center gap-2">
          <AlertCircle />
          <span className="font-bold">Problem not found</span>
        </div>
      </div>
    );
  }

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="show"
      className="min-h-screen text-[#E8DCC4] px-4 md:px-8 pt-32 pb-10 overflow-hidden relative"
    >
      <div className="max-w-[1600px] mx-auto grid grid-cols-1 lg:grid-cols-12 gap-6 h-[calc(100vh-160px)]">
        {/* ================= LEFT PANEL ================= */}
        <div className="lg:col-span-5 bg-[#161210]/80 backdrop-blur-md border border-[#2A2420] rounded-2xl flex flex-col overflow-hidden shadow-2xl shadow-black/40">
          {/* Header */}
          <div className="p-4 border-b border-[#2A2420] bg-[#1A1512]/50">
            <button
              onClick={() => navigate(-1)}
              className="flex items-center gap-2 text-xs font-medium text-[#8C8375] hover:text-amber-400 transition-colors mb-3"
            >
              <ArrowLeft size={14} /> Back to Problems
            </button>

            <div className="flex items-center justify-between">
              <h1 className="text-xl font-bold text-[#FAF6F0] tracking-tight truncate pr-4">
                {problem.id}. {problem.title}
              </h1>
              <DifficultyBadge level={problem.difficulty} />
            </div>
          </div>

          {/* Tabs */}
          <div className="flex border-b border-[#2A2420] bg-[#130F0D]">
            {[
              { id: "description", label: "Description", icon: FileText },
              { id: "testcases", label: "Testcases", icon: List },
              { id: "submissions", label: "Submissions", icon: CheckCircle },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as Tab)}
                className={`flex items-center gap-2 px-6 py-3 text-xs font-semibold transition-all relative ${
                  activeTab === tab.id
                    ? "text-amber-400 bg-[#1A1512]"
                    : "text-[#8C8375] hover:text-[#D6CFC7] hover:bg-[#1A1512]/50"
                }`}
              >
                <tab.icon size={14} />
                {tab.label}
                {activeTab === tab.id && (
                  <motion.div
                    layoutId="activeTab"
                    className="absolute bottom-0 left-0 right-0 h-0.5 bg-amber-400"
                  />
                )}
              </button>
            ))}
          </div>

          {/* Scrollable Content */}
          <div className="flex-1 overflow-y-auto p-6 scrollbar-thin scrollbar-thumb-[#2A2420] scrollbar-track-transparent">
            <AnimatePresence mode="wait">
              {activeTab === "description" && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="prose prose-invert prose-sm max-w-none"
                >
                  <div className="text-[#D6CFC7] leading-7 whitespace-pre-wrap font-sans">
                    {problem.description}
                  </div>
                </motion.div>
              )}

              {activeTab === "testcases" && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="space-y-6"
                >
                  {problem.testCases.slice(0, 3).map((tc, idx) => {
                    const result = runResults[tc.id];
                    const hasRun = result !== undefined;
                    const isCorrect =
                      hasRun &&
                      !result.isError &&
                      result.output === tc.output.trim();

                    return (
                      <div
                        key={tc.id}
                        className={`bg-[#0F0A0A] border rounded-xl overflow-hidden transition-colors ${
                          hasRun
                            ? isCorrect
                              ? "border-emerald-500/50"
                              : "border-rose-500/50"
                            : "border-[#2A2420]"
                        }`}
                      >
                        <div className="px-4 py-2 bg-[#1A1512] border-b border-[#2A2420] flex items-center justify-between">
                          <div className="text-xs font-bold text-[#8C8375] uppercase tracking-wider flex items-center gap-2">
                            <Terminal size={12} /> Example {idx + 1}
                          </div>
                          {hasRun && (
                            <span
                              className={`text-[10px] px-2 py-0.5 rounded font-bold uppercase ${
                                isCorrect
                                  ? "bg-emerald-500/20 text-emerald-400"
                                  : "bg-rose-500/20 text-rose-400"
                              }`}
                            >
                              {isCorrect ? "Passed" : "Failed"}
                            </span>
                          )}
                        </div>
                        <div className="p-4 grid grid-cols-2 gap-4 text-sm font-mono">
                          <div className="col-span-2">
                            <span className="text-[#5C544E] block mb-1 text-xs">
                              Input:
                            </span>
                            <div className="text-[#E8DCC4] bg-[#161210] p-3 rounded border border-[#2A2420]/50 whitespace-pre-wrap">
                              {tc.input}
                            </div>
                          </div>
                          <div>
                            <span className="text-[#5C544E] block mb-1 text-xs">
                              Expected:
                            </span>
                            <div className="text-[#E8DCC4] bg-[#161210] p-3 rounded border border-[#2A2420]/50 whitespace-pre-wrap">
                              {tc.output}
                            </div>
                          </div>
                          <div>
                            <span className="text-[#5C544E] block mb-1 text-xs">
                              Your Output:
                            </span>
                            <div
                              className={`p-3 rounded border whitespace-pre-wrap min-h-[3rem] ${
                                hasRun
                                  ? result.isError
                                    ? "text-rose-400 border-rose-900/30 bg-rose-950/10"
                                    : "text-[#E8DCC4] border-[#2A2420]/50 bg-[#161210]"
                                  : "text-[#5C544E] border-[#2A2420]/30 bg-[#161210]"
                              }`}
                            >
                              {hasRun
                                ? result.output
                                : "Run code to see output..."}
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </motion.div>
              )}

              {activeTab === "submissions" && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="space-y-2"
                >
                  {submissions.length === 0 ? (
                    <div className="text-center py-10 text-[#5C544E] flex flex-col items-center gap-2">
                      <Code2 size={32} className="opacity-20" />
                      <p>No submissions yet. Give it a try!</p>
                    </div>
                  ) : (
                    // UPDATED: Added index and modified display label
                    submissions.map((sub, index) => (
                      <div
                        key={sub.id}
                        className="flex items-center justify-between bg-[#1A1512]/50 border border-[#2A2420] rounded-lg px-4 py-3 text-sm hover:border-amber-900/30 transition-colors"
                      >
                        <div className="flex items-center gap-3">
                          <div
                            className={`w-2 h-2 rounded-full ${
                              sub.status === "Accepted"
                                ? "bg-emerald-500"
                                : "bg-rose-500"
                            }`}
                          />
                          {/* NEW: Shows "Submission X" */}
                          <span className="font-mono text-[#D6CFC7] font-semibold">
                            Submission {submissions.length - index}
                          </span>
                        </div>
                        <span
                          className={`px-2 py-1 rounded text-xs font-bold ${
                            sub.status === "Accepted"
                              ? "bg-emerald-950/30 text-emerald-400 border border-emerald-900/30"
                              : "bg-rose-950/30 text-rose-400 border border-rose-900/30"
                          }`}
                        >
                          {sub.status}
                        </span>
                      </div>
                    ))
                  )}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* ================= RIGHT PANEL (Editor) ================= */}
        <div className="lg:col-span-7 flex flex-col h-full bg-[#161210]/80 backdrop-blur-md border border-[#2A2420] rounded-2xl shadow-2xl shadow-black/40 overflow-hidden relative">
          {/* Top Bar (Language Selector) */}
          <div className="flex items-center justify-between px-4 py-3 border-b border-[#2A2420] bg-[#1A1512]/50">
            <div className="flex items-center gap-3">
              <Code2 size={16} className="text-[#5C544E]" />
              <span className="text-xs font-bold text-[#8C8375] uppercase tracking-wider">
                Code Editor
              </span>
            </div>

            <div className="relative group">
              <select
                value={language}
                onChange={(e) => {
                  const lang = e.target.value;
                  setLanguage(lang);
                  setCode(getStarterCode(slug || "", lang)); // <--- Use the helper here too
                }}
                className="pl-3 pr-8 py-1.5 bg-[#0F0A0A] border border-[#2A2420] rounded-lg text-xs font-medium text-[#E8DCC4] focus:outline-none focus:border-amber-500/50 hover:border-amber-500/30 transition-colors appearance-none cursor-pointer"
              >
                <option value="javascript">JavaScript</option>
                <option value="python">Python</option>
                <option value="cpp">C++</option>
              </select>
            </div>
          </div>

          {/* Editor Area with Scrollbar styling */}
          <div className="flex-1 relative group overflow-hidden">
            <CodeMirror
              value={code}
              height="100%"
              theme={oneDark}
              extensions={[languageExtensions[language]]}
              onChange={(value) => setCode(value)}
              className="text-base h-full [&>.cm-editor]:h-full [&>.cm-scroller]:overflow-auto [&>.cm-scroller]:scrollbar-thin [&>.cm-scroller]:scrollbar-track-[#161210] [&>.cm-scroller]:scrollbar-thumb-[#2A2420] hover:[&>.cm-scroller]:scrollbar-thumb-[#443C35]"
            />

            {/* UPDATED: Result Toast with new animation */}
            <AnimatePresence>
              {result && (
                <motion.div
                  variants={toastVariants} // Use new variants
                  initial="hidden"
                  animate="visible"
                  exit="exit"
                  className={`absolute top-6 right-6 px-4 py-3 rounded-xl border shadow-2xl flex items-center gap-3 backdrop-blur-xl z-20 ${
                    result === "Accepted" || result === "Submitted"
                      ? "bg-emerald-950/80 border-emerald-900/50 text-emerald-400"
                      : "bg-rose-950/80 border-rose-900/50 text-rose-400"
                  }`}
                >
                  {result === "Accepted" || result === "Submitted" ? (
                    <CheckCircle size={18} />
                  ) : (
                    <AlertCircle size={18} />
                  )}
                  <span className="font-bold text-sm">{result}</span>
                  <button
                    onClick={() => setResult(null)}
                    className="ml-2 hover:opacity-70"
                  >
                    ✕
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Bottom Bar (Buttons) */}
          <div className="flex items-center justify-end gap-3 px-4 py-3 border-t border-[#2A2420] bg-[#1A1512]">
            <button
              onClick={handleRun}
              disabled={running || submitting}
              className="flex items-center gap-2 px-5 py-2 bg-[#2A2420]/30 hover:bg-[#2A2420]/60 text-[#D6CFC7] text-xs font-bold rounded-lg border border-[#2A2420] transition-all hover:scale-105 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Play size={14} className={running ? "animate-pulse" : ""} />
              {running ? "Running..." : "Run Code"}
            </button>

            <button
              onClick={handleSubmit}
              disabled={submitting}
              className={`flex items-center gap-2 px-5 py-2 text-black text-xs font-bold rounded-lg transition-all shadow-[0_0_15px_-3px_rgba(245,158,11,0.3)] hover:scale-105 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed ${
                submitting
                  ? "bg-amber-700 cursor-not-allowed opacity-70"
                  : "bg-amber-500 hover:bg-amber-400"
              }`}
            >
              {submitting ? (
                <>Processing...</>
              ) : (
                <>
                  <Send size={14} /> Submit
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

/* ================= BADGE COMPONENT ================= */

const DifficultyBadge = ({ level }: { level: string }) => {
  const colors = {
    Easy: "text-emerald-400 bg-emerald-950/30 border-emerald-900/40",
    Medium: "text-amber-400 bg-amber-950/30 border-amber-900/40",
    Hard: "text-rose-400 bg-rose-950/30 border-rose-900/40",
  };

  return (
    <span
      className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider border ${
        colors[level as keyof typeof colors] || colors.Easy
      }`}
    >
      {level}
    </span>
  );
};
