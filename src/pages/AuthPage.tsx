import { useState, useEffect } from "react";
import Input from "../kit/components/Input";
import PrimaryButton from "../kit/components/PrimaryButton";
import bluredBg from "../kit/assets/waveBg.png";
import MapAddressSelector from "../kit/components/MapAddressSelector";
import { useAppDispatch } from "../hooks/hooks";
import { setModalOpen } from "../store/slice/ui.slice";

interface ComplaintForm {
  complaint: string;
  address?: string;
}

const AuthPage = () => {
  const dispatch = useAppDispatch();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isAddressLoading, setIsAddressLoading] = useState(false);
  const [, setNotification] = useState<{
    show: boolean;
    type: "success" | "error" | "warning" | "info" | "loading";
    message: string;
  }>({
    show: false,
    type: "info",
    message: "",
  });
  const [formData, setFormData] = useState<ComplaintForm>({
    complaint: "",
    address: "",
  });
  const [isHelpModalOpen, setIsHelpModalOpen] = useState(false);

  const showNotification = (
    type: "success" | "error" | "warning" | "info" | "loading",
    message: string
  ) => {
    setNotification({ show: true, type, message });
    if (type !== "loading") {
      setTimeout(() => {
        setNotification((prev) => ({ ...prev, show: false }));
      }, 3000);
    }
  };

  const handleAddressSelect = (address: string) => {
    setIsAddressLoading(true);
    showNotification("loading", "Получение адреса...");

    setTimeout(() => {
      setFormData((prev) => ({ ...prev, address }));
      setIsAddressLoading(false);
      showNotification("success", "Адрес успешно получен");
    }, 1000);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.complaint.trim()) {
      showNotification("error", "Пожалуйста, введите текст жалобы");
      return;
    }

    setIsLoading(true);
    showNotification("loading", "Отправка жалобы...");

    try {
      const dataToSend = {
        complaint: formData.complaint,
        ...(formData.address && { address: formData.address }),
      };

      const response = await fetch("http://localhost:3001/submit-complaint", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(dataToSend),
      });

      const data = await response.json();

      if (response.ok) {
        showNotification(
          "success",
          data.message || "Жалоба успешно отправлена"
        );
        setFormData({ complaint: "", address: "" });

        console.log("Категория жалобы:", data.data.category);
        console.log("Оценка серьезности:", data.data.seriousnessScore);
      } else {
        showNotification("error", data.error || "Ошибка при отправке жалобы");
      }
    } catch (error) {
      console.error("Error submitting complaint:", error);
      showNotification("error", "Ошибка при отправке жалобы");
    } finally {
      setIsLoading(false);
    }
  };
  const handleOverlayClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget && e.type === "click") {
      setIsModalOpen(false);
    }
  };

  useEffect(() => {
    dispatch(setModalOpen(isModalOpen || isHelpModalOpen));

    if (isModalOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }

    return () => {
      document.body.style.overflow = "unset";
      dispatch(setModalOpen(false));
    };
  }, [isModalOpen, isHelpModalOpen, dispatch]);

  return (
    <div
      className="w-full min-h-screen overflow-hidden relative flex items-center justify-center"
      style={{
        backgroundImage: `url(${bluredBg})`,
        backgroundSize: "100vw",
        backgroundPositionY: "center",
        backgroundAttachment: "fixed",
        filter: "none",
      }}
    >
      <div className="bg-primary-bg/80 min-h-screen w-full relative flex items-center justify-center px-4  z-10">
        <div className="relative max-w-2xl w-full space-y-8 text-center mb-3">
          <div className="space-y-6 relative">
            <h1 className="text-4xl md:text-5xl font-bold text-white-black bg-clip-text p-3">
              🇰🇬Сервис приёма жалоб граждан
            </h1>
            <p className="text-lg md:text-xl text-white-black/80">
              Оставьте жалобу по вопросам ЖКХ, транспорта, медицины,
              образования, экологии, полиции, госуслуг и другим государственным
              структурам. Все обращения направляются в уполномоченные органы для
              рассмотрения.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center mt-12 relative">
            <button
              onClick={() => setIsModalOpen(true)}
              className="bg-purple hover:bg-dark-purple !text-white px-6 py-2 rounded-md  w-fit mx-auto
            transition-all duration-300 hover:shadow-[0_0_20px_0_rgba(108,99,255,0.3)]
            border-2 border-transparent hover:border-white-black backdrop-blur-sm relative z-20"
            >
              Создать жалобу
            </button>
          </div>

          <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8 relative">
            <div className="p-6 rounded-lg border border-white-black/20 bg-white-black/5 backdrop-blur-sm">
              <h3 className="text-xl font-semibold text-white-black mb-2">
                Быстрая отправка
              </h3>
              <p className="text-white-black/70">
                Оставьте жалобу за несколько секунд — просто и удобно.
              </p>
            </div>

            <div className="p-6 rounded-lg border border-white-black/20 bg-white-black/5 backdrop-blur-sm">
              <h3 className="text-xl font-semibold text-white-black mb-2">
                Широкий охват
              </h3>
              <p className="text-white-black/70">
                Поддерживаются обращения по ключевым общественным направлениям.
              </p>
            </div>

            <div className="p-6 rounded-lg border border-white-black/20 bg-white-black/5 backdrop-blur-sm">
              <h3 className="text-xl font-semibold text-white-black mb-2">
                Передача в органы
              </h3>
              <p className="text-white-black/70">
                Все жалобы автоматическйи перенаправляются в соответствующие
                государственные структуры.
              </p>
            </div>
          </div>

          {isModalOpen && (
            <div
              className="fixed inset-0 bg-black/50 flex items-center justify-center p-3 z-[100] overflow-hidden m-0"
              onClick={handleOverlayClick}
            >
              <div
                className="border border-white-black bg-primary-bg rounded-lg p-3 max-w-md w-full max-h-[90vh] flex flex-col"
                onClick={(e) => e.stopPropagation()}
              >
                <h2 className="text-2xl font-bold text-white-black mb-2 sm:mb-4">
                  Создание жалобы
                </h2>
                <form
                  onSubmit={handleSubmit}
                  className="space-y-3 flex flex-col items-start overflow-y-auto flex-1 scrollbar-thin scrollbar-thumb-purple scrollbar-track-transparent"
                >
                  <MapAddressSelector onAddressSelect={handleAddressSelect} />

                  {isAddressLoading ? (
                    <div className="text-purple text-sm">
                      Получение адреса...
                    </div>
                  ) : (
                    <div className="text-purple text-sm opacity-0 pointer-events-none">
                      Получение адреса...
                    </div>
                  )}
                  <label htmlFor="" className="text-white-black">
                    Адрес
                  </label>
                  <Input
                    name="address"
                    placeholder="Введите адрес (необязательно)..."
                    value={formData.address}
                    onChange={(e) =>
                      setFormData({ ...formData, address: e.target.value })
                    }
                    readOnly={false}
                  />
                  <label htmlFor="" className="text-white-black">
                    Жалоба
                  </label>
                  <Input
                    name="complaint"
                    placeholder="Введите текст жалобы..."
                    value={formData.complaint}
                    onChange={(e) =>
                      setFormData({ ...formData, complaint: e.target.value })
                    }
                    isTextarea
                    readOnly={false}
                    required
                  />
                  <div className="flex justify-between w-full">
                    <div className="flex items-center gap-4">
                      <PrimaryButton
                        outline
                        onClick={() => setIsModalOpen(false)}
                        className="!text-sm !px-3"
                        type="button"
                      >
                        Отмена
                      </PrimaryButton>
                      <PrimaryButton
                        type="submit"
                        className="!text-sm !px-3 min-w-fit"
                        disabled={isLoading}
                      >
                        {isLoading ? "Отправка..." : "Отправить"}
                      </PrimaryButton>
                    </div>

                    <button
                      type="button"
                      onClick={(e) => {
                        e.preventDefault();
                        setIsHelpModalOpen(true);
                      }}
                      className="p-1 border-2 text-purple border-purple rounded-full  transition-all"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="25"
                        height="25"
                        viewBox="0 0 50 50"
                        fill="currentColor"
                      >
                        <path d="M 25 2 C 12.309295 2 2 12.309295 2 25 C 2 37.690705 12.309295 48 25 48 C 37.690705 48 48 37.690705 48 25 C 48 12.309295 37.690705 2 25 2 z M 25 4 C 36.609824 4 46 13.390176 46 25 C 46 36.609824 36.609824 46 25 46 C 13.390176 46 4 36.609824 4 25 C 4 13.390176 13.390176 4 25 4 z M 25 11 A 3 3 0 0 0 22 14 A 3 3 0 0 0 25 17 A 3 3 0 0 0 28 14 A 3 3 0 0 0 25 11 z M 21 21 L 21 23 L 22 23 L 23 23 L 23 36 L 22 36 L 21 36 L 21 38 L 22 38 L 23 38 L 27 38 L 28 38 L 29 38 L 29 36 L 28 36 L 27 36 L 27 21 L 26 21 L 22 21 L 21 21 z"></path>
                      </svg>
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}

          {isHelpModalOpen && (
            <div
              className="fixed inset-0 bg-black/50 flex items-center justify-center p-3 z-[150] overflow-hidden"
              onClick={() => setIsHelpModalOpen(false)}
            >
              <div
                className="border border-white-black bg-primary-bg rounded-lg p-6 max-w-md w-full"
                onClick={(e) => e.stopPropagation()}
              >
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-xl font-bold text-white-black">
                    Как заполнить жалобу
                  </h3>
                  <button
                    onClick={() => setIsHelpModalOpen(false)}
                    className="text-white-black hover:text-purple transition-colors"
                  >
                    ✕
                  </button>
                </div>
                <div className="space-y-4 text-white-black/80 text-left">
                  <div>
                    <h4 className="font-semibold mb-2 text-white-black">
                      Адрес
                    </h4>
                    <p>Укажите адрес проблемы одним из способов:</p>
                    <ul className="list-disc pl-5 mt-2 space-y-1">
                      <li>Выберите точку на карте</li>
                      <li>Разрешите определение геолокации</li>
                      <li>Введите адрес вручную</li>
                    </ul>
                  </div>
                  <div>
                    <h4 className="font-semibold mb-2 text-white-black">
                      Жалоба
                    </h4>
                    <p>Опишите проблему максимально подробно:</p>
                    <ul className="list-disc pl-5 mt-2 space-y-1">
                      <li>Что случилось?</li>
                      <li>Как долго существует проблема?</li>
                      <li>Какие меры уже были приняты?</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AuthPage;
