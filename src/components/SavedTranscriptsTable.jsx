import {useEffect, useState} from "react";
import { db,auth } from '../firebaseConfig.js';
import { collection, getDocs, doc, deleteDoc, where, query } from "firebase/firestore";
import {Link} from "react-router";
import {Oval, ThreeDots} from "react-loader-spinner";

export default function SavedTranscriptsTable({openMethod}){

    const [data, setData] = useState([]);
    const [deletePopup,setDeletePopup] = useState(false);
    const [deleteId, setDeleteId] = useState(0);
    const [loading,setLoading] = useState(false);
    //to fetch data
    const fetchSavedData = async () => {
        const user = auth.currentUser;
        if (!user) return;
        setLoading(true)
        const q = query(
            collection(db, "notes"),
            where("uid", "==", user.uid)
        );

        const querySnapshot = await getDocs(q);
        const fetchedData = querySnapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data(),
        }));

        setData(fetchedData);
        setLoading(false)
        console.log("fetched data", fetchedData);
    };

    //to delete data
    const handleDelete = async () => {
        if(!deleteId){
            return;
        }
        try {
            setLoading(true);
            const docRef = doc(db, "notes", deleteId);
            await deleteDoc(docRef);

            console.log("Document successfully deleted!");
            setDeletePopup(false);
            setLoading(false);
            location.reload();
        } catch (error) {
            console.error("Error deleting document: ", error);
        }
    }
    //to download

    const handleDownload = (fileText,fileName) => {
        const filename = fileName+".txt";
        const blob = new Blob([fileText], { type: 'text/plain' });
        const url = URL.createObjectURL(blob);

        const a = document.createElement('a');
        a.href = url;
        a.download = filename;
        document.body.appendChild(a); // Append to body for Firefox compatibility
        a.click();
        document.body.removeChild(a); // Clean up the temporary element
        URL.revokeObjectURL(url); // Release the object URL
    };


    //to open saved transcript
    function handleOpen(_transcript){
        openMethod(_transcript);
    }



    useEffect(() => {
        fetchSavedData();
    }, []);

    // Helper to format timestamp
    const formatDate = (seconds) => {
        const date = new Date(seconds * 1000);
        return date.toLocaleString(); // Customize format if needed
    };



    return (
        <>

            {
                deletePopup &&

                    <div style={{zIndex:60}} className=" absolute -top-10 left-10 flex justify-center items-center w-full  h-full  ">
                        <div className={   ` p-5 bg-gray-950 rounded-lg`  }>
                        <span  className="block text-center mb-2 text-lg font-medium text-white ">
                            Are you sure want to delete?</span>

                        <div className={`flex justify-center items-center gap-5 py-5.5` }>
                            <button type="button"
                                    onClick={()=>{setDeletePopup(false)}}
                                    className="cursor-pointer inline-flex items-center px-5 py-2.5 text-sm font-medium text-center text-white bg-blue-700 rounded-lg focus:ring-4 focus:ring-blue-900 hover:bg-blue-800">
                                Cancel

                            </button>
                            <button type="button"
                                    onClick={handleDelete}
                                    className="cursor-pointer inline-flex items-center px-5 py-2.5 text-sm font-medium text-center text-white bg-red-700 rounded-lg focus:ring-4 focus:ring-red-900 hover:bg-red-800">
                                Delete

                            </button>
                        </div>
                        </div>
                    </div>


            }



            <div className="relative overflow-x-auto shadow-md sm:rounded-lg">

                {loading && <div
                    className={`h-full w-full bg-[rgba(0,0,0,0.5)] absolute top-0 left-0 flex justify-center items-center`}>
                    <ThreeDots
                        visible={true}
                        height="75"
                        width="75"
                        color="#0d7cf9"
                        radius="9"
                        ariaLabel="three-dots-loading"
                        wrapperStyle={{}}
                        wrapperClass=""
                    />
                </div>}
                <table className="w-full text-md text-left rtl:text-right text-gray-400">

                    <thead className="text-sm  uppercase  bg-gray-700 text-gray-400">
                    <tr>
                        <th scope="col" className="px-6 py-3">
                            Title
                        </th>
                        <th scope="col" className="px-6 py-3">
                            Created At
                        </th>
                        <th scope="col" className="px-6 py-3">
                            Updated At
                        </th>

                        <th scope="col" className="px-6 py-3 text-center" colSpan={3}>
                            Actions
                        </th>
                    </tr>
                    </thead>

                    <tbody>

                    {data.map((item, index) => (
                        <tr
                            key={item.id}
                            className={`${
                                index % 2 === 0
                                    ? "odd:bg-gray-900"
                                    : " even:bg-gray-800"
                            } border-b border-gray-700 `}
                        >
                            <th
                                scope="row"
                                className="px-6 py-4 font-medium capitalize  whitespace-nowrap text-white"
                            >
                                {item.title}
                            </th>
                            <td className="px-6 py-4">{formatDate(item.createdAt.seconds)}</td>
                            <td className="px-6 py-4">{item.updatedAt ?  formatDate(item.updatedAt.seconds) : "---- ---"}</td>

                            <td className="px-6 py-4 border-l border-gray-700  text-center" colSpan={1}>
                                <span
                                    onClick={()=>{handleOpen(item)}}
                                    className="font-medium text-blue-500 hover:underline cursor-pointer"
                                >Open
                                </span>

                            </td>
                            <td className="px-6 py-4 border-l border-gray-700 text-center">
                            <span
                                onClick={() => {
                                    handleDownload(item.transcript, item.title)
                                }}
                                className="font-medium  text-yellow-700 hover:underline cursor-pointer"
                            >
                                Download
                            </span>

                            </td>
                            <td className="px-6 py-4 border-l border-gray-700  text-center">
                            <span
                                onClick={() => {
                                    setDeleteId(item.id)
                                    setDeletePopup(true);
                                }}
                                className="font-medium text-red-700 hover:underline cursor-pointer"
                            >
                                Delete
                            </span>

                            </td>
                        </tr>
                    ))}


                    </tbody>
                </table>
            </div>

        </>
    )
}