const AddComplaintButton = ({
  onClick,
  className,
}: {
  onClick?: () => void;
  className?: string;
}) => {
  return (
    <button
      onClick={(e) => {
        e.preventDefault();
        onClick?.();
      }}
      className={
        className +
        ` bg-purple w-[50px] h-[50px] rounded-full hover:bg-dark-purple shadow-[0_0_4px_0_rgb(108,99,255)] p-2 flex justify-center items-center border-2 border-transparent`
      }
      style={{
        borderColor: "var(--color-purple)",
      }}
    >
      <svg width="24" height="23.98" viewBox="0 0 24 23.9809" fill="none">
        <defs />
        <path
          d="M10.5 22.48C10.5 22.87 10.65 23.26 10.93 23.54C11.22 23.82 11.6 23.98 12 23.98C12.39 23.98 12.77 23.82 13.06 23.54C13.34 23.26 13.5 22.87 13.5 22.48L13.5 13.48L22.5 13.48C22.89 13.48 23.27 13.33 23.56 13.05C23.84 12.76 24 12.38 24 11.99C24 11.59 23.84 11.21 23.56 10.93C23.27 10.64 22.89 10.49 22.5 10.49L13.5 10.49L13.5 1.49C13.5 1.1 13.34 0.72 13.06 0.43C12.77 0.15 12.39 0 12 0C11.6 0 11.22 0.15 10.93 0.43C10.65 0.72 10.5 1.1 10.5 1.49L10.5 10.49L1.5 10.49C1.1 10.49 0.72 10.64 0.43 10.93C0.15 11.21 0 11.59 0 11.99C0 12.38 0.15 12.76 0.43 13.05C0.72 13.33 1.1 13.48 1.5 13.48L10.5 13.48L10.5 22.48Z"
          fill="#F7F7F7"
        />
      </svg>
    </button>
  );
};

export default AddComplaintButton;
