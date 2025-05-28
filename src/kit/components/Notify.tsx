import { useEffect, useState } from "react";

const Notify = ({
  type,
  message,
  onClose,
}: {
  type: "success" | "error" | "warning" | "info" | "loading";
  message: string;
  onClose: () => void;
}) => {
  const [visible, setVisible] = useState(false);

  const notifyStyles = {
    success: "bg-green-500",
    error: "bg-red-500",
    warning: "bg-yellow-500",
    info: "bg-blue-500",
    loading: "bg-gray-500",
  };

  useEffect(() => {
    setVisible(true);

    if (type !== "loading") {
      const timer = setTimeout(() => {
        setVisible(false);
        setTimeout(() => onClose(), 300);
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [type, onClose]);

  return (
    <div
      className={`z-[100] fixed top-4 right-4 px-2 py-2 rounded-md text-white shadow-lg transform transition-all duration-300 text-sm md:px-4
        ${visible ? "translate-x-0 opacity-100" : "translate-y-full opacity-0"} 
        ${notifyStyles[type] || notifyStyles.info}`}
    >
      {message}
    </div>
  );
};

export default Notify;
