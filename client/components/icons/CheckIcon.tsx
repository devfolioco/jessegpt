export function CheckIcon({ color = '#0FA38D', className }: { color?: string; className?: string }) {
  return (
    <svg
      width="32"
      height="32"
      viewBox="0 0 32 32"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <rect width="32" height="32" rx="16" fill={color} />
      <path
        d="M22.6663 11L13.4997 20.1667L9.33301 16"
        stroke="white"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
