/* eslint-disable react-refresh/only-export-components */
import { createContext, useState } from "react";

interface ShowIdContextType {
  showId: string | null;
  handleShowId: (newShowId: string | null) => void;
}

interface PropsType {
  children: React.ReactNode;
}

export const showIdContext = createContext<ShowIdContextType>({ showId: null, handleShowId: () => {} });

export const ShowIdProvider: React.FC<PropsType> = ({ children }) => {
  const [showId, setShowId] = useState<string | null>(null);
  const handleShowId = (showId: string | null) => setShowId(() => showId);
  return <showIdContext.Provider value={{ showId, handleShowId }}>{children}</showIdContext.Provider>;
};
