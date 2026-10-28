// Animated sky: gradient + drifting clouds + twinkling stars
const clouds = [
  { top: '8%', size: 220, dur: 70, delay: 0, op: 0.35 },
  { top: '22%', size: 140, dur: 55, delay: -20, op: 0.25 },
  { top: '45%', size: 280, dur: 90, delay: -45, op: 0.2 },
  { top: '65%', size: 180, dur: 65, delay: -10, op: 0.25 },
  { top: '82%', size: 240, dur: 80, delay: -60, op: 0.18 },
];

export default function Background() {
  return (
    <div className="sky" aria-hidden>
      <div className="sky-orb orb-1" />
      <div className="sky-orb orb-2" />
      <div className="sky-orb orb-3" />
      {Array.from({ length: typeof window !== 'undefined' && window.innerWidth < 640 ? 14 : 40 }).map((_, i) => (
        <span
          key={i}
          className="star"
          style={{
            top: `${Math.random() * 100}%`,
            left: `${Math.random() * 100}%`,
            animationDelay: `${Math.random() * 4}s`,
          }}
        />
      ))}
      {clouds.map((c, i) => (
        <div
          key={i}
          className="cloud"
          style={{
            top: c.top,
            width: c.size,
            height: c.size * 0.42,
            opacity: c.op,
            animationDuration: `${c.dur}s`,
            animationDelay: `${c.delay}s`,
          }}
        />
      ))}
    </div>
  );
}
