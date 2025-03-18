import { createContext, ReactNode, useContext, useEffect, useState } from "react";

type SideBarProviderProps = {
  children: ReactNode;
};

interface SideBarContextType {
  isLargeOpen: boolean;
  isSmallOpen: boolean;
  toggle: () => void;
  close: () => void;
}

const SideBarContext = createContext<SideBarContextType | null>(null);

export function useSideBarContext() {
  const value = useContext(SideBarContext);

  if (value == null) throw new Error("Cannot use outside of SideBarProvider");

  return value;
}

const SideBarProvider = ({ children }: SideBarProviderProps) => {
  const [isLargeOpen, setIsLargeOpen] = useState(true);
  const [isSmallOpen, setIsSmallOpen] = useState(false);

  useEffect(() => {
    const handler = () => {
      if(!isSmallScreen()) setIsSmallOpen(false)
    }

    window.addEventListener("resize", handler)

    return () => {
    window.removeEventListener("resize", handler)
    }
  }, [])


  function isSmallScreen() {
    return window.innerWidth < 1024;
  }

  function toggle() {
    if (isSmallScreen()) {
      setIsSmallOpen((s) => !s);
    } else {
      setIsLargeOpen((l) => !l);
    }
  }

  function close() {
    if (isSmallScreen()) {
      setIsSmallOpen(false);
    } else {
      setIsLargeOpen(false);
    }
  }

  return (
    <SideBarContext.Provider
      value={{ isLargeOpen, isSmallOpen, toggle, close }}
    >
      {children}
    </SideBarContext.Provider>
  );
};

export default SideBarProvider;
