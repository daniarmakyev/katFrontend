import { useState } from "react";

const Select = ({
  thumb,
  list,
  onChange,
}: {
  thumb: string;
  list: string[];
  onChange: (value: string) => void;
}) => {
  const [open, setOpen] = useState(false);

  const handleSelectItem = (item: string) => {
    onChange(item);
    setOpen(false);
  };

  return (
    <div className="relative inline-block text-lg max-w-[93px] w-full">
      <button
        className="bg-dark-purple flex justify-between items-center font-medium text-white text-sm w-full hover:shadow-[0_0_4px_0_rgb(108,99,255)] px-2 rounded-md text-left h-10 border-2 border-transparent"
        style={
          open
            ? {
                borderColor: "var(--color-purple)",
                backgroundColor: "var(--color-select-opened)",
                boxShadow: "none",
              }
            : {}
        }
        onClick={() => setOpen((prev) => !prev)}
        type="button"
      >
        {thumb}
        <svg
          width="10"
          height="10"
          viewBox="0 0 7.74255 4.00406"
          style={{
            transform: open ? "rotate(180deg)" : "rotate(0deg)",
            transition: "transform 0.2s ease-in-out",
          }}
        >
          <defs />
          <path d="M3.87 3.5L0.5 0.5" stroke="#F7F7F7" />
          <path d="M7.24 0.5L3.87 3.5" stroke="#F7F7F7" />
        </svg>
      </button>
      {open && (
        <div className="absolute w-fit bg-white mt-0 font-normal rounded-sm border text-purple border-purple z-10">
          <ul>
            {list.map((item, index) => (
              <li
                key={index}
                className="hover:bg-select-hover-purple border-b-purple border-b px-1 py-1 cursor-pointer text-nowrap"
                onClick={() => handleSelectItem(item)}
              >
                {item}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default Select;
