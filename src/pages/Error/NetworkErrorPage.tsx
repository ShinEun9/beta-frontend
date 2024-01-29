import { usePreventScroll } from "@/hooks";

const NetworkErrorPage = () => {
  usePreventScroll({ isModal: false });

  return <div style={{ position: "fixed", inset: 0, zIndex: "200", backgroundColor: "white", textAlign: "center" }}>NetworkErrorPage</div>;
};

export default NetworkErrorPage;
