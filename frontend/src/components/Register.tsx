import React, { useState } from 'react';
import {REGISTER_API} from "../DATA/APIList"
import { useNavigate } from 'react-router-dom';


export const Register: React.FC = () => {
 
    const [form, setForm]= useState({
        name:"",
        email:"",
        password:"",
       
    })
    const [confirmPassword, setConfirmPassword]= useState("")
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleChange = (e:any)=>{
        const {name, value} = e.target
     setForm((prev)=>({
        ...prev,
        [name]:value
     }))
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if(!form)return 
        setError(''); // Reset error on new attempt
        
        if (form.password !== confirmPassword) {
            setError('Passwords do not match');
            return;
        }

          try {
            // Replace with your actual sign-in API call
            const response = await fetch(REGISTER_API, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(form),
            });

            console.log("response is :", response)
            if (!response.ok) {
                throw new Error('Sign in failed');
            }
            // Handle successful sign-in
            console.log('Signed in successfully');
           
            alert("Done")
        } catch (err) {
            setError(err instanceof Error ? err.message : 'An error occurred');
        } finally {
            setLoading(false);
        }

        // console.log("Final Form is :",form)


        // TODO: Implement registration API call
        console.log( form.email, form.password );
    };

    return (
        <div className="w-full animate-in fade-in duration-500">
            <form onSubmit={handleSubmit} className="space-y-5">
                {/* Email Field */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Name </label>
                    <input
                        type="text"
                        placeholder="prince"
                        className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-yellow-400 focus:border-transparent outline-none transition-all"
                        name='name'
                        value={form.name}
                        onChange={handleChange}
                        required
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
                    <input
                        type="email"
                        placeholder="example@mail.com"
                        className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-yellow-400 focus:border-transparent outline-none transition-all"
                        name='email'
                        value={form.email}
                        onChange={handleChange}
                        required
                    />
                </div>

                {/* Password Field */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
                    <input
                        type="password"
                        placeholder="••••••••"
                         name='password'
                        className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-yellow-400 focus:border-transparent outline-none transition-all"
                        value={form.password}
                        onChange={handleChange}
                        required
                    />
                </div>

                {/* Confirm Password Field */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Confirm Password</label>
                    <input
                        type="password"
                        placeholder="••••••••"
                        className={`w-full px-4 py-3 rounded-lg border outline-none transition-all ${
                            error ? 'border-red-500 focus:ring-red-200' : 'border-gray-300 focus:ring-2 focus:ring-yellow-400'
                        }`}
                        name='confirmPassword'
                        value={confirmPassword}
                        onChange={(e)=>setConfirmPassword(e.target.value)}
                        required
                    />
                </div>

                {/* Error Message */}
                {error && (
                    <div className="bg-red-50 text-red-600 text-sm p-3 rounded-md border border-red-100 animate-shake">
                        {error}
                    </div>
                )}

                {/* Submit Button */}
                <button 
                    type="submit"
                    className="w-full bg-yellow-400 hover:bg-yellow-500 text-black font-bold py-3 rounded-lg shadow-lg transform active:scale-95 transition-all duration-200 mt-2"
                >
                    Create Account
                </button>
            </form>
        </div>
    );
};