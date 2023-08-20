import { useEffect, useState } from 'react'
import LogoutComp from '../components/LogoutComp';
import axios from 'axios';
import { useLocation, useNavigate } from 'react-router-dom';
import { options } from '../data/options';
import { pdfjs } from "react-pdf";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFileUpload } from '@fortawesome/free-solid-svg-icons';
import { makeStyles } from '@material-ui/core';
import JobProfilePopup from '../components/JobProfilePopupComp';
import FooterComp from '../components/footerComp';

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
    backgroundColor: '#00000014',
    borderRadius: 10,
    minHeight: 20,
    border: '1px solid darkgrey',
  },
  selectProfileButton: {
    marginLeft: 10,
    padding: 5,
    border: '2px solid darkgrey',
    borderRadius: 5,
    fontSize: 14,
    cursor: 'pointer'
  },
  tryAnotherPrompt: {
    width: 250,
    padding: 15,
    backgroundColor: 'white',
    color: 'black',
    borderRadius: 50,
    textAlign: 'center',
    marginLeft: 'auto',
    marginRight: 'auto',
    marginTop: 50,
    cursor: 'pointer',
    fontWeight: 500,
    fontSize: 18,
    border: '1px solid',

    "&:hover": {
      color: 'green'
    },
  },
  navigateButton: {
    width: 250,
    padding: 15,
    backgroundColor: 'white',
    color: 'black',
    borderRadius: 50,
    textAlign: 'center',
    marginLeft: 'auto',
    marginRight: 'auto',
    cursor: 'pointer',
    fontWeight: 500,
    fontSize: 18,
    border: '1px solid',

    "&:hover": {
      color: 'green'
    },
  },
  copyToClipboardButton: {
    border: 'none',
    cursor: 'pointer',
    marginLeft: 10
  },
  brandName: {
    fontFamily: 'Roboto Serif',
    cursor: 'pointer',
    color: 'white',
    marginLeft: 50,

    [theme.breakpoints.down("xs")]: {
      fontSize: 24,
      marginLeft: 20
    },
  },
  logoutButton: {
    display: "flex",
    marginRight: 50,

    [theme.breakpoints.down("xs")]: {
      marginRight: 20
    },
  },
  usageDetailsContainer: {
    textAlign: "center",
    marginTop: 50,
    marginBottom: 50,
    fontSize: 18,

    [theme.breakpoints.down("xs")]: {
      marginTop: 30,
      marginBottom: 30,
      fontSize: 16
    },
  },
  andDivider: {
    [theme.breakpoints.down("sm")]: {
      marginTop: 20
    }
  },
  uploadResumeBlockContainer: {
    display: "flex",
    flexDirection: 'column',
    alignItems: "flex-end",
    justifyContent: "flex-end",

    [theme.breakpoints.down("xs")]: {
      width: 200
    }
  },
  uploadResumeBlock: {
    padding: 16,
    background: "#5271FF",
    borderRadius: 4,
    color: "white",
    display: "inline-block",
    cursor: "pointer",
    fontWeight: 600,
    width: 220,
    textAlign: 'center',
    fontSize: 20,

    [theme.breakpoints.down("xs")]: {
      width: 180,
      fontSize: 16
    }
  },
  uploadWarning: {
    marginTop: 10,
    color: 'darkblue',
    fontSize: 16,
    fontStyle: 'italic',

    [theme.breakpoints.down("xs")]: {
      fontSize: 14
    }
  },
  motto: {
    textAlign: 'center',
    fontWeight: 'bold',
    fontSize: 36,
    fontFamily: 'Montserrat',
    margin: 10,
    paddingTop: 30
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
  const [selectedProfile, setSelectedProfile] = useState('')
  const classes = useStyles();
  const data = location.state;
  const jobProfiles = ["Software Engineer", "Data Scientist", "UX Designer"];
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [borderColor, setBorderColor] = useState("darkgrey");
  const [copied, setCopied] = useState(false);

  const formUrl = 'https://www.plopso.com/#referral-form'
  const homeUrl = "https://www.plopso.com/"

  const copyToClipboard = () => {
    navigator.clipboard.writeText(couponCode);
    setCopied(true);
  };

  const openPopup = () => {
    setIsPopupOpen(true);
  };

  const closePopup = () => {
    setIsPopupOpen(false);
  };

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
      if (response.status === 200) {
        setCurrentPromptLimitCount(response.data.currentMaxPromptCount)
        setUsedPromptCount(response.data.currentPromptCount)
        setCouponCode(response.data.couponCode)
        if (response.data.currentMaxPromptCount === response.data.currentPromptCount) {
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
        if (usedPromptCount !== currentPromptLimitCount) {
          setIsLoading(true);

          // const reqBody = {
          //   data: {
          //     email: data.data.email,
          //     resumeText: requestText,
          //     queryText: promptText
          //   }
          // }
          // try {
          //   let response
          //     = await axios.post(`/api/user/generate`, JSON.stringify(reqBody), {
          //       headers: {
          //         'Content-Type': 'application/json',
          //       }
          //     });

          //   if (response.status === 200) {
          //     setGPT(response.data.responseText.split("\n"));
          //     setIsLoading(false);
          //     setCurrentPromptLimitCount(response.data.currentMaxPromptCount)
          //     setUsedPromptCount(response.data.currentPromptCount)
          //     setCouponCode(response.data.couponCode)

          //     if (response.data.currentMaxPromptCount === response.data.currentPromptCount) {
          //       setIsDailyLimitReached(true)
          //     } else {
          //       setIsDailyLimitReached(false)
          //     }
          //   }
          // } catch (e) {
          //   promptErrorMessage("you have reached your daily limit for prompts!")
          // }
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
    const targetLoaderElement = document.querySelector('.analyzingSection');
    if(isLoading) {
      targetLoaderElement.scrollIntoView({
        behavior: 'smooth',
        block: 'start',
      });
    }
    if (!isLoading && resGPT.length > 0) {
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

  function promptErrorMessage(msg) {
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
          width: "100%",
          height: "100%",
          minHeight: '100vh',
          backgroundColor: "rgba(70, 160, 148, 11%)",
          color: "black",
          paddingBottom: 60,
          fontFamily: 'open sans,sans-serif'
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            backgroundColor: '#087566',
            justifyContent: "space-between",
            borderBottom: "4px solid #5ba38f",
            width: '100%'
          }}
        >
          <h1
            className={classes.brandName}
            onClick={() => {
              window.location.href = homeUrl
            }}
          >PLOPSO</h1>
          <ul
            className={classes.logoutButton}
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
        <div className={classes.motto}>
          Get your resume insights with Resum-AI
        </div>
        <div
          className={classes.usageDetailsContainer}
        >
          <div
            style={{
              padding: 5,
              fontWeight: 500
            }}
          >
            {`Used ` + usedPromptCount + ` out of ` + currentPromptLimitCount + ` prompts as per your daily limit`}
          </div
          >
          {currentPromptLimitCount === 2 &&
            <div
              style={{
                padding: 5,
                fontWeight: 500
              }}
            >Share <div
              style={{
                display: 'inline-block',
                backgroundColor: 'lightgrey',
                color: 'black',
                borderRadius: 5,
                marginLeft: 10,
                marginRight: 10,
                padding: 10
              }}
            >{couponCode}
                <button
                  style={{
                    padding: 5,
                    borderRadius: 5
                  }}
                  className={classes.copyToClipboardButton}
                  onClick={copyToClipboard}>
                  {copied ? 'Copied!' : 'Copy'}
                </button>
              </div> coupon code to increase your daily prompt limit</div>
          }
          {isDailyLimitReached && <div
            style={{
              padding: 5,
              fontWeight: 500,
              color: 'red'
            }}
          >You have used you daily limit of {currentPromptLimitCount} prompts</div>}
        </div>
        <div
          className={classes.container}
        >
          <div
            className={classes.uploadResumeBlockContainer}
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
                disabled={isDailyLimitReached}
                onChange={handleFile}
              />
              <div
                className={classes.uploadResumeBlock}
              >
                <FontAwesomeIcon icon={faFileUpload} /> &nbsp;&nbsp;UPLOAD RESUME
              </div>
            </div>
            {selectedFileName && (
              <p style={{ fontSize: 14, marginTop: 8 }}>{selectedFileName}</p>
            )}
            <div
              className={classes.uploadWarning}
            >(*Only Docx and PDF are accepted)</div>
          </div>
          <div
            className={classes.andDivider}>
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
            {(isDisable || isDailyLimitReached) && (
              <div
                style={{
                  color: 'red',
                  marginTop: 10,
                  marginBottom: 5,
                  fontStyle: 'italic'
                }}>
                Please upload a resume
              </div>
            )}
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
                    color: `${isDisable || isDailyLimitReached || isLoading ? "gray" : "#000"}`,
                    cursor: "pointer",
                    margin: 4,
                    fontSize: 16,
                    marginBottom: 20,
                  }}
                  onMouseEnter={handleMouseEnter}
                  onMouseLeave={handleMouseLeave}
                  disabled={isDisable || isDailyLimitReached || isLoading}
                  value={val}
                  onClick={() => {
                    setPromptText(val);
                    setKeyWord(val + ". " + requestText);
                  }}
                >
                  {val}
                </button>
              ))}
              <button
                style={{
                  padding: 10,
                  border: "1px solid black",
                  borderRadius: 16,
                  background: "#fff",
                  color: `${isDisable || isDailyLimitReached || isLoading ? "gray" : "#000"}`,
                  cursor: "pointer",
                  margin: 4,
                  fontSize: 16,
                  marginBottom: 20,
                }}
                onMouseEnter={handleMouseEnter}
                onMouseLeave={handleMouseLeave}
                disabled={isDisable || isDailyLimitReached || isLoading}
                onClick={() => {
                  if (selectedProfile === null || selectedProfile.length === 0) {
                    alert("please select a profile to proceed.")
                    setBorderColor("red")
                  } else {
                    setPromptText("Show me the roadmap to become " + selectedProfile);
                    setKeyWord("Show me the roadmap to become" + ". " + requestText)
                  }
                }}
              >
                Show me the road to become
                <button
                  className={classes.selectProfileButton}
                  style={{
                    borderColor: borderColor
                  }}
                  disabled={isDisable || isDailyLimitReached}
                  onClick={(e) => {
                    setBorderColor("darkgrey")
                    setIsPopupOpen(true)
                    e.stopPropagation()
                  }}
                >
                  {selectedProfile.length === 0 ? 'Select profile' : selectedProfile}
                </button>
              </button>
              <JobProfilePopup
                isOpen={isPopupOpen}
                onClose={closePopup}
                jobProfiles={jobProfiles}
                selectedProfile={selectedProfile}
                setSelectedProfile={setSelectedProfile}
              />
            </div>
          </div>
        </div>
        {isLoading && <div 
          className='analyzingSection'
          style={{
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
        {
          // !isLoading && resGPT.length > 0 && 
          (
            <div
              style={{
                color: "black",
                marginTop: 40
              }}
            >
              <div className="promptResult" style={{ width: '90%', marginLeft: 'auto', marginRight: 'auto', fontSize: 24, fontWeight: 500 }}>Result just made for you:</div>
              <div
                className={classes.outputContainer}
              >
                <div style={{
                  margin: 20
                }}>
                  {resGPT.length === 0 ? 'Ready...' : resGPT.map((line, index) => (
                    <div style={{ marginTop: 10, lineHeight: 1.3 }} key={index}>{line}</div>
                  ))}
                </div>
              </div>
            </div>
          )}
        <div
          className={classes.tryAnotherPrompt}
          onClick={() => {
            setGPT([])
            window.scrollTo(0, 0)
          }}
        >
          Try another prompt
        </div>
        <div
          style={{
            textAlign: 'center',
            fontSize: 18,
            fontWeight: 500,
            marginTop: 20,
            marginBottom: 20
          }}
        >
          OR
        </div>
        <div
          className={classes.navigateButton}
          onClick={() => {
            window.location.href = formUrl
          }}
        >
          Explore job referral options
        </div>
      </main>
      <FooterComp />
    </div>
  )
}

export default Demo