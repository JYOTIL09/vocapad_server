import SignOutButton from "../auth/SignOut.jsx";
import {useState} from "react";
import { auth } from "../firebaseConfig";
import {useAuthState} from "react-firebase-hooks/auth";

export default  function Header({SavedTranscriptMethod}){

    const [signoutPopup,setSignoutPopup] = useState(false);
    const [user] = useAuthState(auth);

    const handleSignOut = async () => {

            try {
                await auth.signOut();
                console.log("User signed out");
            } catch (error) {
                console.error("Error signing out:", error);
            }

    };

    return (

<>
    {
        signoutPopup &&

            <div style={{zIndex:60}} className=" fixed top-5 flex justify-center items-start w-full  h-full  ">
                <div className={   ` p-10 bg-gray-950 rounded-lg w-1/6 min-w-[300px]`  }>
                        <span  className="block text-center mb-2 text-lg font-medium text-white ">
                            Want to Sign Out?</span>

                    <div className={`flex justify-center items-center gap-5 py-5.5` }>
                        <button type="button"
                                onClick={()=>{setSignoutPopup(false)}}
                                className="cursor-pointer inline-flex items-center px-5 py-2.5 text-sm font-medium text-center text-white bg-blue-700 rounded-lg focus:ring-4  focus:ring-blue-900 hover:bg-blue-800">
                            No

                        </button>
                        <button type="button"
                                onClick={handleSignOut}
                                className="cursor-pointer inline-flex items-center px-5 py-2.5 text-sm font-medium text-center text-white bg-blue-700 rounded-lg focus:ring-4 focus:ring-blue-900 hover:bg-blue-800">
                            Yes

                        </button>
                    </div>
                </div>
            </div>


    }
        <nav className=" border-gray-200 bg-gray-900">
            <div className="max-w-screen-xl flex flex-wrap items-center justify-between mx-auto p-4">
                <a href="#" className="flex items-center space-x-3 rtl:space-x-reverse">
                    <img src="https://flowbite.com/docs/images/logo.svg" className="h-8" alt="Flowbite Logo"/>
                    <span
                        className="self-center text-2xl font-semibold whitespace-nowrap text-white">VocaPad</span>
                </a>
                <button data-collapse-toggle="navbar-default" type="button"
                        className="inline-flex items-center p-2 w-10 h-10 justify-center text-sm  rounded-lg md:hidden  focus:outline-none focus:ring-2 text-gray-400 hover:bg-gray-700 focus:ring-gray-600"
                        aria-controls="navbar-default" aria-expanded="false">
                    <span className="sr-only">Open main menu</span>
                    <svg className="w-5 h-5" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none"
                         viewBox="0 0 17 14">
                        <path stroke="currentColor"
                              d="M1 1h15M1 7h15M1 13h15"/>
                    </svg>
                </button>
                <div className="hidden w-full md:block md:w-auto" id="navbar-default">
                    <ul className="font-medium flex flex-row justify-center items-center p-4 md:p-0 mt-4 border rounded-lg  md:flex-row md:space-x-8 rtl:space-x-reverse md:mt-0 md:border-0  bg-gray-800 md:bg-gray-900 border-gray-700">


                        <li>
                            <span
                                onClick={SavedTranscriptMethod}
                               className="cursor-pointer block py-2 px-3 rounded-sm   md:border-0  md:p-0 text-white md:hover:text-blue-500 hover:bg-gray-700 hover:text-white md:hover:bg-transparent">Saved Transcripts</span>
                        </li>
                        <li >
                        <SignOutButton onSignOutClick={()=>{setSignoutPopup(true)}} />
                        </li>
                        <li>
                            {user && (
                                <div className="flex items-center gap-3">
                                    {user.photoURL && (
                                        <img
                                            src={user.photoURL}
                                            alt="Profile"
                                            className="w-8 h-8 rounded-full"
                                        />
                                    )}
                                    <div className="text-md text-white">
                                        <p>{user.displayName ||   user.email }</p>
                                    </div>
                                </div>
                            )}
                        </li>
                    </ul>


                </div>
            </div>
        </nav>
</>
    )
}