import React, { createContext, ReactNode } from 'react';
import Extension from '../libs/extension';

interface NicoProviderProps {
  children: ReactNode;
  value: NicoContextProps;
}

export interface NicoContextProps {
  isLogin: boolean;
  loaded: boolean;
  extension: Extension;
}

export const NicoContext = createContext<NicoContextProps>({
  isLogin: false,
  loaded: false,
  extension: new Extension(),
});

const NicoProvider = (props: NicoProviderProps) => {
  return <NicoContext.Provider value={props.value}>{props.children}</NicoContext.Provider>;
};

export default NicoProvider;
