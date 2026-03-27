import React, { useState } from 'react';
import loginImage from "../assets/Images/loginImg.jpg";
import { Register } from '../components/Register';
import { SignIn } from '../components/SignIn';

const Home = () => {
  const [toggle, setToggle] = useState(false);

  const handleToggle = () => {
    setToggle(prev => !prev);
  };

  return (
    <div className="flex  h-screen bg-yellow w-full bg-slate-50 overflow-hidden font-sans">
      {/* Left Side: Image Section (Hidden on mobile for better UX) */}
      <div className="hidden lg:flex flex-1 relative">
        <img
          src={loginImage}
          alt="login page"
          className="absolute inset-0 w-full h-full object-cover mix-blend-multiply opacity-90"
          loading="lazy"
        />
        <div className="relative z-10 flex flex-col justify-end p-12 text-white">
          <h1 className="text-5xl font-bold leading-tight">Connect with <br /> your friends.</h1>
          <p className="mt-4 text-lg opacity-90">Experience the next generation of real-time communication.</p>
        </div>
      </div>

      {/* Right Side: Form Section */}
      <div className="flex flex-1 flex-col justify-center items-center px-6   bg-white">
        <div className="w-full max-w-md space-y-8">
          {/* Header */}
          <div className="text-center lg:text-left">
            <h2 className="text-3xl font-extrabold text-gray-900">
              {toggle ? "Create an account" : "Welcome back"}
            </h2>
            {/* <p className="mt-2 text-sm text-gray-600">
                            Please enter your details to continue.
                        </p> */}
          </div>

          {/* Component Container */}
          <div className="mt-8 transition-all duration-500 ease-in-out">
            {toggle ? <Register /> : <SignIn />}
          </div>

          {/* Toggle Link */}
          <div className="text-center mt-6 h-28">
            <p className="text-gray-600">
              {toggle ? "Already have an account ?" : "Don't have an account?"}
              <button
                onClick={handleToggle}
                className="ml-2 font-semibold text-yellow-600 hover:text-yellow-500 transition-colors focus:outline-none"
              >
                {toggle ? "Sign In" : "Create one now"}
              </button>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;