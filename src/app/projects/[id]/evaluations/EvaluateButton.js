'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { evaluateProposals } from '@/lib/actions/evaluate';
import { Zap, Users, Brain, Target, BarChart3, Sparkles, CheckCircle2 } from 'lucide-react';
import { toast } from 'sonner';

const PHASES = [
  { icon: Users, label: 'Scanning applicant profiles', detail: 'Reading skills, portfolios & track records...', duration: 1800 },
  { icon: Brain, label: 'Deep-analyzing proposals', detail: 'Parsing cover letters for clarity & intent...', duration: 2000 },
  { icon: Target, label: 'Matching skills to requirements', detail: 'Cross-referencing project needs with candidate abilities...', duration: 1800 },
  { icon: BarChart3, label: 'Scoring & ranking candidates', detail: 'Computing weighted composite scores...', duration: 1600 },
  { icon: Sparkles, label: 'Generating AI insights', detail: 'Summarizing recommendations for each applicant...', duration: 1200 },
];

const MIN_ANIMATION_MS = 4500;

/* Subtle floating dots using only the design palette */
function FloatingDots() {
  const canvasRef = useRef(null);
  const animRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const dpr = window.devicePixelRatio || 1;
    const parent = canvas.parentElement;

    const resize = () => {
      const rect = parent.getBoundingClientRect();
      canvas.width = rect.width * dpr;
      canvas.height = rect.height * dpr;
      canvas.style.width = `${rect.width}px`;
      canvas.style.height = `${rect.height}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    resize();

    // Palette-safe colors (all from DESIGN.md)
    const colors = [
      [90, 130, 222],  // #5a82de — secondary
      [208, 72, 65],   // #d04841 — primary
      [203, 244, 201], // #cbf4c9 — green badge
      [206, 222, 253], // #cedefd — blue badge
      [239, 221, 253], // #efddfd — purple badge
    ];

    const nodes = [];
    const nodeCount = 30;
    const rect = parent.getBoundingClientRect();

    for (let i = 0; i < nodeCount; i++) {
      const color = colors[i % colors.length];
      nodes.push({
        x: Math.random() * rect.width,
        y: Math.random() * rect.height,
        vx: (Math.random() - 0.5) * 0.4,
        vy: (Math.random() - 0.5) * 0.4,
        r: Math.random() * 2 + 1.5,
        pulse: Math.random() * Math.PI * 2,
        color,
      });
    }

    const draw = () => {
      const w = rect.width;
      const h = rect.height;
      ctx.clearRect(0, 0, w, h);

      for (const n of nodes) {
        n.x += n.vx;
        n.y += n.vy;
        n.pulse += 0.02;
        if (n.x < 0 || n.x > w) n.vx *= -1;
        if (n.y < 0 || n.y > h) n.vy *= -1;
      }

      // Draw subtle connections
      for (let i = 0; i < nodes.length; i++) {
        for (let j = i + 1; j < nodes.length; j++) {
          const dx = nodes[i].x - nodes[j].x;
          const dy = nodes[i].y - nodes[j].y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < 100) {
            const alpha = (1 - dist / 100) * 0.06;
            ctx.beginPath();
            ctx.moveTo(nodes[i].x, nodes[i].y);
            ctx.lineTo(nodes[j].x, nodes[j].y);
            ctx.strokeStyle = `rgba(46, 45, 45, ${alpha})`;
            ctx.lineWidth = 0.5;
            ctx.stroke();
          }
        }
      }

      // Draw dots
      for (const n of nodes) {
        const opacity = 0.15 + Math.sin(n.pulse) * 0.1;
        const [r, g, b] = n.color;
        ctx.beginPath();
        ctx.arc(n.x, n.y, n.r + Math.sin(n.pulse) * 0.4, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${r}, ${g}, ${b}, ${opacity})`;
        ctx.fill();
      }

      animRef.current = requestAnimationFrame(draw);
    };

    draw();
    return () => { if (animRef.current) cancelAnimationFrame(animRef.current); };
  }, []);

  return <canvas ref={canvasRef} className="absolute inset-0 pointer-events-none" />;
}

