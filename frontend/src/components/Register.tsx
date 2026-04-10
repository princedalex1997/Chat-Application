import React, { useState } from 'react';
import { REGISTER_API } from "../DATA/APIList";
import { Form, useNavigate } from 'react-router-dom';

export const Register: React.FC = () => {

    const navigate = useNavigate();

    const [form, setForm] = useState({
        name: "",
        email: "",
        password: "",
        number: ""
    });

    const [confirmPassword, setConfirmPassword] = useState("");
    const [profilePic, setProfilePic] = useState<File | null>(null);
    const [preview, setPreview] = useState<string | null>(null);

    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleChange = (e: any) => {
        const { name, value } = e.target;
        setForm((prev) => ({
            ...prev,
            [name]: value
        }));
    };

    const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        // preview
        setPreview(URL.createObjectURL(file));

        const data = new FormData();
        data.append("file", file); // ✅ correct
        data.append("upload_preset", "chatapplication");

        try {
            const res = await fetch(
                "https://api.cloudinary.com/v1_1/dtopqistw/image/upload",
                {
                    method: "POST",
                    body: data,
                }
            );

            const result = await res.json();

            // console.log("Uploaded Image URL:", result.secure_url);

            // setProfilePic(result.ssecure_urle)
            // store this for backend
            setProfilePic(result.secure_url);

        } catch (err) {
            console.log("Upload Error:", err);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        if (form.password !== confirmPassword) {
            setError('Passwords do not match');
            setLoading(false);
            return;
        }
        const payload = {
            name: form.name,
            email: form.email,
            password: form.password,
            pic: profilePic ? profilePic : null,
            number: form.number
        }
        try {
            const response = await fetch(REGISTER_API, {
                method: 'POST',
                headers: {
                    "Content-type": "application/json",
                },
                body: JSON.stringify(payload),
            });
            console.log(response);

            if (!response.ok) {
                throw new Error('Registration failed');
            }

            alert("Account Created");
            navigate("/");

        } catch (err) {
            setError(err instanceof Error ? err.message : 'Something went wrong');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="w-full min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-100 to-gray-200 px-4">

            <form
                onSubmit={handleSubmit}
                className="w-full max-w-md bg-white rounded-2xl shadow-xl p-6 space-y-5 animate-fade-in"
            >

                <h2 className="text-2xl font-bold text-center text-gray-800">
                    Create Account
                </h2>

                {/* Image Upload */}
                <div className="flex justify-center">
                    <label className="cursor-pointer group">
                        <div className="w-24 h-24 rounded-full border-2 border-dashed border-gray-300 flex items-center justify-center overflow-hidden bg-gray-100 group-hover:border-yellow-400 transition">

                            {preview ? (
                                <img
                                    src={preview}
                                    alt="preview"
                                    className="w-full h-full object-cover"
                                />
                            ) : (
                                <span className="text-sm text-gray-500">
                                    Upload
                                </span>
                            )}
                        </div>

                        <input
                            type="file"
                            accept="image/*"
                            onChange={handleImageChange}
                            className="hidden"
                        />
                    </label>
                </div>

                {/* Name */}
                <input
                    type="text"
                    name="name"
                    placeholder="Name"
                    value={form.name}
                    onChange={handleChange}
                    className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-yellow-400 focus:border-transparent outline-none transition"
                    required
                />
                <input
                    type="text"
                    name="number"
                    placeholder="Number"
                    value={form.number}
                    onChange={handleChange}
                    className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-yellow-400 focus:border-transparent outline-none transition"
                    required
                />

                {/* Email */}
                <input
                    type="email"
                    name="email"
                    placeholder="Email"
                    value={form.email}
                    onChange={handleChange}
                    className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-yellow-400 focus:border-transparent outline-none transition"
                    required
                />

                {/* Password */}
                <input
                    type="password"
                    name="password"
                    placeholder="Password"
                    value={form.password}
                    onChange={handleChange}
                    className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-yellow-400 focus:border-transparent outline-none transition"
                    required
                />

                {/* Confirm Password */}
                <input
                    type="password"
                    placeholder="Confirm Password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className={`w-full px-4 py-3 rounded-lg border outline-none transition ${error
                        ? 'border-red-500 focus:ring-red-200'
                        : 'border-gray-300 focus:ring-2 focus:ring-yellow-400'
                        }`}
                    required
                />

                {/* Error */}
                {error && (
                    <div className="bg-red-50 text-red-600 text-sm p-3 rounded-md border border-red-200 text-center">
                        {error}
                    </div>
                )}

                {/* Button */}
                <button
                    type="submit"
                    disabled={loading}
                    className="w-full bg-yellow-400 hover:bg-yellow-500 disabled:opacity-60 text-black font-semibold py-3 rounded-lg shadow-md active:scale-95 transition"
                >
                    {loading ? "Creating..." : "Create Account"}
                </button>

            </form>
        </div>
    );
};