export default function ExchangeLogo({ name = 'X', size = 32, accent = '#fff' }) {
  const letter = (name || 'X')[0];
  return (
    <div
      className="rounded-lg flex items-center justify-center font-semibold mono"
      style={{
        width: size,
        height: size,
        background: 'linear-gradient(180deg, rgba(255,255,255,0.06), rgba(255,255,255,0.02))',
        border: '1px solid rgba(255,255,255,0.10)',
        color: accent,
        fontSize: size * 0.42,
        textShadow: `0 0 14px ${accent}55`,
      }}
      title={name}
    >
      {letter}
    </div>
  );
}
