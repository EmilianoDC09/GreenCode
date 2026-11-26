/** Logotipo de GreenCode */
export function LeafIcon({ size = 24, className = '' }) {
  return (
    <svg
      className={className}
      width={size}
      height={size}
      viewBox="0 0 24 24"
      aria-hidden="true"
    >
      <path
        d="M20.5 3.5C11 3.5 4.5 7.6 4.5 14.2c0 1.6.4 3 1 4.2C7.4 13 11 9.6 16 8c-4.4 2.6-7.6 6.3-9.4 11.4 1.2.8 2.7 1.1 4.2 1.1 6.4 0 9.7-5.3 9.7-17Z"
        fill="var(--leaf)"
      />
      <path
        d="M4 21c1.8-5.6 5.8-10 11-12.4"
        stroke="var(--leaf-vein)"
        strokeWidth="1.4"
        strokeLinecap="round"
        fill="none"
      />
    </svg>
  );
}

export default function Logo({ tone = 'dark' }) {
  return (
    <span className={`logo logo--${tone}`}>
      <LeafIcon size={26} />
      <span className="logo-text">GreenCode</span>
    </span>
  );
}
