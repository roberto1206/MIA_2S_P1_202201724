import React, { useRef, useState } from 'react';
import Editor from '@monaco-editor/react';

export function EditorT() {
  const editorRef = useRef(null);
  const [resultado, setResultado] = useState("");

  function handleEditorDidMount(editor, monaco) {
    editorRef.current = editor;
  }

  function showValue() {
    // Obtener el contenido del editor
    const command = editorRef.current.getValue();

    // Enviar el contenido al backend
    fetch('http://localhost:3000/analyze', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ command }), // Enviar el comando en JSON
    })
      .then((response) => response.json())
      .then((data) => {
        console.log(data.results); // Ver los resultados en la consola
        setResultado(data.results.join("\n")); // Mostrar los resultados en el textarea
      })
      .catch((error) => {
        console.error('Error al interpretar:', error);
      });
  }

  const loadDocument = (event) => {
    const uploadedFile = event.target.files[0];

    // Usamos FileReader para leer el archivo cargado
    const reader = new FileReader();
    reader.onload = (e) => {
      const fileContent = e.target.result;
      // Establecemos el contenido del archivo en el editor
      editorRef.current.setValue(fileContent);
    };

    // Leer el archivo como texto
    if (uploadedFile) {
      reader.readAsText(uploadedFile);
    }
  };

  return (
    <>
      <div style={{display:'flex', justifyContent: 'center', gap: '10px' , marginRight:'-20px'}}>
        {/* Input para cargar archivo */}
        <input type="file" onChange={loadDocument} style={{marginTop:"2px"}} />
        <button onClick={showValue} style={{marginTop:"5px"}}>Interpretar</button>
      </div>
    
      <div style={{display:'flex', alignItems:"center"}}>
        <Editor
          height="60vh"
          width={"80vh"}
          defaultLanguage=""
          defaultValue="// some comment"
          theme='vs-dark'
          onMount={handleEditorDidMount}
        />
        <textarea value={resultado} cols={70} rows={27} readOnly />
      </div>
    </>
  );
}
