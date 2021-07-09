import React, {
  createContext,
  useState,
  useContext,
} from 'react';
import { uuid } from 'uuidv4';
import api from '../services/api';

import {
  money_mask,
} from '../utils/validations';
import {
  soma,
} from '../utils/soma';

import { useAuth } from './auth';
import { useEvaluator } from './evaluators';

const ProjectContext = createContext({});

export const ProjectProvider = ({ children }) => {
  const { user } = useAuth();

  const { changeStatus: changeStatusEvaluator } = useEvaluator();

  const [configuration, setConfigurations] = useState(null);

  const [loading, setLoading] = useState(false);

  const [project, setProject] = useState(null);

  const [review, setReview] = useState(0);
  const [status, setStatus] = useState(false);

  const [membros, setMembros] = useState([{ label: user?.name, value: JSON.stringify({ ...user, funcao: 'Coordenador(a)' }) }]);
  const [atividades, setAtividades] = useState([]);

  React.useEffect(() => {
    if (user) {
      if (user.profile.name == 'Administrador') {
        api.get(`projects/review`, {
          params: {
            user_id: 0,
          },
        }).then(({ data }) => {
          setReview(data.length);
        });
      }
    }
  }, [user, status]);

  const [plano, setPlano] = useState({
    resumo: '',
    palavras_chave: '',
    informacoes_relevantes_para_avaliacao: '',
    experiencia_coordenador: '',
    sintese_projeto: '',
    objetivos_gerais: '',
    objetivos_especificos: '',
    metodologia: '',
    resultados_esperados: '',
    impactos_esperados: '',
    riscos_atividades: '',
    referencia_bibliografica: '',
    estado_arte: '',
  });

  const [despesas, setDespesas] = useState([
    {
      id: uuid(),
      titulo: "Diárias",
      valor: "R$ 0",
    },
    {
      id: uuid(),
      titulo: "Hospedagem/Alimentação",
      valor: "R$ 0",
    },
    {
      id: uuid(),
      titulo: "Material de Consumo",
      valor: "R$ 0",
    },
    {
      id: uuid(),
      titulo: "Passagens",
      valor: "R$ 0",
    },
    {
      id: uuid(),
      titulo: "Pessoal",
      valor: "R$ 0",
    },
    {
      id: uuid(),
      titulo: "Encargos",
      valor: "R$ 0",
    },
    {
      id: uuid(),
      titulo: "Bolsas",
      valor: "R$ 0",
    },
    {
      id: uuid(),
      titulo: "Outros Serviços de Terceiros",
      valor: "R$ 0",
    },
    {
      id: uuid(),
      titulo: "Equipamentos e Material Permanente",
      valor: "R$ 0",
    },
  ]);
  const [recursos, setRecursos] = useState([]);
  const [abrangencias, setAbrangencias] = useState([]);

  const [orcamentos, setOrcamentos] = useState(
    {
      diarias: [],
      hospedagem_alimentacao: [],
      materiais_consumo: [],
      passagens: [],
      servicos_terceiros: [],
      materiais_permanentes_equipamentos: [],
      pessoal: [],
      bolsas: [],
      encargos: [],
    },
  );

  const getProject = React.useCallback(async (edital, coordenador, setFiles, setInitialLoading, setProtocolo) => {
    setLoading(true);

    setProject(null);
    setMembros([{ label: user.name, value: JSON.stringify({ ...user, funcao: 'Coordenador(a)' }) }]);
    setAtividades([]);
    setPlano({
      resumo: '',
      palavras_chave: '',
      informacoes_relevantes_para_avaliacao: '',
      experiencia_coordenador: '',
      sintese_projeto: '',
      objetivos_gerais: '',
      objetivos_especificos: '',
      metodologia: '',
      resultados_esperados: '',
      impactos_esperados: '',
      riscos_atividades: '',
      referencia_bibliografica: '',
      estado_arte: '',
    });
    setDespesas(despesas);
    setRecursos([]);
    setAbrangencias([]);
    setOrcamentos(
      {
        diarias: [],
        hospedagem_alimentacao: [],
        materiais_consumo: [],
        passagens: [],
        servicos_terceiros: [],
        materiais_permanentes_equipamentos: [],
        pessoal: [],
        bolsas: [],
        encargos: [],
      },
    );

    setInitialLoading(true);

    api.put(`/projects`, {
      edital_id: edital,
      coordenador_id: coordenador,
    }).then(({ data }) => {
      setProject(data);

      setStatus(!status);
      changeStatusEvaluator();

      setFiles(data.files.map((item) => ({
        id: item.id,
        title: item.document.title,
        file: item.document,
        url_document: item.document.url,
        url_attachment: item.url,
      })));

      setProtocolo(data.protocolo || uuid());
      setAbrangencias(JSON.parse(data.abrangencia || '[]'));

      const orcamentos_temp = JSON.parse(data.orcamento || JSON.stringify(orcamentos));
      setOrcamentos(orcamentos_temp);

      const despesas_temp = JSON.parse(data.recursos_proprios || JSON.stringify(despesas));
      setDespesas(despesas_temp.map((item) => (
        (item.titulo == 'Diárias') ? ({ ...item, valor: money_mask(String(soma(orcamentos_temp.diarias))) })
          : (item.titulo == 'Hospedagem/Alimentação') ? ({ ...item, valor: money_mask(String(soma(orcamentos_temp.hospedagem_alimentacao))) })
            : (item.titulo == 'Material de Consumo') ? ({ ...item, valor: money_mask(String(soma(orcamentos_temp.materiais_consumo))) })
              : (item.titulo == 'Passagens') ? ({ ...item, valor: money_mask(String(soma(orcamentos_temp.passagens))) })
                : (item.titulo == 'Outros Serviços de Terceiros') ? ({ ...item, valor: money_mask(String(soma(orcamentos_temp.servicos_terceiros))) })
                  : (item.titulo == 'Equipamentos e Material Permanente') ? ({ ...item, valor: money_mask(String(soma(orcamentos_temp.materiais_permanentes_equipamentos))) })
                    : (item.titulo == 'Pessoal') ? ({ ...item, valor: money_mask(String(soma(orcamentos_temp.pessoal))) })
                      : (item.titulo == 'Bolsas') ? ({ ...item, valor: money_mask(String(soma(orcamentos_temp.bolsas))) })
                        : (item.titulo == 'Encargos') ? ({ ...item, valor: money_mask(String(soma(orcamentos_temp.encargos))) })
                          : item
      )));

      setRecursos(JSON.parse(data.recursos_solicitados_outros || '[]'));
      if (data.membros.length > 0) {
        setMembros(data.membros.map((item) => ({ label: item.name, value: JSON.stringify(item) })));
      } else {
        setMembros([{ label: data?.coordenador?.name, value: JSON.stringify({ ...data.coordenador, funcao: 'Coordenador(a)' }) }]);
      }
      setAtividades(data.atividades);

      setPlano({
        resumo: data.resumo || '',
        palavras_chave: data.palavras_chave || '',
        informacoes_relevantes_para_avaliacao: data.informacoes_relevantes_para_avaliacao || '',
        experiencia_coordenador: data.experiencia_coordenador || '',
        sintese_projeto: data.sintese_projeto || '',
        objetivos_gerais: data.objetivos_gerais || '',
        objetivos_especificos: data.objetivos_especificos || '',
        metodologia: data.metodologia || '',
        resultados_esperados: data.resultados_esperados || '',
        impactos_esperados: data.impactos_esperados || '',
        riscos_atividades: data.riscos_atividades || '',
        referencia_bibliografica: data.referencia_bibliografica || '',
        estado_arte: data.estado_arte || '',
      });

      api.get(`configurations`, {
        params: {
          edital_id: edital,
        },
      }).then(({ data: configuration }) => {
        setConfigurations({ ...configuration, plano_trabalho: JSON.parse(configuration.plano_trabalho) });

        if (data.files.length == 0) {
          setFiles(configuration.files.map((item) => ({
            id: item.id,
            title: item.title,
            file: item,
            configuration_document_id: item.id,
            url_document: item.url,
            url_attachment: null,
          })));
        }

        setLoading(false);
        setInitialLoading(false);
      });
    }).catch((error) => {
      api.get(`configurations`, {
        params: {
          edital_id: edital,
        },
      }).then(({ data }) => {
        setConfigurations({ ...data, plano_trabalho: JSON.parse(data.plano_trabalho) });
        setLoading(false);
        setInitialLoading(false);
        setFiles(data.files.map((item) => ({
          id: item.id,
          title: item.title,
          file: item,
          configuration_document_id: item.id,
          url_document: item.url,
          url_attachment: null,
        })));
      });
    });
  }, [user, despesas, status, orcamentos, changeStatusEvaluator]);

  const changeStatus = React.useCallback(async () => {
    setStatus(!status);

    // getProject();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [status]);

  return (
    <ProjectContext.Provider
      value={{
        loading,
        setLoading,
        status,
        setStatus,
        changeStatus,
        review,
        project,
        setProject,
        membros,
        setMembros,
        atividades,
        setAtividades,
        plano,
        setPlano,
        despesas,
        setDespesas,
        recursos,
        setRecursos,
        abrangencias,
        setAbrangencias,
        orcamentos,
        setOrcamentos,
        configuration,
        setConfigurations,
        getProject,
      }}
    >
      {children}
    </ProjectContext.Provider>
  );
};

export function useProject() {
  const context = useContext(ProjectContext);

  if (!context) {
    throw Error('useProject must be used within an ProjectProvider');
  }

  return context;
}
