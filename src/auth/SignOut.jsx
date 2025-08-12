import React from "react";


function SignOutButton({onSignOutClick}) {


    return (
        <button onClick={onSignOutClick}   type="button"
                className="text-white   focus:ring-4  font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-blue-800">
            Sign Out
        </button>

)

}

export default SignOutButton;
