import { useEffect, useState } from 'react'
import LogoutComp from '../components/LogoutComp';
import axios from 'axios';
import { useLocation, useNavigate } from 'react-router-dom';
import { options } from '../data/options';
import { pdfjs } from "react-pdf";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFileUpload } from '@fortawesome/free-solid-svg-icons';
import { makeStyles } from '@material-ui/core';

pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.js`;

const useStyles = makeStyles((theme) => ({
  container: {
    width: "100%",
    display: "flex",
    alignItems: "center",
    justifyContent: "space-evenly",
    flexDirection: "row",
    flexWrap: "wrap",

    [theme.breakpoints.down("sm")]: {
      flexDirection: "column",
    },
  },
  promptSelectionContainer: {
    width: "40%",

    [theme.breakpoints.down("sm")]: {
      width: "90%",
    },
  },
  outputContainer: {
    fontSize: '16px',
    width: '90%',
    marginLeft: 'auto',
    marginRight: 'auto',
    marginTop: 30,
    backgroundColor: '#283732',
    borderRadius: 10,
    padding: 30,

    [theme.breakpoints.down("sm")]: {
      width: "75%",
      padding: 20
    }
  }
}));

const Demo = () => {
  const location = useLocation()
  const navigate = useNavigate()
  const [file, setFile] = useState(null);
  const [promptText, setPromptText] = useState("");
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
  const [selectedFileName, setSelectedFileName] = useState('');
  const [dots, setDots] = useState('');
  const classes = useStyles();
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

  useEffect(() => {
    const intervalId = setInterval(() => {
      setDots((prevDots) => (prevDots.length < 3 ? prevDots + '.' : ''));
    }, 500); 

    return () => clearInterval(intervalId);
  }, []);

  useEffect(() => {
    const targetElement = document.querySelector('.promptResult');
    if (!isLoading && targetElement) {
      targetElement.scrollIntoView({
        behavior: 'smooth',
        block: 'start',
      });
    }
  }, [isLoading])

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
  
    if (fileData && (fileData.type === "application/pdf" || fileData.type === "application/vnd.openxmlformats-officedocument.wordprocessingml.document")) {
      setFile((prev) => fileData);
      const reader = new FileReader();
      reader.onload = handleFileRead;
      reader.readAsArrayBuffer(fileData);
      setSelectedFileName(fileData.name);
    } else {
      alert("Please select .pdf or .docx file");
      e.target.value = null; 
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

  const handleMouseEnter = (e) => {
    if (!isDisable && !isDailyLimitReached) {
      e.target.style.color = "blue";
    }
  };
  
  const handleMouseLeave = (e) => {
    if (!isDisable && !isDailyLimitReached) {
      e.target.style.color = "#000";
    }
  };

  return (
    <div>
      <main
        style={{
          width: "100vw",
          height: "100vh",
          background: "#087566",
          color: "#fff",
          paddingBottom: 30
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
            >Share <div 
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
          className={classes.container}
        >
          <div
            style={{
              display: "flex",
              flexDirection: 'column',
              alignItems: "flex-end",
              justifyContent: "flex-end",
            }}
          >
            <div style={{ position: "relative", display: "inline-block" }}>
              <input
                type="file"
                style={{
                  position: "absolute",
                  left: 0,
                  top: 0,
                  opacity: 0,
                  width: "100%",
                  height: "100%",
                  cursor: "pointer",
                }}
                accept=".pdf,.docx"
                disabled={isDailyLimitReached}
                onChange={handleFile}
              />
              <div
                style={{
                  padding: 16,
                  background: "#8c84fa",
                  borderRadius: 4,
                  color: "white",
                  display: "inline-block",
                  cursor: "pointer",
                  fontWeight: 600,
                  width: 220,
                  textAlign: 'center',
                  fontSize:20
                }}
              >
                <FontAwesomeIcon icon={faFileUpload}/> &nbsp;&nbsp;UPLOAD FILE
              </div>
            </div>
            {selectedFileName && (
                  <p style={{ fontSize: 14, marginTop: 8 }}>{selectedFileName}</p>
                )}
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
            className={classes.promptSelectionContainer}
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
                <button
                  key={index}
                  style={{
                    padding: 15,
                    border: "1px solid black",
                    borderRadius: 16,
                    background: "#fff",
                    color: `${isDisable || isDailyLimitReached ? "gray" : "#000"}`,
                    cursor: "pointer",
                    margin: 4,
                    fontSize: 16,
                    marginBottom: 20,
                  }}
                  onMouseEnter={handleMouseEnter}
                  onMouseLeave={handleMouseLeave}
                  disabled={isDisable || isDailyLimitReached}
                  value={val}
                  onClick={() => {
                    setPromptText(val);
                    setKeyWord(val + ". " + requestText);
                  }}
                >
                  {val}
                </button>
              ))}

            </div>
          </div>
        </div>
        {isLoading && <div style={{
          marginTop: 60,
          fontWeight: 500,
          fontSize: 20,
          textAlign: 'center',
          marginLeft: 'auto',
          marginRight: 'auto'
        }}>
          <div>
            AI is analyzing your resume{dots}
          </div>
        </div>}
        {!isLoading && resGPT.length > 0 && (
          <div
            style={{
              color: "#fff",
              background: "#087566",
              marginTop: 20
            }}
          >
            <div className="promptResult" style={{textAlign: 'center', fontSize: 24, fontWeight:500}}>Results for Prompt</div>
            <div
              className={classes.outputContainer}
            >
               {resGPT.map((line, index) => (
                <div style={{marginTop: 10, lineHeight: 1.3}} key={index}>{line}</div>
              ))}
            </div>
          </div>
        )}
      </main>
    </div>
  )
}

export default Demo