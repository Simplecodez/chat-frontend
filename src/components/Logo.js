function Logo({ width = 300, height = 350 }) {
  return (
    <div className="logo">
      <svg width={width} height={height} viewBox="0 0 64 97" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path
          d="M61.7451 71.6085L53.3458 94.0249L2.25291 94.4063L48.264 3.3871M4.87904 23.075L12.4774 2.97513L60.907 2.59375L14.8959 93.6129"
          stroke="rgba(255, 255, 255, 0.922)"
          strokeWidth="9.16667"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </div>
  );
}

export default Logo;
