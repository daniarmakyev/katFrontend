const InputSearch = ({
  value,
  onChange,
}: {
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}) => {
  return (
    <div className="relative w-full max-w-[595px] mx-auto text-[16px]">
      <input
        value={value}
        onChange={onChange}
        type="text"
        placeholder="Search note..."
        className="placeholder:text-input-placeholder w-full bg-primary-bg rounded-sm max-h-9 text-primary border px-4 py-2 min-h-10 border-primary-border focus:outline-2 outline-primary-outline"
      />
      <svg
        width="21.000000"
        height="21.000000"
        viewBox="0 0 21 21"
        className="absolute top-2 right-2.5"
      >
        <defs />
        <path
          d="M20.77 19.68L15.9 14.81L15.85 14.81C17.35 13.04 18.11 10.75 17.97 8.44C17.82 6.12 16.79 3.95 15.08 2.37C13.38 0.8 11.13 -0.05 8.8 0C6.48 0.04 4.27 0.99 2.63 2.63C0.99 4.27 0.04 6.48 0 8.8C-0.05 11.13 0.8 13.38 2.37 15.08C3.95 16.79 6.12 17.82 8.44 17.97C10.75 18.11 13.04 17.35 14.81 15.85C14.81 15.85 14.81 15.89 14.81 15.9L19.68 20.77C19.75 20.84 19.83 20.9 19.92 20.94C20.01 20.98 20.11 21 20.21 21C20.31 21 20.41 20.98 20.5 20.94C20.59 20.9 20.67 20.84 20.74 20.77C20.82 20.71 20.88 20.62 20.92 20.53C20.97 20.44 20.99 20.34 20.99 20.23C21 20.13 20.98 20.03 20.94 19.93C20.9 19.84 20.85 19.75 20.77 19.68ZM9 16.46C7.52 16.46 6.07 16.02 4.83 15.2C3.6 14.38 2.64 13.21 2.07 11.84C1.51 10.47 1.36 8.96 1.65 7.51C1.94 6.05 2.65 4.72 3.7 3.67C4.75 2.62 6.08 1.91 7.54 1.62C8.99 1.33 10.5 1.48 11.87 2.04C13.24 2.61 14.41 3.57 15.23 4.8C16.05 6.04 16.49 7.49 16.49 8.97C16.49 9.95 16.3 10.93 15.92 11.84C15.55 12.75 14.99 13.57 14.3 14.27C13.6 14.96 12.78 15.52 11.87 15.89C10.96 16.27 9.98 16.46 9 16.46Z"
          fill="var(--color-primary)"
        />
      </svg>
    </div>
  );
};

export default InputSearch;
