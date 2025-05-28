import type React from "react";

const Input = ({
  type = "text",
  placeholder,
  onChange,
  className = "",
  isTextarea = false,
  name,
  value,
  defaultValue,
  readOnly = false,
  required = false,
}: {
  type?: string;
  placeholder?: string;
  onChange?: React.ChangeEventHandler<HTMLInputElement | HTMLTextAreaElement>;
  className?: string;
  isTextarea?: boolean;
  name?: string;
  value?: string;
  defaultValue?: string;
  readOnly: boolean;
  required?: boolean;
}) => {
  const baseClass =
    "placeholder:text-input-placeholder w-full bg-primary-bg rounded-sm text-primary border px-4 py-2 border-primary-border focus:outline-2 outline-primary-outline";

  if (isTextarea) {
    return (
      <textarea
        required={required}
        name={name}
        className={`${className} ${baseClass}`}
        placeholder={placeholder}
        onChange={onChange}
        rows={4}
        value={value}
        defaultValue={defaultValue}
        readOnly={readOnly}
      />
    );
  }

  return (
    <input
      required={required}
      name={name}
      className={`${className} ${baseClass} max-h-9 min-h-10`}
      type={type}
      placeholder={placeholder}
      onChange={onChange}
      value={value}
      defaultValue={defaultValue}
      readOnly={readOnly}
    />
  );
};

export default Input;
