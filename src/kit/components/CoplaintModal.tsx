import React, { useState, useEffect } from "react";
import { useAppDispatch } from "../../hooks/hooks";
import Input from "./Input";
import PrimaryButton from "./PrimaryButton";
import StatusSelect from "./StatusSelect";
import { complaintstatusChange } from "../../store/action/complaints.action";
import type { IComplaints } from "../../store/slice/complaints.slice";

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

  return (
    <div
      className="fixed inset-0 bg-black/70 flex items-center justify-center z-[3] p-2.5 "
      onClick={handleOverlayClick}
    >
      <div className="w-full max-w-[500px] bg-primary-bg rounded-xl p-6 shadow-lg ">
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

          <PrimaryButton
            className="!px-2 mt-4  ms-auto"
            outline
            onClick={() => {
              onClose();
            }}
          >
            Закрыть
          </PrimaryButton>
        </form>
      </div>
    </div>
  );
};

export default ComplaintModal;
