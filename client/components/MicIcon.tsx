export function MicIcon({ color = 'white' }: { color?: string }) {
  return (
    <svg width="20" height="22" viewBox="0 0 20 22" fill="none" xmlns="http://www.w3.org/2000/svg">
      <g id="mic">
        <path
          id="Vector"
          d="M10 1.83337C9.33696 1.83337 8.70107 2.09677 8.23223 2.56561C7.76339 3.03445 7.5 3.67033 7.5 4.33337V11C7.5 11.6631 7.76339 12.299 8.23223 12.7678C8.70107 13.2366 9.33696 13.5 10 13.5C10.663 13.5 11.2989 13.2366 11.7678 12.7678C12.2366 12.299 12.5 11.6631 12.5 11V4.33337C12.5 3.67033 12.2366 3.03445 11.7678 2.56561C11.2989 2.09677 10.663 1.83337 10 1.83337Z"
          stroke={color}
          stroke-width="2"
          stroke-linecap="round"
          stroke-linejoin="round"
        />
        <path
          id="Vector_2"
          d="M15.8334 9.33337V11C15.8334 12.5471 15.2188 14.0309 14.1249 15.1248C13.0309 16.2188 11.5472 16.8334 10.0001 16.8334C8.45299 16.8334 6.96925 16.2188 5.87529 15.1248C4.78133 14.0309 4.16675 12.5471 4.16675 11V9.33337"
          stroke={color}
          stroke-width="2"
          stroke-linecap="round"
          stroke-linejoin="round"
        />
        <path
          id="Vector_3"
          d="M10 16.8334V20.1667"
          stroke={color}
          stroke-width="2"
          stroke-linecap="round"
          stroke-linejoin="round"
        />
        <path
          id="Vector_4"
          d="M6.66675 20.1666H13.3334"
          stroke={color}
          stroke-width="2"
          stroke-linecap="round"
          stroke-linejoin="round"
        />
      </g>
    </svg>
  );
}
