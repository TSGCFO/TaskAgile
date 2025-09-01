import { create } from "zustand";
import { persist } from "zustand/middleware";

interface ToolsState {
  webSearch: boolean;
  fileSearch: boolean;
  codeInterpreter: boolean;
  functions: boolean;
  weather: boolean;
  jokes: boolean;
  googleCalendar: boolean;
  googleGmail: boolean;
  currentVectorStore: { id: string; name: string };
  setWebSearch: (enabled: boolean) => void;
  setFileSearch: (enabled: boolean) => void;
  setCodeInterpreter: (enabled: boolean) => void;
  setFunctions: (enabled: boolean) => void;
  setWeather: (enabled: boolean) => void;
  setJokes: (enabled: boolean) => void;
  setGoogleCalendar: (enabled: boolean) => void;
  setGoogleGmail: (enabled: boolean) => void;
  setCurrentVectorStore: (store: { id: string; name: string }) => void;
}

const useToolsStore = create<ToolsState>()(
  persist(
    (set) => ({
      webSearch: true,
      fileSearch: false,
      codeInterpreter: true,
      functions: true,
      weather: true,
      jokes: false,
      googleCalendar: false,
      googleGmail: false,
      currentVectorStore: { id: "", name: "Example Store" },
      setWebSearch: (enabled) => set({ webSearch: enabled }),
      setFileSearch: (enabled) => set({ fileSearch: enabled }),
      setCodeInterpreter: (enabled) => set({ codeInterpreter: enabled }),
      setFunctions: (enabled) => set({ functions: enabled }),
      setWeather: (enabled) => set({ weather: enabled }),
      setJokes: (enabled) => set({ jokes: enabled }),
      setGoogleCalendar: (enabled) => set({ googleCalendar: enabled }),
      setGoogleGmail: (enabled) => set({ googleGmail: enabled }),
      setCurrentVectorStore: (store) => set({ currentVectorStore: store }),
    }),
    {
      name: "tools-config",
    }
  )
);

export default useToolsStore;
