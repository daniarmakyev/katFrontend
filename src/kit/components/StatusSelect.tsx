import React from "react";

interface StatusSelectProps {
  status: string;
  onChange: (newStatus: string) => void;
  disabled?: boolean;
}

const StatusSelect: React.FC<StatusSelectProps> = ({ status, onChange, disabled }) => {
  const statusOptions = ["новая", "в обработке", "ожидает уточнения", "отклонена", "завершена"];

  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    e.stopPropagation();
    onChange(e.target.value);
  };

  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation();
  };

  return (
    <select
      value={status}
      onChange={handleChange}
      onClick={handleClick}
      className="cursor-pointer text-sm bg-primary-bg text-white-black border border-purple rounded-md px-2 py-1"
      disabled={disabled}
    >
      {statusOptions.map((option) => (
        <option key={option} value={option}>
          {option}
        </option>
      ))}
    </select>
  );
};

export default StatusSelect;