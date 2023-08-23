import { useEffect, useState } from 'react'
import LogoutComp from '../components/LogoutComp';
import axios from 'axios';
import { useLocation, useNavigate } from 'react-router-dom';
import { options, promptMapping } from '../data/options';
import { pdfjs } from "react-pdf";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCircleInfo, faCopy, faFileUpload, faUser } from '@fortawesome/free-solid-svg-icons';
import { makeStyles } from '@material-ui/core';
import JobProfilePopup from '../components/JobProfilePopupComp';
import FooterComp from '../components/footerComp';
import PizZip from "pizzip";
import { DOMParser } from "@xmldom/xmldom";
import { jobProfiles } from '../data/job_profiles';

pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.js`;

const useStyles = makeStyles((theme) => ({
  container: {
    width: "100%",
    display: "flex",
    alignItems: "center",
    justifyContent: "space-evenly",
    flexDirection: "row",
    flexWrap: "wrap",
    marginTop: 20,

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
  outputInnerContainer: {
    margin: 20,

    [theme.breakpoints.down("xs")]: {
      marginLeft: 10,
      marginRight: 10
    },
  },
  selectProfileButton: {
    marginLeft: 10,
    padding: 5,
    border: '2px solid darkgrey',
    borderRadius: 5,
    fontSize: 14,
    cursor: 'pointer',

    "&:hover": {
      backgroundColor: '#cfcdcd'
    }
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

    [theme.breakpoints.down('xs')]: {
      fontSize: 16,
      padding: 10
    }
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

    [theme.breakpoints.down('xs')]: {
      fontSize: 16,
      padding: 10
    }
  },
  copyToClipboardButton: {
    border: 'none',
    cursor: 'pointer',
    marginLeft: 5
  },
  brandName: {
    fontFamily: 'Roboto Serif',
    cursor: 'pointer',
    color: 'white',
    marginLeft: 50,
    fontSize: 24,

    [theme.breakpoints.down("xs")]: {
      marginLeft: 20
    },
  },
  logoutButton: {
    display: "flex",
    marginRight: 50,
    marginTop: 10,
    marginBottom: 10,

    [theme.breakpoints.down("xs")]: {
      marginRight: 20
    },
  },
  usageDetailsContainer: {
    marginTop: 50,
    fontSize: 18,
    width: '90%',
    marginLeft: 'auto',
    marginRight: 'auto',
    display: 'flex',
    flexDirection: 'row',

    [theme.breakpoints.down("xs")]: {
      marginTop: 30,
      fontSize: 16
    },
  },
  usageDetails: {
    width: '90%',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',

    [theme.breakpoints.down("xs")]: {
      fontSize: 14
    }
  },
  accountIconContainer: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    padding: 20,
    height: 30,
    width: 30,
    marginRight: 20,
    borderRadius: '50%',
    fontSize: 36,
    marginTop: 'auto',
    marginBottom: 'auto',
    border: '1px solid black',

    [theme.breakpoints.down("xs")]: {
      fontSize: 24,
      height: 20,
      width: 20,
      padding: 10,
      marginRight: 10
    }
  },
  couponCodeContainer: {
    display: 'inline-block',
    backgroundColor: '#454444',
    color: 'white',
    borderRadius: 5,
    marginLeft: 10,
    marginRight: 10,
    padding: 10,
    letterSpacing: 1,

    [theme.breakpoints.down("xs")]: {
      padding: 5,
      marginLeft: 5,
      marginRight: 5
    }
  },
  andDivider: {
    fontSize: 24,
    fontWeight: 'bold',

    [theme.breakpoints.down("sm")]: {
      marginTop: 40,
      marginBottom: 20
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
    backgroundColor: "#5271FF",
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
    paddingTop: 30,

    [theme.breakpoints.down("xs")]: {
      fontSize: 28
    }
  },
  promptSelectionTitle: {
    fontSize: 24,

    [theme.breakpoints.down("xs")]: {
      fontSize: 20
    }
  },
  promptResultTitle: {
    width: '90%',
    marginLeft: 'auto',
    marginRight: 'auto',
    fontSize: 24,

    [theme.breakpoints.down("xs")]: {
      fontSize: 20
    }
  },
  infoContent: {
    overflow: 'hidden',
    maxHeight: '500px',
    transition: 'max-height 0.5s ease-out, transform 0.5s ease-out, opacity 0.5s ease-out',
    marginBottom: 10,
    marginTop: 5,
    width: 350,
    marginLeft: '10%',
    marginRight: '10%',
    borderRadius: 10,
    fontSize: 14,
    padding: 15,
    backgroundColor: '#d5c228',
    opacity: 1,
    transform: 'scaleY(1)',

    [theme.breakpoints.down("sm")]: {
      width: 300,
      marginLeft: '20%'
    },

    [theme.breakpoints.down("xs")]: {
      width: 280,
      marginLeft: '10%'
    }
  },
  collapsed: {
    maxHeight: 0,
    opacity: 0,
    transform: 'scaleY(0)',
    padding: 15,
  },
  copiedConfirm: {
    fontSize: 14,
    display: 'inline',
    position: 'absolute',
    zIndex: 10,
    padding: 10,
    marginTop: -40,
    marginLeft: -80,
    backgroundColor: '#000000ab',
    color: 'white',
    borderRadius: 10
  },
  selectionPromptItem: {
    padding: 15,
    border: "1px solid black",
    borderRadius: 16,
    background: "#fff",
    cursor: "pointer",
    margin: 4,
    fontSize: 16,
    marginBottom: 20,

    [theme.breakpoints.down("xs")]: {
      fontSize: 14,
      padding: 10,
      borderRadius: 10
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
  const [selectedProfile, setSelectedProfile] = useState('')
  const classes = useStyles();
  const data = location.state;
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [borderColor, setBorderColor] = useState("darkgrey");
  const [showInfo, setShowInfo] = useState(false);
  const [copied, setCopied] = useState(false);

  const formUrl = 'https://www.plopso.com/#referral-form'
  const homeUrl = "https://www.plopso.com/"

  const copyToClipboard = () => {
    setCopied(true)
    navigator.clipboard.writeText(couponCode);
  };

  const toggleExpand = () => {
    setShowInfo(!showInfo);
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
    const access_token = localStorage.getItem("google-access-token")
    if (access_token === null || data === null) {
      navigate('/login')
    } else {
      fetchUserDetails(data.data.email)
    }

    const handleOPENAIAPI = async () => {
      if (isExtracted && promptText) {
        if (usedPromptCount !== currentPromptLimitCount) {
          setIsLoading(true);
          const reqBody = {
            data: {
              email: data.data.email,
              resumeText: requestText,
              queryText: promptText
            }
          }
          try {
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

              if (response.data.currentMaxPromptCount === response.data.currentPromptCount) {
                setIsDailyLimitReached(true)
              } else {
                setIsDailyLimitReached(false)
              }
            }
          } catch (e) {
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
    const intervalId = setInterval(() => {
      setCopied(false)
    }, 1000)

    return () => clearInterval(intervalId);
  }, [copied]);

  useEffect(() => {
    const targetElement = document.querySelector('.promptResult');
    const targetLoaderElement = document.querySelector('.analyzingSection');
    if (isLoading) {
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
  function str2xml(str) {
    if (str.charCodeAt(0) === 65279) {
      str = str.substr(1);
    }
    return new DOMParser().parseFromString(str, "text/xml");
  }

  function getParagraphs(content) {
    const zip = new PizZip(content);
    const xml = str2xml(zip.files["word/document.xml"].asText());
    const paragraphsXml = xml.getElementsByTagName("w:p");
    const paragraphs = [];

    for (let i = 0, len = paragraphsXml.length; i < len; i++) {
      let fullText = "";
      const textsXml = paragraphsXml[i].getElementsByTagName("w:t");
      for (let j = 0, len2 = textsXml.length; j < len2; j++) {
        const textXml = textsXml[j];
        if (textXml.childNodes) {
          fullText += textXml.childNodes[0].nodeValue;
        }
      }
      if (fullText) {
        paragraphs.push(fullText);
      }
    }
    return paragraphs;
  }

  const extractTextFromDOCX = async (content) => {
    try {
      setIsDisable(true);
      const paragraphs = getParagraphs(content);
      const extractedText = paragraphs.join(' ')
      setRequesText(extractedText);
      setIsDisable(false);
    } catch (error) {
      console.error('Error extracting text from DOCX:', error);
      setRequesText('');
    }
  };

  const handleFile = (e) => {
    let fileData = e.target.files[0];

    if (fileData && (fileData.type === "application/pdf" || fileData.type === "application/vnd.openxmlformats-officedocument.wordprocessingml.document")) {
      setFile(fileData);
    } else {
      alert("Please select .pdf or .docx file");
      e.target.value = null;
      return;
    }
  };

  useEffect(() => {
    if (file !== null) {
      const reader = new FileReader();
      reader.onload = handleFileRead
      reader.readAsArrayBuffer(file);
      setSelectedFileName(file.name);
    }
  }, [file])

  const handleFileRead = async (event) => {
    const content = event.target.result;
    if (content) {
      if (file.name.endsWith('.pdf')) {
        await extractTextFromPDF(content);
      } else if (file.name.endsWith('.docx')) {
        await extractTextFromDOCX(content);
      }
      setKeyWord(promptText + ". " + requestText);
      setIsExtracted(true);
    }
  };

  function promptErrorMessage(msg) {
    alert(msg)
  }

  const handleMouseEnter = (e) => {
    if (!isDisable && !isDailyLimitReached && !isLoading) {
      e.target.style.color = "blue";
    }
  };

  const handleMouseLeave = (e) => {
    if (!isDisable && !isDailyLimitReached && !isLoading) {
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
          <div className={classes.accountIconContainer}>
            <FontAwesomeIcon icon={faUser} />
          </div>
          <div className={classes.usageDetails}>
            <div
              style={{
                padding: 5
              }}
            >
              {`Used: `} {<span style={{
                fontWeight: 'bold',
                color: `${isDailyLimitReached ? "red" : "#000"}`
              }}> {usedPromptCount + ` out of ` + currentPromptLimitCount}</span>} {` prompts per daily usage.`}
            </div>
            {currentPromptLimitCount === 2 &&
              <div
                style={{
                  padding: 5,
                }}
              >Share your coupon code
                <div
                  className={classes.couponCodeContainer}
                >{couponCode}
                  <button
                    style={{
                      padding: 5,
                      borderRadius: 5
                    }}
                    className={classes.copyToClipboardButton}
                    onClick={copyToClipboard}>
                    <FontAwesomeIcon icon={faCopy} />
                  </button>
                </div>
                {copied &&
                  <div className={classes.copiedConfirm}>copied!</div>}
                <FontAwesomeIcon onClick={toggleExpand} cursor='pointer' style={{ color: '#d5c228' }} icon={faCircleInfo} />
              </div>
            }
          </div>
        </div>
        <div className={`${classes.infoContent} ${showInfo ? '' : classes.collapsed}`}>
          {`Ask your friend to login here using your coupon code and then, you will unlock 6 prompts per daily usage.`}
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
                  cursor: `${isDailyLimitReached ? 'default' : 'pointer'}`,
                }}
                disabled={isDailyLimitReached}
                onChange={handleFile}
              />
              <div
                className={classes.uploadResumeBlock}
                style={{
                  backgroundColor: `${isDailyLimitReached ? "rgb(110 127 207)" : "rgb(39 69 209)"}`,
                  cursor: `${isDailyLimitReached ? 'default' : 'pointer'}`
                }}
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
            and
          </div>
          <div
            className={classes.promptSelectionContainer}
          >
            <p
              className={classes.promptSelectionTitle}
            >
              Choose one of the below prompt
            </p>
            {(isDisable && !isDailyLimitReached) && (
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
              <button
                className={classes.selectionPromptItem}
                style={{
                  color: `${isDisable || isDailyLimitReached || isLoading ? "gray" : "#000"}`,
                }}
                onMouseEnter={handleMouseEnter}
                onMouseLeave={handleMouseLeave}
                disabled={isDisable || isDailyLimitReached || isLoading}
                onClick={() => {
                  if (selectedProfile === null || selectedProfile.length === 0) {
                    alert("please select a profile to proceed.")
                    setBorderColor("red")
                  } else {
                    setGPT([])
                    setPromptText(promptMapping[3] + selectedProfile + promptMapping[4]);
                    setKeyWord("Show me the roadmap to become" + ". " + requestText)
                  }
                }}
              >
                Show me the points to improve and my roadmap for
                <button
                  className={classes.selectProfileButton}
                  style={{
                    borderColor: borderColor,
                    color: `${isDisable || isDailyLimitReached || isLoading ? "gray" : "#000"}`
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
              {options.map((val, index) => (
                <button
                  className={classes.selectionPromptItem}
                  key={index}
                  style={{
                    color: `${isDisable || isDailyLimitReached || isLoading ? "gray" : "#000"}`
                  }}
                  onMouseEnter={handleMouseEnter}
                  onMouseLeave={handleMouseLeave}
                  disabled={isDisable || isDailyLimitReached || isLoading}
                  value={promptMapping[index]}
                  onClick={() => {
                    setGPT([])
                    setPromptText(promptMapping[index]);
                    setKeyWord(promptMapping[index] + ". " + requestText);
                  }}
                >
                  {val}
                </button>
              ))}
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
              <div className={"promptResult " + classes.promptResultTitle}>Result just made for you:</div>
              <div
                className={classes.outputContainer}
              >
                <div
                  className={classes.outputInnerContainer}>
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