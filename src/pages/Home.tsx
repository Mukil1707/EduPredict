import React from 'react';
import { motion } from 'motion/react';
import { Link } from 'react-router-dom';
import { Brain, TrendingUp, ShieldCheck, Zap, ChevronRight } from 'lucide-react';

const Home = () => {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative h-screen flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(56,189,248,0.1),transparent_50%)]" />
        <div className="absolute top-0 left-0 w-full h-full bg-slate-950 -z-10" />
        
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center px-6 relative z-10"
        >
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.5 }}
            className="inline-block px-4 py-1.5 mb-6 rounded-full bg-white/5 border border-white/10 text-cyan-400 text-sm font-medium"
          >
            Empowering Education with Data
          </motion.div>
          <h1 className="text-6xl md:text-8xl font-bold mb-6 tracking-tight">
            Predict Student <br />
            <span className="gradient-text">Success Early</span>
          </h1>
          <p className="text-xl text-slate-400 max-w-2xl mx-auto mb-10">
            A professional monitoring system using advanced predictive modeling to identify 
            at-risk students and optimize academic outcomes.
          </p>
          <div className="flex gap-4 justify-center">
            <Link to="/login" className="btn-primary flex items-center gap-2">
              Launch Dashboard <ChevronRight size={20} />
            </Link>
            <a href="#features" className="px-6 py-3 rounded-xl border border-white/10 hover:bg-white/5 transition-all font-semibold">
              Learn More
            </a>
          </div>
        </motion.div>

        {/* Floating Elements */}
        <motion.div
          animate={{ y: [0, -20, 0] }}
          transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
          className="absolute top-1/4 left-1/4 w-64 h-64 bg-purple-500/10 blur-[100px] rounded-full"
        />
        <motion.div
          animate={{ y: [0, 20, 0] }}
          transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
          className="absolute bottom-1/4 right-1/4 w-64 h-64 bg-cyan-500/10 blur-[100px] rounded-full"
        />
      </section>

      {/* Features Section */}
      <section id="features" className="py-24 px-6 max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold mb-4">Powerful Features</h2>
          <p className="text-slate-400">Everything you need to monitor and improve student performance.</p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {[
            { icon: Brain, title: "Performance Prediction", desc: "Advanced algorithms to predict final grades based on current performance." },
            { icon: TrendingUp, title: "Real-time Monitoring", desc: "Track attendance and assignment marks with interactive visualizations." },
            { icon: ShieldCheck, title: "Risk Detection", desc: "Automatically identify students who need immediate intervention." },
            { icon: Zap, title: "Instant Reports", desc: "Generate comprehensive performance reports with a single click." }
          ].map((feature, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="glass-card p-8 hover:border-cyan-500/50 transition-all group"
            >
              <div className="w-12 h-12 rounded-lg bg-cyan-500/10 flex items-center justify-center text-cyan-400 mb-6 group-hover:scale-110 transition-transform">
                <feature.icon size={24} />
              </div>
              <h3 className="text-xl font-bold mb-3">{feature.title}</h3>
              <p className="text-slate-400 text-sm leading-relaxed">{feature.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>
    </div>
  );
};

export default Home;
