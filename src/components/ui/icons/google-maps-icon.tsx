import * as React from "react"
const GoogleMapsIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    aria-label="Google Maps"
    viewBox="0 0 512 512"
    stroke="currentColor"
    fill="currentColor"
    {...props}
  >
    <rect width={512} height={512} fill="currentColor" rx="15%" />
    <clipPath id="a">
      <path d="M375 136a133 133 0 0 0-79-66 136 136 0 0 0-40-6 133 133 0 0 0-103 48 133 133 0 0 0-31 86c0 38 13 64 13 64 15 32 42 61 61 86a399 399 0 0 1 30 45 222 222 0 0 1 17 42c3 10 6 13 13 13s11-5 13-13a228 228 0 0 1 16-41 472 472 0 0 1 45-63c5-6 32-39 45-64 0 0 15-29 15-68 0-37-15-63-15-63z" />
    </clipPath>
    <g strokeWidth={130} clipPath="url(#a)">
      <path stroke="#fbbc04" d="m104 379 152-181" />
      <path stroke="#4285f4" d="M256 198 378 53" />
      <path stroke="#34a853" d="m189 459 243-290" />
      <path stroke="#1a73e8" d="m255 120-79-67" />
      <path stroke="#ea4335" d="m76 232 91-109" />
    </g>
    <circle cx={256} cy={198} r={51} fill="#fff" />
  </svg>
)
export default GoogleMapsIcon
