import React, {
  createContext,
  useCallback,
  useState,
  useContext,
} from 'react';

import { store } from 'react-notifications-component';

const ProgramContext = createContext({});

export const ProgramProvider = ({ children }) => {
  const [loading, setLoading] = useState(false);
  const [program, setPrograms] = useState();

  const insertProgram = useCallback(async (email) => {
    store.addNotification({
      message: `Programa inserido com sucesso!`,
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

  const updateProgram = useCallback(async (data) => {
    store.addNotification({
      message: `Programa atualizado com sucesso!`,
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

  const deleteProgram = useCallback(async (email) => {
    store.addNotification({
      message: `Programa deletado com sucesso!`,
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
    <ProgramContext.Provider
      value={{
        insertProgram,
        updateProgram,
        deleteProgram,
      }}
    >
      {children}
    </ProgramContext.Provider>
  );
};

export function useProgram() {
  const context = useContext(ProgramContext);

  if (!context) {
    throw Error('useProgram must be used within an ProgramProvider');
  }

  return context;
}
