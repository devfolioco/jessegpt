import clsx from 'clsx';

export function Loader({ color = '#07131A', className }: { color?: string; className?: string }) {
  return (
    <svg
      width="25"
      height="24"
      viewBox="0 0 25 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={clsx('animate-spin', className)}
    >
      <g id="loader">
        <path
          id="Vector"
          d="M12.5 2V6M12.5 18V22M5.43 4.93L8.26 7.76M16.74 16.24L19.57 19.07M2.5 12H6.5M18.5 12H22.5M5.43 19.07L8.26 16.24M16.74 7.76L19.57 4.93"
          stroke={color}
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </g>
    </svg>
  );
}
