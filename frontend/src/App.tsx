import { ReactNode } from "react";
import SideBarProvider from "./contexts/SideBarContext";
import { ThemeProvider } from "./contexts/ThemeContext";

type AppProps = {
  children: ReactNode;
};

function App({ children }: AppProps) {
  return (
    <ThemeProvider defaultTheme="light" storageKey="vite-ui-theme">
      <SideBarProvider>
        {children}
      </SideBarProvider>
    </ThemeProvider>
  );
}

export default App;
