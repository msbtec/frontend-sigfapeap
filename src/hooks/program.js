import React, {
  useEffect,
  createContext,
  useCallback,
  useState,
  useContext,
} from 'react';

import { store } from 'react-notifications-component';
import api from '../services/api';

const ProgramContext = createContext({});

export const ProgramProvider = ({ children }) => {
  const [loading, setLoading] = useState(false);
  const [programs, setPrograms] = useState([]);

  const [status, setStatus] = useState(false);

  useEffect(() => {
    async function loadPrograms() {
      api.get(`programs`).then(({ data }) => {
        setPrograms(data);
      });
    }

    loadPrograms();
  }, []);

  const create = useCallback(async (data) => {
    setLoading(true);

    const formData = new FormData();
    formData.append("data", JSON.stringify(data));
    // formData.append("file", file);

    api.post(`programs`, formData).then(({ data: program }) => {
      setPrograms([...programs, program]);

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
    }).finally(() => {
      setLoading(false);
    });
  }, [programs]);

  const addNotice = useCallback(async (data, file) => {
    setLoading(true);

    const formData = new FormData();
    formData.append("title", data.title);
    formData.append("description", data.description);
    formData.append("program_id", data.id);
    formData.append("file", file);

    api.post(`files`, formData).then(() => {
      store.addNotification({
        message: `Edital inserido com sucesso!`,
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

      setStatus(!status);
    }).finally(() => {
      setLoading(false);
    });
  }, [status]);

  const removeNotice = useCallback(async (data) => {
    setLoading(true);

    api.delete(`files/${data.id}`).then(() => {
      store.addNotification({
        message: `Edital removido com sucesso!`,
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
    }).finally(() => {
      setLoading(false);
    });
  }, []);

  const update = useCallback(async (data, file) => {
    setLoading(true);

    const formData = new FormData();
    formData.append("title", data.title);
    formData.append("description", data.description);

    if (file) {
      formData.append("file", file);
    }

    api.put(`programs/${data.id}`, formData).then(({ data: program }) => {
      setPrograms(programs.map((item) => (item.id === data.id ? program : item)));

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
    }).finally(() => {
      setLoading(false);
    });
  }, [programs]);

  const erase = useCallback(async (data) => {
    setLoading(true);

    api.delete(`programs/${data.id}`).then(() => {
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
    }).finally(() => {
      setLoading(false);
    });
  }, [programs]);

  return (
    <ProgramContext.Provider
      value={{
        programs,
        loading,
        create,
        addNotice,
        removeNotice,
        update,
        erase,
        status,
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
