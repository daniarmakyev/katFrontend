import { createSlice } from "@reduxjs/toolkit";
import { getСomplaintsList, getСomplaintsListByFilter, complaintstatusChange } from "../action/complaints.action";

export interface IComplaints {
  id?: string | number;
  complaint: string;    // Changed from body
  address: string;      // Added this field
  category: string;
  status: "new" | "in_progress" | "waiting" | "rejected" | "completed" | string;
  seriousnessScore: number;
  createdAt?: string;   // Added this field
  updatedAt?: string;   // Added this field
}

interface ComplaintsState {
  complaint: IComplaints;
  complaints: IComplaints[];
  loading: boolean;
  error: string | null;
  notification: {
    show: boolean;
    message: string;
    type: "success" | "error" | "warning" | "info" | "loading";
  }
}

const initialState: ComplaintsState = {
  complaint: {
    id: "",
    category: "",
    address: "",
    status: "",
    createdAt: "",
    updatedAt: "",
    seriousnessScore: 0,
    complaint: "", // Changed from body to complaint
  },
  complaints: [],
  loading: false,
  error: null,
  notification: {
    show: false,
    message: "",
    type: "info"
  }
};

// Add these helper functions at the top of the file
export const decodeStatus = (status: string): string => {
  switch (status) {
    case "new":
      return "новая";
    case "in_progress":
      return "в обработке";
    case "waiting":
      return "ожидает уточнения";
    case "rejected":
      return "отклонена";
    case "completed":
      return "завершена";
    default:
      return status;
  }
};

export const decodeSpecialization = (specialization: string): string => {
  switch (specialization) {
    case "medicine":
      return "медицина";
    case "ecology":
      return "экология";
    case "police":
      return "полиция";
    case "transport":
      return "транспорт";
    case "housing":
      return "жкх";
    case "social":
      return "соцзащита";
    case "government":
      return "госуслуги";
    case "corruption":
      return "коррупция";
    case "education":
      return "образование";
    default:
      return specialization;
  }
};

const complaintsSlice = createSlice({
  name: "complaint",
  initialState,
  reducers: {
    hideNotification: (state) => {
      state.notification.show = false;
    }
  },
  extraReducers: (builder) => {
    builder
      // Обработка изменения статуса жалобы
      .addCase(complaintstatusChange.pending, (state) => {
        // Не показываем уведомления для изменения статуса
        state.error = null;
      })

      // filepath: /Users/daniarmakyev/Desktop/toDoList/src/store/slice/complaints.slice.ts
      .addCase(complaintstatusChange.fulfilled, (state, { payload }) => {
        // Находим жалобу в массиве и обновляем её
        const complaintIndex = state.complaints.findIndex(
          complaint => complaint.id === payload.id
        );

        if (complaintIndex !== -1) {
          // Обновляем жалобу с новыми данными из ответа сервера
          state.complaints[complaintIndex] = {
            ...state.complaints[complaintIndex],
            ...payload,
            status: decodeStatus(payload.status) // Decode the status here
          };
        }

        // Если это текущая выбранная жалоба, обновляем и её
        if (state.complaint.id === payload.id) {
          state.complaint = { ...state.complaint, ...payload, status: decodeStatus(payload.status) }; // Decode the status here
        }
      })
      .addCase(complaintstatusChange.rejected, (state, action) => {
        state.error = action.error.message || "Не удалось обновить статус жалобы";
        state.notification = {
          show: true,
          message: `Ошибка: ${action.error.message || "Не удалось обновить статус жалобы"}`,
          type: "error"
        };
      })
      .addCase(getСomplaintsList.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.notification = {
          show: true,
          message: "Загрузка жалоб...",
          type: "loading"
        };
      })
      .addCase(getСomplaintsList.fulfilled, (state, { payload }) => {
        state.complaints = payload.map((complaint: { status: string; }) => ({
          ...complaint,
          status: decodeStatus(complaint.status)
        }));
        state.loading = false;
        state.notification = {
          show: true,
          message: "Жалобы успешно загружены",
          type: "success"
        };
      })
      .addCase(getСomplaintsList.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Не удалось загрузить жалобы";
        state.notification = {
          show: true,
          message: `Ошибка: ${action.error.message || "Не удалось загрузить жалобы"}`,
          type: "error"
        };
      })
      .addCase(getСomplaintsListByFilter.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.notification = {
          show: true,
          message: "Фильтрация жалоб...",
          type: "loading"
        };
      })
      .addCase(getСomplaintsListByFilter.fulfilled, (state, { payload }) => {
        state.complaints = payload.map((complaint: IComplaints) => ({
          ...complaint,
          status: decodeStatus(complaint.status),
          category: decodeSpecialization(complaint.category) 
        }));
        state.loading = false;
        state.notification = {
          show: true,
          message: "Жалобы успешно загружены",
          type: "success"
        };
      })
      .addCase(getСomplaintsListByFilter.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Failed to filter complaints";
        state.notification = {
          show: true,
          message: `Error: ${action.error.message || "Failed to filter complaints"}`,
          type: "error"
        };
      });
  },
});

export const { hideNotification } = complaintsSlice.actions;
export default complaintsSlice;