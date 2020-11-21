import React, {
  createContext,
  useCallback,
  useState,
  useContext,
} from 'react';

import { store } from 'react-notifications-component';

const EvaluatorContext = createContext({});

export const EvaluatorProvider = ({ children }) => {
  const [loading, setLoading] = useState(false);
  const [evaluators, setEvaluators] = useState([]);

  const updateEvaluator = useCallback(async (data) => {
    store.addNotification({
      message: `Usuário atualizado com sucesso!`,
      type: 'success',
      insert: 'top',
      container: 'top-right',
      animationIn: ['animate__animated', 'animate__fadeIn'],
      animationOut: ['animate__animated', 'animate__fadeOut'],
      dismiss: {
        duration: 5000,
        onScreen: true,
      },
    });
  }, []);

  return (
    <EvaluatorContext.Provider
      value={{
        updateEvaluator,
      }}
    >
      {children}
    </EvaluatorContext.Provider>
  );
};

export function useEvaluator() {
  const context = useContext(EvaluatorContext);

  if (!context) {
    throw Error('useEvaluator must be used within an EvaluatorProvider');
  }

  return context;
}
