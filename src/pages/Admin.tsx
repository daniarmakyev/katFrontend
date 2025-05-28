const Admin = () => {
  const services = [
    {
      name: "Медицина",
      route: "/admin/medicine",
      gradient: "from-blue-700 to-blue-900",
      description: "Управление медицинскими услугами",
    },
    {
      name: "Экология",
      route: "/admin/ecology",
      gradient: "from-green-700 to-green-900",
      description: "Экологический мониторинг",
    },
    {
      name: "Полиция",
      route: "/admin/police",
      gradient: "from-red-700 to-red-900",
      description: "Система безопасности",
    },
    {
      name: "Транспорт",
      route: "/admin/transport",
      gradient: "from-purple-700 to-purple-900",
      description: "Транспортная система",
    },
    {
      name: "ЖКХ",
      route: "/admin/housing",
      gradient: "from-orange-700 to-orange-900",
      description: "Жилищно-коммунальные услуги",
    },
    {
      name: "Социальные услуги",
      route: "/admin/social",
      gradient: "from-pink-700 to-pink-900",
      description: "Социальная поддержка",
    },
    {
      name: "Правительство",
      route: "/admin/government",
      gradient: "from-indigo-700 to-indigo-900",
      description: "Государственные услуги",
    },
    {
      name: "Коррупция",
      route: "/admin/corruption",
      gradient: "from-gray-700 to-gray-900",
      description: "Борьба с коррупцией",
    },
    {
      name: "Образование",
      route: "/admin/education",
      gradient: "from-teal-700 to-teal-900",
      description: "Образовательная система",
    },
  ];

  const handleCardClick = (route: string) => {
    window.location.href = `http://localhost:5173${route}`;
  };

  return (
    <div className="min-h-screen bg-primary-bg from-slate-900 via-purple-900 to-slate-900 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold  mb-4 bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent">
            Админ панель
          </h1>
          <p className="text-white-black text-lg">
            Здесь вы можете открыть любой сервис
          </p>
          <div className="w-24 h-1 bg-gradient-to-r from-cyan-400 to-purple-400 mx-auto mt-4 rounded-full"></div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {services.map((service, index) => (
            <div
              key={index}
              onClick={() => handleCardClick(service.route)}
              className="group relative h-32 w-full min-w-40 cursor-pointer transform transition-all duration-300 hover:scale-105 hover:shadow-2xl"
            >
              <div
                className={`absolute inset-0 bg-gradient-to-br ${service.gradient} rounded-xl opacity-80 group-hover:opacity-100 transition-opacity duration-300`}
              ></div>

              <div
                className="absolute inset-0 rounded-xl opacity-10 group-hover:opacity-20 transition-opacity duration-300"
                style={{
                  backgroundImage: `radial-gradient(circle at 25% 25%, white 2px, transparent 2px), 
                                      radial-gradient(circle at 75% 75%, white 2px, transparent 2px)`,
                  backgroundSize: "20px 20px",
                }}
              ></div>

              <div className="relative h-full p-6 flex flex-col justify-between text-white">
                <div className="flex items-center space-x-3">
                  <h3 className="text-lg font-bold truncate">{service.name}</h3>
                </div>

                <p className="text-sm text-white/80 group-hover:text-white transition-colors duration-300">
                  {service.description}
                </p>

                <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transform translate-x-2 group-hover:translate-x-0 transition-all duration-300">
                  <svg
                    className="w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 5l7 7-7 7"
                    />
                  </svg>
                </div>
              </div>

              <div className="absolute inset-0 rounded-xl border border-white/20 group-hover:border-white/40 transition-colors duration-300"></div>
            </div>
          ))}
        </div>

        <div className="text-center mt-12">
          <div className="inline-flex items-center space-x-2 text-white-black text-sm">
            <div className="w-2 h-2 bg-cyan-400 rounded-full animate-pulse"></div>
            <span>Система активна</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Admin;
