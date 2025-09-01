'use client';

import {
  createContext,
  type Dispatch,
  type ReactNode,
  type SetStateAction,
  useContext,
  useState,
} from 'react';

const LayoutStateContext = createContext<boolean | undefined>(undefined);

const LayoutDispatchContext = createContext<
  Dispatch<SetStateAction<boolean>> | undefined
>(undefined);

export const LayoutProvider = ({ children }: { children: ReactNode }) => {
  const [isNavVisible, setIsNavVisible] = useState(true);

  return (
    <LayoutStateContext.Provider value={isNavVisible}>
      <LayoutDispatchContext.Provider value={setIsNavVisible}>
        {children}
      </LayoutDispatchContext.Provider>
    </LayoutStateContext.Provider>
  );
};

export const useLayoutState = (): boolean => {
  const context = useContext(LayoutStateContext);
  if (context === undefined) {
    throw new Error('useLayoutState must be used within a LayoutProvider');
  }
  return context;
};

export const useLayoutDispatch = (): Dispatch<SetStateAction<boolean>> => {
  const context = useContext(LayoutDispatchContext);
  if (context === undefined) {
    throw new Error('useLayoutDispatch must be used within a LayoutProvider');
  }
  return context;
};
