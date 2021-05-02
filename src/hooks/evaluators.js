import React, {
  useEffect,
  createContext,
  useCallback,
  useState,
  useContext,
} from 'react';

import api from '../services/api';

import { useResearcher } from './researcher';

const EvaluatorContext = createContext({});

export const EvaluatorProvider = ({ children }) => {
  const [loading, setLoading] = useState(false);

  const { users, update } = useResearcher();

  const [evaluators, setEvaluators] = useState([]);

  async function loadEvaluators() {
    api.get(`evaluators`).then(({ data }) => {
      setEvaluators(data.map((item) => ({
        ...item,
        programs: item.programs.map((program) => ({ label: program.title, value: program.id })),
      })));
    });
  }

  useEffect(() => {
    loadEvaluators();
  }, [users]);

  const erase = useCallback(async (data) => {
    setLoading(true);

    const formData = new FormData();
    formData.append("evaluator", false);

    api.put(`users/${data.id}`, formData).then(({ data: user }) => {
      update({ ...data, evaluator: false });
      setEvaluators(evaluators.filter((evaluator) => evaluator.id != data.id));
    }).finally(() => {
    //   store.addNotification({
    //     message: `Avaliador deletado com sucesso!`,
    //     type: 'success',
    //     insert: 'top',
    //     container: 'top-right',
    //     animationIn: ['animate__animated', 'animate__fadeIn'],
    //     animationOut: ['animate__animated', 'animate__fadeOut'],
    //     dismiss: {
    //       duration: 5000,
    //       onScreen: true,
    //     },
    //   });

      setLoading(false);
    });
  }, [evaluators, update]);

  return (
    <EvaluatorContext.Provider
      value={{
        evaluators,
        loading,
        erase,
        loadEvaluators,
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
