import React from 'react';

import { useProject } from '../../../../../hooks/project';

export default function App({
  project, screen, setScreen, setPageLoading,
}) {
  const { configuration } = useProject();

  return (
    <ul className="breadcrumb" style={{ marginBottom: 20 }}>

      <li style={{
        backgroundColor: screen.header ? '#b20710' : '#ccc', padding: 10, marginRight: 2,
      }}
      >
        <a onClick={() => {
          if (project?.submetido == 'true') {
            setPageLoading(true);

            setTimeout(() => {
              setScreen({
                ...screen, header: true, documents: false, appresentation: false, abrangencia: false, equipe: false, recursos: false, orcamento: false,
              });
            }, 1000);

            setTimeout(() => {
              setPageLoading(false);
            }, 2000);
          }
        }}
        >
          Plano de Trabalho
        </a>
      </li>

      {configuration?.files?.length > 0
      && (
      <li style={{
        backgroundColor: screen.documents ? '#b20710' : '#ccc', padding: 10, marginRight: 2,
      }}
      >
        <a onClick={() => {
          if (project?.submetido == 'true') {
            setPageLoading(true);

            setTimeout(() => {
              setScreen({
                ...screen, documents: true, header: false, appresentation: false, abrangencia: false, equipe: false, recursos: false, orcamento: false,
              });
            }, 1000);

            setTimeout(() => {
              setPageLoading(false);
            }, 2000);
          }
        }}
        >
          Documentos
        </a>
      </li>
      )}

      {configuration && JSON.parse(configuration.apresentacao).isOne
      && (
      <li style={{
        backgroundColor: screen.appresentation ? '#b20710' : '#ccc', padding: 10, marginRight: 2,
      }}
      >
        <a onClick={() => {
          if (project?.submetido == 'true') {
            setPageLoading(true);

            setTimeout(() => {
              setScreen({
                ...screen, header: false, documents: false, abrangencia: false, recursos: false, equipe: false, appresentation: true, orcamento: false,
              });
            }, 1000);

            setTimeout(() => {
              setPageLoading(false);
            }, 3000);
          }
        }}
        >
          Plano de Apresentação
        </a>
      </li>
      )}

      {configuration && JSON.parse(configuration.abrangencia).abrangencias.abrangencia.checked
      && (
      <li style={{
        backgroundColor: screen.abrangencia ? '#b20710' : '#ccc', padding: 10, marginRight: 2,
      }}
      >
        <a onClick={() => {
          if (project?.submetido == 'true') {
            setPageLoading(true);

            setTimeout(() => {
              setScreen({
                ...screen, header: false, documents: false, appresentation: false, abrangencia: true, equipe: false, recursos: false, orcamento: false,
              });
            }, 1000);

            setTimeout(() => {
              setPageLoading(false);
            }, 2000);
          }
        }}
        >
          Abrangência
        </a>
      </li>
      )}

      {configuration && JSON.parse(configuration.membros).equipes.equipe.checked
      && (
      <li style={{
        backgroundColor: screen.equipe ? '#b20710' : '#ccc', padding: 10, marginRight: 2,
      }}
      >
        <a onClick={() => {
          if (project?.submetido == 'true') {
            setPageLoading(true);

            setTimeout(() => {
              setScreen({
                ...screen, header: false, documents: false, appresentation: false, abrangencia: false, equipe: true, recursos: false, orcamento: false,
              });
            }, 1000);

            setTimeout(() => {
              setPageLoading(false);
            }, 2000);
          }
        }}
        >
          Equipe
        </a>
      </li>
      )}

      {configuration && (JSON.parse(configuration.orcamento).isOne
      || JSON.parse(configuration.recursos_solicitados_outros).recursos.recurso.checked) && (
      <li style={{
        backgroundColor: screen.orcamento ? '#b20710' : '#ccc', padding: 10, marginRight: 2,
      }}
      >
        <a onClick={() => {
          if (project?.submetido == 'true') {
            setPageLoading(true);

            setTimeout(() => {
              setScreen({
                ...screen, header: false, documents: false, appresentation: false, abrangencia: false, equipe: false, orcamento: true, recursos: false,
              });
            }, 1000);

            setTimeout(() => {
              setPageLoading(false);
            }, 2000);
          }
        }}
        >
          Orçamentos
        </a>
      </li>
      )}

      {configuration && JSON.parse(configuration.orcamento).isOne
      && (
      <li style={{
        backgroundColor: screen.recursos ? '#b20710' : '#ccc', padding: 10, marginRight: 2,
      }}
      >
        <a onClick={() => {
          if (project?.submetido == 'true') {
            setPageLoading(true);

            setTimeout(() => {
              setScreen({
                ...screen, header: false, documents: false, appresentation: false, abrangencia: false, equipe: false, recursos: true, orcamento: false,
              });
            }, 1000);

            setTimeout(() => {
              setPageLoading(false);
            }, 2000);
          }
        }}
        >
          Recursos
        </a>
      </li>
      )}
    </ul>
  );
}
