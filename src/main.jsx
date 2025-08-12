import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from "./firebaseConfig";
import ReactDOM from "react-dom/client";
import React, {useState} from "react";
import LoginForm from "./auth/Login.jsx";
import RegistrationForm from "./components/RegistrationForm.jsx";
import App from "./App.jsx";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./index.css"
import {Vortex} from "react-loader-spinner";


function AppRouter() {
    const [user, loading] = useAuthState(auth);

    if (loading) return (<div className={`bg-white scale-110 animate-pulse fixed top-0 left-0 h-screen w-screen flex justify-center items-center`}>
        <Vortex
            visible={true}
            height="80"
            width="80"
            ariaLabel="vortex-loading"
            wrapperStyle={{}}
            wrapperClass="vortex-wrapper"
            colors={['#172cce', '#0d7cf9', '#0d7cf9', '#172cce', '#172cce', '#0d7cf9']}
        />
    </div>);

    return (

        <Router>
            <Routes>
                {/* Public Routes */}
                <Route path="/" element={!user ? <LoginForm /> : <Navigate to="/dashboard" />} />
                <Route path="/login" element={!user ? <LoginForm /> : <Navigate to="/dashboard" />} />
                <Route path="/signup" element={!user ? <RegistrationForm /> : <Navigate to="/dashboard" />} />

                {/* Protected Routes */}
                <Route path="/dashboard" element={user ? <App /> : <Navigate to="/login" />} />


                {/* Catch-all */}
                <Route path="*" element={<Navigate to="/" />} />
            </Routes>
        </Router>
    );
}

ReactDOM.createRoot(document.getElementById("root")).render(
    <React.StrictMode>
        <ToastContainer />
        <AppRouter />
    </React.StrictMode>
);
