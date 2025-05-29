import React, { useState, useEffect } from "react";
import { useAppDispatch } from "../../hooks/hooks";
import Input from "./Input";
import PrimaryButton from "./PrimaryButton";
import StatusSelect from "./StatusSelect";
import {
  complaintstatusChange,
  getRecommendation,
} from "../../store/action/complaints.action";
import type { IComplaints } from "../../store/slice/complaints.slice";
import { setModalOpen } from "../../store/slice/ui.slice";

const ComplaintModal = ({
  onClose,
  complaints,
}: {
  onClose: () => void;
  complaints?: IComplaints | null;
}) => {
  const dispatch = useAppDispatch();
  const [isStatusChanging, setIsStatusChanging] = useState(false);
  const [formData, setFormData] = useState({
    complaint: "",
    address: "",
    category: "",
    date: "",
    seriousnessScore: 0,
    status: "новая",
  });
  const [recommendation, setRecommendation] = useState<string | null>(null);
  const [isLoadingRecommendation, setIsLoadingRecommendation] = useState(false);
  const [displayText, setDisplayText] = useState('');
  const [isTyping, setIsTyping] = useState(false);

  useEffect(() => {
    if (complaints) {
      setFormData({
        complaint: complaints.complaint || "",
        address: complaints.address || "",
        category: complaints.category || "",
        date: complaints.createdAt?.slice(0, 10) || "",
        seriousnessScore: complaints.seriousnessScore || 0,
        status: complaints.status || "новая",
      });
    }
  }, [complaints]);

  useEffect(() => {
    dispatch(setModalOpen(true));
    
    return () => {
      dispatch(setModalOpen(false));
    };
  }, [dispatch]);

  const handleStatusChange = async (newStatus: string) => {
    if (!complaints?.id || isStatusChanging) return;
    setIsStatusChanging(true);

    try {
      await dispatch(
        complaintstatusChange({
          complaintId: String(complaints.id),
          status: newStatus,
        })
      ).unwrap();
      setFormData((prev) => ({ ...prev, status: newStatus }));
    } catch (error) {
      console.error("Error updating status:", error);
    } finally {
      setIsStatusChanging(false);
    }
  };

  const handleGetRecommendation = async () => {
    if (!formData.complaint || isLoadingRecommendation) return;

    setIsLoadingRecommendation(true);
    try {
      const result = await dispatch(
        getRecommendation(formData.complaint)
      ).unwrap();
      setRecommendation(result);
    } catch (error) {
      console.error("Error getting recommendation:", error);
    } finally {
      setIsLoadingRecommendation(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (
      !formData.complaint.trim() ||
      !formData.category.trim() ||
      !formData.date
    ) {
      alert("Пожалуйста, заполните все поля");
      return;
    }
    onClose();
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleOverlayClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  useEffect(() => {
    if (!recommendation) {
      setDisplayText('');
      return;
    }

    setIsTyping(true);
    let index = 0;
    let text = '';

    const typeInterval = setInterval(() => {
      if (index < recommendation.length) {
        text += recommendation[index];
        setDisplayText(text);
        index++;
      } else {
        setIsTyping(false);
        clearInterval(typeInterval);
      }
    }, 30);

    return () => clearInterval(typeInterval);
  }, [recommendation]);

  return (
    <div
      className="fixed inset-0 bg-black/70 flex items-center justify-center z-[51] p-2.5 overflow-y-auto"
      onClick={handleOverlayClick}
    >
      <div className="w-full max-w-[500px] bg-primary-bg rounded-xl p-6 shadow-lg my-4">
        <h3 className="text-lg md:text-2xl text-center text-white-black uppercase">
          {"Просмотр жалобы"}
        </h3>

        <form className="flex flex-col gap-y-2 mt-2.5 " onSubmit={handleSubmit}>
          <label htmlFor="" className="mx-auto text-white-black">
            Очки доверености {`${formData.seriousnessScore.toString()} / 10`}
          </label>
          <label className="text-white-black" htmlFor="">
            Категория
          </label>
          <Input
            name="category"
            placeholder="Введите категорию..."
            onChange={handleChange}
            value={formData.category}
            readOnly={true}
          />
          <label className="text-white-black" htmlFor="">
            Адрес
          </label>
          <Input
            name="address"
            placeholder="Адрес"
            onChange={handleChange}
            value={formData.address}
            readOnly={true}
          />
          <label className="text-white-black" htmlFor="">
            Жалоба
          </label>
          <Input
            name="complaint"
            className="min-h-28"
            placeholder="Введите текст жалобы..."
            isTextarea
            onChange={handleChange}
            value={formData.complaint}
            readOnly={true}
          />
          <label className="text-white-black" htmlFor="">
            Дата
          </label>
          <Input
            name="date"
            type="date"
            onChange={handleChange}
            value={formData.date}
            readOnly={true}
          />
          <label className="text-white-black" htmlFor="">
            Статус
          </label>
          <StatusSelect
            status={formData.status}
            onChange={handleStatusChange}
            disabled={isStatusChanging}
          />

          <div className="mt-4 border-t border-gray-200 pt-4">
            <div className="flex justify-between items-center mb-2">
              <h4 className="text-white-black font-medium">Рекомендация ИИ</h4>
              <button
                type="button"
                onClick={handleGetRecommendation}
                disabled={isLoadingRecommendation}
                className={`px-4 py-2 rounded-md text-sm ${
                  isLoadingRecommendation
                    ? "bg-gray-400 cursor-not-allowed"
                    : "bg-purple hover:bg-dark-purple"
                } text-white transition-colors`}
              >
                {isLoadingRecommendation ? (
                  <span className="flex items-center">
                    <svg
                      className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      ></circle>
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      ></path>
                    </svg>
                    Генерация...
                  </span>
                ) : (
                  "Получить рекомендацию"
                )}
              </button>
            </div>

            {recommendation && (
              <div
                className="mt-2 p-3 bg-white/5 rounded-lg border border-white-black/20 max-h-[200px] overflow-y-auto text-white-black"

              >
                <p 
                  className="typewriter"
                  style={{
                    color: 'var(--text-color)',
                    fontSize: '14px',
                    lineHeight: '1.5',
                    whiteSpace: 'pre-wrap'
                  }}
                >
                  {displayText}
                  {isTyping && <span className="cursor" />}
                </p>
              </div>
            )}
          </div>

          <div className="flex justify-center mt-4">
            <PrimaryButton className="!px-1" outline onClick={onClose}>
              Закрыть
            </PrimaryButton>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ComplaintModal;
