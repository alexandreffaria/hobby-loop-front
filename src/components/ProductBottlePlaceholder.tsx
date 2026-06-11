export function ProductBottlePlaceholder() {
  return (
    <svg
      width="52"
      height="88"
      viewBox="0 0 52 88"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      {/* Cap */}
      <rect x="17" y="1" width="18" height="12" rx="4" fill="#8fa0b4" />
      {/* Neck */}
      <rect x="19" y="12" width="14" height="7" rx="2" fill="#a8bfcc" />
      {/* Bottle body */}
      <rect x="7" y="18" width="38" height="66" rx="13" fill="#c4d2e0" />
      {/* Highlight sheen */}
      <rect x="9" y="20" width="9" height="62" rx="6" fill="white" opacity="0.18" />
      {/* Label background */}
      <rect x="11" y="25" width="30" height="50" rx="7" fill="white" />
      {/* Pink header band — rounded at top, square at bottom via overlap */}
      <rect x="11" y="25" width="30" height="16" rx="7" fill="#d93b8c" />
      <rect x="11" y="33" width="30" height="8" fill="#d93b8c" />
      {/* Subtle white circle accent on pink band */}
      <circle cx="26" cy="33" r="3.5" fill="white" opacity="0.25" />
      {/* Simulated product name text */}
      <rect x="16" y="49" width="20" height="2.5" rx="1.25" fill="#9aaec4" />
      {/* Simulated subtitle lines */}
      <rect x="18" y="55" width="16" height="2" rx="1" fill="#b4c8d8" />
      <rect x="16" y="61" width="20" height="2" rx="1" fill="#9aaec4" />
      {/* Blue accent line */}
      <rect x="18" y="67" width="16" height="2" rx="1" fill="#009de0" opacity="0.5" />
    </svg>
  )
}
