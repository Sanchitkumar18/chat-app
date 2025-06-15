import React, { useState } from 'react';
import { useAuthStore } from '../store/useAuthStore';
import { Eye, EyeOff, Loader2, Lock, Mail, MessageSquare } from 'lucide-react';
import { Link } from 'react-router-dom';
import AuthImagePattern from '../components/AuthImagePattern';
import toast from 'react-hot-toast';

const LoginPage = () => {
    const [showPassword, setShowPassword] = useState(false);
    const [formData, setFormData] = useState({
        email: "",
        password: ""
    });

    const { login, isLoggingIn } = useAuthStore();

    const validateForm = () => {
        if (!formData.email.trim()) return toast.error("Email is required");
        if (!/\S+@\S+\.\S+/.test(formData.email)) return toast.error("Invalid email format");
        if (!formData.password) return toast.error("Password is required");
        return true;
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (validateForm()) login(formData);
    };

    return (
        <div className='min-h-screen grid lg:grid-cols-2'>
            {/* Left side */}
            <div className='flex flex-col justify-center items-center p-6 sm:p-12'>
                <div className='w-full max-w-md space-y-8'>
                    {/* Logo */}
                    <div className="text-center mb-8">
                        <div className="flex flex-col items-center gap-2 group">
                            <div className="size-12 rounded-xl bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                                <MessageSquare className="size-6 text-primary" />
                            </div>
                            <h1 className="text-2xl font-bold mt-2">Welcome Back</h1>
                            <p className="text-base-content/60">Sign in to continue</p>
                        </div>
                    </div>

                    <form onSubmit={handleSubmit} className='space-y-6'>
                        <div className="form-control">
                            <label className="label">
                                <span className="label-text font-medium">Email</span>
                            </label>
                            <div className="flex items-center input input-bordered w-full pl-3 pr-3 py-2 gap-3">
                                <Mail className="text-base-content/40 w-5 h-5" />
                                <input
                                    type="email"
                                    className="w-full outline-none bg-transparent text-base-content placeholder:text-base-content/40"
                                    placeholder="you@example.com"
                                    value={formData.email}
                                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                />
                            </div>
                        </div>

                        <div className="form-control">
                            <label className="label">
                                <span className="label-text font-medium">Password</span>
                            </label>
                            <div className="flex items-center input input-bordered w-full pl-3 pr-3 py-2 gap-3 relative">
                                <Lock className="text-base-content/40 w-5 h-5" />
                                <input
                                    type={showPassword ? "text" : "password"}
                                    className="w-full outline-none bg-transparent text-base-content placeholder:text-base-content/40"
                                    placeholder="••••••••"
                                    value={formData.password}
                                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                />
                                <button
                                    type='button'
                                    className='absolute right-3'
                                    onClick={() => setShowPassword(!showPassword)}
                                >
                                    {showPassword ? (
                                        <EyeOff className='size-5 text-base-content/40' />
                                    ) : (
                                        <Eye className='size-5 text-base-content/40' />
                                    )}
                                </button>
                            </div>
                        </div>

                        <button type='submit' className='btn btn-primary w-full' disabled={isLoggingIn}>
                            {isLoggingIn ? (
                                <>
                                    <Loader2 className='size-5 animate-spin' />
                                    Signing in...
                                </>
                            ) : (
                                "Sign In"
                            )}
                        </button>
                    </form>

                    <div className='text-center'>
                        <p className='text-base-content/60'>
                            Don&apos;t have an account?{" "}
                            <Link to="/signup" className='link link-primary'>Create Account</Link>
                        </p>
                    </div>
                </div>
            </div>

            {/* Right side */}
            <AuthImagePattern
                title="Welcome Back!"
                subtitle="Log in and reconnect with your community."
            />
        </div>
    );
};

export default LoginPage;
