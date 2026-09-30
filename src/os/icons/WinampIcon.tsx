// Our own Winamp-style lightning bolt, sized like the react95 icons so it works anywhere they do
function WinampIcon({ variant = "32x32_4" }: { variant?: "32x32_4" | "16x16_4" }) {
  const size = variant === "16x16_4" ? 16 : 32;
  return (
    <svg width={size} height={size} viewBox="0 0 32 32" aria-hidden>
      <path d="M19 2 6 18h8l-3 12 15-18h-9l5-10z" fill="#f7b500" stroke="#000" strokeWidth="1.5" strokeLinejoin="round" />
      <path d="M18.5 5 9.5 16h6.5l-2 8" fill="none" stroke="#fff3a0" strokeWidth="1.5" strokeLinejoin="round" />
      <path d="M26 12h-9l5-10" fill="none" stroke="#c45a00" strokeWidth="1.5" strokeLinejoin="round" />
    </svg>
  );
}

export default WinampIcon
