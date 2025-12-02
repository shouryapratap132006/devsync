"use client";
import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";
import {
  TbLoader2,
  TbPlus,
  TbTrash,
  TbMap,
  TbCalendar,
  TbTarget,
  TbSchool,
  TbClock,
  TbChevronRight,
  TbCheck
} from "react-icons/tb";

export default function RoadmapPage() {
  const defaultSkills = ["HTML", "CSS", "JavaScript", "React", "Node.js", "DSA", "Git", "Python", "SQL", "Express"];
  const defaultLearn = ["Next.js", "TypeScript", "MongoDB", "Machine Learning", "System Design", "DevOps", "Docker", "Kubernetes"];

  const [skills, setSkills] = useState(defaultSkills);
  const [learnList, setLearnList] = useState(defaultLearn);
  const [selectedSkills, setSelectedSkills] = useState([]);
  const [selectedLearn, setSelectedLearn] = useState([]);
  const [customSkill, setCustomSkill] = useState("");
  const [customLearn, setCustomLearn] = useState("");
  const [extraDetails, setExtraDetails] = useState("");
  const [level, setLevel] = useState("");
  const [goal, setGoal] = useState("");
  const [time, setTime] = useState("");

  const [roadmaps, setRoadmaps] = useState([]);
  const [activeRoadmap, setActiveRoadmap] = useState(null);
  const [editingMode, setEditingMode] = useState(false);
  const [loading, setLoading] = useState(false);
  const [creating, setCreating] = useState(false);
  const [error, setError] = useState(null);
  const router = useRouter();

  const backendURL = process.env.NEXT_PUBLIC_API_URL
    ? `${process.env.NEXT_PUBLIC_API_URL}/api/roadmaps`
    : "http://localhost:8080/api/roadmaps";

  async function safeFetch(url, options = {}) {
    const token = localStorage.getItem("token");
    if (!token) {
      router.push("/auth/login");
      return null;
    }
    try {
      const res = await fetch(url, {
        ...options,
        headers: { ...options.headers, Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
      });
      if (res.status === 401) {
        localStorage.removeItem("token");
        router.push("/auth/login");
        return null;
      }
      return res;
    } catch (err) {
      console.error(err);
      return null;
    }
  }

  useEffect(() => {
    fetchRoadmaps();
  }, []);

  async function fetchRoadmaps() {
    setLoading(true);
    const res = await safeFetch(backendURL);
    if (res && res.ok) {
      setRoadmaps(await res.json());
    }
    setLoading(false);
  }

  function toggleSkill(skill, type) {
    if (type === "known") {
      setSelectedSkills((prev) =>
        prev.includes(skill) ? prev.filter((s) => s !== skill) : [...prev, skill]
      );
    } else {
      setSelectedLearn((prev) =>
        prev.includes(skill) ? prev.filter((s) => s !== skill) : [...prev, skill]
      );
    }
  }

  function addCustom(text, type) {
    if (!text.trim()) return;
    if (type === "known") {
      setSkills((prev) => [...prev, text]);
      setCustomSkill("");
      setSelectedSkills(prev => [...prev, text]);
    } else {
      setLearnList((prev) => [...prev, text]);
      setCustomLearn("");
      setSelectedLearn(prev => [...prev, text]);
    }
  }

  useEffect(() => {
    if (editingMode && activeRoadmap) {
      setSelectedSkills(activeRoadmap.skills || []);
      setSelectedLearn(activeRoadmap.wantToLearn || []);
      setLevel(activeRoadmap.level || "");
      setGoal(activeRoadmap.goal || "");
      setTime(activeRoadmap.time || "");
      setExtraDetails(activeRoadmap.extraDetails || "");
    }
  }, [editingMode, activeRoadmap]);

  async function createRoadmap() {
    if (!selectedSkills.length || !selectedLearn.length || !level || !goal || !time) {
      alert("⚠ Please fill all required fields.");
      return;
    }

    setCreating(true);
    const payload = { skills: selectedSkills, wantToLearn: selectedLearn, level, goal, time, extraDetails };

    const res = await safeFetch(backendURL, { method: "POST", body: JSON.stringify(payload) });
    if (res && res.ok) {
      const roadmap = await res.json();
      setRoadmaps([roadmap, ...roadmaps]);
      setActiveRoadmap(roadmap);
      setEditingMode(false);
    } else {
      alert("Failed to create roadmap.");
    }
    setCreating(false);
  }

  async function deleteRoadmap(id) {
    if (!confirm("Delete this roadmap?")) return;
    const res = await safeFetch(`${backendURL}/${id}`, { method: "DELETE" });
    if (res && res.ok) {
      setRoadmaps(roadmaps.filter((r) => r._id !== id));
      if (activeRoadmap?._id === id) setActiveRoadmap(null);
    }
  }

  return (
    <div className="flex min-h-screen bg-slate-50 dark:bg-slate-900 transition-colors duration-300">
      {/* Sidebar */}
      <aside className="w-80 bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-700 hidden lg:flex flex-col fixed h-full pt-24 pb-6 px-6 z-10">
        <div className="mb-8">
          <button
            onClick={() => {
              setActiveRoadmap(null);
              setEditingMode(true);
            }}
            className="btn-primary w-full flex items-center justify-center gap-2 shadow-blue-500/20"
          >
            <TbPlus size={20} /> New Roadmap
          </button>
        </div>

        <div className="flex-1 overflow-y-auto pr-2 space-y-3 custom-scrollbar">
          <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-4">Your Roadmaps</h3>
          {loading ? (
            <div className="flex justify-center py-4"><TbLoader2 className="animate-spin text-blue-600" /></div>
          ) : roadmaps.length > 0 ? (
            roadmaps.map((r) => (
              <div
                key={r._id}
                onClick={() => { setActiveRoadmap(r); setEditingMode(false); }}
                className={`group p-4 rounded-xl border-2 cursor-pointer transition-all duration-200 ${activeRoadmap?._id === r._id
                  ? "bg-blue-50 dark:bg-slate-800 border-blue-500 shadow-md ring-1 ring-blue-500/20"
                  : "bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 hover:border-blue-400 dark:hover:border-blue-500 hover:shadow-md hover:bg-slate-50 dark:hover:bg-slate-700"
                  }`}
              >
                <div className="flex justify-between items-start mb-2">
                  <h4 className={`font-bold text-sm line-clamp-1 ${activeRoadmap?._id === r._id ? "text-blue-800 dark:text-blue-300" : "text-slate-900 dark:text-slate-100"}`}>
                    {r.goal}
                  </h4>
                  <button
                    onClick={(e) => { e.stopPropagation(); deleteRoadmap(r._id); }}
                    className={`transition-colors opacity-0 group-hover:opacity-100 ${activeRoadmap?._id === r._id ? "text-blue-400 hover:text-red-600" : "text-slate-400 hover:text-red-600"}`}
                  >
                    <TbTrash size={16} />
                  </button>
                </div>
                <div className={`flex items-center gap-2 text-xs font-medium ${activeRoadmap?._id === r._id ? "text-blue-600 dark:text-blue-400" : "text-slate-500 dark:text-slate-400"}`}>
                  <TbCalendar size={12} />
                  {new Date(r.createdAt).toLocaleDateString()}
                </div>
              </div>
            ))
          ) : (
            <div className="text-center py-8 bg-slate-50 dark:bg-slate-800 rounded-xl border border-dashed border-slate-200 dark:border-slate-700">
              <p className="text-slate-500 dark:text-slate-400 text-sm">No roadmaps yet.</p>
            </div>
          )}
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 lg:ml-80 p-6 md:p-10 pt-24 pb-32 max-w-5xl mx-auto w-full">
        <AnimatePresence mode="wait">
          {(!activeRoadmap || editingMode) ? (
            <motion.div
              key="form"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-8"
            >
              <header>
                <h1 className="text-3xl font-bold text-slate-900 dark:text-white mb-2">Create New Roadmap</h1>
                <p className="text-slate-500 dark:text-slate-400">Let AI design your perfect learning path.</p>
              </header>

              <div className="grid md:grid-cols-2 gap-8">
                {/* Skills Section */}
                <div className="card-premium p-6">
                  <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
                    <TbCheck className="text-green-500" /> Skills You Know
                  </h3>
                  <div className="flex flex-wrap gap-2 mb-4">
                    {skills.map(s => (
                      <button
                        key={s}
                        onClick={() => toggleSkill(s, "known")}
                        className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${selectedSkills.includes(s)
                          ? "bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 border border-green-200 dark:border-green-800"
                          : "bg-slate-50 dark:bg-slate-800 text-slate-600 dark:text-slate-300 border border-slate-100 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-700"
                          }`}
                      >
                        {s}
                      </button>
                    ))}
                  </div>
                  <div className="flex gap-2">
                    <input
                      value={customSkill}
                      onChange={(e) => setCustomSkill(e.target.value)}
                      placeholder="Add custom skill..."
                      className="flex-1 px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700 text-sm bg-white dark:bg-slate-800 text-slate-900 dark:text-white placeholder:text-slate-500 dark:placeholder:text-slate-400 focus:outline-none focus:border-blue-500"
                      onKeyDown={(e) => e.key === 'Enter' && addCustom(customSkill, "known")}
                    />
                    <button onClick={() => addCustom(customSkill, "known")} className="p-2 bg-slate-100 dark:bg-slate-800 rounded-lg hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300">
                      <TbPlus />
                    </button>
                  </div>
                </div>

                {/* Learn Section */}
                <div className="card-premium p-6">
                  <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
                    <TbTarget className="text-blue-500" /> Want to Learn
                  </h3>
                  <div className="flex flex-wrap gap-2 mb-4">
                    {learnList.map(s => (
                      <button
                        key={s}
                        onClick={() => toggleSkill(s, "learn")}
                        className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${selectedLearn.includes(s)
                          ? "bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-800"
                          : "bg-slate-50 dark:bg-slate-800 text-slate-600 dark:text-slate-300 border border-slate-100 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-700"
                          }`}
                      >
                        {s}
                      </button>
                    ))}
                  </div>
                  <div className="flex gap-2">
                    <input
                      value={customLearn}
                      onChange={(e) => setCustomLearn(e.target.value)}
                      placeholder="Add custom tech..."
                      className="flex-1 px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700 text-sm bg-white dark:bg-slate-800 text-slate-900 dark:text-white placeholder:text-slate-500 dark:placeholder:text-slate-400 focus:outline-none focus:border-blue-500"
                      onKeyDown={(e) => e.key === 'Enter' && addCustom(customLearn, "learn")}
                    />
                    <button onClick={() => addCustom(customLearn, "learn")} className="p-2 bg-slate-100 dark:bg-slate-800 rounded-lg hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300">
                      <TbPlus />
                    </button>
                  </div>
                </div>
              </div>

              {/* Details Section */}
              <div className="card-premium p-6">
                <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-6">Learning Preferences</h3>
                <div className="grid md:grid-cols-3 gap-6 mb-6">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Current Level</label>
                    <div className="relative">
                      <TbSchool className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                      <select
                        value={level}
                        onChange={(e) => setLevel(e.target.value)}
                        className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white outline-none appearance-none focus:bg-white dark:focus:bg-slate-800 focus:ring-2 focus:ring-blue-500/20"
                      >
                        <option value="">Select Level</option>
                        <option value="Beginner">Beginner</option>
                        <option value="Intermediate">Intermediate</option>
                        <option value="Advanced">Advanced</option>
                      </select>
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Main Goal</label>
                    <div className="relative">
                      <TbTarget className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                      <input
                        value={goal}
                        onChange={(e) => setGoal(e.target.value)}
                        placeholder="e.g. Full Stack Dev"
                        className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white placeholder:text-slate-500 dark:placeholder:text-slate-400 focus:bg-white dark:focus:bg-slate-800 focus:ring-2 focus:ring-blue-500/20 outline-none"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Time Commitment</label>
                    <div className="relative">
                      <TbClock className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                      <select
                        value={time}
                        onChange={(e) => setTime(e.target.value)}
                        className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white outline-none appearance-none focus:bg-white dark:focus:bg-slate-800 focus:ring-2 focus:ring-blue-500/20"
                      >
                        <option value="">Select Time</option>
                        <option value="1-2">1-2 hours/day</option>
                        <option value="3-5">3-5 hours/day</option>
                        <option value="weekend">Weekends Only</option>
                        <option value="flexible">Flexible</option>
                      </select>
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Additional Context (Optional)</label>
                  <textarea
                    value={extraDetails}
                    onChange={(e) => setExtraDetails(e.target.value)}
                    placeholder="Any specific projects you want to build or learning style preferences?"
                    className="w-full p-4 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white placeholder:text-slate-500 dark:placeholder:text-slate-400 focus:bg-white dark:focus:bg-slate-800 focus:ring-2 focus:ring-blue-500/20 outline-none resize-none h-24"
                  />
                </div>
              </div>

              <div className="flex justify-end">
                <button
                  onClick={createRoadmap}
                  disabled={creating}
                  className="btn-primary px-8 py-3 text-lg shadow-lg shadow-blue-500/20 disabled:opacity-70 disabled:cursor-not-allowed flex items-center gap-2"
                >
                  {creating ? <TbLoader2 className="animate-spin" /> : <TbMap />}
                  {creating ? "Generating Strategy..." : "Generate Roadmap"}
                </button>
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="roadmap"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-8"
            >
              <header className="flex justify-between items-start">
                <div>
                  <div className="flex items-center gap-2 text-blue-600 font-medium mb-2">
                    <TbMap /> Personal Roadmap
                  </div>
                  <h1 className="text-3xl font-bold text-slate-900 dark:text-white">{activeRoadmap.goal}</h1>
                  <p className="text-slate-500 dark:text-slate-400 mt-1">Generated on {new Date(activeRoadmap.createdAt).toLocaleDateString()}</p>
                </div>
                <button onClick={() => setEditingMode(true)} className="text-blue-600 font-medium hover:underline">
                  Create New
                </button>
              </header>

              <div className="grid gap-6">
                {activeRoadmap.weeks?.map((weekContent, idx) => (
                  <div key={idx} className="card-premium p-0 overflow-hidden">
                    <div className="bg-slate-50 dark:bg-slate-800 px-6 py-4 border-b border-slate-100 dark:border-slate-700 flex items-center gap-3">
                      <span className="flex items-center justify-center w-8 h-8 rounded-full bg-blue-600 text-white font-bold text-sm">
                        {idx + 1}
                      </span>
                      <h3 className="font-bold text-slate-900 dark:text-white">Week {idx + 1}</h3>
                    </div>
                    <div className="p-6">
                      <p className="text-slate-700 dark:text-slate-300 leading-relaxed whitespace-pre-wrap">{weekContent}</p>
                    </div>
                  </div>
                ))}
              </div>

              {activeRoadmap.extraDetails && (
                <div className="bg-blue-50 dark:bg-blue-900/20 rounded-2xl p-6 border border-blue-100 dark:border-blue-800">
                  <h4 className="font-bold text-blue-900 dark:text-blue-300 mb-2 flex items-center gap-2">
                    <TbTarget /> AI Notes
                  </h4>
                  <p className="text-blue-800 dark:text-blue-200">{activeRoadmap.extraDetails}</p>
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </main>
    </div>
  );
}
