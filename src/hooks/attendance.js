import React, {
  useEffect,
  createContext,
  useCallback,
  useState,
  useContext,
} from 'react';

import { useAuth } from './auth';
import api from '../services/api';

const AttendanceContext = createContext({});

export const AttendanceProvider = ({ children }) => {
  const [loading, setLoading] = useState(false);
  const [requests, setRequests] = useState([]);
  const [status, setStatus] = useState(false);

  const [notResponding, setNotResponding] = useState(0);

  const { user } = useAuth();

  async function getRequests(date = undefined) {
    setLoading(true);
    api.get(`contacts`, {
      params: {
        user_id: user?.profile?.name == 'Pesquisador' ? user?.id : undefined,
        date,
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
    // getRequestsUrgentes(undefined, 'Todos');
    setStatus(!status);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [status]);

  return (
    <AttendanceContext.Provider
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
    </AttendanceContext.Provider>
  );
};

export function useAttendance() {
  const context = useContext(AttendanceContext);

  if (!context) {
    throw Error('useAttendance must be used within an AttendanceProvider');
  }

  return context;
}