function PhaseStep({ phase, currentPhase, isComplete }) {
  const isActive = phase === currentPhase;
  const isPast = phase < currentPhase || isComplete;
  const Icon = PHASES[phase].icon;

  return (
    <div
      className={`flex items-center gap-3 transition-all duration-500 ${
        isActive ? 'opacity-100' : isPast ? 'opacity-40' : 'opacity-15'
      }`}
    >
      <div
        className={`relative h-9 w-9 rounded-xl flex items-center justify-center shrink-0 transition-all duration-500 ${
          isPast ? 'bg-[#cbf4c9]' : isActive ? 'bg-[#cedefd]' : 'bg-[#eeebea]'
        }`}
      >
        {isPast ? (
          <CheckCircle2 className="h-4 w-4 text-[#181717]" />
        ) : (
          <Icon className={`h-4 w-4 ${isActive ? 'text-[#5a82de]' : 'text-[#666666]'}`} />
        )}
        {isActive && (
          <div className="absolute inset-0 rounded-xl border border-[#5a82de]/30 ai-pulse-ring" />
        )}
      </div>
      <div className="min-w-0">
        <p className={`text-[14px] font-medium transition-colors duration-300 ${isActive ? 'text-[#181717]' : 'text-[#666666]'}`}>
          {PHASES[phase].label}
        </p>
        {isActive && (
          <p className="text-[12px] text-[#666666] mt-0.5 ai-fade-in">
            {PHASES[phase].detail}
          </p>
        )}
      </div>
    </div>
  );
}

