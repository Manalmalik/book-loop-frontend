function TickBanner() {
  const messages = [
    "READ A LITTLE",
    "RETURN OFTEN",
    "ONE MORE CHAPTER",
    "NO BEIGE BOOKMARKS",
    "YOUR SHELF, YOUR RULES",
    "★",
  ];

  return (
    <div className="headliner">
      <div className="headliner-track">
        {[...messages, ...messages].map((message, index) => (
          <span
            key={index}
            className={message === "★" ? "headliner-star" : ""}
          >
            {message}
          </span>
        ))}
      </div>
    </div>
  );
}

export default TickBanner
