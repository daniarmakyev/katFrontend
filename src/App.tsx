import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { useAppSelector, useAppDispatch } from "./hooks/hooks";
import InputSearch from "./kit/components/InputSearch";
import Notify from "./kit/components/Notify";
import Select from "./kit/components/Select";
import detective from "./kit/assets/detective.png";
import { getСomplaintsListByFilter } from "./store/action/complaints.action";
import ComplaintItem from "./kit/components/ComplaintItem";
import {
  decodeSpecialization,
  hideNotification,
  type IComplaints,
} from "./store/slice/complaints.slice";
import ComplaintModal from "./kit/components/CoplaintModal";

const filterSelectList = [
  "все",
  "новая",
  "в обработке",
  "ожидает уточнения",
  "отклонена",
  "завершена",
];

const sortTypes = {
  severity: "По серьезности",
  date: "По дате",
};

const sortOptions = [
  { value: "severity", label: "По серьезности" },
  { value: "date", label: "По дате" },
];

function App() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentComplaint, setCurrentComplaint] = useState<IComplaints | null>(
    null
  );
  const [searchValue, setSearchValue] = useState("");
  const [filterStatus, setFilterStatus] = useState(filterSelectList[0]);
  const [sortType, setSortType] = useState<"severity" | "date">("date");
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("desc");
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isSortModalOpen, setIsSortModalOpen] = useState(false);

  const { complaints, notification, loading } = useAppSelector(
    (state) => state.complaint
  );
  const dispatch = useAppDispatch();
  const { specialization } = useParams();

  const sortedComplaints = [...complaints].sort((a, b) => {
    if (sortType === "date") {
      const dateA = a.createdAt || new Date(0).toISOString();
      const dateB = b.createdAt || new Date(0).toISOString();
      return sortDirection === "desc"
        ? new Date(dateB).getTime() - new Date(dateA).getTime()
        : new Date(dateA).getTime() - new Date(dateB).getTime();
    } else {
      return sortDirection === "desc"
        ? b.seriousnessScore - a.seriousnessScore
        : a.seriousnessScore - b.seriousnessScore;
    }
  });

  useEffect(() => {
    const timeout = setTimeout(() => {
      dispatch(
        getСomplaintsListByFilter({
          searchValue,
          status: filterStatus,
          specialization,
        })
      );
    }, 300);

    return () => clearTimeout(timeout);
  }, [searchValue, filterStatus, specialization, dispatch]);

  return (
    <div className="bg-primary-bg min-h-screen flex flex-col items-center relative px-2">
      <div className="max-w-[750px] w-full relative">
        {notification.show && (
          <Notify
            type={notification.type}
            message={notification.message}
            onClose={() => dispatch(hideNotification())}
          />
        )}
        <h1 className="mb-4 text-white-black text-2xl md:mt-10 mt-5 uppercase w-fit sm:mx-auto font-semibold">
          {decodeSpecialization(specialization || "")}
        </h1>
        <div className="flex gap-4 w-full items-center">
          <InputSearch
            value={searchValue}
            onChange={(e) => setSearchValue(e.target.value)}
          />
          <Select
            list={filterSelectList}
            thumb={filterStatus}
            onChange={setFilterStatus}
          />
          <div className="relative">
            <button
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              className="px-3 py-2 text-nowrap bg-purple hover:bg-dark-purple text-white rounded-md transition-colors flex items-center gap-2"
            >
              <span className="              border-white border-e-2 pe-2">
                {sortTypes[sortType]}
              </span>
              <svg
                className={`w-4 h-4 transition-transform  ${
                  sortDirection === "desc" ? "rotate-180" : ""
                }`}
                onClick={(e) => {
                  e.stopPropagation();
                  setSortDirection(sortDirection === "asc" ? "desc" : "asc");
                }}
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={3}
                  d="M5 15l7-7 7 7"
                />
              </svg>
            </button>

            {isDropdownOpen && (
              <div
                className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg z-50 border border-gray-200"
                onClick={() => setIsDropdownOpen(false)}
              >
                <div className="py-1">
                  <button
                    onClick={() => setSortType("severity")}
                    className={`w-full text-left px-4 py-2 text-black hover:bg-purple-50 ${
                      sortType === "severity" ? "bg-purple-100" : ""
                    }`}
                  >
                    По серьезности
                  </button>
                  <button
                    onClick={() => setSortType("date")}
                    className={`w-full text-left px-4 py-2 text-black  ${
                      sortType === "date" ? "bg-purple-100" : ""
                    }`}
                  >
                    По дате
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>

        {isSortModalOpen && (
          <div
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-3 z-[51]"
            onClick={() => setIsSortModalOpen(false)}
          >
            <div
              className="bg-white rounded-lg p-4 w-full max-w-xs"
              onClick={(e) => e.stopPropagation()}
            >
              <h3 className="text-lg font-semibold text-black mb-4">
                Сортировка
              </h3>
              <div className="space-y-2">
                {sortOptions.map((option) => (
                  <button
                    key={option.value}
                    onClick={() => {
                      setSortType(option.value as "severity" | "date");
                      setIsSortModalOpen(false);
                    }}
                    className={`w-full text-left px-3 py-2 rounded ${
                      sortType === option.value
                        ? "bg-purple-600 text-white"
                        : "text-black hover:bg-gray-100"
                    }`}
                  >
                    {option.label}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        <ul className="mt-5 flex flex-col items-center">
          {loading ? (
            <div className="w-16 h-16 border-4 border-t-transparent border-white-black border-solid rounded-full animate-spin mt-10"></div>
          ) : sortedComplaints.length === 0 ? (
            <li className="mx-auto">
              <img
                src={detective}
                alt="empty image"
                className="max-w-[225px] max-h-[171px]"
              />
              <h2 className="text-center text-white-black text-lg md:text-xl">
                Пусто...
              </h2>
            </li>
          ) : (
            sortedComplaints.map((complaint) => (
              <ComplaintItem
                key={complaint.id}
                complaint={complaint}
                openModal={() => {
                  setCurrentComplaint(complaint);
                  setIsModalOpen(true);
                }}
              />
            ))
          )}
        </ul>
      </div>

      {isModalOpen && currentComplaint && (
        <ComplaintModal
          complaints={currentComplaint}
          onClose={() => {
            setIsModalOpen(false);
            setCurrentComplaint(null);
          }}
        />
      )}
    </div>
  );
}

export default App;