function AnimatedCounter({ value, label }) {
  const [display, setDisplay] = useState(0);
  useEffect(() => {
    const end = value;
    const duration = 800;
    const start = Date.now();
    const tick = () => {
      const elapsed = Date.now() - start;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setDisplay(Math.round(end * eased));
      if (progress < 1) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  }, [value]);

  return (
    <div className="text-center">
      <p className="text-[32px] font-medium text-[#181717] tabular-nums">{display}</p>
      <p className="text-[12px] font-medium text-[#666666] mt-1">{label}</p>
    </div>
  );
}

export function EvaluateButton({ projectId }) {
  const [evaluating, setEvaluating] = useState(false);
  const [currentPhase, setCurrentPhase] = useState(0);
  const [isComplete, setIsComplete] = useState(false);
  const [resultMsg, setResultMsg] = useState('');
  const [stats, setStats] = useState(null);
  const resultRef = useRef(null);
  const startRef = useRef(null);

  const runPhaseAnimation = useCallback(async () => {
    for (let i = 0; i < PHASES.length; i++) {
      setCurrentPhase(i);
      await new Promise(r => setTimeout(r, PHASES[i].duration));
    }
  }, []);

  const handleEvaluate = async () => {
    setEvaluating(true);
    setCurrentPhase(0);
    setIsComplete(false);
    setResultMsg('');
    setStats(null);
    startRef.current = Date.now();

    // Run API + animation in parallel
    const apiPromise = evaluateProposals({ projectId })
      .then(result => { resultRef.current = result; })
      .catch(() => { resultRef.current = { message: 'Failed to evaluate proposals' }; });

    const animPromise = runPhaseAnimation();
    await Promise.all([apiPromise, animPromise]);

    // Enforce minimum duration
    const elapsed = Date.now() - startRef.current;
    if (elapsed < MIN_ANIMATION_MS) {
      await new Promise(r => setTimeout(r, MIN_ANIMATION_MS - elapsed));
    }

    const result = resultRef.current;
    setStats({
      evaluated: parseInt(result?.message?.match(/\d+/)?.[0]) || 0,
      criteria: PHASES.length,
    });
    setIsComplete(true);
    setResultMsg(result?.success ? result.message : (result?.message || ''));

    // Auto-dismiss
    await new Promise(r => setTimeout(r, 2200));
    setEvaluating(false);
    setIsComplete(false);

    if (result?.success) {
      toast.success(result.message);
    } else if (result?.message) {
      toast.error(result.message);
    }
  };

  if (!evaluating) {
    return (
      <button
        onClick={handleEvaluate}
        className="btn-filled-2 h-12 flex items-center justify-center px-6 text-[15px] gap-2 cursor-pointer"
      >
        <Zap className="h-5 w-5" />
        Run AI Evaluation
      </button>
    );
  }

  const progressPercent = isComplete
    ? 100
    : Math.min(95, Math.round(((currentPhase + 0.5) / PHASES.length) * 100));

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop — light tint matching #f9f7f6 */}
      <div className="absolute inset-0 bg-[#181717]/30 backdrop-blur-sm ai-fade-in" />

      {/* Modal card — white bg, 32px radius per design system */}
      <div className="relative w-full max-w-lg bg-white rounded-[32px] border border-[#eeebea] overflow-hidden ai-modal-enter">

        {/* Particle background */}
        <div className="absolute inset-0 overflow-hidden">
          <FloatingDots />
        </div>

        <div className="relative z-10 p-10">
          {/* Header */}
          <div className="flex items-center gap-4 mb-8">
            <div className="h-14 w-14 rounded-2xl bg-[#efddfd] flex items-center justify-center shrink-0">
              <Brain className="h-7 w-7 text-[#181717]" />
            </div>
            <div>
              <h2 className="text-[20px] font-medium text-[#181717] tracking-tight">
                {isComplete ? 'Evaluation Complete' : 'AI Evaluation in Progress'}
              </h2>
              <p className="text-[14px] text-[#666666] mt-0.5">
                {isComplete
                  ? resultMsg || 'All proposals have been scored.'
                  : 'Analyzing proposals with machine learning...'}
              </p>
            </div>
          </div>

          {/* Progress bar */}
          <div className="mb-8">
            <div className="flex justify-between text-[12px] font-medium text-[#666666] mb-2">
              <span>Progress</span>
              <span className="tabular-nums">{progressPercent}%</span>
            </div>
            <div className="h-2 bg-[#eeebea] rounded-full overflow-hidden">
              <div
                className="h-full rounded-full transition-all duration-1000 ease-out"
                style={{
                  width: `${progressPercent}%`,
                  background: isComplete ? '#cbf4c9' : '#d04841',
                }}
              />
            </div>
          </div>

          {/* Phase steps */}
          {!isComplete && (
            <div className="space-y-4">
              {PHASES.map((_, i) => (
                <PhaseStep key={i} phase={i} currentPhase={currentPhase} isComplete={isComplete} />
              ))}
            </div>
          )}

          {/* Completion stats */}
          {isComplete && stats && (
            <div className="ai-scale-in">
              <div className="flex items-center justify-center gap-12 py-8">
                <AnimatedCounter value={stats.evaluated} label="Evaluated" />
                <div className="w-px h-12 bg-[#eeebea]" />
                <AnimatedCounter value={stats.criteria} label="Criteria" />
              </div>
              <div className="flex items-center justify-center gap-2 text-[#181717]">
                <CheckCircle2 className="h-5 w-5 text-[#181717]" />
                <span className="text-[15px] font-medium">Results ready — refreshing page...</span>
              </div>
            </div>
          )}
        </div>
      </div>

      <style jsx>{`
        .ai-pulse-ring {
          animation: ai-pulse 2s ease-out infinite;
        }
        @keyframes ai-pulse {
          0% { transform: scale(1); opacity: 0.6; }
          100% { transform: scale(2); opacity: 0; }
        }
        .ai-modal-enter {
          animation: ai-enter 0.4s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }
        @keyframes ai-enter {
          from { opacity: 0; transform: scale(0.94) translateY(16px); }
          to { opacity: 1; transform: scale(1) translateY(0); }
        }
        .ai-scale-in {
          animation: ai-scale 0.5s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }
        @keyframes ai-scale {
          from { opacity: 0; transform: scale(0.85); }
          to { opacity: 1; transform: scale(1); }
        }
        .ai-fade-in {
          animation: ai-fade 0.3s ease forwards;
        }
        @keyframes ai-fade {
          from { opacity: 0; }
          to { opacity: 1; }
        }
      `}</style>
    </div>
  );
}
