
import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, ShoppingBag, Zap, ShieldCheck } from 'lucide-react';
import Button from '../components/ui/Button';
import Header from '../components/layout/Header';

const HomePage: React.FC = () => {
  return (
    <div className="flex flex-col h-full bg-dark-bg">
      <Header />
      <div className="flex-1 overflow-y-auto">
        {/* Hero Section */}
        <section className="relative flex-1 flex flex-col items-center justify-center px-6 py-20 text-center overflow-hidden min-h-[calc(100vh-64px)]">
          {/* Ambient Background Effects */}
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            <div className="absolute top-[20%] left-[20%] w-[500px] h-[500px] rounded-full bg-primary-purple/20 blur-[100px] animate-pulse-subtle" />
            <div className="absolute bottom-[20%] right-[20%] w-[400px] h-[400px] rounded-full bg-primary-pink/10 blur-[120px]" />
          </div>

          <div className="relative z-10 max-w-4xl mx-auto space-y-10">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-dark-elevated border border-dark-border shadow-lg text-[11px] font-semibold text-text-secondary uppercase tracking-wider">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
              </span>
              New: Agentic Shopping Experience
            </div>

            <h1 className="text-6xl md:text-8xl font-bold tracking-tight text-white leading-[1.1]">
              Shopping,<br />
              <span className="bg-gradient-to-r from-primary-purple via-pink-500 to-primary-pink bg-clip-text text-transparent">Reimagined.</span>
            </h1>

            <p className="text-lg md:text-xl text-text-secondary max-w-2xl mx-auto leading-relaxed font-light">
              Your AI concierge that researches, compares, and finds exactly what you need. <br className="hidden md:block"/> Stop searching, start discovering.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-6">
              <Link to="/chat">
                <Button size="lg" variant="primary" className="h-14 px-10 text-[15px] rounded-full shadow-[0_0_30px_-5px_rgba(99,102,241,0.5)] border border-white/10">
                  Start Shopping <ArrowRight className="ml-2 w-5 h-5" />
                </Button>
              </Link>
            </div>
          </div>
        </section>

        {/* Features Grid */}
        <section className="py-20 px-6 border-t border-dark-border bg-dark-bg/50 backdrop-blur-lg">
          <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
            <FeatureCard 
              icon={<ShoppingBag className="text-white" />}
              title="Deep Research"
              description="Our agents scour the web, reading reviews and specs so you don't have to."
              color="bg-primary-purple"
            />
            <FeatureCard 
              icon={<Zap className="text-white" />}
              title="Instant Comparison"
              description="Get side-by-side comparisons of top products tailored to your preferences."
              color="bg-primary-pink"
            />
            <FeatureCard 
              icon={<ShieldCheck className="text-white" />}
              title="Unbiased"
              description="We don't sell products. We optimize for your happiness, not commissions."
              color="bg-emerald-500"
            />
          </div>
        </section>
      </div>
    </div>
  );
};

const FeatureCard = ({ icon, title, description, color }: { icon: React.ReactNode, title: string, description: string, color: string }) => (
  <div className="p-8 rounded-2xl bg-dark-card border border-dark-border hover:border-dark-border-active hover:bg-dark-elevated transition-all duration-300 group">
    <div className={`w-12 h-12 rounded-xl shadow-lg flex items-center justify-center mb-6 ${color} bg-opacity-90 group-hover:scale-110 transition-transform duration-300`}>
      {icon}
    </div>
    <h3 className="text-xl font-bold text-white mb-3">{title}</h3>
    <p className="text-text-secondary leading-relaxed text-sm font-light">{description}</p>
  </div>
);

export default HomePage;
