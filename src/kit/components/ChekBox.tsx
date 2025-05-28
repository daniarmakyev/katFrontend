const CheckBox = ({
  checked = false,
  checkBoxOnClick,
}: {
  checked?: boolean;
  checkBoxOnClick: () => void;
}) => {
  return (
    <button
      onClick={(e) => {
        e.preventDefault();
        e.stopPropagation();
        checkBoxOnClick();
      }}
      type="button"
      className={`
        w-6 h-6
        border rounded-xs
        flex items-center justify-center
        cursor-pointer transition-colors
        ${checked ? "bg-purple border-purple" : "border-purple"}
      `}
    >
      {checked && (
        <svg
          width="12"
          height="9"
          viewBox="0 0 12 9"
          fill="none"
          className="text-white"
        >
          <path
            d="M1 4.5L4.5 8L11 1"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
          />
        </svg>
      )}
    </button>
  );
};

export default CheckBox;
