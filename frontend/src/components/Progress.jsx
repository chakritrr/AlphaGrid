export default function Progress({ value, color = '#00FF88', height = 6 }) {
  return (
    <div
      className="w-full rounded-full overflow-hidden"
      style={{ background: 'rgba(255,255,255,0.06)', height }}
    >
      <div
        className="h-full rounded-full transition-all duration-700"
        style={{
          width: `${Math.min(value, 100)}%`,
          background: `linear-gradient(90deg, ${color}, ${color}aa)`,
          boxShadow: `0 0 10px ${color}88`,
        }}
      />
    </div>
  );
}
