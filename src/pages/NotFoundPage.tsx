import { useNavigate } from "react-router-dom";

export default function NotFoundPage() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-primary-bg flex items-center justify-center px-4">
      <div className="max-w-2xl w-full text-center space-y-8">
        {/* Заголовок */}
        <div className="space-y-4">
          <h1 className="text-8xl font-bold text-purple">404</h1>
          <h2 className="text-2xl font-semibold text-white-black">
            Страница не найдена
          </h2>
        </div>

        {/* Описание */}
        <div className="space-y-6">
          <p className="text-white-black/80 text-lg">
            Извините, но запрашиваемая страница не существует или была перемещена.
          </p>
          <p className="text-white-black/60">
            Рекомендуем проверить правильность введенного адреса или вернуться на главную страницу.
          </p>
        </div>

        {/* Кнопки */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center mt-8">
          <button
            onClick={() => navigate(-1)}
            className="px-6 py-2 border-2 border-purple text-purple rounded-md 
              hover:bg-purple hover:text-white transition-all duration-300"
          >
            Вернуться назад
          </button>
          <button
            onClick={() => navigate("/")}
            className="px-6 py-2 bg-purple text-white rounded-md
              hover:bg-dark-purple transition-all duration-300"
          >
            На главную
          </button>
        </div>
      </div>
    </div>
  );
}