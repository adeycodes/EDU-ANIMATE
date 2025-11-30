import React, { useState } from 'react';
import { Subject, GradeLevel, LessonAnalysis, Scene } from '../types';
import { analyzeLesson, generateScenes } from '../services/geminiService';
import { Loader2, ArrowRight, Wand2, CheckCircle, Video, AlertCircle } from 'lucide-react';
import CanvasRenderer from '../components/CanvasRenderer';

const CreateVideo: React.FC = () => {
  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  // Step 1 Data
  const [subject, setSubject] = useState<Subject>(Subject.Mathematics);
  const [grade, setGrade] = useState<GradeLevel>(GradeLevel.JSS1);
  const [lessonText, setLessonText] = useState('');

  // Step 2 Data
  const [analysis, setAnalysis] = useState<LessonAnalysis | null>(null);
  const [scenes, setScenes] = useState<Scene[]>([]);
  
  // Step 3 Data
  const [currentSceneIdx, setCurrentSceneIdx] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);

  const handleAnalysis = async () => {
    if (!lessonText.trim()) return;
    setLoading(true);
    setError(null);
    try {
      const result = await analyzeLesson(lessonText, subject, grade);
      setAnalysis(result);
      
      // Chain scene generation
      const generatedScenes = await generateScenes(result, lessonText);
      setScenes(generatedScenes);
      
      setStep(2);
    } catch (err) {
      setError("Failed to analyze lesson. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleSceneComplete = () => {
    if (currentSceneIdx < scenes.length - 1) {
      // Auto advance after short delay
      setTimeout(() => {
        setCurrentSceneIdx(prev => prev + 1);
        setIsPlaying(true); // Keep playing next scene
      }, 500);
    } else {
      setIsPlaying(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6 pb-20">
      {/* Header Stepper */}
      <div className="flex items-center justify-between mb-8">
        {[1, 2, 3].map((s) => (
          <div key={s} className="flex items-center gap-2">
            <div className={`
              w-8 h-8 rounded-full flex items-center justify-center font-bold
              ${step === s ? 'bg-primary-600 text-white' : step > s ? 'bg-green-500 text-white' : 'bg-slate-200 text-slate-500'}
            `}>
              {step > s ? <CheckCircle size={16} /> : s}
            </div>
            <span className={`text-sm font-medium hidden md:block ${step === s ? 'text-primary-700' : 'text-slate-500'}`}>
              {s === 1 ? 'Lesson Details' : s === 2 ? 'Review Storyboard' : 'Final Preview'}
            </span>
            {s < 3 && <div className="w-12 h-1 bg-slate-200 mx-2 hidden md:block"></div>}
          </div>
        ))}
      </div>

      {error && (
        <div className="bg-red-50 text-red-700 p-4 rounded-lg flex items-center gap-2">
          <AlertCircle size={20} />
          {error}
        </div>
      )}

      {/* STEP 1: INPUT */}
      {step === 1 && (
        <div className="bg-white p-6 md:p-8 rounded-xl border border-slate-200 shadow-sm space-y-6">
          <div>
            <h2 className="text-xl font-bold text-slate-900 mb-1">Create New Video Lesson</h2>
            <p className="text-slate-500 text-sm">Paste your lesson notes below. AI will do the rest.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Subject</label>
              <select 
                className="w-full rounded-lg border-slate-300 border p-2 focus:ring-2 focus:ring-primary-500 outline-none"
                value={subject}
                onChange={(e) => setSubject(e.target.value as Subject)}
              >
                {Object.values(Subject).map(s => <option key={s} value={s}>{s}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Grade Level</label>
              <select 
                className="w-full rounded-lg border-slate-300 border p-2 focus:ring-2 focus:ring-primary-500 outline-none"
                value={grade}
                onChange={(e) => setGrade(e.target.value as GradeLevel)}
              >
                {Object.values(GradeLevel).map(g => <option key={g} value={g}>{g}</option>)}
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Lesson Content / Notes</label>
            <textarea 
              className="w-full h-64 rounded-lg border-slate-300 border p-4 focus:ring-2 focus:ring-primary-500 outline-none resize-none font-mono text-sm"
              placeholder="Paste your lesson text here. E.g. 'Photosynthesis is the process by which plants use sunlight...'"
              value={lessonText}
              onChange={(e) => setLessonText(e.target.value)}
            ></textarea>
            <p className="text-xs text-slate-400 mt-2 text-right">{lessonText.length} chars</p>
          </div>

          <div className="flex justify-end pt-4">
            <button 
              onClick={handleAnalysis}
              disabled={loading || !lessonText}
              className="bg-primary-600 hover:bg-primary-700 disabled:opacity-50 disabled:cursor-not-allowed text-white px-6 py-3 rounded-lg font-medium flex items-center gap-2 transition-all"
            >
              {loading ? <Loader2 className="animate-spin" size={20} /> : <Wand2 size={20} />}
              {loading ? 'Analyzing with AI...' : 'Generate Magic'}
            </button>
          </div>
        </div>
      )}

      {/* STEP 2: STORYBOARD REVIEW */}
      {step === 2 && analysis && (
        <div className="space-y-6">
          <div className="bg-blue-50 border border-blue-100 p-6 rounded-xl">
            <h3 className="font-bold text-blue-900 mb-2">Lesson Analysis</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              <p><span className="font-semibold text-blue-700">Topic:</span> {analysis.mainTopic}</p>
              <p><span className="font-semibold text-blue-700">Duration:</span> ~{Math.ceil(analysis.estimatedDuration / 60)} mins</p>
              <p><span className="font-semibold text-blue-700">Difficulty:</span> <span className="capitalize">{analysis.difficulty}</span></p>
              <p><span className="font-semibold text-blue-700">Key Concepts:</span> {analysis.keyConcepts.join(', ')}</p>
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="font-bold text-lg text-slate-800 px-1">Generated Scenes ({scenes.length})</h3>
            {scenes.map((scene, idx) => (
              <div key={idx} className="bg-white p-4 rounded-lg border border-slate-200 shadow-sm flex flex-col md:flex-row gap-4">
                <div className="w-full md:w-16 h-16 bg-slate-100 rounded-lg flex items-center justify-center text-slate-400 font-bold text-xl flex-shrink-0">
                  {idx + 1}
                </div>
                <div className="flex-1 space-y-2">
                  <div className="flex justify-between items-start">
                    <h4 className="font-bold text-slate-800">{scene.title}</h4>
                    <span className="text-xs bg-slate-100 px-2 py-1 rounded text-slate-500">{scene.duration}s</span>
                  </div>
                  <p className="text-sm text-slate-600"><span className="font-semibold text-slate-700">Visuals:</span> {scene.visualDescription}</p>
                  <p className="text-sm text-slate-600 italic bg-amber-50 p-2 rounded border border-amber-100">
                    "<span className="font-semibold text-amber-800">Narrator:</span> {scene.narrationScript}"
                  </p>
                </div>
              </div>
            ))}
          </div>

          <div className="flex justify-between pt-4">
            <button onClick={() => setStep(1)} className="text-slate-500 hover:text-slate-700 font-medium">Back</button>
            <button 
              onClick={() => setStep(3)}
              className="bg-primary-600 hover:bg-primary-700 text-white px-8 py-3 rounded-lg font-medium flex items-center gap-2 shadow-lg shadow-primary-500/30"
            >
              Render Video <Video size={20} />
            </button>
          </div>
        </div>
      )}

      {/* STEP 3: PREVIEW */}
      {step === 3 && scenes.length > 0 && (
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
          <div className="aspect-video bg-black rounded-lg overflow-hidden relative mb-4">
            <CanvasRenderer 
              scene={scenes[currentSceneIdx]} 
              isPlaying={isPlaying} 
              onComplete={handleSceneComplete}
            />
            {/* Overlay Controls */}
            {!isPlaying && (
              <div className="absolute inset-0 flex items-center justify-center bg-black/20">
                <button 
                  onClick={() => setIsPlaying(true)}
                  className="w-16 h-16 bg-white/90 rounded-full flex items-center justify-center text-primary-600 hover:scale-105 transition-transform shadow-xl"
                >
                  <Video size={32} fill="currentColor" />
                </button>
              </div>
            )}
            <div className="absolute bottom-4 right-4 bg-black/70 text-white text-xs px-2 py-1 rounded">
              Scene {currentSceneIdx + 1} / {scenes.length}
            </div>
          </div>

          <div className="flex items-center justify-between">
             <div className="space-y-1">
               <h3 className="font-bold text-lg">{scenes[currentSceneIdx].title}</h3>
               <p className="text-sm text-slate-500">Playing scene {currentSceneIdx + 1} of {scenes.length}</p>
             </div>
             <div className="flex gap-2">
               <button 
                 onClick={() => setIsPlaying(!isPlaying)}
                 className="px-4 py-2 bg-slate-100 hover:bg-slate-200 rounded-lg text-sm font-medium"
               >
                 {isPlaying ? 'Pause' : 'Play'}
               </button>
               <button className="px-4 py-2 bg-primary-600 hover:bg-primary-700 text-white rounded-lg text-sm font-medium">
                 Download MP4
               </button>
             </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CreateVideo;