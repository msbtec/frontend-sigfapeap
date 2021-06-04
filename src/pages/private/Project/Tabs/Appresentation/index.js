/* eslint-disable import/named */
import React from 'react';

import { CKEditor } from '@ckeditor/ckeditor5-react';
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import { Form } from '../../../../../components/Form';

import { useProject } from '../../../../../hooks/project';

export default function Appresentation() {
  const { configuration, plano, setPlano } = useProject();

  return (
    <Form>
      {JSON.parse(configuration.apresentacao).apresentacao.resumo.checked
      && (
      <div className="input-block">
        <label style={{ marginBottom: 10 }}>
          Resumo da proposta
        </label>
        <CKEditor
          editor={ClassicEditor}
          data={plano.resumo}
          onReady={(editor) => {}}
          onChange={(event, editor) => {
            const data = editor.getData();
            // if (data.length <= 5.000) {
            setPlano({ ...plano, resumo: data });
            // }
          }}
        />
      </div>
      )}

      {JSON.parse(configuration.apresentacao).apresentacao.palavras_chave.checked
      && (
      <div className="input-block" style={{ marginBottom: 20 }}>
        <label style={{ marginBottom: 10 }}>
          Palavras-Chave
        </label>
        <CKEditor
          editor={ClassicEditor}
          data={plano.palavras_chave}
          onReady={(editor) => {}}
          onChange={(event, editor) => {
            const data = editor.getData();
            // if (data.length <= 200) {
            setPlano({ ...plano, palavras_chave: data });
            // }
          }}
        />
      </div>
      )}

      {JSON.parse(configuration.apresentacao).apresentacao.informacoes_relevantes_para_avaliacao.checked
      && (
      <div className="input-block" style={{ marginBottom: 20 }}>
        <label style={{ marginBottom: 10 }}>
          Informações Relevantes para Avaliação da Proposta
        </label>
        <CKEditor
          editor={ClassicEditor}
          data={plano.informacoes_relevantes_para_avaliacao}
          onReady={(editor) => {}}
          onChange={(event, editor) => {
            const data = editor.getData();
            // if (data.length <= 3.000) {
            setPlano({ ...plano, informacoes_relevantes_para_avaliacao: data });
            // }
          }}
        />
      </div>
      )}

      {JSON.parse(configuration.apresentacao).apresentacao.experiencia_coordenador.checked
      && (
      <div className="input-block" style={{ marginBottom: 20 }}>
        <label style={{ marginBottom: 10 }}>
          Experiência do Coordenador
        </label>
        <CKEditor
          editor={ClassicEditor}
          data={plano.experiencia_coordenador}
          onReady={(editor) => {}}
          onChange={(event, editor) => {
            const data = editor.getData();
            // if (data.length <= 3.000) {
            setPlano({ ...plano, experiencia_coordenador: data });
            // }
          }}
        />
      </div>
      )}

      {JSON.parse(configuration.apresentacao).apresentacao.sintese_projeto.checked
      && (
      <div className="input-block" style={{ marginBottom: 20 }}>
        <label style={{ marginBottom: 10 }}>
          Síntese do Projeto
        </label>
        <CKEditor
          editor={ClassicEditor}
          data={plano.sintese_projeto}
          onReady={(editor) => {}}
          onChange={(event, editor) => {
            const data = editor.getData();
            // if (data.length <= 5.000) {
            setPlano({ ...plano, sintese_projeto: data });
            // }
          }}
        />
      </div>
      )}

      {JSON.parse(configuration.apresentacao).apresentacao.objetivos_gerais.checked
      && (
      <div className="input-block" style={{ marginBottom: 20 }}>
        <label style={{ marginBottom: 10 }}>
          Objetivos Gerais
        </label>
        <CKEditor
          editor={ClassicEditor}
          data={plano.objetivos_gerais}
          onReady={(editor) => {}}
          onChange={(event, editor) => {
            const data = editor.getData();
            // if (data.length <= 1.000) {
            setPlano({ ...plano, objetivos_gerais: data });
            // }
          }}
        />
      </div>
      )}

      {JSON.parse(configuration.apresentacao).apresentacao.objetivos_especificos.checked
      && (
      <div className="input-block" style={{ marginBottom: 20 }}>
        <label style={{ marginBottom: 10 }}>
          Objetivo Específico
        </label>
        <CKEditor
          editor={ClassicEditor}
          data={plano.objetivos_especificos}
          onReady={(editor) => {}}
          onChange={(event, editor) => {
            const data = editor.getData();
            // if (data.length <= 3.000) {
            setPlano({ ...plano, objetivos_especificos: data });
            // }
          }}
        />
      </div>
      )}

      {JSON.parse(configuration.apresentacao).apresentacao.estado_arte.checked
      && (
      <div className="input-block" style={{ marginBottom: 20 }}>
        <label style={{ marginBottom: 10 }}>
          Estado da Arte
        </label>
        <CKEditor
          editor={ClassicEditor}
          data={plano.estado_arte}
          onReady={(editor) => {}}
          onChange={(event, editor) => {
            const data = editor.getData();
            // if (data.length <= 15.000) {
            setPlano({ ...plano, estado_arte: data });
            // }
          }}
        />
      </div>
      )}

      {JSON.parse(configuration.apresentacao).apresentacao.metodologia.checked
      && (
      <div className="input-block" style={{ marginBottom: 20 }}>
        <label style={{ marginBottom: 10 }}>
          Metodologia
        </label>
        <CKEditor
          editor={ClassicEditor}
          data={plano.metodologia}
          onReady={(editor) => {}}
          onChange={(event, editor) => {
            const data = editor.getData();
            // if (data.length <= 15.000) {
            setPlano({ ...plano, metodologia: data });
            // }
          }}
        />
      </div>
      )}

      {JSON.parse(configuration.apresentacao).apresentacao.resultados_esperados.checked
      && (
      <div className="input-block" style={{ marginBottom: 20 }}>
        <label style={{ marginBottom: 10 }}>
          Resultados Esperados
        </label>
        <CKEditor
          editor={ClassicEditor}
          data={plano.resultados_esperados}
          onReady={(editor) => {}}
          onChange={(event, editor) => {
            const data = editor.getData();
            // if (data.length <= 5.000) {
            setPlano({ ...plano, resultados_esperados: data });
            // }
          }}
        />
      </div>
      )}

      {JSON.parse(configuration.apresentacao).apresentacao.impactos_esperados.checked
      && (
      <div className="input-block" style={{ marginBottom: 20 }}>
        <label style={{ marginBottom: 10 }}>
          Impactos Esperados
        </label>
        <CKEditor
          editor={ClassicEditor}
          data={plano.impactos_esperados}
          onReady={(editor) => {}}
          onChange={(event, editor) => {
            const data = editor.getData();
            // if (data.length <= 5.000) {
            setPlano({ ...plano, impactos_esperados: data });
            // }
          }}
        />
      </div>
      )}

      {JSON.parse(configuration.apresentacao).apresentacao.riscos_atividades.checked
      && (
      <div className="input-block" style={{ marginBottom: 20 }}>
        <label style={{ marginBottom: 10 }}>
          Riscos e Atividades
        </label>
        <CKEditor
          editor={ClassicEditor}
          data={plano.riscos_atividades}
          onReady={(editor) => {}}
          onChange={(event, editor) => {
            const data = editor.getData();
            // if (data.length <= 3.000) {
            setPlano({ ...plano, riscos_atividades: data });
            // }
          }}
        />
      </div>
      )}

      {JSON.parse(configuration.apresentacao).apresentacao.referencia_bibliografica.checked
      && (
      <div className="input-block" style={{ marginBottom: 20 }}>
        <label style={{ marginBottom: 10 }}>
          Referência Bibliográfica
        </label>
        <CKEditor
          editor={ClassicEditor}
          data={plano.referencia_bibliografica}
          onReady={(editor) => {}}
          onChange={(event, editor) => {
            const data = editor.getData();
            // if (data.length <= 5.000) {
            setPlano({ ...plano, referencia_bibliografica: data });
            // }
          }}
        />
      </div>
      )}
    </Form>
  );
}
