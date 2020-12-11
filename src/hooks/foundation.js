import React, {
  createContext,
  useCallback,
  useState,
  useContext,
} from 'react';

import { uuid } from 'uuidv4';
import { store } from 'react-notifications-component';

const FoundationContext = createContext({});

export const FoundationProvider = ({ children }) => {
  const [loading, setLoading] = useState(false);
  const [foundations, setFoundations] = useState([
    {
      id: uuid(),
      cnpj: '10.533.202/0001-52',
      type_institution: 'Pública',
      name: 'Universidade Federal do Amapá',
      social_name: 'UNIFAP',
      address: 'Rod. Juscelino Kubitschek, km 02 - Jardim Marco Zero, Macapá - AP, 68903-419',
      site: 'www.unifap.br',
      phone: '(96) 3312-1700',
      email: 'suporte@unifap.br',
      observation: 'The Federal University of Amapá is a Brazilian public institution which is located in Macapá, Brazil.',
    },
  ]);

  const create = useCallback(async (data) => {
    setLoading(true);
    setFoundations([...foundations, { id: uuid(), ...data }]);
    store.addNotification({
      message: `Instituição de pesquisa inserida com sucesso!`,
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
  }, [foundations]);

  const update = useCallback(async (data) => {
    setLoading(true);
    setFoundations(foundations.map((item) => (item.id === data.id ? data : item)));
    store.addNotification({
      message: `Instituição de pesquisa atualizada com sucesso!`,
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
  }, [foundations]);

  const erase = useCallback(async (data) => {
    setLoading(true);
    setFoundations(foundations.filter((item) => (item.id !== data.id)));
    store.addNotification({
      message: `Instituição de pesquisa deletada com sucesso!`,
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
  }, [foundations]);

  return (
    <FoundationContext.Provider
      value={{
        foundations,
        loading,
        create,
        update,
        erase,
      }}
    >
      {children}
    </FoundationContext.Provider>
  );
};

export function useFoundation() {
  const context = useContext(FoundationContext);

  if (!context) {
    throw Error('useFoundation must be used within an FoundationProvider');
  }

  return context;
}
