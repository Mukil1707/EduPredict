import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { BrainCircuit, Send, Loader2, CheckCircle2, AlertCircle, UserPlus } from 'lucide-react';

const Prediction = () => {
  const [formData, setFormData] = useState({
    student_id: '',
    name: '',
    email: '',
    department: '',
    attendance: '',
    study_hours: '',
    assignment_marks: '',
    previous_exam_marks: ''
  });
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setResult(null);
    setSuccess(false);

    try {
      const response = await fetch('/api/predict', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          attendance: Number(formData.attendance),
          study_hours: Number(formData.study_hours),
          assignment_marks: Number(formData.assignment_marks),
          previous_exam_marks: Number(formData.previous_exam_marks)
        }),
      });
      const data = await response.json();
      
      if (response.ok) {
        // Artificial delay for effect
        setTimeout(() => {
          setResult(data);
          setLoading(false);
          setSuccess(true);
          // Clear form for next entry
          setFormData({
            student_id: '',
            name: '',
            email: '',
            department: '',
            attendance: '',
            study_hours: '',
            assignment_marks: '',
            previous_exam_marks: ''
          });
        }, 1000);
      } else {
        alert(data.error || 'Prediction failed');
        setLoading(false);
      }
    } catch (error) {
      console.error('Prediction failed');
      setLoading(false);
    }
  };

  return (
    <div className="p-12 ml-80 min-h-screen">
      <div className="max-w-7xl mx-auto">
        <div className="mb-16">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
          >
            <h1 className="text-6xl font-black tracking-tighter mb-4 gradient-text">
              Performance Prediction
            </h1>
            <p className="text-slate-500 text-lg font-medium">Input student metrics to generate data-driven academic forecasts.</p>
          </motion.div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          {/* Input Form */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="lg:col-span-7 glass-card p-12"
          >
            <form onSubmit={handleSubmit} className="space-y-10">
              <div className="grid grid-cols-2 gap-8">
                <div className="space-y-3">
                  <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 ml-1">Student ID</label>
                  <input
                    type="text"
                    required
                    className="input-field"
                    placeholder="e.g. STU001"
                    value={formData.student_id}
                    onChange={(e) => setFormData({...formData, student_id: e.target.value})}
                  />
                </div>
                <div className="space-y-3">
                  <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 ml-1">Full Name</label>
                  <input
                    type="text"
                    required
                    className="input-field"
                    placeholder="e.g. John Doe"
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-8">
                <div className="space-y-3">
                  <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 ml-1">Email Address</label>
                  <input
                    type="email"
                    className="input-field"
                    placeholder="john@example.com"
                    value={formData.email}
                    onChange={(e) => setFormData({...formData, email: e.target.value})}
                  />
                </div>
                <div className="space-y-3">
                  <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 ml-1">Department</label>
                  <input
                    type="text"
                    className="input-field"
                    placeholder="e.g. Computer Science"
                    value={formData.department}
                    onChange={(e) => setFormData({...formData, department: e.target.value})}
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-8">
                <div className="space-y-3">
                  <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 ml-1">Attendance (%)</label>
                  <input
                    type="number"
                    required
                    min="0"
                    max="100"
                    className="input-field"
                    placeholder="0-100"
                    value={formData.attendance}
                    onChange={(e) => setFormData({...formData, attendance: e.target.value})}
                  />
                </div>
                <div className="space-y-3">
                  <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 ml-1">Daily Study Hours</label>
                  <input
                    type="number"
                    required
                    min="0"
                    max="24"
                    step="0.5"
                    className="input-field"
                    placeholder="e.g. 4.5"
                    value={formData.study_hours}
                    onChange={(e) => setFormData({...formData, study_hours: e.target.value})}
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-8">
                <div className="space-y-3">
                  <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 ml-1">Assignment Marks</label>
                  <input
                    type="number"
                    required
                    min="0"
                    max="100"
                    className="input-field"
                    placeholder="0-100"
                    value={formData.assignment_marks}
                    onChange={(e) => setFormData({...formData, assignment_marks: e.target.value})}
                  />
                </div>
                <div className="space-y-3">
                  <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 ml-1">Prev. Exam Marks</label>
                  <input
                    type="number"
                    required
                    min="0"
                    max="100"
                    className="input-field"
                    placeholder="0-100"
                    value={formData.previous_exam_marks}
                    onChange={(e) => setFormData({...formData, previous_exam_marks: e.target.value})}
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="btn-primary w-full flex items-center justify-center gap-3 py-5"
              >
                {loading ? (
                  <>
                    <Loader2 className="animate-spin" size={20} />
                    Processing...
                  </>
                ) : (
                  <>
                    <UserPlus size={20} />
                    Add Student
                  </>
                )}
              </button>
            </form>
          </motion.div>

          {/* Results Section */}
          <div className="lg:col-span-5 relative">
            <AnimatePresence mode="wait">
              {!result && !loading && (
                <motion.div
                  key="placeholder"
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 1.05 }}
                  className="h-full flex flex-col items-center justify-center text-center p-12 glass-card border-dashed border-white/10"
                >
                  <div className="w-24 h-24 rounded-full bg-slate-900 flex items-center justify-center text-slate-700 mb-8 border border-white/5 shadow-inner">
                    <BrainCircuit size={48} />
                  </div>
                  <h3 className="text-3xl font-black mb-4 tracking-tight text-white">Ready to Predict</h3>
                  <p className="text-slate-500 leading-relaxed font-medium">
                    Fill in the student data on the left to see the generated performance forecast.
                  </p>
                </motion.div>
              )}

              {loading && (
                <motion.div
                  key="loading"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="h-full flex flex-col items-center justify-center text-center p-12 glass-card"
                >
                  <div className="relative w-32 h-32 mb-10">
                    <div className="absolute inset-0 border-2 border-white/5 rounded-full" />
                    <div className="absolute inset-0 border-2 border-amber-500 border-t-transparent rounded-full animate-spin" />
                    <BrainCircuit className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-amber-500" size={40} />
                  </div>
                  <h3 className="text-3xl font-black mb-4 tracking-tight text-white">Analyzing Data</h3>
                  <p className="text-slate-500 leading-relaxed font-medium">Our model is processing metrics and historical patterns...</p>
                </motion.div>
              )}

              {result && (
                <motion.div
                  key="result"
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="glass-card p-12 h-full flex flex-col relative overflow-hidden group"
                >
                  <div className="absolute top-0 right-0 p-8">
                    <div className="w-16 h-16 rounded-2xl bg-amber-500/10 flex items-center justify-center text-amber-500 animate-pulse">
                      <CheckCircle2 size={32} />
                    </div>
                  </div>

                  <div className="mb-12">
                    <h3 className="text-4xl font-black tracking-tighter mb-2 text-white">Analysis Result</h3>
                    <p className="text-amber-500/60 text-[10px] font-black uppercase tracking-widest">Student ID: {result.student_id || 'STU-NEW'}</p>
                  </div>

                  <div className="flex-1 flex flex-col items-center justify-center">
                    <div className="relative w-64 h-64 mb-12">
                      <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
                        <circle
                          className="text-slate-900 stroke-current"
                          strokeWidth="4"
                          cx="50"
                          cy="50"
                          r="45"
                          fill="transparent"
                        />
                        <motion.circle
                          cx="50"
                          cy="50"
                          r="45"
                          fill="transparent"
                          initial={{ strokeDasharray: "0 282.7" }}
                          animate={{ strokeDasharray: `${(result.predicted_score / 100) * 282.7} 282.7` }}
                          transition={{ duration: 2, ease: "circOut" }}
                          className="text-amber-500 stroke-current stroke-[4] stroke-linecap-round drop-shadow-[0_0_10px_rgba(251,191,36,0.5)]"
                        />
                      </svg>
                      <div className="absolute inset-0 flex flex-col items-center justify-center">
                        <span className="text-6xl font-black tracking-tighter text-white">{Math.round(result.predicted_score)}%</span>
                        <span className="text-[10px] text-amber-500/60 uppercase tracking-widest font-black mt-2">Predicted Score</span>
                      </div>
                    </div>

                    <div className="w-full space-y-6">
                      <div className="p-8 rounded-[2rem] bg-slate-950/50 border border-white/5 shadow-inner">
                        <div className="flex justify-between text-[10px] font-black uppercase tracking-widest mb-4">
                          <span className="text-slate-500">Risk Assessment</span>
                          <span className={`${
                            result.risk_level === 'Low' ? 'text-emerald-400' :
                            result.risk_level === 'Medium' ? 'text-amber-400' :
                            'text-red-400'
                          }`}>{result.risk_level} Risk</span>
                        </div>
                        <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden">
                          <motion.div 
                            initial={{ width: 0 }}
                            animate={{ width: result.risk_level === 'Low' ? '33%' : result.risk_level === 'Medium' ? '66%' : '100%' }}
                            className={`h-full ${
                              result.risk_level === 'Low' ? 'bg-emerald-500' :
                              result.risk_level === 'Medium' ? 'bg-amber-500' :
                              'bg-red-500'
                            }`}
                          />
                        </div>
                      </div>
                      
                      <p className="text-sm text-slate-500 text-center leading-relaxed px-4 font-medium italic">
                        "Based on current metrics, this student is likely to achieve a {result.predicted_score}% overall score. 
                        {result.risk_level === 'High' ? ' Immediate academic intervention is recommended.' : ' Continue current monitoring schedule.'}"
                      </p>
                    </div>
                  </div>

                  <button 
                    onClick={() => setResult(null)}
                    className="mt-12 text-[10px] font-black uppercase tracking-widest text-slate-600 hover:text-amber-500 transition-all hover:tracking-[0.2em]"
                  >
                    Clear Result
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* Session Entries Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-20 glass-card p-12"
        >
          <div className="flex justify-between items-center mb-10">
            <div>
              <h3 className="text-2xl font-bold tracking-tight mb-2 text-white">Session Activity</h3>
              <p className="text-slate-500 text-sm">Records added or updated during this active session.</p>
            </div>
          </div>
          <div className="space-y-4">
            {result ? (
              <div className="flex items-center justify-between p-6 rounded-2xl bg-slate-900/50 border border-amber-500/10">
                <div className="flex items-center gap-6">
                  <div className="w-12 h-12 rounded-2xl bg-amber-500/10 flex items-center justify-center text-amber-500">
                    <CheckCircle2 size={24} />
                  </div>
                  <div>
                    <h4 className="font-bold text-white">Latest Record Processed</h4>
                    <p className="text-xs text-amber-500/60 uppercase tracking-widest font-bold mt-1">Database Sync Complete</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-2xl font-bold tracking-tighter text-white">{Math.round(result.predicted_score)}%</p>
                  <p className="text-[10px] text-amber-500/60 uppercase tracking-widest font-bold">Forecast</p>
                </div>
              </div>
            ) : (
              <div className="text-center py-16 text-slate-700 uppercase tracking-widest text-[10px] font-bold border border-dashed border-slate-900 rounded-3xl">
                No session activity recorded.
              </div>
            )}
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Prediction;
