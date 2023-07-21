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
  },
}));

export default function Home() {
  const [file, setFile] = useState(null);
  const [result, setResult] = useState('');
  const [requestText, setRequesText] = useState('');
  const classes = useStyles();

  const handleFileChange = (event) => {
    const selectedFile = event.target.files[0];
    setFile(selectedFile);
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
      console.log("requestText: ",requestText)
      const response = await fetch("/api/generate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ amit: content }),
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
        className={classes.input}
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
      <Button
        variant="contained"
        color="primary"
        className={classes.button}
        onClick={handleUpload}
        disabled={!file}
      >
        Extract Text
      </Button>
      {result && (
        <div className={classes.result}>
          <h3>Extracted Text:</h3>
          <pre>{result}</pre>
        </div>
      )}
    </div>
  );
}
