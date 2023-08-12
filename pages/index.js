import React, { useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import CloudUploadIcon from '@material-ui/icons/CloudUpload';
import { Document, Page, pdfjs } from 'react-pdf';
import { saveAs } from 'file-saver';
import Docxtemplater from 'docxtemplater';

pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.js`;

const useStyles = makeStyles((theme) => ({
  root: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    marginTop: theme.spacing(4),
  },
  input: {
    display: 'none',
  },
  button: {
    marginTop: theme.spacing(2),
  },
  result: {
    marginTop: theme.spacing(4),
    whiteSpace: 'pre-wrap',
    width: "90%",
    marginLeft: "auto",
    marginRight: "auto",
    padding: 10,
    border: '2px solid rgba(0, 0, 0, 0.05)',
    overflowX: "scroll",
    fontSize:"16px"
  },
  inputContainer: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    marginTop: theme.spacing(4),
    width: '50%', // Default width for laptop screens

    [theme.breakpoints.up('md')]: {
      // Adjust width to 90% for PC screens and larger
      width: '90%',
    },
  },
  input: {
    width: '100%', // To make the input fill the container width
    height: 'auto',
    minHeight:"400px",
    padding: '10px',
    fontSize: '16px',
    border: '1px solid #ccc',
    borderRadius: '4px',
    marginBottom: theme.spacing(2),
    wordWrap: "break-word"
  },
  input1: {
    display: "none"
  }
}));

export default function Home() {
  const [file, setFile] = useState(null);
  const [result, setResult] = useState('');
  const [requestText, setRequesText] = useState('');
  const [promptText, setPromptText] = useState(''); 
  const classes = useStyles();

  const handleFileChange = (event) => {
    const selectedFile = event.target.files[0];
    setFile(selectedFile);
  };

  const handlePromptChange = (event) => {
    setPromptText(event.target.value);
  };

  const handleUpload = () => {
    if (file) {
      const reader = new FileReader();
      reader.onload = handleFileRead;
      reader.readAsArrayBuffer(file);
    }
  };

  const handleFileRead = async (event) => {
    const content = event.target.result;
    if (file.name.endsWith('.pdf')) {
      await extractTextFromPDF(content);
    } else if (file.name.endsWith('.docx')) {
      await extractTextFromDOCX(content);
    }
  };

  const extractTextFromPDF = async (content) => {
    try {
      const loadingTask = pdfjs.getDocument({ data: content });
      const pdfDocument = await loadingTask.promise;
      let extractedText = '';

      for (let pageNumber = 1; pageNumber <= pdfDocument.numPages; pageNumber++) {
        const page = await pdfDocument.getPage(pageNumber);
        const pageText = await page.getTextContent();
        const pageStrings = pageText.items.map((item) => item.str);
        extractedText += pageStrings.join(' ');
      }

      setRequesText(extractedText);
      ProcessText(extractedText)
    } catch (error) {
      console.error('Error extracting text from PDF:', error);
      setRequesText('');
    }
  };

  const extractTextFromDOCX = async (content) => {
    try {
      const buffer = new Uint8Array(content);
      const doc = new Docxtemplater();
      doc.loadZip(buffer);
      doc.render();
      const extractedText = doc.getFullText();
      setRequesText(extractedText);
      ProcessText(extractedText)
    } catch (error) {
      console.error('Error extracting text from DOCX:', error);
      setRequesText('');
    }
  };

  async function ProcessText(content){
    try {
     // console.log("requestText: ",requestText)
      const response = await fetch("/api/generate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ amit: content + ". " + promptText }),
      });

      const data = await response.json();
      if (response.status !== 200) {
        throw data.error || new Error(`Request failed with status ${response.status}`);
      }

      setResult(data.result);
      //setRequesText("");
    } catch(error) {
      // Consider implementing your own error handling logic here
      console.error(error);
      alert(error.message);
    }
  };

  return (
    <div className={classes.root}>
      <input
        accept=".pdf,.docx"
        className={classes.input1}
        id="file-upload"
        type="file"
        onChange={handleFileChange}
      />
      <label htmlFor="file-upload">
        <Button
          variant="contained"
          color="default"
          component="span"
          className={classes.button}
          startIcon={<CloudUploadIcon />}
        >
          Upload File
        </Button>
      </label>
      <div className={classes.inputContainer}>
        <label htmlFor="text-input">Prompt:</label>
        <textarea
          type="text"
          id="text-input"
          value={promptText}
          onChange={handlePromptChange}
          className={classes.input}
          placeholder="Type your prompt here..."
        />
      </div>
      <Button
        variant="contained"
        color="primary"
        className={classes.button}
        onClick={handleUpload}
        disabled={!file}
      >
        GENERATE
      </Button>
      {result && (
        <div className={classes.result}>
          <h3>Jina Output</h3>
          <pre>{result}</pre>
        </div>
      )}
    </div>
  );
}
