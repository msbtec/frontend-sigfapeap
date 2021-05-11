import React, {
  useEffect,
  createContext,
  useCallback,
  useState,
  useContext,
} from 'react';

import { useAuth } from './auth';
import api from '../services/api';

const ContactContext = createContext({});

export const ContactProvider = ({ children }) => {
  const [loading, setLoading] = useState(false);
  const [requests, setRequests] = useState([]);
  const [status, setStatus] = useState(false);

  const [notResponding, setNotResponding] = useState(0);

  const { user } = useAuth();

  async function getRequests() {
    setLoading(true);
    api.get(`contacts`, {
      params: {
        user_id: user?.profile?.name == 'Pesquisador' ? user?.id : undefined,
      },
    }).then(({ data }) => {
      setRequests(data);
      setNotResponding(data.filter((item) => !item.resposta).length);
      setLoading(false);
    });
  }

  useEffect(() => {
    getRequests();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);

  const changeStatus = useCallback(async () => {
    getRequests();
    setStatus(!status);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [status]);

  return (
    <ContactContext.Provider
      value={{
        loading,
        requests,
        getRequests,
        status,
        changeStatus,
        notResponding,
      }}
    >
      {children}
    </ContactContext.Provider>
  );
};

export function useContact() {
  const context = useContext(ContactContext);

  if (!context) {
    throw Error('useContact must be used within an ContactProvider');
  }

  return context;
}
