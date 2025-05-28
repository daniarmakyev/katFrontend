const EditButton = ({ onClick }: { onClick: () => void }) => {
  return (
    <button
      onClick={(e) => {
        e.preventDefault();
        e.stopPropagation();
        onClick();
      }}
      className="text-[#CDCDCD] hover:text-purple"
      type="button"
    >
      <svg
        width="18.001709"
        height="18.001678"
        viewBox="0 0 14.0017 14.0017"
        fill="none"
      >
        <defs />
        <path
          d="M0.5 10.16L0.5 13.5L3.83 13.5L10.5 6.82L12.9 4.43L12.9 4.43C13.23 4.1 13.39 3.94 13.45 3.75C13.51 3.58 13.51 3.4 13.45 3.23C13.39 3.04 13.23 2.87 12.9 2.54L11.45 1.09C11.12 0.76 10.95 0.6 10.76 0.54C10.59 0.48 10.41 0.48 10.25 0.54C10.06 0.6 9.89 0.76 9.56 1.09L9.56 1.1L7.17 3.49L0.5 10.16ZM7.17 3.49L10.5 6.82"
          stroke="currentColor"
        />
      </svg>
    </button>
  );
};

export default EditButton;
