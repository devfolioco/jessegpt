export function DevfolioIcon({ color = 'white', className }: { color?: string; className?: string }) {
  return (
    <svg
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <g id="devfolio">
        <path
          id="Icon"
          d="M8 21H11C18.5 21 21 16.4211 21 13M5.78947 17H11C14.9532 17 18 15.0058 18 11.0526V9.26316C18 5.30996 14.9532 2 11 2H5.78947C4.80117 2 4 2.90644 4 3.89474V15.42C4 16.4083 4.80117 17 5.78947 17Z"
          stroke={color}
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </g>
    </svg>
  );
}
