import React, {
  useEffect,
  createContext,
  useCallback,
  useState,
  useContext,
} from 'react';

import { useAuth } from './auth';
import api from '../services/api';

const RequestContext = createContext({});

export const RequestProvider = ({ children }) => {
  const [loading, setLoading] = useState(false);
  const [requests, setRequests] = useState([]);
  const [requestsPendentes, setRequestsPendentes] = useState([]);
  const [status, setStatus] = useState(false);

  const { user } = useAuth();

  async function getRequests() {
    setLoading(true);
    api.get(`requests`, {
      params: {
        user_id: user?.profile?.name == 'Pesquisador' ? user?.id : undefined,
      },
    }).then(({ data }) => {
      setRequests(data);
      setRequestsPendentes(data.filter((item) => item.status == 'PENDENTE'));
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
    <RequestContext.Provider
      value={{
        loading,
        requests,
        getRequests,
        requestsPendentes,
        status,
        changeStatus,
      }}
    >
      {children}
    </RequestContext.Provider>
  );
};

export function useRequest() {
  const context = useContext(RequestContext);

  if (!context) {
    throw Error('useRequest must be used within an RequestProvider');
  }

  return context;
}
