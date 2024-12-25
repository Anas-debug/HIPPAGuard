import React, { createContext, useContext, useState, useEffect } from 'react';
import { SecurityCore } from '../core/security-core';

interface SecurityContextType {
  securityCore: SecurityCore | null;
  initialize: (masterKey: string) => Promise<void>;
  encrypt: (data: any) => Promise<string>;
  decrypt: (data: string) => Promise<any>;
  isInitialized: boolean;
}

const SecurityContext = createContext<SecurityContextType | null>(null);

export function SecurityProvider({ children }: { children: React.ReactNode }) {
  const [securityCore, setSecurityCore] = useState<SecurityCore | null>(null);
  const [isInitialized, setIsInitialized] = useState(false);

  useEffect(() => {
    return () => {
      if (securityCore) {
        securityCore.destroy();
      }
    };
  }, [securityCore]);

  const initialize = async (masterKey: string) => {
    const core = new SecurityCore();
    await core.initialize(masterKey);
    setSecurityCore(core);
    setIsInitialized(true);
  };

  const encrypt = async (data: any) => {
    if (!securityCore) throw new Error('Security core not initialized');
    return securityCore.encrypt(data);
  };

  const decrypt = async (data: string) => {
    if (!securityCore) throw new Error('Security core not initialized');
    return securityCore.decrypt(data);
  };

  return (
    <SecurityContext.Provider value={{ securityCore, initialize, encrypt, decrypt, isInitialized }}>
      {children}
    </SecurityContext.Provider>
  );
}

export function useSecurity() {
  const context = useContext(SecurityContext);
  if (!context) {
    throw new Error('useSecurity must be used within a SecurityProvider');
  }
  return context;
}
