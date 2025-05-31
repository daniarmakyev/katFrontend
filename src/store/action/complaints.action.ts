import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import type { IComplaints } from "../slice/complaints.slice";
import { api } from "../../helpers/const";

const encodeStatus = (status: string): string => {
  switch (status) {
    case "новая":
      return "new";
    case "в обработке":
      return "in_progress";
    case "ожидает уточнения":
      return "waiting";
    case "отклонена":
      return "rejected";
    case "завершена":
      return "completed";
    default:
      return status;
  }
};

const encodeSpecialization = (specialization: string): string => {
  switch (specialization) {
    case "медицина":
      return "medicine";
    case "экология":
      return "ecology";
    case "полиция":
      return "police";
    case "транспорт":
      return "transport";
    case "жкх":
      return "housing";
    case "соцзащита":
      return "social";
    case "госуслуги":
      return "government";
    case "коррупция":
      return "corruption";
    case "образование":
      return "education";
    default:
      return specialization;
  }
};

interface ComplaintsResponse {
  message: string;
  data: IComplaints[];
}

interface RecommendationResponse {
  message: string;
  data: string;
}

export const complaintstatusChange = createAsyncThunk(
  "complaints/complaintstatusChange",
  async ({ complaintId, status }: { complaintId: string | number; status: string }) => {
    try {
      const response = await axios.patch(`${api}${complaintId}`, {
        status: encodeStatus(status), 
      });

      return response.data.data;
    } catch (error) {
      console.error("Error updating complaints:", error);
      throw error;
    }
  }
);

export const getСomplaintsListByFilter = createAsyncThunk(
  "complaints/getComplaintsList",
  async ({
    searchValue = "",
    status = "все",
    specialization = ""
  }: {
    searchValue?: string;
    status?: string;
    specialization?: string;
  }) => {
    try {
      const params: Record<string, string> = {};
      
      if (searchValue && searchValue.trim() !== "") {
        params.complaint_like = searchValue.trim();
      }
      
      if (status && status !== "все" && status.trim() !== "") {
        params.status = encodeStatus(status);
      }
      
      if (specialization && specialization.trim() !== "") {
        params.specialization = encodeSpecialization(specialization.trim());
      }

      console.log("Отправляемые параметры:", params);

      const response = await axios.get<ComplaintsResponse>(`${api}complaints`, {
        params
      });
      
      return response.data.data;
    } catch (error) {
      console.error("Error fetching complaints:", error);
      throw error;
    }
  }
);
export const getСomplaintsList = createAsyncThunk(
  "complaints/getСomplaintsList",
  async () => {
    try {
      const response = await axios.get(`${api}complaints`);
      return response.data.data; 
    } catch (error) {
      console.error("Error fetching complaints:", error);
      throw error;
    }
  }
);

export const createComplaints = createAsyncThunk(
  "complaints/createComplaints",
  async (data: IComplaints, thunkAPI) => {
    try {
      await axios.post(`${api}complaints`, data);
      thunkAPI.dispatch(getСomplaintsListByFilter({ searchValue: "", status: "все" }));
    } catch (error) {
      console.error("Error creating complaints:", error);
      throw error;
    }
  }
);

export const editComplaints = createAsyncThunk(
  "complaints/editComplaints",
  async ({ id, updatedComplaints }: { id: string; updatedComplaints: Partial<IComplaints> }, thunkAPI) => {
    try {
      await axios.patch(`${api}complaints/${id}`, updatedComplaints);
      thunkAPI.dispatch(getСomplaintsListByFilter({ searchValue: "", status: "все" }));
    } catch (error) {
      console.error("Error editing complaints:", error);
      throw error;
    }
  }
);

export const deleteComplaints = createAsyncThunk(
  "complaints/deleteComplaints",
  async (complaintId: string, thunkAPI) => {
    try {
      await axios.delete(`${api}complaints/${complaintId}`);
      thunkAPI.dispatch(getСomplaintsListByFilter({ searchValue: "", status: "все" }));
    } catch (error) {
      console.error("Error deleting complaints:", error);
      throw error;
    }
  }
);

export const getRecommendation = createAsyncThunk(
  "complaints/getRecommendation",
  async (complaint: string) => {
    try {
      const response = await axios.post<RecommendationResponse>(
        `${api}recommendation`,
        { complaint }
      );
      return response.data.data;
    } catch (error) {
      console.error("Error getting recommendation:", error);
      throw error;
    }
  }
);