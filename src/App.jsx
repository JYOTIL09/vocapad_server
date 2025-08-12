import "./App.css";
import TextEditor from "./components/editor/TextEditor";
import Header from "./layout/Header.jsx";
import {useState} from "react";
import SavedTranscriptsTable from "./components/SavedTranscriptsTable.jsx";

function App() {

    const [openSavedTranscripts, setOpenSavedTranscripts] = useState(false);
    const [_transcript, setTranscript] = useState("");
    const [updateObject,setUpdateObject] = useState(null);

    function handleSavedTranscripts(){
        setOpenSavedTranscripts(true);
    }



    function handleOpen(_savedData){
    setTranscript(_savedData.transcript);
    setOpenSavedTranscripts(false);
    setUpdateObject(_savedData);
    }

    function cancelUpdate(){
        location.reload();
    }

  return (
    <>


        <section style={{display:"block"}}>


            <div className="header">
                <Header SavedTranscriptMethod={handleSavedTranscripts} />
            </div>



            {
                openSavedTranscripts &&

            <div  className={`saved_transcripts_table_cont fixed h-screen w-screen top-0 left-0 flex justify-center items-center  z-30`}>
                      <div className="z-40 relative w-2/3 min-w-[800px] rounded-lg drop-shadow-2xl p-6 bg-gray-900">
                          <div
                              onClick={()=> {
                                  setOpenSavedTranscripts(false);
                              }}
                              className={`absolute z-50 cursor-pointer rounded-full border-2 hover:scale-110 duration-200  bg-gray-900 border-red-500 -top-2  -right-2 p-1 shadow-lg`}>
                              <svg className="w-4 h-4 scale-105" aria-hidden="true" xmlns="http://www.w3.org/2000/svg"
                                   fill="red" viewBox="0 0 20 20">
                                  <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd"/>
                              </svg>
                          </div>
                       <SavedTranscriptsTable  openMethod={handleOpen} />
                      </div>
            </div>
            }

            <div className="body">
                <TextEditor initialTranscript={_transcript} updateObject={updateObject} cancelUpdateMethod={cancelUpdate} />
            </div>

        </section>
      {/*<ToastContainer />*/}



      <div className="p-4">
        {/*<RegistrationForm />*/}
      </div>



    </>
  );
}

export default App;