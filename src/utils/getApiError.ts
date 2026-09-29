import axios from "axios";

type ErrorResponse = {
  errorMessage?: string;
};

export const getApiError = (error: unknown) => {
  if (axios.isAxiosError<ErrorResponse>(error)) {
    return {
      status: error.response?.status,
      message:
        error.response?.data?.errorMessage ||
        "Something went wrong",
    };
  }

  return {
    status: undefined,
    message: "Something went wrong",
  };
};