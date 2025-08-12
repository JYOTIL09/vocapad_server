import React, { useState } from "react";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../firebaseConfig";
import { toast } from "react-toastify";
import { signInWithPopup } from "firebase/auth";
import {  googleProvider } from "../firebaseConfig";
import SignOutButton from "./SignOut.jsx"; // adjust path

export default function LoginForm() {
    const [email, setEmail] = useState("");
    const [emailError, setEmailError] = useState("");

    const [password, setPassword] = useState("");
    const [passwordError, setPasswordError] = useState("");

    const validateEmail = () => {
        const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
        if (!emailPattern.test(email)) {
            setEmailError("Enter a valid email address.");
            return false;
        }
        setEmailError("");
        return true;
    };

    const validatePassword = () => {
        if (password.length < 6) {
            setPasswordError("Password must be at least 6 characters.");
            return false;
        }
        setPasswordError("");
        return true;
    };

    const handleLogin = async () => {
        const isEmailValid = validateEmail();
        const isPasswordValid = validatePassword();

        if (isEmailValid && isPasswordValid) {
            try {
                await signInWithEmailAndPassword(auth, email, password);
                toast.success("Logged in successfully!", {
                    position: "top-center",
                    autoClose: 3000,
                });

                // Clear form
                setEmail("");
                setPassword("");
            } catch (error) {
                toast.error("Login failed. Check your credentials.", {
                    position: "top-center",
                    autoClose: 3000,
                });
                console.error("Login error:", error);
            }
        }
    };

    const handleGoogleSignIn = async () => {
        try {
            const result = await signInWithPopup(auth, googleProvider);
            const user = result.user;

            console.log("Google user:", user);
            toast.success(`Welcome, ${user.displayName}!`, {
                position: "top-center",
                autoClose: 3000,
            });

            // Optional: store user info in Firestore
            // await setDoc(doc(db, "users", user.uid), {
            //   email: user.email,
            //   name: user.displayName,
            //   photoURL: user.photoURL,
            //   provider: "google",
            // });

        } catch (error) {
            console.error("Google sign-in error:", error.message);
            toast.error("Google sign-in failed.");
        }
    };


    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-100 px-4">
            <div className="bg-white shadow-lg rounded-xl pb-8 w-full max-w-md">
                <div className="max-w-screen-xl flex flex-wrap items-center justify-between mx-auto p-4 rounded-t-lg border-gray-200 bg-gray-900">
                    <a href="#" className="flex items-center space-x-3 rtl:space-x-reverse">
                        <img src="https://flowbite.com/docs/images/logo.svg" className="h-9" alt="Flowbite Logo"/>
                        <span
                            className="self-center text-2xl font-semibold whitespace-nowrap text-white">VocaPad</span>
                    </a>

                </div>

                <h2 className="text-2xl font-bold mb-6 mt-3 text-center text-gray-800">
                    Login
                </h2>
<div className={`p-8 pt-0`}>
                <label className="block text-gray-700 mb-2">Email</label>
                <input
                    type="email"
                    className="w-full p-3 border border-gray-300 rounded focus:outline-none focus:ring focus:ring-blue-400 text-gray-900"
                    placeholder="Enter your email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    onBlur={validateEmail}
                />
                {emailError && <p className="text-red-500 mt-2">{emailError}</p>}

                <label className="block text-gray-700 mt-4 mb-2">Password</label>
                <input
                    type="password"
                    className="w-full p-3 border border-gray-300 rounded focus:outline-none focus:ring focus:ring-blue-400 text-gray-900"
                    placeholder="Enter your password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    onBlur={validatePassword}
                />
                {passwordError && <p className="text-red-500 mt-2">{passwordError}</p>}
<div className={`flex flex-col justify-center items-center gap-3`}>
                <button
                    onClick={handleLogin}
                    className="mt-6 w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
                >
                    Login
                </button>

    <span>New to Vocapad? <a href={`/signup`}  className={`underline font-bold`}>Sign-Up </a> </span>
<span>or</span>
                <button className="btn-165 flex justify-center items-center gap-2 cursor-pointer border border-blue-600 px-5" onClick={handleGoogleSignIn}>
                    <svg className={`h-10 w-10`} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 450 262">
                        <path fill="#4285F4"
                              d="M255.878 133.451c0-10.734-.871-18.567-2.756-26.69H130.55v48.448h71.947c-1.45 12.04-9.283 30.172-26.69 42.356l-.244 1.622 38.755 30.023 2.685.268c24.659-22.774 38.875-56.282 38.875-96.027"></path>
                        <path fill="#34A853"
                              d="M130.55 261.1c35.248 0 64.839-11.605 86.453-31.622l-41.196-31.913c-11.024 7.688-25.82 13.055-45.257 13.055-34.523 0-63.824-22.773-74.269-54.25l-1.531.13-40.298 31.187-.527 1.465C35.393 231.798 79.49 261.1 130.55 261.1"></path>
                        <path fill="#FBBC05"
                              d="M56.281 156.37c-2.756-8.123-4.351-16.827-4.351-25.82 0-8.994 1.595-17.697 4.206-25.82l-.073-1.73L15.26 71.312l-1.335.635C5.077 89.644 0 109.517 0 130.55s5.077 40.905 13.925 58.602l42.356-32.782"></path>
                        <path fill="#EB4335"
                              d="M130.55 50.479c24.514 0 41.05 10.589 50.479 19.438l36.844-35.974C195.245 12.91 165.798 0 130.55 0 79.49 0 35.393 29.301 13.925 71.947l42.211 32.783c10.59-31.477 39.891-54.251 74.414-54.251"></path>
                    </svg>
                    <span>Login with Google</span>
                </button>
</div>
</div>
            </div>
        </div>
    );
}
