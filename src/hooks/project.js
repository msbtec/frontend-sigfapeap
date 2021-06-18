import React, {
  createContext,
  useState,
  useContext,
} from 'react';
import { uuid } from 'uuidv4';
import api from '../services/api';

import { useAuth } from './auth';

const ProjectContext = createContext({});

export const ProjectProvider = ({ children }) => {
  const { user } = useAuth();

  const [configuration, setConfigurations] = useState(null);

  const [loading, setLoading] = useState(false);

  const [project, setProject] = useState(null);

  const [review, setReview] = useState(0);
  const [status, setStatus] = useState(false);

  const [membros, setMembros] = useState([{ label: user?.name, value: JSON.stringify(user) }]);
  const [atividades, setAtividades] = useState([]);

  React.useEffect(() => {
    api.get(`projects/review`).then(({ data }) => {
      setReview(data.length);
    });
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

  return (
    <ProjectContext.Provider
      value={{
        loading,
        setLoading,
        status,
        setStatus,
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
