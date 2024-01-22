import axios from "axios";
import { useCallback } from "react";
import { toast } from "react-toastify";

interface ErrorResponse {
  ok: boolean;
  message: string;
}

const useApiError = () => {
  const handleError = useCallback((error: unknown) => {
    // 얘는 잘 안 먹힘
    if (!navigator.onLine) {
      toast.error("인터넷 연결이 끊겼습니다. 연결 상태를 확인해주세요.");
      return;
    }

    if (axios.isAxiosError(error)) {
      if (error.response) {
        const httpStatus = error.response?.status;
        const errorResponse = error.response?.data as ErrorResponse;
        const httpMessage = errorResponse.message;

        // 에러 핸들러를 실행하기 전에 httpStatus가 유효한지 확인합니다.
        const handle = httpStatus ? statusHandlers[httpStatus] : statusHandlers.default;
        handle(httpMessage);
      } else {
        toast.error("서버 연결이 원활하지 않습니다.");
      }
    } else {
      toast.error("네트워크 연결 오류 또는 기타 오류가 발생했습니다.");
    }
  }, []);

  return { handleError };
};

const statusHandlers: { [key: number]: (msg: string) => void; default: (msg: string) => void } = {
  400: (msg: string) => toast.error(msg),
  401: (msg: string) => toast.error(`인증 에러 : ${msg}`),
  500: () => toast.error("서버 오류가 발생했습니다."),
  default: () => toast.error("서버에서 알 수 없는 오류가 발생했습니다."),
};

export default useApiError;
