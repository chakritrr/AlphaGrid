import { Check } from 'lucide-react';

export default function Stepper({ steps, current }) {
  return (
    <div className="flex items-center gap-2">
      {steps.map((s, i) => (
        <div key={i} className="flex items-center gap-2 flex-1">
          <div className="flex items-center gap-2">
            <div
              className="w-7 h-7 rounded-full flex items-center justify-center text-[11px] font-semibold mono"
              style={{
                background: i <= current ? 'rgba(0,212,255,0.15)' : 'rgba(255,255,255,0.04)',
                border: `1px solid ${i <= current ? 'rgba(0,212,255,0.5)' : 'rgba(255,255,255,0.10)'}`,
                color: i <= current ? '#67E5FF' : '#8A90A2',
                boxShadow: i === current ? '0 0 16px rgba(0,212,255,0.4)' : 'none',
              }}
            >
              {i < current ? <Check size={12} /> : i + 1}
            </div>
            <div
              className="hidden md:block text-[12px]"
              style={{ color: i <= current ? '#E7EAF2' : '#5A6072' }}
            >
              {s}
            </div>
          </div>
          {i < steps.length - 1 && <div className={`step-line ${i < current ? 'active' : ''}`} />}
        </div>
      ))}
    </div>
  );
}
