const colors = [
  "#EE668B",
  "#38BDA9",
  "#FFC928",
  "#5050D8",
];

type BookLoopSpinnerProps = {
  label?: string;
  size?: "small" | "medium";
};

export default function BookloopSpinner({
  label = "Loading",
  size = "medium",
}: BookLoopSpinnerProps) {
  const orbitRadius = size === "small" ? 9 : 12;

  return (
    <div className={`bookloop-spinner-status bookloop-spinner-status-${size}`} role="status" aria-label={label}>
      <div className="bookloop-spinner" aria-hidden="true">
        {colors.map((color, index) => (
          <span
            key={color}
            className="spinner-orbit-dot"
            style={{
              transform: `translate(-50%, -50%) rotate(${index * 90}deg) translateY(-${orbitRadius}px)`,
            }}
          >
            <span
              className="spinner-dot"
              style={{
                backgroundColor: color,
                animationDelay: `${index * 0.5}s`,
              }}
            />
          </span>
        ))}
      </div>
      <span className="bookloop-spinner-label">{label}</span>
    </div>
  );
}