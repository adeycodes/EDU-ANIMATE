import React from 'react';
import { Link } from 'react-router-dom';
import { PlayCircle, Check, Users, Zap } from 'lucide-react';

const LandingPage: React.FC = () => {
  return (
    <div className="bg-white">
      {/* Navbar */}
      <nav className="border-b border-slate-100 fixed w-full bg-white/80 backdrop-blur-md z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
             <div className="w-8 h-8 bg-primary-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-lg">E</span>
            </div>
            <span className="font-bold text-xl text-slate-900">EduAnimate</span>
          </div>
          <div className="hidden md:flex gap-8 text-sm font-medium text-slate-600">
            <a href="#features" className="hover:text-primary-600">Features</a>
            <a href="#samples" className="hover:text-primary-600">Samples</a>
            <a href="#pricing" className="hover:text-primary-600">Pricing</a>
          </div>
          <div className="flex gap-4">
            <Link to="/login" className="text-sm font-medium text-slate-600 hover:text-primary-600 py-2">Login</Link>
            <Link to="/signup" className="bg-primary-600 hover:bg-primary-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors">
              Get Started
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <div className="pt-32 pb-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto text-center">
        <span className="inline-block bg-primary-50 text-primary-700 px-4 py-1.5 rounded-full text-sm font-semibold mb-6 border border-primary-100">
          🇳🇬 Built for Nigerian Teachers
        </span>
        <h1 className="text-4xl md:text-6xl font-bold text-slate-900 tracking-tight mb-6">
          Turn Lesson Notes into <br className="hidden md:block"/>
          <span className="text-primary-600">Engaging Videos</span> in Minutes
        </h1>
        <p className="text-lg md:text-xl text-slate-600 max-w-2xl mx-auto mb-10">
          EduAnimate uses AI to convert your text directly into whiteboard animations. 
          Perfect for NERDC curriculum alignment and boosting student engagement.
        </p>
        <div className="flex flex-col sm:flex-row justify-center gap-4">
          <Link to="/signup" className="flex items-center justify-center gap-2 bg-primary-600 hover:bg-primary-700 text-white px-8 py-4 rounded-xl font-bold text-lg transition-all shadow-lg shadow-primary-500/30">
            Start Creating for Free <Zap size={20} />
          </Link>
          <a href="#demo" className="flex items-center justify-center gap-2 bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 px-8 py-4 rounded-xl font-bold text-lg transition-all">
            Watch Demo <PlayCircle size={20} />
          </a>
        </div>
      </div>

      {/* Stats/Social Proof */}
      <div className="border-y border-slate-100 bg-slate-50 py-12">
        <div className="max-w-7xl mx-auto px-4 grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
          {[
            { label: 'Teachers', value: '2,000+' },
            { label: 'Videos Created', value: '15,000+' },
            { label: 'Schools', value: '120+' },
            { label: 'Students Reached', value: '50k+' }
          ].map((stat, i) => (
            <div key={i}>
              <div className="text-3xl font-bold text-slate-900 mb-1">{stat.value}</div>
              <div className="text-sm text-slate-500 font-medium uppercase tracking-wide">{stat.label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Features Grid */}
      <div id="features" className="py-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold text-slate-900 mb-4">Why Nigerian Schools Choose Us</h2>
          <p className="text-slate-600 max-w-2xl mx-auto">Designed specifically for the local context, handling everything from curriculum alignment to local currency.</p>
        </div>
        <div className="grid md:grid-cols-3 gap-8">
          {[
            { icon: Users, title: 'AI Storyboard Artist', desc: 'No design skills needed. Our AI reads your note and draws relevant diagrams automatically.' },
            { icon: Zap, title: 'Low Data Usage', desc: 'Videos are optimized for WhatsApp sharing and slow internet connections.' },
            { icon: Check, title: 'NERDC Aligned', desc: 'Templates structured for Primary 1-6 and JSS/SSS curriculums.' }
          ].map((feat, i) => (
            <div key={i} className="bg-white p-8 rounded-2xl border border-slate-100 shadow-sm hover:shadow-md transition-shadow">
              <div className="w-12 h-12 bg-primary-50 rounded-lg flex items-center justify-center text-primary-600 mb-6">
                <feat.icon size={24} />
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-3">{feat.title}</h3>
              <p className="text-slate-600 leading-relaxed">{feat.desc}</p>
            </div>
          ))}
        </div>
      </div>
      
      {/* Pricing Teaser */}
      <div id="pricing" className="bg-slate-900 text-white py-24 px-4">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-3xl font-bold mb-6">Affordable for Every Teacher</h2>
          <div className="grid md:grid-cols-2 gap-8 mt-12">
            <div className="bg-slate-800 p-8 rounded-2xl border border-slate-700">
              <h3 className="text-xl font-bold mb-2">Free Plan</h3>
              <div className="text-4xl font-bold mb-4">₦0<span className="text-lg text-slate-400 font-normal">/mo</span></div>
              <ul className="text-left space-y-3 mb-8 text-slate-300">
                <li className="flex gap-2"><Check size={18} className="text-primary-500"/> 3 Videos per month</li>
                <li className="flex gap-2"><Check size={18} className="text-primary-500"/> 720p Resolution</li>
                <li className="flex gap-2"><Check size={18} className="text-primary-500"/> Watermarked</li>
              </ul>
              <Link to="/signup" className="block w-full py-3 rounded-lg bg-slate-700 hover:bg-slate-600 transition-colors font-medium">Sign Up Free</Link>
            </div>
            <div className="bg-primary-600 p-8 rounded-2xl border border-primary-500 transform scale-105 shadow-xl">
              <div className="text-xs font-bold uppercase tracking-wider bg-white/20 inline-block px-3 py-1 rounded-full mb-4">Most Popular</div>
              <h3 className="text-xl font-bold mb-2">Teacher Pro</h3>
              <div className="text-4xl font-bold mb-4">₦3,500<span className="text-lg text-primary-200 font-normal">/mo</span></div>
              <ul className="text-left space-y-3 mb-8 text-white">
                <li className="flex gap-2"><Check size={18} /> 20 Videos per month</li>
                <li className="flex gap-2"><Check size={18} /> 1080p HD</li>
                <li className="flex gap-2"><Check size={18} /> No Watermark</li>
              </ul>
              <Link to="/signup" className="block w-full py-3 rounded-lg bg-white text-primary-700 hover:bg-slate-50 transition-colors font-bold">Start Pro Trial</Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LandingPage;