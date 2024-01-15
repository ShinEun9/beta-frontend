import { useEffect } from "react";
import { Outlet, useLocation } from "react-router-dom";
import { QueryCache, QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Header } from "./components/layouts";
import { useModalStore } from "./stores";
import PrivateRoute from "./PrivateRoute";
import { useApiError } from "./hooks";

function App() {
  const location = useLocation();
  const { setOpenModal } = useModalStore();
  const isPrivateRoute = location.pathname.startsWith("/mypage");

  useEffect(() => {
    if (location.state?.from !== "detail") window.scrollTo(0, 0);
    setOpenModal({ state: false, type: "" });
  }, [location.pathname, setOpenModal]);

  const { handleError } = useApiError();
  const queryClient = new QueryClient({
    defaultOptions: {
      mutations: {
        onError: handleError,
      },
    },
    queryCache: new QueryCache({
      onError: handleError,
    }),
  });

  return (
    <QueryClientProvider client={queryClient}>
      {location.pathname !== "/signup" && location.pathname !== "/login" && <Header />}
      {isPrivateRoute ? <PrivateRoute /> : <Outlet />}
      {/* <ReactQueryDevtools initialIsOpen={false} /> */}
    </QueryClientProvider>
  );
}

export default App;
