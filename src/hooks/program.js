import React, {
  createContext,
  useCallback,
  useState,
  useContext,
} from 'react';

import { uuid } from 'uuidv4';
import { store } from 'react-notifications-component';

const ProgramContext = createContext({});

export const ProgramProvider = ({ children }) => {
  const [loading, setLoading] = useState(false);
  const [programs, setPrograms] = useState([
    {
      id: uuid(),
      title: 'Quero Açaí',
      description: 'O calor deu uma leve pausa, o clima ficou um pouco mais fresquinho e a gente já pensa em tomar aquele caldo 😋 Vem pra Quero Açaí que temos caldos quentinhos te esperando ❤🍵',
      url: 'https://cdnimg.webstaurantstore.com/images/products/large/542714/1977986.jpg',
      avaliation: '4.5',
      evaluators: [
        {
          label: 'Luan Maranhão Roberta',
          value: 'Luan Maranhão Roberta',
        },
      ],
    },
  ]);

  const create = useCallback(async (data) => {
    setLoading(true);
    setPrograms([...programs, { id: uuid(), ...data }]);
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
    setLoading(false);
  }, [programs]);

  const update = useCallback(async (data) => {
    setLoading(true);
    setPrograms(programs.map((item) => (item.id === data.id ? data : item)));
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
    setLoading(false);
  }, [programs]);

  const erase = useCallback(async (data) => {
    setLoading(true);
    setPrograms(programs.filter((item) => (item.id !== data.id)));
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
    setLoading(false);
  }, [programs]);

  return (
    <ProgramContext.Provider
      value={{
        programs,
        loading,
        create,
        update,
        erase,
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
