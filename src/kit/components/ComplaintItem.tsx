import { useState, useEffect } from "react";
import { useAppDispatch } from "../../hooks/hooks";
import { complaintstatusChange } from "../../store/action/complaints.action";
import {
  decodeStatus,
  type IComplaints,
} from "../../store/slice/complaints.slice";
import CheckBox from "./ChekBox";
import StatusSelect from "./StatusSelect";

const ComplaintItem = ({
  complaint,
  openModal,
}: {
  complaint: IComplaints;
  openModal: (mode: "view") => void;
}) => {
  const dispatch = useAppDispatch();
  const [checked, setChecked] = useState(
    complaint.status === "завершена" || complaint.status === "отклонена"
  );
  const [isStatusChanging, setIsStatusChanging] = useState(false);

  useEffect(() => {
    setChecked(
      complaint.status === "завершена" || complaint.status === "отклонена"
    );
  }, [complaint.status]);

  const handleStatusChange = async (newStatus: string) => {
    if (isStatusChanging) return;
    setIsStatusChanging(true);

    try {
      await dispatch(
        complaintstatusChange({
          complaintId: String(complaint.id!),
          status: newStatus,
        })
      ).unwrap();
    } catch (error) {
      console.error("Error updating status:", error);
    } finally {
      setIsStatusChanging(false);
    }
  };

  const handleCheckboxChange = async () => {
    const newStatus = checked ? "в обработке" : "завершена";
    await handleStatusChange(newStatus);
  };

  return (
    <li
      className="w-full flex justify-start sm:justify-between items-center border-b-purple border-b-[1px] pb-3 pt-3 hover:bg-task-hover cursor-pointer p-1"
      onClick={() => {
        openModal("view");
      }}
    >
      <div className="flex items-center gap-2 sm:gap-3">
        <CheckBox checked={checked} checkBoxOnClick={handleCheckboxChange} />
        <div>
          <h5
            className={`text-xs sm:text-lg m-0 text-white-black max-w-[100px] sm:w-auto sm:max-w-[350px] md:max-w-[450px] truncate whitespace-nowrap overflow-hidden ${
              checked ? "line-through mask-linear-to-neutral" : ""
            }`}
          >
            {complaint.complaint}
          </h5>
          <p
            className={`text-xs md:text-sm font-normal  text-[#a9a9a9] w-[30vw] max-w-[100vw] sm:w-auto sm:max-w-[250px] md:max-w-[350px] truncate whitespace-nowrap overflow-hidden ${
              checked ? "line-through" : ""
            }`}
          >
            {complaint.address}
          </p>
        </div>
      </div>

      <div className="flex sm:gap-2 items-end">
        <span
          className={`text-xs md:text-sm  text-white-black sm:block hidden ${
            checked ? "line-through mask-linear-to-neutral" : ""
          }`}
        >
          {new Date(complaint.createdAt ?? new Date()).toLocaleDateString(
            "ru-RU"
          )}
        </span>
        <div className="flex flex-col justify-center items-end gap-y-2">
          <div className="flex items-center justify-end gap-12 max-w-[320px] w-full flex-nowrap">
            <div className="flex items-center gap-2">
              <svg
                viewBox="0 0 100 100"
                fill={
                  complaint.seriousnessScore > 4 &&
                  complaint.seriousnessScore < 7
                    ? "oklch(75% 0.183 55.934)"
                    : complaint.seriousnessScore < 4
                    ? "oklch(50.5% 0.213 27.518)"
                    : "oklch(62.7% 0.194 149.214)"
                }
                xmlns="http://www.w3.org/2000/svg"
                width={20}
                height={20}
              >
                <circle cx="50" cy="50" r="50" />
              </svg>
              <span className="text-white-black">
                {complaint.seriousnessScore} / 10{" "}
              </span>
            </div>
            <label htmlFor="" className="text-white-black">
              Статус
            </label>
          </div>
          <StatusSelect
            status={decodeStatus(complaint.status)}
            onChange={handleStatusChange}
            disabled={isStatusChanging}
          />
        </div>
      </div>
    </li>
  );
};

export default ComplaintItem;
