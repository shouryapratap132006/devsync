"use client";
import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { TbLoader2 } from "react-icons/tb";

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

  // Backend URL
  const backendURL = "http://localhost:8080/api/roadmaps";

  // Safe fetch wrapper
  async function safeFetch(url, options = {}) {
    let res;

    try {
      const token = localStorage.getItem("token");
      if (!token) {
        router.push("/auth/login");
        throw new Error("No auth token found");
      }

      const headers = {
        ...options.headers,
        "Authorization": `Bearer ${token}`
      };

      res = await fetch(url, { ...options, headers });
    } catch (err) {
      console.error("Network error:", err);
      throw new Error("Network request failed");
    }

    const text = await res.text();

    let data;
    try {
      data = text ? JSON.parse(text) : null;
    } catch {
      console.error("Invalid JSON:", text);
      throw new Error("Invalid JSON returned by server");
    }

    if (!res.ok) {
      throw new Error(data?.error || res.statusText || "Request failed");
    }

    return data;
  }

  useEffect(() => {
    fetchRoadmaps();
  }, []);

  async function fetchRoadmaps() {
    setLoading(true);
    setError(null);
    try {
      const data = await safeFetch(backendURL);
      setRoadmaps(data);
    } catch (err) {
      console.error(err);
      setError("Could not load roadmaps");
    } finally {
      setLoading(false);
    }
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
    } else {
      setLearnList((prev) => [...prev, text]);
      setCustomLearn("");
    }
  }

  // when entering editing mode for an existing roadmap, prefill form fields
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

  // Make sure this function is declared as async
  async function createRoadmap() {
    // Show popup warning if required fields are missing
    if (!selectedSkills.length || !selectedLearn.length || !level || !goal || !time) {
      alert("⚠ Please fill all required fields (skills, goal, level, time).");
      return;
    }

    const payload = {
      skills: selectedSkills,
      wantToLearn: selectedLearn,
      level,
      goal,
      time,
      extraDetails,
    };

    try {
      const roadmap = await safeFetch(backendURL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      setRoadmaps((prev) => [roadmap, ...prev]);
      setActiveRoadmap(roadmap);
      setEditingMode(false);
    } catch (err) {
      console.error(err);
      alert(err.message || "Failed to create roadmap");
    }
  }

  async function loadRoadmap(id) {
    setLoading(true);
    setError(null);
    try {
      const data = await safeFetch(`${backendURL}/${id}`);
      setActiveRoadmap(data);
      setEditingMode(false);
    } catch (err) {
      console.error(err);
      setError("Could not load roadmap");
    } finally {
      setLoading(false);
    }
  }

  // Clear assessment form when a roadmap is opened (unless user is in editingMode)
  useEffect(() => {
    if (activeRoadmap && !editingMode) {
      setSelectedSkills([]);
      setSelectedLearn([]);
      setLevel("");
      setGoal("");
      setTime("");
      setExtraDetails("");
      setCustomSkill("");
      setCustomLearn("");
    }
  }, [activeRoadmap, editingMode]);

  async function deleteRoadmap(id) {
    if (!confirm("Delete this roadmap?")) return;
    setError(null);
    try {
      await safeFetch(`${backendURL}/${id}`, { method: "DELETE" });
      setRoadmaps((prev) => prev.filter((r) => r._id !== id));
      if (activeRoadmap && activeRoadmap._id === id) setActiveRoadmap(null);
    } catch (err) {
      console.error(err);
      setError("Could not delete roadmap");
    }
  }

  return (
    <div className="flex w-full min-h-screen bg-[#eef1f5]">
      {/* Sidebar */}
      <aside className="w-72 bg-white border-r shadow p-6 hidden md:block sticky top-0 h-screen overflow-auto">
        <h2 className="text-lg font-bold text-gray-900 mb-4">Your Roadmaps</h2>

        <button
          onClick={() => {
            setActiveRoadmap(null);
            setEditingMode(true);
            window.scrollTo({ top: 0, behavior: "smooth" });
          }}
          className="w-full mb-4 py-2 rounded-xl bg-blue-600 text-white font-semibold hover:bg-blue-700 shadow"
        >
          + New Roadmap
        </button>

        <div className="flex flex-col gap-3">
          {loading && <div className="text-gray-700 font-medium">Loading...</div>}

          {roadmaps.map((r) => (
            <div
              key={r._id}
              className="p-3 rounded-xl border hover:bg-gray-100 cursor-pointer flex justify-between items-start"
              onClick={() => loadRoadmap(r._id)}
            >
              <div>
                <div className="font-semibold text-gray-900">
                  {r.goal || "Untitled"}
                </div>
                <div className="text-sm text-gray-600 mt-1">
                  {new Date(r.createdAt).toLocaleString()}
                </div>
              </div>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  deleteRoadmap(r._id);
                }}
                className="text-sm text-red-600"
              >
                Delete
              </button>
            </div>
          ))}

          {!roadmaps.length && !loading && (
            <div className="text-gray-600">No saved roadmaps yet.</div>
          )}
        </div>
      </aside>

      {/* Main */}
      <main className="flex-1 p-8">
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="max-w-6xl mx-auto">
          <header className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900">Create / View Roadmap</h1>
            <p className="text-gray-700 mt-1">
              Fill the assessment or pick a previous roadmap from the left.
            </p>
          </header>

          {/* Assessment Form - hide when a premade/saved roadmap is selected unless editingMode is active */}
          {(!activeRoadmap || editingMode) && (
            <section className="mb-8 bg-white p-6 rounded-xl shadow border border-gray-200">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Skills Known */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-3">
                  Skills You Already Know
                </h3>

                <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                  {skills.map((s) => (
                    <label
                      key={s}
                      className="flex items-center gap-2 p-2 border rounded-lg cursor-pointer bg-gray-50"
                    >
                      <input
                        type="checkbox"
                        checked={selectedSkills.includes(s)}
                        onChange={() => toggleSkill(s, "known")}
                        className="w-4 h-4 accent-blue-600"
                      />
                      <span className="text-gray-900 text-sm">{s}</span>
                    </label>
                  ))}
                </div>

                <div className="flex gap-2 mt-3">
                  <input
                    value={customSkill}
                    onChange={(e) => setCustomSkill(e.target.value)}
                    placeholder="Add custom skill"
                    className="flex-1 border rounded-lg px-3 py-2 placeholder-gray-500 text-gray-900"
                  />
                  <button
                    onClick={() => addCustom(customSkill, "known")}
                    className="px-4 rounded-lg bg-blue-600 text-white"
                  >
                    +
                  </button>
                </div>
              </div>

              {/* Want to Learn */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-3">
                  Technologies You Want to Learn
                </h3>

                <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                  {learnList.map((s) => (
                    <label
                      key={s}
                      className="flex items-center gap-2 p-2 border rounded-lg cursor-pointer bg-gray-50"
                    >
                      <input
                        type="checkbox"
                        checked={selectedLearn.includes(s)}
                        onChange={() => toggleSkill(s, "learn")}
                        className="w-4 h-4 accent-blue-600"
                      />
                      <span className="text-gray-900 text-sm">{s}</span>
                    </label>
                  ))}
                </div>

                <div className="flex gap-2 mt-3">
                  <input
                    value={customLearn}
                    onChange={(e) => setCustomLearn(e.target.value)}
                    placeholder="Add custom tech"
                    className="flex-1 border rounded-lg px-3 py-2 placeholder-gray-500 text-gray-900"
                  />
                  <button
                    onClick={() => addCustom(customLearn, "learn")}
                    className="px-4 rounded-lg bg-blue-600 text-white"
                  >
                    +
                  </button>
                </div>
              </div>
            </div>

            {/* Level, Goal, Time */}
            <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-900 mb-1">
                  Experience Level
                </label>
                <select
                  value={level}
                  onChange={(e) => setLevel(e.target.value)}
                  className="w-full border rounded-lg px-3 py-2 bg-white text-gray-900"
                >
                  <option value="">Select your level</option>
                  <option value="Beginner">Beginner</option>
                  <option value="Intermediate">Intermediate</option>
                  <option value="Advanced">Advanced</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-900 mb-1">
                  Learning Goal
                </label>
                <input
                  value={goal}
                  onChange={(e) => setGoal(e.target.value)}
                  placeholder="e.g. Become a Full-Stack Developer"
                  className="w-full border rounded-lg px-3 py-2 placeholder-gray-500 text-gray-900"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-900 mb-1">
                  Time Availability
                </label>
                <select
                  value={time}
                  onChange={(e) => setTime(e.target.value)}
                  className="w-full border rounded-lg px-3 py-2 bg-white text-gray-900"
                >
                  <option value="">Select</option>
                  <option value="1-2">1–2 hours/day</option>
                  <option value="3-5">3–5 hours/day</option>
                  <option value="weekend">Weekends only</option>
                  <option value="flexible">Flexible</option>
                </select>
              </div>
            </div>

            {/* Extra Details */}
            <div className="mt-6">
              <label className="block text-sm font-medium text-gray-900 mb-1">
                Extra Details
              </label>
              <textarea
                value={extraDetails}
                onChange={(e) => setExtraDetails(e.target.value)}
                placeholder="Write anything that helps the AI understand you better"
                className="w-full border rounded-lg px-3 py-2 h-28 placeholder-gray-500 text-gray-900"
              />
            </div>

            <div className="mt-6 flex items-center gap-4">
              <button
                onClick={createRoadmap}
                disabled={creating}
                className="px-6 py-3 rounded-lg bg-blue-600 text-white font-semibold hover:bg-blue-700"
              >
                {creating ? (
                  <div className="flex items-center gap-2">
                    <TbLoader2 className="animate-spin text-xl" />
                    <span>Generating...</span>
                  </div>
                ) : (
                  "Generate Roadmap"
                )}
              </button>
              {error && <div className="text-red-600 font-medium">{error}</div>}
              
            </div>
            </section>
          )}

          {/* Roadmap Viewer */}
          <section className="bg-white p-6 rounded-xl shadow border border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Roadmap</h3>

            {activeRoadmap ? (
              <div>
                <h4 className="text-xl font-bold text-gray-900 mb-2">
                  {activeRoadmap.goal || "Personalized Roadmap"}
                </h4>
                <div className="text-sm text-gray-700 mb-4">
                  Created: {new Date(activeRoadmap.createdAt).toLocaleString()}
                </div>

                <div className="space-y-4">
                  {activeRoadmap.weeks?.map((week, idx) => (
                    <div key={idx} className="p-4 border rounded-lg bg-gray-50">
                      <div className="font-semibold text-gray-900">
                        Week {idx + 1}
                      </div>
                      <div className="text-sm text-gray-800 mt-2">
                        {week}
                      </div>
                    </div>
                  ))}
                </div>

                <div className="mt-6">
                  <h5 className="font-semibold text-gray-900 mb-2">Notes</h5>
                  <div className="text-sm text-gray-800 whitespace-pre-wrap">
                    {activeRoadmap.extraDetails}
                  </div>
                </div>
              </div>
            ) : (
              <div className="text-gray-700">
                Select an existing roadmap from the left or generate a new one.
              </div>
            )}
          </section>
        </motion.div>
      </main>
    </div>
  );
}
