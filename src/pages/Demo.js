import { useEffect, useState } from 'react'
import LogoutComp from '../components/LogoutComp';
import axios from 'axios';
import { useLocation, useNavigate } from 'react-router-dom';
import { options } from '../data/options';
import { pdfjs } from "react-pdf";
import { CircularProgress } from '@material-ui/core';

pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.js`;

const Demo = () => {
  const location = useLocation()
  const navigate = useNavigate()
  const [file, setFile] = useState(null);
  const [promptText, setPromptText] = useState("");
  const [responseText, setResponseText] = useState("");
  const [requestText, setRequesText] = useState("");
  const [keyword, setKeyWord] = useState("");
  const [resGPT, setGPT] = useState([]);
  const [isExtracted, setIsExtracted] = useState(false);
  const [isDisable, setIsDisable] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [usedPromptCount, setUsedPromptCount] = useState(0);
  const [currentPromptLimitCount, setCurrentPromptLimitCount] = useState(0);
  const [couponCode, setCouponCode] = useState('')
  const [isDailyLimitReached, setIsDailyLimitReached] = useState(false)
  const data = location.state;

  useEffect(() => {
    const fetchUserDetails = async (email) => {
      const reqBody = {
        data: {
          email: data.data.email
        }
      }
      let response
        = await axios.post(`/api/user/details`, JSON.stringify(reqBody), {
          headers: {
            'Content-Type': 'application/json',
          }
        });
      if(response.status === 200) {
        setCurrentPromptLimitCount(response.data.currentMaxPromptCount)
        setUsedPromptCount(response.data.currentPromptCount)
        setCouponCode(response.data.couponCode)
        if(response.data.currentMaxPromptCount === response.data.currentPromptCount) {
          setIsDailyLimitReached(true)
        } else {
          setIsDailyLimitReached(false)
        }
      }
    }
    
    if (data === null) {
      navigate('/login')
    } else {
      fetchUserDetails(data.data.email)
    }

    const handleOPENAIAPI = async () => {
      if (isExtracted && promptText) {
        if(usedPromptCount !== currentPromptLimitCount){
          setIsLoading(true);
          const reqBody = {
            data: {
              email: data.data.email,
              resumeText: requestText,
              queryText: promptText
            }
          }
          try{
            let response
            = await axios.post(`/api/user/generate`, JSON.stringify(reqBody), {
              headers: {
                'Content-Type': 'application/json',
              }
            });

            if (response.status === 200) {
              setGPT(response.data.responseText.split("\n"));
              setIsLoading(false);
              setCurrentPromptLimitCount(response.data.currentMaxPromptCount)
              setUsedPromptCount(response.data.currentPromptCount)
              setCouponCode(response.data.couponCode)
              if(response.data.currentMaxPromptCount === response.data.currentPromptCount) {
                setIsDailyLimitReached(true)
              } else {
                setIsDailyLimitReached(false)
              }
            }
          } catch(e) {
            promptErrorMessage("you have reached your daily limit for prompts!")
          }
        } else {
          promptErrorMessage("you have reached your daily limit for prompts!")
        }
      }
    };

    handleOPENAIAPI();
  }, [keyword]);


  const extractTextFromPDF = async (content) => {
    try {
      setIsDisable(true);
      const loadingTask = pdfjs.getDocument({ data: content });
      const pdfDocument = await loadingTask.promise;
      let extractedText = "";

      for (
        let pageNumber = 1;
        pageNumber <= pdfDocument.numPages;
        pageNumber++
      ) {
        const page = await pdfDocument.getPage(pageNumber);
        const pageText = await page.getTextContent();
        const pageStrings = pageText.items.map((item) => item.str);
        extractedText += pageStrings.join(" ");
      }

      setRequesText(extractedText);
      setIsDisable(false);
    } catch (error) {
      console.error("Error extracting text from PDF:", error);
      setRequesText("");
    }
  };

  const handleFile = (e) => {
    let fileData = e.target.files[0];

    if (fileData && fileData.type === "application/pdf") {
      setFile((prev) => fileData);
      const reader = new FileReader();
      reader.onload = handleFileRead;
      reader.readAsArrayBuffer(fileData);
    } else {
      alert("Please select .pdf file");
      return;
    }
  };

  const handleFileRead = async (event) => {
    const content = event.target.result;

    if (content) {
      await extractTextFromPDF(content);
      setKeyWord(promptText + ". " + requestText);
      setIsExtracted(true);
    }
  };

  function promptErrorMessage(msg){
    alert(msg)
  }

  return (
    <div>
      <main
        style={{
          width: "100vw",
          height: "100vh",
          background: "#087566",
          color: "#fff",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-around",
            borderBottom: "4px solid #5ba38f",
            width: '100%'
          }}
        >
          <h2>Plopso</h2>
          <ul
            style={{
              display: "flex",
            }}
          >
            <li
              style={{
                padding: "0 1rem",
                listStyle: "none",
              }}
            >
              <LogoutComp />
            </li>
          </ul>
        </div>
        <div
          style={{
            textAlign: "center",
            marginTop: 50,
            marginBottom:50
          }}
        >
          <div
            style={{
              padding: 5,
              fontSize:18,
              fontWeight:500
            }}
          >
            {`Used ` + usedPromptCount + ` out of ` + currentPromptLimitCount + ` prompts as per your daily limit`}
          </div
          >
          {currentPromptLimitCount === 2 &&
            <div
              style={{
                padding: 5,
                fontSize:18,
                fontWeight:500
              }}
            >Use <div 
              style={{
                display: 'inline-block',
                backgroundColor: 'lightgrey',
                padding: 5,
                color: 'black',
                borderRadius:5,
                marginLeft: 10,
                marginRight: 10
              }}
            >{couponCode}</div> coupon code to increase your daily prompt limit to 6</div>
          }
          {isDailyLimitReached && <div
            style={{
              padding: 5,
              fontSize:18,
              fontWeight:500,
              color: 'yellow'
            }}
          >You have used you daily limit of {currentPromptLimitCount} prompts</div>}
        </div>
        <div
          style={{
            width: "100%",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-evenly",
          }}
        >
          <div
            style={{
              display: "flex",
              flexDirection: 'column',
              alignItems: "flex-end",
              justifyContent: "flex-end",
            }}
          >
            <input
              type="file"
              style={{
                padding: 16,
                background: "#8c84fa",
                borderRadius: 4,
              }}
              disabled={isDailyLimitReached}
              onChange={handleFile}
            />

            <div
              style={{
                marginTop: 10,
                color: 'yellow'
              }}
            >(*Only Docx and PDF are accepted)</div>
          </div>
          <div>
            <h1>and</h1>
          </div>
          <div
            style={{
              width: "40%",
            }}
          >
            <p
              style={{
                fontSize: "24px",
                fontWeight: 500
              }}
            >
              Choose one of the below prompt
            </p>
            <div
              style={{
                display: "flex",
                flexDirection: "column",
              }}
            >
              {options.map((val, index) => (
                <input
                  style={{
                    padding: 16,
                    border: "1px solid black",
                    borderRadius: 16,
                    background: "#fff",
                    color: `${isDisable || isDailyLimitReached ? "gray" : "#000"}`,
                    cursor: "pointer",
                    margin: 4,
                    fontSize: 16,
                  }}
                  disabled={isDisable || isDailyLimitReached}
                  value={val}
                  onClick={() => {
                    setPromptText(val);
                    setKeyWord(val + ". " + requestText);
                  }}
                />
              ))}
            </div>
          </div>
        </div>
        {isLoading && <div style={{
          textAlign: 'center',
          margin: 16,
        }}>
          <CircularProgress size={32} color='white' style={{marginTop:40}}/>
        </div>}
        {!isLoading && resGPT.length > 0 && (
          <div
            style={{
              color: "#fff",
              background: "#087566",
              padding: 32,
              marginTop: 40
            }}
          >
            <div style={{textAlign: 'center', fontSize: 24, fontWeight:500}}>Results for Prompt</div>
            <div
              style={{
                fontSize: '1.2rem',
                width: '80%',
                marginLeft: 'auto',
                marginRight: 'auto',
                marginTop: 50
              }}
            >
               {resGPT.map((line, index) => (
                <div style={{marginTop: 10}} key={index}>{line}</div>
              ))}
            </div>
          </div>
        )}
      </main>
    </div>
  )
}

export default Demo