
import SpeechRecognition, { useSpeechRecognition } from 'react-speech-recognition';
import {useEffect, useState} from "react";
import { db, auth } from '../../firebaseConfig.js';
import {collection, addDoc, doc, updateDoc} from "firebase/firestore";
import SavedTranscriptsTable from "../SavedTranscriptsTable.jsx";
import PopupInputBox from "./PopupInputBox.jsx";

function TextEditor({initialTranscript,updateObject,cancelUpdateMethod}) {

    const [finalTranscript, setFinalTranscript] = useState(initialTranscript || "");


    const [copyStatus, setCopyStatus] = useState('');

    const [showPopup,setShowPopup] = useState(false);
    const [savePopup,setSavePopup] = useState(false);
    const [_updateObj, setUpdateObj] = useState(updateObject)

    const user = auth.currentUser;
    const uid = user?.uid;

    const {
        transcript,
        listening,
        resetTranscript,
        browserSupportsSpeechRecognition
    } = useSpeechRecognition();

    if (!browserSupportsSpeechRecognition) {
        return <span>Browser doesn't support speech recognition.</span>;
    }

    //To turn on and turn off the microphone
    function handleMicrophone() {
        if (listening) {
            setFinalTranscript((prev) => `${prev} ${transcript}`.trim());
            SpeechRecognition.stopListening().then(()=>{resetTranscript();});

             // Clear old transcript
        } else {
            SpeechRecognition.startListening({
                continuous:true,
                interimResults: true
            });
        }
    }



    //To clear the writing area
    function clearText(){
        if(listening){
            SpeechRecognition.stopListening();

            resetTranscript();
        }

        setFinalTranscript("");
    }

    //to manage copy to clipboard functionality
    const handleCopy = async () => {
        try {
            await navigator.clipboard.writeText(finalTranscript);
            setCopyStatus('Copied!');
            console.log('Copied: ');
        } catch (err) {
            setCopyStatus('Failed to copy!');
            console.error('Failed to copy text: ', err);
        }
    };

    //to download text file
    const handleDownload = () => {
        const filename = 'transcript_vocapad.txt'; // Or allow user to specify
        const blob = new Blob([finalTranscript], { type: 'text/plain' });
        const url = URL.createObjectURL(blob);

        const a = document.createElement('a');
        a.href = url;
        a.download = filename;
        document.body.appendChild(a); // Append to body for Firefox compatibility
        a.click();
        document.body.removeChild(a); // Clean up the temporary element
        URL.revokeObjectURL(url); // Release the object URL
    };



    //to save the transcript in firebase
    const saveTranscript = async (title) => {

        try {

            if(_updateObj !== null){
                const docRef = doc(db, "notes", _updateObj.id);
                const newData = {
                    uid,
                    title : title,
                    transcript: finalTranscript,
                    createdAt: _updateObj.createdAt,
                    updatedAt : new Date()
                }
                await updateDoc(docRef, newData);
            }else {
                await addDoc(collection(db, "notes"), {
                    uid,
                    title: title,
                    transcript: finalTranscript,
                    createdAt: new Date(),
                });
            }
            console.log("Saved!");
            setShowPopup(false);
            setSavePopup(true);
            setShowPopup(false);
            setTimeout(()=>{
                setSavePopup(false)
            },2500)
        } catch (e) {
            console.error("Error adding document: ", e);
            alert("Error adding document:");
        }
    };

    function handleChange(e){
        setFinalTranscript(e.target.value);
    }

    //Effects

    useEffect(()=>{
        setFinalTranscript(initialTranscript)
    },[initialTranscript])

    useEffect(()=>{
        setUpdateObj(updateObject)
    },[updateObject])
    //
    // useEffect(() => {
    //     if (listening) {
    //         setLiveTranscript(transcript); // Show live speech
    //     }
    // }, [transcript, listening]);
    //
    // useEffect(() => {
    //     if (!listening && liveTranscript) {
    //         setFinalTranscript((prev) => `${prev} ${liveTranscript}`.trim());
    //         setLiveTranscript(""); // Clear live buffer
    //         resetTranscript();     // Clear speech-recognition transcript
    //     }
    // }, [listening]);


    return (

      <>
          { uid &&
          <>
          { savePopup &&
              <div id="toast-simple"
                   className="flex fixed right-[40%] top-[48%] z-50 items-center justify-center shadow-2xl w-full max-w-xs p-4 space-x-4 rtl:space-x-reverse  divide-x rtl:divide-x-reverse  rounded-lg border-gray-400 border animate-bounce text-gray-400 divide-gray-700 bg-gray-800"
                   role="alert">
                  <svg className="w-5 h-5  text-blue-500 rotate-45" aria-hidden="true"
                       xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 18 20">
                      <path stroke="currentColor"
                            d="m9 17 8 2L9 1 1 19l8-2Zm0 0V9"/>
                  </svg>
                  <div className="ps-4 text-md font-bold">Saved successfully.</div>
              </div>
          }

          {
              showPopup &&

              <div  className={`saved_transcripts_table_cont fixed h-screen w-screen top-0 left-0 flex justify-center items-center  z-30`}>
                  <div className="z-40 relative w-1/4 min-w-[450px] rounded-lg drop-shadow-2xl p-6 bg-gray-900">

                      <PopupInputBox submitMethod={saveTranscript} cancelMethod={()=> {
                          setShowPopup(false);
                      }}
                      initialTitle={ _updateObj !== null ? _updateObj.title : ""} />
                  </div>
              </div>
          }

          <form className={` p-4 flex justify-center items-center flex-col`}>
              <div
                  className="w-4/5 mb-4 border  rounded-lg bg-gray-700 border-gray-600">
                  <div
                      className="flex items-center justify-between px-3 py-2 border-b border-gray-600 ">
                      <div
                          className="flex flex-wrap items-center  sm:divide-x sm:rtl:divide-x-reverse divide-gray-600">
                          <div className="flex items-center space-x-1 rtl:space-x-reverse sm:pe-4">
                              <button type="button"
                                      onClick={handleMicrophone}
                                      className={`p-2   rounded-sm cursor-pointer ${listening ? "bg-amber-600 text-white" : " text-gray-500hover:text-gray-900  text-gray-400 hover:text-white hover:bg-gray-600"}
                                      `}>
                                  <svg className="w-4 h-4 scale-150" aria-hidden="true" xmlns="http://www.w3.org/2000/svg"
                                       fill="currentColor" viewBox="0 0 24 24">
                                      <path d="M12 14a3 3 0 0 0 3-3V5a3 3 0 0 0-6 0v6a3 3 0 0 0 3 3Zm5-3a5 5 0 0 1-10 0H5a7 7 0 0 0 14 0h-2Zm-5 9v-2a7 7 0 0 0 7-7h-2a5 5 0 0 1-10 0H5a7 7 0 0 0 7 7v2h-3a1 1 0 1 0 0 2h6a1 1 0 1 0 0-2h-3Z"/>
                                  </svg>
                                  <span className="sr-only">Turn on microphone</span>
                              </button>
                          </div>
                          <div className="flex flex-wrap items-center space-x-1 rtl:space-x-reverse sm:ps-4">


                              <button type="button"
                                      onClick={handleCopy}
                                      className="p-2 rounded-sm cursor-pointer text-gray-400 hover:text-white hover:bg-gray-600">
                                  <svg className="w-4 h-4" aria-hidden="true" xmlns="http://www.w3.org/2000/svg"
                                       fill="currentColor" viewBox="0 0 16 20">
                                      <path d="M5 5V.13a2.96 2.96 0 0 0-1.293.749L.879 3.707A2.96 2.96 0 0 0 .13 5H5Z"/>
                                      <path
                                          d="M14.067 0H7v5a2 2 0 0 1-2 2H0v11a1.969 1.969 0 0 0 1.933 2h12.134A1.97 1.97 0 0 0 16 18V2a1.97 1.97 0 0 0-1.933-2ZM6.709 13.809a1 1 0 1 1-1.418 1.409l-2-2.013a1 1 0 0 1 0-1.412l2-2a1 1 0 0 1 1.414 1.414L5.412 12.5l1.297 1.309Zm6-.6-2 2.013a1 1 0 1 1-1.418-1.409l1.3-1.307-1.295-1.295a1 1 0 0 1 1.414-1.414l2 2a1 1 0 0 1-.001 1.408v.004Z"/>
                                  </svg>
                                  <span className="sr-only" >Copy Script</span>
                              </button>


                              <button type="button"
                                      onClick={handleDownload}
                                      className="p-2 rounded-sm cursor-pointer text-gray-400 hover:text-white hover:bg-gray-600">
                                  <svg className="w-4 h-4" aria-hidden="true" xmlns="http://www.w3.org/2000/svg"
                                       fill="currentColor" viewBox="0 0 20 20">
                                      <path
                                          d="M14.707 7.793a1 1 0 0 0-1.414 0L11 10.086V1.5a1 1 0 0 0-2 0v8.586L6.707 7.793a1 1 0 1 0-1.414 1.414l4 4a1 1 0 0 0 1.416 0l4-4a1 1 0 0 0-.002-1.414Z"/>
                                      <path
                                          d="M18 12h-2.55l-2.975 2.975a3.5 3.5 0 0 1-4.95 0L4.55 12H2a2 2 0 0 0-2 2v4a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-4a2 2 0 0 0-2-2Zm-3 5a1 1 0 1 1 0-2 1 1 0 0 1 0 2Z"/>
                                  </svg>
                                  <span className="sr-only">Download</span>
                              </button>
                          </div>
                      </div>

                      <div>
                          <button type="button"
                                  onClick={clearText}
                                  className="p-2  rounded-sm cursor-pointer   text-red-400 hover:text-white hover:bg-gray-600">
                              <svg className="w-4 h-4 scale-125" aria-hidden="true" xmlns="http://www.w3.org/2000/svg"
                                   fill="currentColor" viewBox="0 0 20 20">
                                  <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd"/>
                              </svg>
                              <span className="sr-only">Clear text</span>
                          </button>

                      </div>
                  </div>

                  <div className="px-4 py-2  rounded-b-lg bg-gray-800">
                      <p className="text-gray-400 italic text-md px-5">{transcript}</p>
                      <label htmlFor="editor" className="sr-only ">Publish post</label>
                      <textarea id="editor" rows="28" style={{maxHeight : "70vh", minHeight:"450px"}}
                                className="block w-full outline-0  px-0 text-lg border-0 bg-gray-800 focus:ring-0 text-white placeholder-gray-400"
                                placeholder="Tell me, I'll write for you..." required
                                value={finalTranscript}
                                onChange={handleChange}
                      ></textarea>
                  </div>

              </div>
              {
                  _updateObj === null
                  ?
                      <button type="button" onClick={()=>setShowPopup(true)}
                              className="cursor-pointer inline-flex items-center px-5 py-2.5 text-sm font-medium text-center text-white bg-blue-700 rounded-lg focus:ring-4  focus:ring-blue-900 hover:bg-blue-800">
                          Save
                      </button>
                      :
                      <div>
                          <span className={`block text-center font-bold capitalize`}>Title : {_updateObj.title }</span>
                      <div className={`flex justify-center items-center gap-5 py-5.5` }>
                          <button type="button"
                                  onClick={cancelUpdateMethod}
                                  className="cursor-pointer inline-flex items-center px-5 py-2.5 text-sm font-medium text-center text-white bg-red-700 rounded-lg focus:ring-4 focus:ring-red-900 hover:bg-red-800">
                              Cancel

                          </button>
                          <button type="button"
                                  onClick={()=>setShowPopup(true)}
                                  className="cursor-pointer inline-flex items-center px-5 py-2.5 text-sm font-medium text-center text-white bg-blue-700 rounded-lg focus:ring-4 focus:ring-blue-900 hover:bg-blue-800">
                              Update

                          </button>
                      </div>
                      </div>

              }

          </form>
</>
          }

      </>
  )
}

export default TextEditor;