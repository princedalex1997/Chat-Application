import React, { useState } from 'react';
import { LOGIN_API } from "../DATA/APIList"
import { useNavigate } from 'react-router-dom';

export const SignIn: React.FC = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const navigation = useNavigate()


    // console.log("API us ",apiUrl)

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setLoading(true);
        // console.warn(email,password)
        try {
            // Replace with your actual sign-in API call
            const response = await fetch(LOGIN_API, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, password }),
            });

            if (!response.ok) {
                throw new Error('Sign in failed');
            }
            // Handle successful sign-in
            console.log('Signed in successfully');
            const data = await response.json()
            localStorage.setItem("userInfo", JSON.stringify(data));
            console.warn("Data is:", data)
            navigation('/Chats')
            alert("Done")
        } catch (err) {
            setError(err instanceof Error ? `${err.message}. Please Try Again` : 'An error occurred');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className=" flex items-center justify-center bg-gray-50 py-12 px-4">
            <div className="max-w-md w-full space-y-8">
                <h2 className="text-3xl font-bold text-center">Sign In</h2>
                <form onSubmit={handleSubmit} className="space-y-6">
                    {error && <p className="text-red-600 text-sm">{error}</p>}
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Email</label>
                        <input
                            // type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                            className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700">Password</label>
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                            className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className={`w-full ${loading ? "cursor-progress" : "cursor-pointer"} bg-blue-600 text-white py-2 rounded-md font-medium hover:bg-blue-700 disabled:bg-gray-400`}
                    >
                        {loading ? <span className="inline-block w-6 h-6 border-4 border-gray-300 border-t-blue-500 rounded-full animate-spin"></span> : 'Sign In'}
                    </button>
                </form>
            </div>
        </div>
    );
};