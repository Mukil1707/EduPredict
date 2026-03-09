import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Download, Filter, Search, FileDown, Trash2, Plus, X, UserPlus, Loader2, CheckCircle2 } from 'lucide-react';

const Reports = () => {
  const [students, setStudents] = useState([]);
  const [filter, setFilter] = useState('All');
  const [search, setSearch] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState(false);
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

  const fetchStudents = async () => {
    const res = await fetch('/api/students');
    const data = await res.json();
    setStudents(data);
  };

  useEffect(() => {
    fetchStudents();
  }, []);

  const filteredStudents = students.filter(s => {
    const matchesFilter = filter === 'All' || s.risk_level === filter;
    const matchesSearch = 
      s.name.toLowerCase().includes(search.toLowerCase()) || 
      s.student_id.toLowerCase().includes(search.toLowerCase()) ||
      (s.department && s.department.toLowerCase().includes(search.toLowerCase()));
    return matchesFilter && matchesSearch;
  });

  const handleDownload = () => {
    const csvContent = "data:text/csv;charset=utf-8," 
      + "Student ID,Name,Email,Department,Attendance,Study Hours,Assignment Marks,Prev Exam,Predicted Score,Risk Level\n"
      + filteredStudents.map(s => `${s.student_id},${s.name},${s.email || ''},${s.department || ''},${s.attendance},${s.study_hours},${s.assignment_marks},${s.previous_exam_marks},${s.predicted_score},${s.risk_level}`).join("\n");
    
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "student_report.csv");
    document.body.appendChild(link);
    link.click();
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this record?')) {
      try {
        const response = await fetch(`/api/students/${id}`, { method: 'DELETE' });
        if (response.ok) {
          setStudents(students.filter(s => s.id !== id));
        }
      } catch (error) {
        console.error('Delete failed');
      }
    }
  };

  const handleClearAll = async () => {
    if (window.confirm('CRITICAL: This will permanently delete ALL student records. Are you sure?')) {
      try {
        const response = await fetch('/api/students/all', { method: 'DELETE' });
        if (response.ok) {
          setStudents([]);
        }
      } catch (error) {
        console.error('Clear all failed');
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

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
        await fetchStudents();
        setIsModalOpen(false);
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
      } else {
        alert(data.error || 'Failed to add student');
      }
    } catch (error) {
      console.error('Add failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-12 ml-80 min-h-screen">
      <div className="max-w-7xl mx-auto">
        <div className="mb-16 flex justify-between items-end">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
          >
            <h1 className="text-6xl font-black tracking-tighter mb-4 gradient-text">
              Student Records
            </h1>
            <p className="text-slate-500 text-lg font-medium">Comprehensive academic database with advanced filtering.</p>
          </motion.div>
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="flex gap-4"
          >
            <button 
              onClick={handleDownload}
              className="btn-secondary flex items-center gap-3"
            >
              <Download size={20} />
              <span>Export CSV</span>
            </button>
            <button 
              onClick={() => setIsModalOpen(true)}
              className="btn-primary flex items-center gap-3"
            >
              <Plus size={20} />
              <span>Add Student</span>
            </button>
          </motion.div>
        </div>

        {/* Filters Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="glass-card p-10 mb-12"
        >
          <div className="flex flex-col md:flex-row gap-8 items-center justify-between">
            <div className="flex gap-3 p-2 rounded-2xl bg-slate-950/50 border border-white/5">
              {['All', 'Low', 'Medium', 'High'].map((f) => (
                <button
                  key={f}
                  onClick={() => setFilter(f)}
                  className={`px-8 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${
                    filter === f 
                      ? 'bg-amber-500 text-slate-950 shadow-lg shadow-amber-500/20' 
                      : 'text-slate-500 hover:text-slate-200'
                  }`}
                >
                  {f} Risk
                </button>
              ))}
            </div>
            
            <div className="relative w-full md:w-96 group">
              <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-600 group-focus-within:text-amber-500 transition-colors" size={20} />
              <input
                type="text"
                placeholder="Search by name, ID, or department..."
                className="input-field pl-16"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
            <button 
              onClick={handleClearAll}
              className="p-4 rounded-2xl bg-red-500/5 border border-red-500/10 text-red-500 hover:bg-red-500/10 transition-all"
              title="Clear All Data"
            >
              <Trash2 size={24} />
            </button>
          </div>
        </motion.div>

        {/* Table Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="glass-card overflow-hidden"
        >
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead className="bg-slate-900/50 text-slate-500 text-[10px] uppercase tracking-widest font-black">
                <tr>
                  <th className="px-10 py-8">Student ID</th>
                  <th className="px-10 py-8">Name & Email</th>
                  <th className="px-10 py-8">Department</th>
                  <th className="px-10 py-8">Attendance</th>
                  <th className="px-10 py-8">Score</th>
                  <th className="px-10 py-8">Risk</th>
                  <th className="px-10 py-8 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {filteredStudents.map((student, i) => (
                  <motion.tr 
                    key={student.id}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.4 + (i * 0.05) }}
                    className="hover:bg-slate-900/30 transition-colors group"
                  >
                    <td className="px-10 py-8 font-mono text-[10px] text-amber-500/60 group-hover:text-amber-400 transition-colors">
                      {student.student_id}
                    </td>
                    <td className="px-10 py-8">
                      <div>
                        <p className="font-black text-sm text-white group-hover:text-amber-400 transition-colors">{student.name}</p>
                        <p className="text-[10px] text-slate-500 mt-1 font-medium">{student.email || 'no-email@edu.com'}</p>
                      </div>
                    </td>
                    <td className="px-10 py-8">
                      <span className="text-xs font-bold text-slate-400">{student.department || 'General'}</span>
                    </td>
                    <td className="px-10 py-8 text-sm text-slate-400 font-bold">{student.attendance}%</td>
                    <td className="px-10 py-8">
                      <div className="flex items-center gap-4">
                        <div className="w-24 h-1.5 bg-slate-900 rounded-full overflow-hidden">
                          <motion.div 
                            initial={{ width: 0 }}
                            animate={{ width: `${student.predicted_score}%` }}
                            className="h-full bg-amber-500 drop-shadow-[0_0_5px_rgba(251,191,36,0.5)]" 
                          />
                        </div>
                        <span className="text-sm font-black text-white">{Math.round(student.predicted_score)}%</span>
                      </div>
                    </td>
                    <td className="px-10 py-8">
                      <span className={`px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest border ${
                        student.risk_level === 'Low' ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' :
                        student.risk_level === 'Medium' ? 'bg-amber-500/10 text-amber-400 border-amber-500/20' :
                        'bg-red-500/10 text-red-400 border-red-500/20'
                      }`}>
                        {student.risk_level}
                      </span>
                    </td>
                    <td className="px-10 py-8 text-right">
                      <button 
                        onClick={() => handleDelete(student.id)}
                        className="p-3 rounded-xl bg-red-500/5 text-red-500/40 hover:text-red-500 hover:bg-red-500/10 transition-all"
                      >
                        <Trash2 size={18} />
                      </button>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
            {filteredStudents.length === 0 && (
              <div className="py-32 text-center">
                <div className="w-20 h-20 rounded-full bg-slate-900 flex items-center justify-center text-slate-700 mx-auto mb-6 border border-white/5 shadow-inner">
                  <Search size={32} />
                </div>
                <p className="text-slate-500 uppercase tracking-widest text-[10px] font-black">No students found matching your criteria</p>
              </div>
            )}
          </div>
        </motion.div>
      </div>

      {/* Add Student Modal */}
      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsModalOpen(false)}
              className="absolute inset-0 bg-slate-950/80 backdrop-blur-sm"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative w-full max-w-2xl glass-card p-12 overflow-y-auto max-h-[90vh]"
            >
              <div className="flex justify-between items-center mb-10">
                <h2 className="text-3xl font-bold tracking-tighter text-white">Add New Student</h2>
                <button onClick={() => setIsModalOpen(false)} className="text-slate-500 hover:text-white transition-colors">
                  <X size={24} />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-8">
                <div className="grid grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold uppercase tracking-widest text-slate-500">Student ID</label>
                    <input
                      type="text"
                      required
                      className="input-field"
                      placeholder="e.g. STU001"
                      value={formData.student_id}
                      onChange={(e) => setFormData({...formData, student_id: e.target.value})}
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold uppercase tracking-widest text-slate-500">Full Name</label>
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

                <div className="grid grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold uppercase tracking-widest text-slate-500">Email Address</label>
                    <input
                      type="email"
                      className="input-field"
                      placeholder="john@example.com"
                      value={formData.email}
                      onChange={(e) => setFormData({...formData, email: e.target.value})}
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold uppercase tracking-widest text-slate-500">Department</label>
                    <input
                      type="text"
                      className="input-field"
                      placeholder="e.g. Computer Science"
                      value={formData.department}
                      onChange={(e) => setFormData({...formData, department: e.target.value})}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold uppercase tracking-widest text-slate-500">Attendance (%)</label>
                    <input
                      type="number"
                      required
                      min="0"
                      max="100"
                      className="input-field"
                      value={formData.attendance}
                      onChange={(e) => setFormData({...formData, attendance: e.target.value})}
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold uppercase tracking-widest text-slate-500">Daily Study Hours</label>
                    <input
                      type="number"
                      required
                      min="0"
                      max="24"
                      step="0.5"
                      className="input-field"
                      value={formData.study_hours}
                      onChange={(e) => setFormData({...formData, study_hours: e.target.value})}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold uppercase tracking-widest text-slate-500">Assignment Marks</label>
                    <input
                      type="number"
                      required
                      min="0"
                      max="100"
                      className="input-field"
                      value={formData.assignment_marks}
                      onChange={(e) => setFormData({...formData, assignment_marks: e.target.value})}
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold uppercase tracking-widest text-slate-500">Prev. Exam Marks</label>
                    <input
                      type="number"
                      required
                      min="0"
                      max="100"
                      className="input-field"
                      value={formData.previous_exam_marks}
                      onChange={(e) => setFormData({...formData, previous_exam_marks: e.target.value})}
                    />
                  </div>
                </div>

                <div className="flex gap-4 pt-4">
                  <button
                    type="button"
                    onClick={() => setIsModalOpen(false)}
                    className="btn-secondary flex-1"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={loading}
                    className="btn-primary flex-1 flex items-center justify-center gap-2"
                  >
                    {loading ? <Loader2 className="animate-spin" size={20} /> : <Plus size={20} />}
                    Add Student
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Reports;
