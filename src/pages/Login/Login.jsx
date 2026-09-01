import { useState } from "react";
import { useForm } from "react-hook-form";
import { Link, useLocation, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { Mail, Lock, Eye, EyeOff, Loader2 } from "lucide-react";
import useAuth from "../../hooks/useAuth";
import useAxiosPublic from "../../hooks/useAxiosPublic";

// Maps Firebase auth error codes to plain, user-facing messages
const getFriendlyErrorMessage = (code) => {
    switch (code) {
        case "auth/invalid-credential":
        case "auth/wrong-password":
        case "auth/user-not-found":
            return "Incorrect email or password.";
        case "auth/too-many-requests":
            return "Too many attempts. Please wait a moment and try again.";
        case "auth/popup-closed-by-user":
            return "Google sign-in was cancelled.";
        case "auth/network-request-failed":
            return "Network error. Check your connection and try again.";
        default:
            return "Something went wrong. Please try again.";
    }
};

const Login = () => {
    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm();

    const { signInUser, googleSignInUser } = useAuth();
    const axiosPublic = useAxiosPublic();
    const location = useLocation();
    const navigate = useNavigate();

    const [loading, setLoading] = useState(false);
    const [googleLoading, setGoogleLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);

    const from = location.state?.from?.pathname || "/";

    const onSubmit = async ({ email, password }) => {
        setLoading(true);
        try {
            await signInUser(email, password);
            toast.success("Welcome back!");
            navigate(from, { replace: true });
        } catch (err) {
            toast.error(getFriendlyErrorMessage(err?.code));
        } finally {
            setLoading(false);
        }
    };

    const handleGoogleLogin = async () => {
        setGoogleLoading(true);
        try {
            const res = await googleSignInUser();
            const userInfo = {
                email: res.user?.email,
                name: res.user?.displayName,
                image: res.user?.photoURL,
            };
            if (res.user?.email) {
                await axiosPublic.post("/users", userInfo);
            }
            toast.success("Welcome back!");
            navigate(from, { replace: true });
        } catch (err) {
            toast.error(getFriendlyErrorMessage(err?.code));
        } finally {
            setGoogleLoading(false);
        }
    };

    return (
        <section className="min-h-[80vh] flex items-center justify-center px-4 py-12">
            <div className="w-full max-w-md bg-white dark:bg-gray-900 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-800 p-8 sm:p-10">
                <div className="mb-8 text-center">
                    <h1 className="text-2xl sm:text-3xl font-semibold text-gray-800 dark:text-white">
                        Sign in to your account
                    </h1>
                    <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
                        Enter your details below to continue
                    </p>
                </div>

                <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-4">
                    {/* Email */}
                    <div>
                        <label
                            htmlFor="email"
                            className="block mb-1.5 text-sm font-medium text-gray-700 dark:text-gray-300"
                        >
                            Email address
                        </label>
                        <div className="relative">
                            <Mail
                                size={18}
                                className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400"
                            />
                            <input
                                id="email"
                                type="email"
                                autoComplete="email"
                                aria-invalid={errors.email ? "true" : "false"}
                                {...register("email", {
                                    required: "Email is required",
                                    pattern: {
                                        value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                                        message: "Enter a valid email address",
                                    },
                                })}
                                className={`block w-full py-2.5 pl-11 pr-4 text-gray-700 bg-white border rounded-lg
                                    dark:bg-gray-900 dark:text-gray-200
                                    focus:outline-none focus:ring-2 focus:ring-cyan-300 focus:ring-opacity-50
                                    ${errors.email
                                        ? "border-red-400 dark:border-red-500"
                                        : "border-gray-200 dark:border-gray-700 focus:border-cyan-400"
                                    }`}
                                placeholder="you@example.com"
                            />
                        </div>
                        {errors.email && (
                            <p className="mt-1.5 text-xs text-red-500">{errors.email.message}</p>
                        )}
                    </div>

                    {/* Password */}
                    <div>
                        <div className="flex items-center justify-between mb-1.5">
                            <label
                                htmlFor="password"
                                className="text-sm font-medium text-gray-700 dark:text-gray-300"
                            >
                                Password
                            </label>
                            <Link
                                to="/"
                                className="text-xs text-cyan-600 hover:underline dark:text-cyan-400"
                            >
                                Forgot password?
                            </Link>
                        </div>
                        <div className="relative">
                            <Lock
                                size={18}
                                className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400"
                            />
                            <input
                                id="password"
                                type={showPassword ? "text" : "password"}
                                autoComplete="current-password"
                                aria-invalid={errors.password ? "true" : "false"}
                                {...register("password", {
                                    required: "Password is required",
                                    minLength: {
                                        value: 6,
                                        message: "Password must be at least 6 characters",
                                    },
                                })}
                                className={`block w-full py-2.5 pl-11 pr-11 text-gray-700 bg-white border rounded-lg
                                    dark:bg-gray-900 dark:text-gray-200
                                    focus:outline-none focus:ring-2 focus:ring-cyan-300 focus:ring-opacity-50
                                    ${errors.password
                                        ? "border-red-400 dark:border-red-500"
                                        : "border-gray-200 dark:border-gray-700 focus:border-cyan-400"
                                    }`}
                                placeholder="Enter your password"
                            />
                            <button
                                type="button"
                                onClick={() => setShowPassword((prev) => !prev)}
                                aria-label={showPassword ? "Hide password" : "Show password"}
                                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                            >
                                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                            </button>
                        </div>
                        {errors.password && (
                            <p className="mt-1.5 text-xs text-red-500">{errors.password.message}</p>
                        )}
                    </div>

                    <button
                        disabled={loading}
                        type="submit"
                        className="w-full flex items-center justify-center gap-2 mt-2 px-6 py-2.5 text-sm font-medium text-white
                            bg-cyan-800 rounded-lg transition-colors duration-200
                            hover:bg-cyan-700 focus:outline-none focus:ring-2 focus:ring-cyan-300 focus:ring-opacity-50
                            disabled:opacity-60 disabled:cursor-not-allowed"
                    >
                        {loading && <Loader2 size={16} className="animate-spin" />}
                        {loading ? "Signing in..." : "Sign in"}
                    </button>
                </form>

                <div className="flex items-center gap-3 my-6">
                    <span className="flex-1 h-px bg-gray-200 dark:bg-gray-700" />
                    <span className="text-xs text-gray-400">or continue with</span>
                    <span className="flex-1 h-px bg-gray-200 dark:bg-gray-700" />
                </div>

                <button
                    onClick={handleGoogleLogin}
                    disabled={googleLoading}
                    type="button"
                    className="w-full flex items-center justify-center gap-3 px-6 py-2.5 text-sm font-medium text-gray-700
                        border border-gray-200 rounded-lg transition-colors duration-200
                        hover:bg-gray-50 dark:border-gray-700 dark:text-gray-200 dark:hover:bg-gray-800
                        focus:outline-none focus:ring-2 focus:ring-cyan-300 focus:ring-opacity-50
                        disabled:opacity-60 disabled:cursor-not-allowed"
                >
                    {googleLoading ? (
                        <Loader2 size={18} className="animate-spin" />
                    ) : (
                        <GoogleIcon />
                    )}
                    {googleLoading ? "Signing in..." : "Sign in with Google"}
                </button>

                <p className="mt-8 text-center text-sm text-gray-500 dark:text-gray-400">
                    Don&apos;t have an account?{" "}
                    <Link
                        to="/signUp"
                        className="font-medium text-cyan-600 hover:underline dark:text-cyan-400"
                    >
                        Sign up
                    </Link>
                </p>
            </div>
        </section>
    );
};

const GoogleIcon = () => (
    <svg className="w-4 h-4" viewBox="0 0 40 40">
        <path
            d="M36.3425 16.7358H35V16.6667H20V23.3333H29.4192C28.045 27.2142 24.3525 30 20 30C14.4775 30 10 25.5225 10 20C10 14.4775 14.4775 9.99999 20 9.99999C22.5492 9.99999 24.8683 10.9617 26.6342 12.5325L31.3483 7.81833C28.3717 5.04416 24.39 3.33333 20 3.33333C10.7958 3.33333 3.33335 10.7958 3.33335 20C3.33335 29.2042 10.7958 36.6667 20 36.6667C29.2042 36.6667 36.6667 29.2042 36.6667 20C36.6667 18.8825 36.5517 17.7917 36.3425 16.7358Z"
            fill="#FFC107"
        />
        <path
            d="M5.25497 12.2425L10.7308 16.2583C12.2125 12.59 15.8008 9.99999 20 9.99999C22.5491 9.99999 24.8683 10.9617 26.6341 12.5325L31.3483 7.81833C28.3716 5.04416 24.39 3.33333 20 3.33333C13.5983 3.33333 8.04663 6.94749 5.25497 12.2425Z"
            fill="#FF3D00"
        />
        <path
            d="M20 36.6667C24.305 36.6667 28.2167 35.0192 31.1742 32.34L26.0159 27.975C24.3425 29.2425 22.2625 30 20 30C15.665 30 11.9842 27.2359 10.5975 23.3784L5.16254 27.5659C7.92087 32.9634 13.5225 36.6667 20 36.6667Z"
            fill="#4CAF50"
        />
        <path
            d="M36.3425 16.7358H35V16.6667H20V23.3333H29.4192C28.7592 25.1975 27.56 26.805 26.0133 27.9758C26.0142 27.975 26.015 27.975 26.0158 27.9742L31.1742 32.3392C30.8092 32.6708 36.6667 28.3333 36.6667 20C36.6667 18.8825 36.5517 17.7917 36.3425 16.7358Z"
            fill="#1976D2"
        />
    </svg>
);

export default Login;