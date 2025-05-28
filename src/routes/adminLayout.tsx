import React, { useEffect, useState } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import HeaderAdmin from "../kit/components/HeaderAdmin";
import { useAppDispatch, useAppSelector } from "../hooks/hooks";
import ChangeThemeButton from "../kit/components/ChangeThemeButton";
import Input from "../kit/components/Input";
import { loginUser, logout } from "../store/action/user.actions";

const AdminLayout = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { user, isAuth } = useAppSelector((state) => state.user); // Add error
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [loginError, setLoginError] = useState<string | null>(null);
  const [loginData, setLoginData] = useState({
    login: "",
    password: "",
  });
  const userId = localStorage.getItem("userId");
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();

    // Add admin shortcut logic
    if (loginData.login === "admin" && loginData.password === "admin") {
      localStorage.setItem("userId", "admin");
      setIsLoginModalOpen(false);
      setLoginData({ login: "", password: "" });
      navigate("/admin");
      return;
    }

    // Existing login logic
    try {
      setLoginError(null);
      await dispatch(loginUser(loginData)).unwrap();
      setIsLoginModalOpen(false);
      setLoginData({ login: "", password: "" });
    } catch (error: unknown) {
      setLoginError(error instanceof Error ? error.message : "Ошибка при входе");
    }
  };
  useEffect(() => {
    if (isAuth || user) {
      navigate(`/admin/${user?.specialization}`);
    }
  }, [isAuth, navigate, user]);

  const handleLogout = () => {
    dispatch(logout());
  };

  return (
    <div className="relative">
      {userId && userId === "admin" && (
        <button
          type="button"
          onClick={() => navigate("/admin")}
          className="fixed bottom-32 right-2 sm:right-8 z-30  bg-purple hover:bg-dark-purple hover:shadow-[0_0_4px_0_rgb(108,99,255)] rounded-md p-2 h-10"
        >
          <svg
            fill="#000000"
            viewBox="0 0 24 24"
            id="home-alt-3"
            width={22}
            height={22}
            data-name="Flat Color"
            xmlns="http://www.w3.org/2000/svg"
          >
            <g id="SVGRepo_bgCarrier" stroke-width="0"></g>
            <g
              id="SVGRepo_tracerCarrier"
              stroke-linecap="round"
              stroke-linejoin="round"
            ></g>
            <g id="SVGRepo_iconCarrier">
              <path
                id="primary"
                d="M21.71,11.29l-9-9a1,1,0,0,0-1.42,0l-9,9a1,1,0,0,0-.21,1.09A1,1,0,0,0,3,13H4v7.3A1.77,1.77,0,0,0,5.83,22H8.5a1,1,0,0,0,1-1V16.1a1,1,0,0,1,1-1h3a1,1,0,0,1,1,1V21a1,1,0,0,0,1,1h2.67A1.77,1.77,0,0,0,20,20.3V13h1a1,1,0,0,0,.92-.62A1,1,0,0,0,21.71,11.29Z"
                fill="#f7f7f7"
              ></path>
            </g>
          </svg>
        </button>
      )}

      {!userId && (
        <button
          type="button"
          onClick={() => setIsLoginModalOpen(true)}
          className="fixed bottom-20 right-2 sm:right-8 z-30  bg-purple hover:bg-dark-purple hover:shadow-[0_0_4px_0_rgb(108,99,255)] rounded-md p-2 h-10"
        >
          <svg
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            width={22}
            height={22}
          >
            <g id="SVGRepo_bgCarrier" stroke-width="0"></g>
            <g
              id="SVGRepo_tracerCarrier"
              stroke-linecap="round"
              stroke-linejoin="round"
            ></g>
            <g id="SVGRepo_iconCarrier">
              {" "}
              <path
                d="M13 2C10.2386 2 8 4.23858 8 7C8 7.55228 8.44772 8 9 8C9.55228 8 10 7.55228 10 7C10 5.34315 11.3431 4 13 4H17C18.6569 4 20 5.34315 20 7V17C20 18.6569 18.6569 20 17 20H13C11.3431 20 10 18.6569 10 17C10 16.4477 9.55228 16 9 16C8.44772 16 8 16.4477 8 17C8 19.7614 10.2386 22 13 22H17C19.7614 22 22 19.7614 22 17V7C22 4.23858 19.7614 2 17 2H13Z"
                fill="#f7f7f7"
              ></path>{" "}
              <path
                d="M3 11C2.44772 11 2 11.4477 2 12C2 12.5523 2.44772 13 3 13H11.2821C11.1931 13.1098 11.1078 13.2163 11.0271 13.318C10.7816 13.6277 10.5738 13.8996 10.427 14.0945C10.3536 14.1921 10.2952 14.2705 10.255 14.3251L10.2084 14.3884L10.1959 14.4055L10.1915 14.4115C10.1914 14.4116 10.191 14.4122 11 15L10.1915 14.4115C9.86687 14.8583 9.96541 15.4844 10.4122 15.809C10.859 16.1336 11.4843 16.0346 11.809 15.5879L11.8118 15.584L11.822 15.57L11.8638 15.5132C11.9007 15.4632 11.9553 15.3897 12.0247 15.2975C12.1637 15.113 12.3612 14.8546 12.5942 14.5606C13.0655 13.9663 13.6623 13.2519 14.2071 12.7071L14.9142 12L14.2071 11.2929C13.6623 10.7481 13.0655 10.0337 12.5942 9.43937C12.3612 9.14542 12.1637 8.88702 12.0247 8.7025C11.9553 8.61033 11.9007 8.53682 11.8638 8.48679L11.822 8.43002L11.8118 8.41602L11.8095 8.41281C11.4848 7.96606 10.859 7.86637 10.4122 8.19098C9.96541 8.51561 9.86636 9.14098 10.191 9.58778L11 9C10.191 9.58778 10.1909 9.58773 10.191 9.58778L10.1925 9.58985L10.1959 9.59454L10.2084 9.61162L10.255 9.67492C10.2952 9.72946 10.3536 9.80795 10.427 9.90549C10.5738 10.1004 10.7816 10.3723 11.0271 10.682C11.1078 10.7837 11.1931 10.8902 11.2821 11H3Z"
                fill="#f7f7f7"
              ></path>{" "}
            </g>
          </svg>
        </button>
      )}

      {isLoginModalOpen && !userId && (
        <div
          className="fixed inset-0 bg-black/50 flex items-center justify-center p-3 z-[51]"
          onClick={() => setIsLoginModalOpen(false)}
        >
          <div
            className="border border-white-black bg-primary-bg rounded-lg p-6 max-w-md w-full"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-bold text-white-black">
                Вход в систему
              </h3>
              <button
                onClick={() => {
                  setIsLoginModalOpen(false);
                  setLoginError(null); // Clear error when closing modal
                }}
                className="text-white-black hover:text-purple transition-colors"
              >
                ✕
              </button>
            </div>
            <form onSubmit={handleLogin} className="space-y-4">
              <div>
                <label className="text-white-black">Логин</label>
                <Input
                  type="text"
                  value={loginData.login}
                  onChange={(e) =>
                    setLoginData({ ...loginData, login: e.target.value })
                  }
                  placeholder="Введите логин"
                  readOnly={false}
                  required
                />
              </div>
              <div>
                <label className="text-white-black">Пароль</label>
                <Input
                  type="password"
                  value={loginData.password}
                  readOnly={false}
                  onChange={(e) =>
                    setLoginData({ ...loginData, password: e.target.value })
                  }
                  placeholder="Введите пароль"
                  required
                />
              </div>
              {loginError && (
                <div className="text-red-500 text-sm p-2 bg-red-500/10 rounded border border-red-500/20">
                  {loginError}
                </div>
              )}
              <button
                type="submit"
                className="w-full bg-purple hover:bg-dark-purple text-white px-4 py-2 rounded-md transition-colors"
              >
                Войти
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Change userId to userId */}
      {userId && (
        <div className="fixed bottom-20 right-2 sm:right-8 cursor-pointer z-30 flex items-center justify-center gap-2   bg-purple hover:bg-dark-purple hover:shadow-[0_0_4px_0_rgb(108,99,255)] rounded-md p-2 h-10">
          <button onClick={handleLogout} className="">
            <svg
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              width={22}
              height={22}
            >
              <g id="SVGRepo_bgCarrier" stroke-width="0"></g>
              <g
                id="SVGRepo_tracerCarrier"
                stroke-linecap="round"
                stroke-linejoin="round"
              ></g>
              <g id="SVGRepo_iconCarrier">
                {" "}
                <path
                  d="M13 4.00881C13.0002 3.45653 12.5527 3.00864 12.0004 3.00842C11.4481 3.00821 11.0002 3.45575 11 4.00803L10.9968 12.0115C10.9966 12.5638 11.4442 13.0117 11.9965 13.0119C12.5487 13.0121 12.9966 12.5645 12.9968 12.0123L13 4.00881Z"
                  fill="#f7f7f7"
                ></path>{" "}
                <path
                  d="M4 12.9916C4 10.7824 4.89541 8.78247 6.34308 7.33476L7.7573 8.74898C6.67155 9.83476 6 11.3347 6 12.9916C6 16.3053 8.68629 18.9916 12 18.9916C15.3137 18.9916 18 16.3053 18 12.9916C18 11.3347 17.3284 9.83469 16.2426 8.74891L17.6568 7.33469C19.1046 8.78241 20 10.7824 20 12.9916C20 17.4098 16.4183 20.9916 12 20.9916C7.58172 20.9916 4 17.4098 4 12.9916Z"
                  fill="#f7f7f7"
                ></path>{" "}
              </g>
            </svg>{" "}
          </button>
        </div>
      )}

      <ChangeThemeButton className="fixed bottom-8 right-2 sm:right-8 z-30" />
      <HeaderAdmin />
      <Outlet />
    </div>
  );
};

export default AdminLayout;
