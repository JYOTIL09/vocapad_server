import {useEffect, useState} from "react";

export default  function PopupInputBox({submitMethod,cancelMethod, initialTitle}){

    const [title,setTitle] = useState(initialTitle);

    function handleChange(e){
        setTitle(e.target.value);
    }

    function handleSubmit(){
        submitMethod(title);
    }


    useEffect(()=>{
       setTitle(initialTitle)
    },initialTitle)

    return (

        <div className="max-w-full mx-auto  ">
            <label htmlFor="email" className="block mb-2 text-sm font-medium  text-white">
                Title</label>
            <input
                type="text" id="transcript_name" aria-describedby="helper-text-explanation"
                value={title}
                onChange={handleChange}
                   className="  border   text-sm rounded-lg  block w-full p-2.5  bg-gray-700 border-gray-600 placeholder-gray-400 text-white focus:ring-blue-500 focus:border-blue-500"
                   placeholder="Title"/>

            <div className={`flex justify-center items-center gap-5 py-5.5` }>
            <button type="button"
                    onClick={cancelMethod}
                    className="cursor-pointer inline-flex items-center px-5 py-2.5 text-sm font-medium text-center text-white bg-red-700 rounded-lg focus:ring-4  focus:ring-red-900 hover:bg-red-800">
                Cancel

            </button>
            <button type="button"
                    onClick={handleSubmit}
                    className="cursor-pointer inline-flex items-center px-5 py-2.5 text-sm font-medium text-center text-white bg-blue-700 rounded-lg focus:ring-4 focus:ring-blue-900 hover:bg-blue-800">
                Save Script

            </button>
            </div>
        </div>

    )
}