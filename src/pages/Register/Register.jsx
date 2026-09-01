import { useForm } from "react-hook-form";
import useAuth from "../../hooks/useAuth";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useState } from "react";
import useAxiosPublic from "../../hooks/useAxiosPublic";
import toast from "react-hot-toast";

const image_hosting_key = import.meta.env.VITE_IMAGE_HOSTING_KEY;
const image_hosting_api = `https://api.imgbb.com/1/upload?key=${image_hosting_key}`;

const Register = () => {
    const { register, formState: { errors }, handleSubmit, reset } = useForm();
    const { createUser, updateUserProfile, googleSignInUser } = useAuth();
    const location = useLocation();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const axiosPublic = useAxiosPublic();
    let from = location.state?.from?.pathname || "/";

    const onSubmit = async (data) => {
        setLoading(true);
        try {
            const imageFile = { image: data.image[0] };
            const resImg = await axiosPublic.post(image_hosting_api, imageFile, {
                headers: { "content-type": "multipart/form-data" },
            });

            if (resImg.data.success) {
                const name = data.name;
                const email = data.email;
                const password = data.password;
                const photoUrl = resImg.data.data.display_url;
                const userInfo = { name, email, image: photoUrl };

                await createUser(email, password);
                await updateUserProfile(name, photoUrl);
                const result = await axiosPublic.post("/users", userInfo);

                if (result.data.insertedId) {
                    toast.success("Account created successfully");
                    reset();
                    navigate(from, { replace: true });
                }
            }
        } catch (err) {
            toast.error(err.message);
            console.log(err);
        } finally {
            setLoading(false);
        }
    };

    const handelGoogleLogin = async () => {
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
            reset();
            navigate(from, { replace: true });
        } catch (err) {
            console.log(err);
            toast.error("Google sign-in failed");
        }
    };

    return (
        <section className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-950 px-4 py-10 sm:py-16">
            <div className="w-full max-w-md">
                <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-sm shadow-slate-900/5 px-6 py-8 sm:px-10 sm:py-10">
                    {/* Header */}
                    <div className="text-center mb-8">
                        <h1 className="text-2xl sm:text-3xl font-semibold text-slate-900 dark:text-white">
                            Create your account
                        </h1>
                        <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
                            Sign up to get started — it only takes a minute.
                        </p>
                    </div>

                    <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-5">
                        {/* Name field */}
                        <div>
                            <label
                                htmlFor="name"
                                className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5"
                            >
                                Full name
                            </label>
                            <div className="relative">
                                <span className="absolute inset-y-0 left-0 flex items-center pl-3.5 text-slate-400">
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        className="w-5 h-5"
                                        fill="none"
                                        viewBox="0 0 24 24"
                                        stroke="currentColor"
                                        strokeWidth="2"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                                        />
                                    </svg>
                                </span>
                                <input
                                    id="name"
                                    {...register("name", { required: true })}
                                    type="text"
                                    placeholder="Jane Doe"
                                    aria-invalid={errors.name ? "true" : "false"}
                                    className={`block w-full py-2.5 pl-11 pr-3.5 rounded-lg border bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 placeholder-slate-400 outline-none transition focus:ring-2 focus:ring-offset-0 ${
                                        errors.name
                                            ? "border-red-400 focus:ring-red-200"
                                            : "border-slate-300 dark:border-slate-700 focus:border-cyan-500 focus:ring-cyan-100 dark:focus:ring-cyan-900/40"
                                    }`}
                                />
                            </div>
                            {errors.name && (
                                <p className="mt-1.5 text-xs text-red-500">Name is required</p>
                            )}
                        </div>

                        {/* Photo field */}
                        <div>
                            <label
                                htmlFor="image"
                                className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5"
                            >
                                Profile photo
                            </label>
                            <input
                                id="image"
                                {...register("image", { required: true })}
                                type="file"
                                accept="image/*"
                                className="block w-full text-sm text-slate-600 dark:text-slate-300
                                    file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0
                                    file:text-sm file:font-medium file:bg-slate-100 file:text-slate-700
                                    dark:file:bg-slate-800 dark:file:text-slate-200
                                    hover:file:bg-slate-200 dark:hover:file:bg-slate-700
                                    border border-slate-300 dark:border-slate-700 rounded-lg
                                    file:cursor-pointer cursor-pointer"
                            />
                            {errors.image && (
                                <p className="mt-1.5 text-xs text-red-500">A profile photo is required</p>
                            )}
                        </div>

                        {/* Email field */}
                        <div>
                            <label
                                htmlFor="email"
                                className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5"
                            >
                                Email address
                            </label>
                            <div className="relative">
                                <span className="absolute inset-y-0 left-0 flex items-center pl-3.5 text-slate-400">
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        className="w-5 h-5"
                                        fill="none"
                                        viewBox="0 0 24 24"
                                        stroke="currentColor"
                                        strokeWidth="2"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                                        />
                                    </svg>
                                </span>
                                <input
                                    id="email"
                                    {...register("email", { required: true })}
                                    type="email"
                                    placeholder="you@example.com"
                                    aria-invalid={errors.email ? "true" : "false"}
                                    className={`block w-full py-2.5 pl-11 pr-3.5 rounded-lg border bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 placeholder-slate-400 outline-none transition focus:ring-2 focus:ring-offset-0 ${
                                        errors.email
                                            ? "border-red-400 focus:ring-red-200"
                                            : "border-slate-300 dark:border-slate-700 focus:border-cyan-500 focus:ring-cyan-100 dark:focus:ring-cyan-900/40"
                                    }`}
                                />
                            </div>
                            {errors.email && (
                                <p className="mt-1.5 text-xs text-red-500">Email is required</p>
                            )}
                        </div>

                        {/* Password field */}
                        <div>
                            <label
                                htmlFor="password"
                                className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5"
                            >
                                Password
                            </label>
                            <div className="relative">
                                <span className="absolute inset-y-0 left-0 flex items-center pl-3.5 text-slate-400">
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        className="w-5 h-5"
                                        fill="none"
                                        viewBox="0 0 24 24"
                                        stroke="currentColor"
                                        strokeWidth="2"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                                        />
                                    </svg>
                                </span>
                                <input
                                    id="password"
                                    {...register("password", {
                                        required: true,
                                        maxLength: 20,
                                        minLength: 6,
                                        pattern: /^(?=.*[A-Z])(?=.*[@$!#%*?&])(?=.*[0-9])(?=.*[a-z])/,
                                    })}
                                    type={showPassword ? "text" : "password"}
                                    placeholder="••••••••"
                                    aria-invalid={errors.password ? "true" : "false"}
                                    className={`block w-full py-2.5 pl-11 pr-11 rounded-lg border bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 placeholder-slate-400 outline-none transition focus:ring-2 focus:ring-offset-0 ${
                                        errors.password
                                            ? "border-red-400 focus:ring-red-200"
                                            : "border-slate-300 dark:border-slate-700 focus:border-cyan-500 focus:ring-cyan-100 dark:focus:ring-cyan-900/40"
                                    }`}
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword((v) => !v)}
                                    aria-label={showPassword ? "Hide password" : "Show password"}
                                    className="absolute inset-y-0 right-0 flex items-center pr-3.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300"
                                >
                                    {showPassword ? (
                                        <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.542-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L3 3m6.878 6.878L21 21" />
                                        </svg>
                                    ) : (
                                        <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                        </svg>
                                    )}
                                </button>
                            </div>
                            {errors.password && (
                                <p className="mt-1.5 text-xs text-red-500">
                                    {errors.password.type === "required" && "Password is required"}
                                    {errors.password.type === "minLength" && "Password must be at least 6 characters"}
                                    {errors.password.type === "maxLength" && "Password must be less than 20 characters"}
                                    {errors.password.type === "pattern" &&
                                        "Include an uppercase letter, lowercase letter, number & special character"}
                                </p>
                            )}
                        </div>

                        {/* Submit */}
                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full flex items-center justify-center gap-2 rounded-lg bg-cyan-700 hover:bg-cyan-600 disabled:opacity-60 disabled:cursor-not-allowed text-white text-sm font-medium py-3 transition-colors focus:outline-none focus:ring-2 focus:ring-cyan-300 focus:ring-offset-2"
                        >
                            {loading ? (
                                <>
                                    <svg
                                        aria-hidden="true"
                                        className="w-4 h-4 animate-spin text-white/60 fill-white"
                                        viewBox="0 0 100 101"
                                        fill="none"
                                        xmlns="http://www.w3.org/2000/svg"
                                    >
                                        <path
                                            d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
                                            fill="currentColor"
                                        />
                                        <path
                                            d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
                                            fill="currentFill"
                                        />
                                    </svg>
                                    Creating account…
                                </>
                            ) : (
                                "Sign up"
                            )}
                        </button>

                        <p className="text-center text-sm text-slate-500 dark:text-slate-400">
                            Already have an account?{" "}
                            <Link to="/signIn" className="font-medium text-cyan-600 dark:text-cyan-400 hover:underline">
                                Sign in
                            </Link>
                        </p>
                    </form>

                    {/* Divider */}
                    <div className="flex items-center gap-3 my-6">
                        <div className="h-px flex-1 bg-slate-200 dark:bg-slate-800" />
                        <span className="text-xs text-slate-400">or continue with</span>
                        <div className="h-px flex-1 bg-slate-200 dark:bg-slate-800" />
                    </div>

                    {/* Google */}
                    <button
                        onClick={handelGoogleLogin}
                        type="button"
                        className="w-full flex items-center justify-center gap-3 rounded-lg border border-slate-300 dark:border-slate-700 py-2.5 text-sm font-medium text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors focus:outline-none focus:ring-2 focus:ring-cyan-200"
                    >
                        <svg className="w-5 h-5 shrink-0" viewBox="0 0 40 40">
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
                        Sign up with Google
                    </button>
                </div>
            </div>
        </section>
    );
};

export default Register;