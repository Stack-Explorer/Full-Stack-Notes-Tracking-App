import React, { useState, useEffect } from 'react';
import { useAuthStore } from '../store/auth.store.js';
import { useNavigate } from "react-router-dom";

const LoginPage = () => {
    const { authUser, isOtpPending, login, hasLoggedIn } = useAuthStore();
    const [form, setForm] = useState({
        email: "",
        password: "",
    });
    const navigate = useNavigate();

    useEffect(() => {
        if (authUser && !isOtpPending && hasLoggedIn) {
            navigate("/home");
        }
    }, [authUser, isOtpPending, navigate]);

    useEffect(() => {
        if (hasLoggedIn) {
            navigate("/home");
        }
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setForm((prevValue) => ({
            ...prevValue,
            [name]: value,
        }));
    };

    const handleClick = async (e) => {
        e.preventDefault();
        await login(form);
    };

    return (
        <div className='h-screen flex flex-col items-center justify-center'>
            <h1 className='text-3xl mb-3'>Login</h1>
            <label className="input input-bordered flex mb-2 items-center gap-2">
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 16 16"
                    fill="currentColor"
                    className="h-4 w-4 opacity-70"
                >
                    <path d="M2.5 3A1.5 1.5 0 0 0 1 4.5v.793c.026.009.051.02.076.032L7.674 8.51c.206.1.446.1.652 0l6.598-3.185A.755.755 0 0 1 15 5.293V4.5A1.5 1.5 0 0 0 13.5 3h-11Z" />
                    <path d="M15 6.954 8.978 9.86a2.25 2.25 0 0 1-1.956 0L1 6.954V11.5A1.5 1.5 0 0 0 2.5 13h11a1.5 1.5 0 0 0 1.5-1.5V6.954Z" />
                </svg>
                <input
                    type="text"
                    onChange={handleChange}
                    value={form.email}
                    name='email'
                    className="grow"
                    placeholder="Email"
                />
            </label>
            
            <label className="input mb-2 input-bordered flex items-center gap-2">
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 16 16"
                    fill="currentColor"
                    className="h-4 w-4 opacity-70"
                >
                    <path
                        fillRule="evenodd"
                        d="M14 6a4 4 0 0 1-4.899 3.899l-1.955 1.955a.5.5 0 0 1-.353.146H5v1.5a.5.5 0 0 1-.5.5h-2a.5.5 0 0 1-.5-.5v-2.293a.5.5 0 0 1 .146-.353l3.955-3.955A4 4 0 1 1 14 6Zm-4-2a.75.75 0 0 0 0 1.5.5.5 0 0 1 .5.5.75.75 0 0 0 1.5 0 2 2 0 0 0-2-2Z"
                        clipRule="evenodd"
                    />
                </svg>
                <input
                    type="password"
                    onChange={handleChange}
                    name='password'
                    value={form.password}
                    className="grow"
                    placeholder='Password'
                />
            </label>
            <button className="btn btn-primary w-80" onClick={handleClick}>Signin</button>
            <p className='mt-2'>
                Account not Created? <a className='anchor-text underline' href="/signup">Signup</a>
            </p>
        </div>
    );
};

export default LoginPage;