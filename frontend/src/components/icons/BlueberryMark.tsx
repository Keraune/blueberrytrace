export function BlueberryMark() {
  return (
    <span className="brand__mark brand__mark--svg" aria-hidden="true">
      <svg viewBox="0 0 48 48" role="img" focusable="false">
        <defs>
          <linearGradient id="blueberry-mark-gradient" x1="8" x2="40" y1="8" y2="42" gradientUnits="userSpaceOnUse">
            <stop offset="0" stopColor="#19c37d" />
            <stop offset="0.5" stopColor="#3b82f6" />
            <stop offset="1" stopColor="#7c3aed" />
          </linearGradient>
          <radialGradient id="blueberry-mark-shine" cx="0" cy="0" r="1" gradientTransform="translate(19 17) rotate(45) scale(13)">
            <stop offset="0" stopColor="#ffffff" stopOpacity="0.72" />
            <stop offset="1" stopColor="#ffffff" stopOpacity="0" />
          </radialGradient>
        </defs>
        <circle cx="24" cy="24" r="21" fill="url(#blueberry-mark-gradient)" />
        <circle cx="24" cy="24" r="21" fill="url(#blueberry-mark-shine)" />
        <path d="M23.9 8.8c1.7 3.4 1.3 5.9-1.1 7.6-1.9-2.2-4.7-3.4-8.5-3.5 3.2-2.9 6.4-4.2 9.6-4.1Z" fill="#d7f7df" />
        <path d="M25.4 16.6c3.7-2.1 7.5-2.2 11.4-.5-3.1.8-5.1 2.5-6.1 5.1-2.1-1.4-3.9-2.9-5.3-4.6Z" fill="#bbf7d0" opacity="0.9" />
        <circle cx="18" cy="27" r="7.1" fill="#182f73" opacity="0.9" />
        <circle cx="30" cy="29" r="8.2" fill="#2f4fb3" opacity="0.92" />
        <circle cx="17" cy="25" r="2.1" fill="#ffffff" opacity="0.35" />
        <circle cx="28" cy="26" r="2.4" fill="#ffffff" opacity="0.32" />
      </svg>
    </span>
  );
}
