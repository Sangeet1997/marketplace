import React from 'react';
import { 
  X, Mail, Code, Cpu, Database, ShieldCheck, Zap, 
  BookOpen, Target, User, Globe, Inbox, Bot, Link, DatabaseZap, ChevronRight,
  Settings
} from 'lucide-react';

const AboutUs = ({ isOpen, onClose, isDarkMode }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className={`w-full max-w-2xl p-8 rounded-lg shadow-xl relative overflow-y-auto max-h-[90%] 
        ${isDarkMode 
          ? 'bg-gray-800 text-white scrollbar-thin scrollbar-track-gray-700 scrollbar-thumb-gray-600 scrollbar-track-rounded-lg scrollbar-thumb-rounded-lg' 
          : 'bg-white text-gray-900 scrollbar-thin scrollbar-track-gray-200 scrollbar-thumb-gray-400 scrollbar-track-rounded-lg scrollbar-thumb-rounded-lg'
        }`}>
        <button 
          onClick={onClose} 
          className={`absolute top-4 right-4 p-2 rounded-full hover:bg-gray-200 transition-colors
            ${isDarkMode 
              ? 'hover:bg-gray-700 text-white' 
              : 'text-gray-700'
            }`}
        >
          <X size={24} />
        </button>

        <h2 className="text-3xl font-bold mb-6 text-center">About Us</h2>

        <div className="space-y-6">
          <section>
            <h3 className="text-xl font-semibold mb-2 flex items-center">
              <BookOpen size={20} className="mr-2" /> About The Platform
            </h3>
            <p className="text-md leading-relaxed">
              Welcome to FairTrader AI, where innovation meets convenience. This platform is designed to empower users in the buying and selling of cars. With a focus on integrating advanced AI capabilities, FairTrader AI ensures a seamless and efficient experience for all users. It's not just a marketplace; it's a smart assistant that makes every interaction intuitive and rewarding.
            </p>
          </section>

          <section>
            <h3 className="text-xl font-semibold mb-2 flex items-center">
              <Target size={20} className="mr-2" /> Mission
            </h3>
            <p className="text-md leading-relaxed">
              The aim is to create a seamless, intuitive platform that connects users, products, and opportunities. The goal is to simplify digital interactions and provide a user-friendly experience for buying, selling, and managing items. By leveraging cutting-edge technology, FairTrader AI strives to build trust, transparency, and efficiency in every transaction.
            </p>
          </section>

          <section>
            <h3 className="text-xl font-semibold mb-2 flex items-center">
              <User size={20} className="mr-2" /> About the Developer
            </h3>
            <p className="text-md leading-relaxed">
              FairTrader AI is a solo project, developed by a passionate individual with a diverse background in development, design, and innovation. This project brings together unique perspectives and skills to solve complex challenges in the automotive marketplace.
            </p>
          </section>

          <section>
            <h3 className="text-xl font-semibold mb-2 flex items-center">
              <Globe size={20} className="mr-2" /> Technologies
            </h3>
            <ul className={`list-disc pl-5 space-y-2 
              ${isDarkMode 
                ? 'text-gray-300' 
                : 'text-gray-700'
              }`}>
              <li><Code size={16} className="inline-block mr-2" />React.js for dynamic, responsive frontend</li>
              <li><Cpu size={16} className="inline-block mr-2" />Node.js and Express for robust backend services</li>
              <li><Database size={16} className="inline-block mr-2" />MongoDB for flexible, scalable data storage</li>
              <li><ShieldCheck size={16} className="inline-block mr-2" />JWT for secure authentication</li>
              <li><Zap size={16} className="inline-block mr-2" />Tailwind CSS for modern, adaptive design</li>
              <li><ChevronRight size={16} className="inline-block mr-2" />Advanced Prompting for smart AI interactions</li>
              <li><DatabaseZap size={16} className="inline-block mr-2" />RAG (Retrieval-Augmented Generation) for car prices and predictions</li>
              <li><Link size={16} className="inline-block mr-2" />LangChain for AI workflows</li>
              <li><Bot size={16} className="inline-block mr-2" />Ollama for LLM integration</li>
              <li><Bot size={16} className="inline-block mr-2" />Llama 3.2, Meta's state-of-the-art LLM</li>
            </ul>
          </section>

          <section>
            <h3 className="text-xl font-semibold mb-2 flex items-center">
              <Inbox size={20} className="mr-2" /> Contact
            </h3>
            <p className="text-md leading-relaxed">
              Have questions or suggestions? Reach out at <a 
                href="mailto:sangeet1116saha@gmail.com" 
                className={`underline 
                  ${isDarkMode 
                    ? 'text-blue-400 hover:text-blue-300' 
                    : 'text-blue-600 hover:text-blue-700'
                  }`}
              >
                sangeet1116saha@gmail.com
              </a>
            </p>
          </section>
        </div>
      </div>
    </div>
  );
};

export default AboutUs;