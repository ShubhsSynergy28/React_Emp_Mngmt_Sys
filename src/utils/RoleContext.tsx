import React, { createContext, useContext } from 'react';

export const RoleContext = createContext<string | null>(null);

export const useRole = () => {return useContext(RoleContext)};

interface RoleProviderProps {
  children: React.ReactNode;
  role: string | null;
}

export const RoleProvider: React.FC<RoleProviderProps> = ({ children, role }) => {
  return <RoleContext.Provider value={role}>{children}</RoleContext.Provider>;
};