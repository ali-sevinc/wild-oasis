import { createContext, ReactNode, useContext, useEffect } from "react";
import { useLocalStorageState } from "../hooks/useLocalStorageState";

interface InitialType {
  isDarkMode: boolean;
  toggleDarkMode: () => void;
}
const initialState: InitialType = {
  isDarkMode: false,
  toggleDarkMode: () => {},
};

const DarkModeContext = createContext(initialState);

export default function DarkModeProvider({
  children,
}: {
  children: ReactNode;
}) {
  const [isDarkMode, setIsDarkMode] = useLocalStorageState(
    window.matchMedia("(prefers-color-scheme: dark)").matches,
    "isDarkMode"
  );

  useEffect(
    function () {
      if (isDarkMode) {
        document.documentElement.classList.add("dark-mode");
        document.documentElement.classList.remove("light-mode");
      } else {
        document.documentElement.classList.add("light-mode");
        document.documentElement.classList.remove("dark-mode");
      }
    },
    [isDarkMode]
  );

  function toggleDarkMode() {
    setIsDarkMode((prev: boolean) => !prev);
  }

  return (
    <DarkModeContext.Provider value={{ isDarkMode, toggleDarkMode }}>
      {children}
    </DarkModeContext.Provider>
  );
}

// eslint-disable-next-line react-refresh/only-export-components
export function useDarkMode() {
  const context = useContext(DarkModeContext);
  if (context === undefined)
    throw new Error("DarkModeContext was used outside of DarkModeProvider.");
  return context;
}
