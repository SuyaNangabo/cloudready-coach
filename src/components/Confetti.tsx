const PIECES = Array.from({ length: 24 }, (_, i) => ({
  left: (i * 41) % 100,
  delay: (i % 8) * 0.15,
  duration: 2.2 + (i % 5) * 0.3,
  hue: [45, 200, 150, 260, 20][i % 5],
  size: 6 + (i % 3) * 3,
}));

/** Lightweight CSS-only confetti burst for streak celebrations. */
export function Confetti() {
  return (
    <div aria-hidden className="pointer-events-none fixed inset-0 z-50 overflow-hidden">
      {PIECES.map((p, i) => (
        <span
          key={i}
          className="confetti-piece absolute top-0"
          style={{
            left: `${p.left}%`,
            width: p.size,
            height: p.size * 1.6,
            backgroundColor: `hsl(${p.hue} 85% 60%)`,
            animationDelay: `${p.delay}s`,
            animationDuration: `${p.duration}s`,
          }}
        />
      ))}
    </div>
  );
}
