import type { LucideProps } from "lucide-react";

export const Icons = {
  Logo: (props: LucideProps) => (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <path d="M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10 10-4.5 10-10S17.5 2 12 2Z" />
      <path d="m15.5 7.5-3 3-1.5 1.5-3-3" />
      <path d="M8.5 13.5v4" />
      <path d="M12.5 13.5v4" />
      <path d="M16.5 13.5v4" />
    </svg>
  ),
};
