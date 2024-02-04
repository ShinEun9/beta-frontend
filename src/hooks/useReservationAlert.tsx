import { toast, Id } from "react-toastify";

const useReservationAlert = () => {
  const showReservationAlert = (toastId: Id) => {
    toast.update(toastId, {
      render: "예매 진행 중...",
      type: toast.TYPE.INFO,
      isLoading: true,
    });
  };
  const showReservationSuccessAlert = (toastId: Id) => {
    toast.update(toastId, {
      render: (
        <p>
          예매 성공하였습니다. <br />
          마이페이지에서 확인하세요.
        </p>
      ),
      type: toast.TYPE.SUCCESS,
      isLoading: false,
      autoClose: 2000,
    });
  };

  const showReservationFailAlert = (toastId: Id, errorMessage: string) => {
    toast.update(toastId, {
      render: errorMessage,
      type: toast.TYPE.ERROR,
      isLoading: false,
      autoClose: 2000,
    });
  };

  return { showReservationAlert, showReservationSuccessAlert, showReservationFailAlert };
};

export default useReservationAlert;
