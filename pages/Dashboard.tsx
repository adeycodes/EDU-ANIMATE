import React from 'react';
import { useAuth } from '../contexts/AuthContext';
import { PlusCircle, Video, Clock, Award } from 'lucide-react';
import { Link } from 'react-router-dom';

const Dashboard: React.FC = () => {
  const { user } = useAuth();

  const stats = [
    { label: 'Videos Created', value: '12', icon: Video, color: 'text-blue-600', bg: 'bg-blue-50' },
    { label: 'Free Credits', value: '3', icon: Award, color: 'text-amber-600', bg: 'bg-amber-50' },
    { label: 'Total Duration', value: '45m', icon: Clock, color: 'text-purple-600', bg: 'bg-purple-50' },
  ];

  const recentVideos = [
    { id: '1', title: 'Intro to Geometry', subject: 'Mathematics', date: '2 days ago', views: 45 },
    { id: '2', title: 'Basic Science: Living Things', subject: 'Basic Science', date: '5 days ago', views: 120 },
    { id: '3', title: 'Parts of Speech', subject: 'English', date: '1 week ago', views: 89 },
  ];

  return (
    <div className="space-y-8">
      {/* Welcome Section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">
            Welcome back, {user?.name.split(' ')[0]}! 👋
          </h1>
          <p className="text-slate-600 mt-1">Ready to create your next lesson?</p>
        </div>
        <Link 
          to="/create"
          className="flex items-center justify-center gap-2 bg-primary-600 hover:bg-primary-700 text-white px-6 py-3 rounded-lg font-medium transition-colors shadow-sm"
        >
          <PlusCircle size={20} />
          Create New Video
        </Link>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {stats.map((stat, idx) => (
          <div key={idx} className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm flex items-center gap-4">
            <div className={`p-4 rounded-full ${stat.bg}`}>
              <stat.icon className={stat.color} size={24} />
            </div>
            <div>
              <p className="text-sm font-medium text-slate-500">{stat.label}</p>
              <h3 className="text-2xl font-bold text-slate-900">{stat.value}</h3>
            </div>
          </div>
        ))}
      </div>

      {/* Recent Videos */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="p-6 border-b border-slate-100 flex items-center justify-between">
          <h2 className="text-lg font-bold text-slate-900">Recent Videos</h2>
          <Link to="/videos" className="text-sm text-primary-600 font-medium hover:underline">View All</Link>
        </div>
        <div className="divide-y divide-slate-100">
          {recentVideos.map((video) => (
            <div key={video.id} className="p-4 flex items-center justify-between hover:bg-slate-50 transition-colors">
              <div className="flex items-center gap-4">
                <div className="w-16 h-10 bg-slate-200 rounded-md flex-shrink-0"></div>
                <div>
                  <h4 className="font-medium text-slate-900">{video.title}</h4>
                  <p className="text-xs text-slate-500">{video.subject} • {video.date}</p>
                </div>
              </div>
              <div className="text-sm text-slate-600">
                {video.views} views
              </div>
            </div>
          ))}
        </div>
      </div>
      
      {/* Quick Tips */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-800 rounded-xl p-6 text-white shadow-lg">
        <h3 className="font-bold text-lg mb-2">💡 Teaching Tip</h3>
        <p className="text-blue-100">
          Did you know? Breaking down complex topics into 2-minute videos improves student retention by 40%. Try using the "JSS 2 Math" template for your next Algebra class.
        </p>
      </div>
    </div>
  );
};

export default Dashboard;