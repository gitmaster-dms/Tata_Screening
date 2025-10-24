// BasicScreeningContext.js
import React, { createContext, useContext, useState } from 'react';

// Create a context
const BasicScreeningContext = createContext();

// Create a provider component
export const BasicScreeningProvider = ({ children }) => {
  const [basicScreeningPkId, setBasicScreeningPkId] = useState(null);

  const setReceivedBasicScreeningPkId = (id) => {
    setBasicScreeningPkId(id);
  };

  return (
    <BasicScreeningContext.Provider value={{ basicScreeningPkId, setReceivedBasicScreeningPkId }}>
      {children}
    </BasicScreeningContext.Provider>
  );
};

// Create a custom hook to use the context
export const useBasicScreeningContext = () => {
  const context = useContext(BasicScreeningContext);
  if (!context) {
    throw new Error('useBasicScreeningContext must be used within a BasicScreeningProvider');
  }
  return context;
};
