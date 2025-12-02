"use client";
import React from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import {
  TbBrain,
  TbTargetArrow,
  TbChartLine,
  TbUsers,
  TbRocket,
  TbCheck,
  TbArrowRight
} from "react-icons/tb";
import Footer from "./components/Footer";

// Animation Variants
const fadeInUp = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6 } }
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.2
    }
  }
};

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col bg-slate-50 dark:bg-slate-900 overflow-x-hidden transition-colors duration-300">

      {/* 🌟 HERO SECTION */}
      <section className="relative pt-24 pb-16 lg:pt-32 lg:pb-20 overflow-hidden">
        {/* Background Elements */}
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden -z-10">
          <div className="absolute top-[-10%] right-[-5%] w-[500px] h-[500px] rounded-full bg-blue-400/20 blur-[100px]" />
          <div className="absolute bottom-[-10%] left-[-10%] w-[600px] h-[600px] rounded-full bg-indigo-400/20 blur-[120px]" />
        </div>

        <div className="max-w-7xl mx-auto px-6 text-center">
          <motion.div
            initial="hidden"
            animate="visible"
            variants={staggerContainer}
            className="max-w-4xl mx-auto"
          >
            <motion.div variants={fadeInUp} className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-50 dark:bg-blue-900/30 border border-blue-100 dark:border-blue-800 text-blue-700 dark:text-blue-300 font-medium text-sm mb-8">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-500"></span>
              </span>
              AI-Powered Career Growth for Developers
            </motion.div>

            <motion.h1 variants={fadeInUp} className="text-5xl md:text-7xl font-bold text-slate-900 dark:text-white tracking-tight mb-8 leading-[1.1]">
              Build Your Dream <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600">
                Developer Career
              </span>
            </motion.h1>

            <motion.p variants={fadeInUp} className="text-xl text-slate-600 dark:text-slate-300 mb-10 max-w-2xl mx-auto leading-relaxed">
              Stop guessing what to learn next. Get a personalized roadmap, AI mentorship, and real-time progress tracking to land your next role.
            </motion.p>

            <motion.div variants={fadeInUp} className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Link href="/auth/signup" className="btn-primary text-lg px-8 py-4 shadow-lg shadow-blue-500/20 flex items-center gap-2 group">
                Start Your Journey
                <TbArrowRight className="group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link href="/auth/login" className="px-8 py-4 rounded-xl font-medium text-slate-700 dark:text-slate-300 hover:bg-white dark:hover:bg-slate-800 hover:shadow-md transition-all border border-transparent hover:border-slate-200 dark:hover:border-slate-700">
                Log In
              </Link>
            </motion.div>
          </motion.div>

          
        </div>
      </section>

      {/* ⚡ FEATURES GRID */}
      <section className="py-24 bg-white dark:bg-slate-900">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-white mb-4">Everything you need to grow</h2>
            <p className="text-slate-600 dark:text-slate-400 max-w-2xl mx-auto text-lg">
              DevSync combines advanced AI with proven learning methodologies to accelerate your growth.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <FeatureCard
              icon={<TbBrain className="text-4xl text-blue-600" />}
              title="AI Assessment"
              desc="Our AI analyzes your current skills and identifies gaps to create a perfectly tailored learning plan."
            />
            <FeatureCard
              icon={<TbTargetArrow className="text-4xl text-indigo-600" />}
              title="Custom Roadmaps"
              desc="Get a step-by-step curriculum with curated resources, projects, and milestones."
            />
            <FeatureCard
              icon={<TbChartLine className="text-4xl text-cyan-600" />}
              title="Progress Tracking"
              desc="Visualize your growth with detailed analytics, streaks, and achievement badges."
            />
            <FeatureCard
              icon={<TbUsers className="text-4xl text-purple-600" />}
              title="Community"
              desc="Connect with other developers, share your wins, and get help when you're stuck."
            />
            <FeatureCard
              icon={<TbRocket className="text-4xl text-orange-600" />}
              title="Career Goals"
              desc="Set specific career objectives and let DevSync guide you to achieve them."
            />
            <FeatureCard
              icon={<TbCheck className="text-4xl text-green-600" />}
              title="Daily Tasks"
              desc="Stay consistent with auto-generated daily tasks that keep you moving forward."
            />
          </div>
        </div>
      </section>

      {/* 💬 TESTIMONIALS */}
      <section className="py-24 bg-slate-50 dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800">
        <div className="max-w-7xl mx-auto px-6">
          <h2 className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-white mb-16 text-center">Loved by Developers</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <TestimonialCard
              quote="DevSync helped me structure my learning. The roadmap guided me to land my first React role in just 3 months."
              author="Aisha Khan"
              role="Frontend Engineer"
              initial="A"
            />
            <TestimonialCard
              quote="The AI assessment highlighted gaps I didn't know I had. I improved fast with daily tasks and the community support."
              author="Rahul Verma"
              role="Backend Developer"
              initial="R"
            />
            <TestimonialCard
              quote="Finally, a tool that actually understands what I need to learn. The progress tracking keeps me motivated every day."
              author="Sarah Jenkins"
              role="Full Stack Dev"
              initial="S"
            />
          </div>
        </div>
      </section>

      {/* 🚀 CTA SECTION */}
      <section className="py-24 bg-white dark:bg-slate-900">
        <div className="max-w-5xl mx-auto px-6">
          <div className="bg-gradient-to-r from-blue-600 to-indigo-600 rounded-3xl p-12 md:p-20 text-center text-white shadow-2xl relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl -mr-16 -mt-16"></div>
            <div className="absolute bottom-0 left-0 w-64 h-64 bg-white/10 rounded-full blur-3xl -ml-16 -mb-16"></div>

            <h2 className="text-3xl md:text-5xl font-bold mb-6 relative z-10">Ready to level up?</h2>
            <p className="text-blue-100 text-lg md:text-xl mb-10 max-w-2xl mx-auto relative z-10">
              Join thousands of developers who are fast-tracking their careers with DevSync.
            </p>
            <Link href="/auth/signup" className="inline-block bg-white text-blue-600 px-10 py-4 rounded-xl font-bold text-lg hover:bg-blue-50 hover:shadow-lg transition-all relative z-10">
              Get Started for Free
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}

