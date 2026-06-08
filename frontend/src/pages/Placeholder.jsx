import TopBar from '../components/TopBar';

export default function PagePlaceholder({ title, subtitle, icon: Icon }) {
  return (
    <div className="page-enter">
      <TopBar title={title} subtitle={subtitle} />
      <div className="glass p-12 flex flex-col items-center justify-center text-center min-h-[420px]">
        <div
          className="w-16 h-16 rounded-2xl mb-4 flex items-center justify-center"
          style={{
            background: 'linear-gradient(135deg, rgba(0,212,255,0.12), rgba(139,92,246,0.12))',
            border: '1px solid rgba(255,255,255,0.08)',
          }}
        >
          <Icon size={26} color="#67E5FF" />
        </div>
        <div className="text-[18px] font-semibold mb-1">{title}</div>
        <div className="text-muted text-[13px] max-w-sm">
          This area is part of the prototype scaffold. Connect it to your backend or expand with the
          controls relevant to {title.toLowerCase()}.
        </div>
      </div>
    </div>
  );
}
