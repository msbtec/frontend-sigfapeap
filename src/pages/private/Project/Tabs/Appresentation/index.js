import React from 'react';

import { CKEditor } from '@ckeditor/ckeditor5-react';
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import { Form } from '../../../../../components/Form';

import { useProject } from '../../../../../hooks/project';

export default function Appresentation() {
  const { plano, setPlano } = useProject();

  return (
    <Form>
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
            setPlano({ ...plano, resumo: data });
          }}
        />
      </div>

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
            setPlano({ ...plano, palavras_chave: data });
          }}
        />
      </div>

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
            setPlano({ ...plano, informacoes_relevantes_para_avaliacao: data });
          }}
        />
      </div>

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
            setPlano({ ...plano, experiencia_coordenador: data });
          }}
        />
      </div>

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
            setPlano({ ...plano, sintese_projeto: data });
          }}
        />
      </div>

      <div className="input-block" style={{ marginBottom: 20 }}>
        <label style={{ marginBottom: 10 }}>
          Objetivo Geral
        </label>
        <CKEditor
          editor={ClassicEditor}
          data={plano.objetivos_gerais}
          onReady={(editor) => {}}
          onChange={(event, editor) => {
            const data = editor.getData();
            setPlano({ ...plano, objetivos_gerais: data });
          }}
        />
      </div>

      <div className="input-block" style={{ marginBottom: 20 }}>
        <label style={{ marginBottom: 10 }}>
          Objetivos Específicos
        </label>
        <CKEditor
          editor={ClassicEditor}
          data={plano.objetivos_especificos}
          onReady={(editor) => {}}
          onChange={(event, editor) => {
            const data = editor.getData();
            setPlano({ ...plano, objetivos_especificos: data });
          }}
        />
      </div>

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
            setPlano({ ...plano, metodologia: data });
          }}
        />
      </div>

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
            setPlano({ ...plano, resultados_esperados: data });
          }}
        />
      </div>

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
            setPlano({ ...plano, impactos_esperados: data });
          }}
        />
      </div>

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
            setPlano({ ...plano, riscos_atividades: data });
          }}
        />
      </div>

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
            setPlano({ ...plano, referencia_bibliografica: data });
          }}
        />
      </div>

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
            setPlano({ ...plano, estado_arte: data });
          }}
        />
      </div>
    </Form>
  );
}
