import React, {
  createContext,
  useState,
  useContext,
} from 'react';

import { useAuth } from './auth';

const ProjectContext = createContext({});

export const ProjectProvider = ({ children }) => {
  const { user } = useAuth();

  const [project, setProject] = useState(null);

  const [membros, setMembros] = useState([{ label: user.name, value: JSON.stringify(user) }]);
  const [atividades, setAtividades] = useState([]);

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

  return (
    <ProjectContext.Provider
      value={{
        project,
        setProject,
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
