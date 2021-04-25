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
    formData.append("beggin", data.beggin);
    formData.append("end", data.end);
    formData.append("documents", data.documents);
    formData.append("description", data.description);
    formData.append("program_id", data.id);
    formData.append("file", file);

    const configurations = {
      plano_trabalho: JSON.stringify({
        fields: {
          titulo_projeto: { checked: true, value: 0 },
          coordenador: { checked: true, value: 0 },
          email: { checked: true, value: 0 },
          faixa_valor: { checked: true, value: 0 },
          tema_interesse: { checked: true, value: 0 },
          instituicao: { checked: true, value: 0 },
          unidade_executora: { checked: true, value: 0 },
          linha_pesquisa: { checked: true, value: 0 },
          inicio_previsto: { checked: true, value: 0 },
          duracao: { checked: true, value: 0 },
          cotacao_moeda_estrangeira: { checked: true, value: 0 },
        },
      }),
      apresentacao: JSON.stringify({
        apresentacao: {
          resumo: { checked: true, value: 0 },
          palavras_chave: { checked: true, value: 0 },
          informacoes_relevantes_para_avaliacao: { checked: true, value: 0 },
          experiencia_coordenador: { checked: true, value: 0 },
          sintese_projeto: { checked: true, value: 0 },
          objetivos_gerais: { checked: true, value: 0 },
          objetivos_especificos: { checked: true, value: 0 },
          metodologia: { checked: true, value: 0 },
          resultados_esperados: { checked: true, value: 0 },
          impactos_esperados: { checked: true, value: 0 },
          riscos_atividades: { checked: true, value: 0 },
          referencia_bibliografica: { checked: true, value: 0 },
          estado_arte: { checked: true, value: 0 },
        },
      }),
      abrangencia: null,
      membros: null,
      atividades: null,
      orcamento: null,
      recursos_proprios: null,
      recursos_solicitados_outros: null,
    };

    api.post(`files`, formData).then(({ data }) => {
      api.post(`configurations`, { ...configurations, file_id: data.id }).then(({ data: configuration }) => {
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
      }).catch((error) => console.log(error.response));
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

  const updateNotice = useCallback(async (data, file) => {
    setLoading(true);

    const formData = new FormData();
    formData.append("title", data.title);
    formData.append("beggin", data.beggin);
    formData.append("end", data.end);
    formData.append("documents", data.documents);
    formData.append("description", data.description);

    if (file) {
      formData.append("file", file);
    }

    api.put(`files/update/${data.id}`, formData).then(({ data }) => {
      store.addNotification({
        message: `Edital atualizado com sucesso!`,
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
        updateNotice,
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