function FeatureCard({ icon, title, desc }) {
  return (
    <div className="p-8 bg-white dark:bg-slate-800 rounded-2xl border border-slate-100 dark:border-slate-700 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 group">
      <div className="mb-6 p-4 bg-slate-50 dark:bg-slate-700 rounded-xl inline-block group-hover:bg-blue-50 dark:group-hover:bg-blue-900/30 transition-colors">
        {icon}
      </div>
      <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-3">{title}</h3>
      <p className="text-slate-600 dark:text-slate-400 leading-relaxed">{desc}</p>
    </div>
  );
}

function TestimonialCard({ quote, author, role, initial }) {
  return (
    <div className="p-8 bg-white dark:bg-slate-800 rounded-2xl border border-slate-100 dark:border-slate-700 shadow-sm">
      <div className="flex gap-1 text-yellow-400 mb-4">
        {[1, 2, 3, 4, 5].map(i => <span key={i}>★</span>)}
      </div>
      <p className="text-slate-700 dark:text-slate-300 mb-6 text-lg leading-relaxed">"{quote}"</p>
      <div className="flex items-center gap-4">
        <div className="w-12 h-12 rounded-full bg-slate-100 dark:bg-slate-700 flex items-center justify-center text-slate-600 dark:text-slate-300 font-bold text-lg">
          {initial}
        </div>
        <div>
          <div className="font-bold text-slate-900 dark:text-white">{author}</div>
          <div className="text-sm text-slate-500 dark:text-slate-400">{role}</div>
        </div>
      </div>
    </div>
  );
}
