import React from 'react';
import { Link } from 'react-router-dom';
import { Github, Twitter, Linkedin } from 'lucide-react';

function Footer() {
  return (
    <footer className="border-t border-white/10 bg-black/20 backdrop-blur-md mt-auto">
      <div className="container mx-auto px-6 py-12">
        <div className="flex flex-col md:flex-row justify-between items-center gap-6">

          {/* Brand */}
          <div className="text-center md:text-left">
            <h3 className="text-2xl font-bold bg-gradient-to-r from-indigo-400 to-cyan-400 bg-clip-text text-transparent mb-2">
              Emporia
            </h3>
            <p className="text-gray-500 text-sm">
              Everything you need, want and love all in one place.
            </p>
          </div>

          {/* Links */}
          <div className="flex gap-8 text-sm text-gray-400">
            <Link to="#" className="hover:text-indigo-400 transition-colors">Privacy</Link>
            <Link to="#" className="hover:text-indigo-400 transition-colors">Terms</Link>
            <Link to="#" className="hover:text-indigo-400 transition-colors">Support</Link>
          </div>

          {/* Social */}
          <div className="flex gap-4">
            <a href="#" className="p-2 bg-white/5 rounded-full text-gray-400 hover:bg-indigo-500 hover:text-white transition-all">
              <Github size={18} />
            </a>
            <a href="#" className="p-2 bg-white/5 rounded-full text-gray-400 hover:bg-blue-400 hover:text-white transition-all">
              <Twitter size={18} />
            </a>
            <a href="#" className="p-2 bg-white/5 rounded-full text-gray-400 hover:bg-blue-600 hover:text-white transition-all">
              <Linkedin size={18} />
            </a>
          </div>
        </div>

        <div className="border-t border-white/5 mt-8 pt-8 text-center text-xs text-gray-600">
          &copy; {new Date().getFullYear()} Emporia Systems. Designed by Shalo Sajan.
        </div>
      </div>
    </footer>
  );
}

export default Footer;