import React, { createContext, useState } from "react";

interface AccessTokenContextType {
  accessToken: string | null;
  setAccessToken: React.Dispatch<React.SetStateAction<string | null>>;
}

const AccessTokenContext = createContext<AccessTokenContextType | null>(null);

const AccessTokenProvider: React.FC = ({ children }) => {
  const [accessToken, setAccessToken] = useState<string | null>(null);

  return (
    <AccessTokenContext.Provider value={{ accessToken, setAccessToken }}>
      {children}
    </AccessTokenContext.Provider>
  );
};

export { AccessTokenContext as default, AccessTokenProvider };
