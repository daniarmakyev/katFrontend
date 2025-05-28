import { Link } from "react-router-dom";

const HeaderAdmin = () => {
  return (
    <div className="bg-primary-bg">
      <header className="max-w-[1190px] w-full mx-auto ">
        <nav>
          <div className="flex justify-start gap-4 items-center p-4 text-white-black">
            <Link to={"/admin"}>Меню</Link>
            <Link to={"/graf"}>Аналитика</Link>
          </div>
        </nav>
      </header>
    </div>
  );
};

export default HeaderAdmin;
