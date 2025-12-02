// FOOTER COMPONENT
import {
  FaFacebookF,
  FaTwitter,
  FaInstagram,
  FaLinkedinIn,
  FaGithub,
} from "react-icons/fa";

export default function Footer() {
  return (
    <footer className="bg-white dark:bg-slate-950 text-slate-600 dark:text-slate-400 pt-16 pb-10 mt-20 border-t border-slate-200 dark:border-slate-800 transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-4 gap-12">

        {/* 1️⃣ BRAND SECTION */}
        <div>
          <h2 className="text-3xl font-bold text-slate-900 dark:text-white mb-4">
            Dev<span className="text-blue-600">Sync</span>
          </h2>
          <p className="text-slate-600 dark:text-slate-400 leading-relaxed mb-6">
            Your AI-powered career companion.
            Build skills, grow faster, and achieve your developer goals.
          </p>

          {/* Social Icons */}
          <div className="flex gap-4 mt-4">
            <a className="p-3 bg-slate-100 dark:bg-slate-800 rounded-full hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-400 transition cursor-pointer">
              <FaFacebookF size={18} />
            </a>
            <a className="p-3 bg-slate-100 dark:bg-slate-800 rounded-full hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-400 transition cursor-pointer">
              <FaTwitter size={18} />
            </a>
            <a className="p-3 bg-slate-100 dark:bg-slate-800 rounded-full hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-400 transition cursor-pointer">
              <FaInstagram size={18} />
            </a>
            <a className="p-3 bg-slate-100 dark:bg-slate-800 rounded-full hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-400 transition cursor-pointer">
              <FaLinkedinIn size={18} />
            </a>
            <a className="p-3 bg-slate-100 dark:bg-slate-800 rounded-full hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-400 transition cursor-pointer">
              <FaGithub size={18} />
            </a>
          </div>
        </div>

        {/* 2️⃣ PRODUCT LINKS */}
        <div>
          <h3 className="text-xl font-semibold text-slate-900 dark:text-white mb-4">Product</h3>
          <ul className="space-y-3 text-slate-600 dark:text-slate-400">
            <li className="hover:text-blue-600 dark:hover:text-blue-400 cursor-pointer">Skill Assessment</li>
            <li className="hover:text-blue-600 dark:hover:text-blue-400 cursor-pointer">AI Roadmaps</li>
            <li className="hover:text-blue-600 dark:hover:text-blue-400 cursor-pointer">Progress Tracker</li>
            <li className="hover:text-blue-600 dark:hover:text-blue-400 cursor-pointer">Community Forum</li>
          </ul>
        </div>

        {/* 3️⃣ RESOURCES */}
        <div>
          <h3 className="text-xl font-semibold text-slate-900 dark:text-white mb-4">Resources</h3>
          <ul className="space-y-3 text-slate-600 dark:text-slate-400">
            <li className="hover:text-blue-600 dark:hover:text-blue-400 cursor-pointer">Blog</li>
            <li className="hover:text-blue-600 dark:hover:text-blue-400 cursor-pointer">Guides & Tutorials</li>
            <li className="hover:text-blue-600 dark:hover:text-blue-400 cursor-pointer">Documentation</li>
            <li className="hover:text-blue-600 dark:hover:text-blue-400 cursor-pointer">FAQs</li>
            <li className="hover:text-blue-600 dark:hover:text-blue-400 cursor-pointer">Support</li>
          </ul>
        </div>

        {/* 4️⃣ NEWSLETTER */}
        <div>
          <h3 className="text-xl font-semibold text-slate-900 dark:text-white mb-4">Stay Updated</h3>
          <p className="text-slate-600 dark:text-slate-400 mb-4">
            Subscribe for tips, updates, and exclusive content.
          </p>

          <div className="flex items-center bg-slate-100 dark:bg-slate-800 p-2 rounded-xl">
            <input
              type="email"
              placeholder="Your email"
              className="bg-transparent w-full px-2 py-2 text-slate-900 dark:text-white outline-none placeholder:text-slate-400 dark:placeholder:text-slate-500"
            />
            <button className="bg-blue-600 px-4 py-2 rounded-lg text-white font-semibold hover:bg-blue-700 transition">
              Join
            </button>
          </div>
        </div>
      </div>

      {/* COPYRIGHT BAR */}
      <div className="mt-16 border-t border-slate-200 dark:border-slate-800 pt-6 text-center text-slate-500 text-sm">
        © {new Date().getFullYear()} DevSync — All rights reserved.
      </div>
    </footer>
  );
}
