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
  const [requestsUrgentes, setRequestsUrgentes] = useState([]);
  const [status, setStatus] = useState(false);

  const [notResponding, setNotResponding] = useState(0);

  const { user } = useAuth();

  async function getRequests(date = undefined, prioridade = 'Todos') {
    setLoading(true);
    api.get(`contacts`, {
      params: {
        user_id: user?.profile?.name == 'Pesquisador' ? user?.id : undefined,
        date,
        prioridade: user?.profile?.name == 'Pesquisador' ? "Todos" : prioridade,
      },
    }).then(({ data }) => {
      setRequests(data);
      setNotResponding(data.filter((item) => !item.resposta).length);
      setLoading(false);
    });
  }

  async function getRequestsUrgentes(date = undefined, prioridade = 'regular') {
    setLoading(true);
    api.get(`contacts`, {
      params: {
        user_id: user?.profile?.name == 'Pesquisador' ? user?.id : undefined,
        date,
        prioridade: user?.profile?.name == 'Pesquisador' ? "Todos" : prioridade,
      },
    }).then(({ data }) => {
      setRequestsUrgentes(data);
      setLoading(false);
    });
  }

  useEffect(() => {
    getRequests();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);

  const changeStatus = useCallback(async () => {
    getRequests();
    // getRequestsUrgentes(undefined, 'Todos');
    setStatus(!status);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [status]);

  return (
    <ContactContext.Provider
      value={{
        loading,
        requests,
        getRequests,
        requestsUrgentes,
        getRequestsUrgentes,
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
