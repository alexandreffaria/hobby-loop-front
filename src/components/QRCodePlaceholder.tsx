export function QRCodePlaceholder() {
  return (
    <svg
      width="64"
      height="64"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="opacity-80"
    >
      {/* Position Detection Patterns (The squares in the corners) */}
      <path d="M2 2h5v5H2V2zm1 1v3h3V3H3z" fill="currentColor" />
      <path d="M17 2h5v5h-5V2zm1 1v3h3V3h-3z" fill="currentColor" />
      <path d="M2 17h5v5H2v-5zm1 1v3h3v-3H3z" fill="currentColor" />

      {/* Random Data Modules */}
      <rect x="9" y="2" width="2" height="2" fill="currentColor" />
      <rect x="13" y="2" width="2" height="2" fill="currentColor" />
      <rect x="9" y="5" width="2" height="2" fill="currentColor" />
      <rect x="11" y="7" width="2" height="2" fill="currentColor" />
      <rect x="14" y="9" width="4" height="2" fill="currentColor" />
      <rect x="2" y="9" width="2" height="4" fill="currentColor" />
      <rect x="6" y="11" width="2" height="2" fill="currentColor" />
      <rect x="9" y="13" width="6" height="2" fill="currentColor" />
      <rect x="17" y="13" width="2" height="2" fill="currentColor" />
      <rect x="9" y="17" width="2" height="5" fill="currentColor" />
      <rect x="13" y="17" width="2" height="2" fill="currentColor" />
      <rect x="17" y="17" width="5" height="2" fill="currentColor" />
      <rect x="20" y="20" width="2" height="2" fill="currentColor" />
    </svg>
  );
}
