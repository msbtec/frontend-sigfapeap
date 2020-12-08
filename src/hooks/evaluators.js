import React, {
  useEffect,
  createContext,
  useCallback,
  useState,
  useContext,
} from 'react';

import { store } from 'react-notifications-component';

import { useResearcher } from './researcher';

const EvaluatorContext = createContext({});

export const EvaluatorProvider = ({ children }) => {
  const [loading, setLoading] = useState(false);

  const { users, update } = useResearcher();

  const [evaluators, setEvaluators] = useState(
    users.filter((researche) => researche.evaluator),
  );

  useEffect(() => {
    setEvaluators(users.filter((researche) => researche.evaluator));
  }, [users]);

  const erase = useCallback(async (data) => {
    setLoading(true);
    update({ ...data, evaluator: false });
    setEvaluators(evaluators.filter((evaluator) => evaluator.id != data.id));
    store.addNotification({
      message: `Avaliador deletado com sucesso!`,
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
    setLoading(false);
  }, [update]);

  return (
    <EvaluatorContext.Provider
      value={{
        evaluators,
        loading,
        erase,
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
