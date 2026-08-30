import { useForm } from "react-hook-form";
import { Link, useLocation, useNavigate } from "react-router-dom";
import useAxiosPublic from "../../hooks/useAxiosPublic";
import toast from "react-hot-toast";
import useAuth from "../../hooks/useAuth";
import { useState } from "react";

const image_hosting_key = import.meta.env.VITE_IMAGE_HOSTING_KEY;
const image_hosting_api = `https://api.imgbb.com/1/upload?key=${image_hosting_key}`;

const SignUp = () => {
    const { register, formState: { errors }, handleSubmit, reset } = useForm();
    const { createUser, updateUserProfile, googleSignInUser } = useAuth();
    const location = useLocation();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const axiosPublic = useAxiosPublic();
    let from = location.state?.from?.pathname || "/";


    const onSubmit = async (data) => {
        setLoading(true);
        const imageFile = { image: data.image[0] };
        const resImg = await axiosPublic.post(image_hosting_api, imageFile, {
            headers: {
                'content-type': 'multipart/form-data'
            }
        })
        if (resImg.data.success) {
            const name = data.name;
            const email = data.email;
            const password = data.password;
            const photoUrl = resImg.data.data.display_url;
            const userInfo = { name, email, image: photoUrl };
            try {
                await createUser(email, password);
                await updateUserProfile(name, photoUrl);
                const result = await axiosPublic.post('/users', userInfo);
                if (result.data.insertedId) {
                    navigate(from, { replace: true });
                    toast.success('User created Successfully');
                    reset();
                }
            } catch (err) {
                toast.error(err.message);
                console.log(err);
            } finally {
                setLoading(false);
            }
        }
    }
    const handelGoogleLogin = async () => {
        try {
            const res = await googleSignInUser();
            const userInfo = {
                email: res.user?.email,
                name: res.user?.displayName,
                image: res.user?.photoURL
            }
            // console.log(userInfo);
            if (res.user?.email) {
                await axiosPublic.post('/users', userInfo);
            }
            navigate(from, { replace: true });
            reset();
        } catch (err) {
            console.log(err);
        }
    }

    return (
        <section className="mt-12 mb-10">
            <div className="container flex flex-col items-center justify-center px-6 mx-auto  md:h-[700px] md:max-w-2xl bg-white dark:bg-gray-900 rounded-2xl">
                <form onSubmit={handleSubmit(onSubmit)} className="w-full max-w-md">
                    <p className="text-2xl font-semibold text-center my-10">Please sign up now</p>

                    {/* name fild  */}
                    <div className="relative flex items-center">
                        <span className="absolute">
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                className="w-6 h-6 mx-3 text-gray-300 dark:text-gray-500"
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
                            {...register('name', { required: true })}
                            type="text"
                            className="block w-full py-3 text-gray-700 bg-white border rounded-lg px-11 dark:bg-gray-900 dark:text-gray-300 dark:border-gray-600 focus:border-blue-400 dark:focus:border-blue-300 focus:ring-blue-300 focus:outline-none focus:ring focus:ring-opacity-40"
                            placeholder="Username"
                        />
                    </div>
                    {errors.name && <span className="text-red-500 text-xs">Name is required</span>}

                    {/* image fild  */}
                    <div>
                        <input
                            {...register('image', { required: true })}
                            type="file"
                            id="image"
                            className="block w-full px-3 py-2 mt-2 text-sm text-gray-600 bg-white border border-gray-200 rounded-lg 
               file:bg-gray-200 file:text-gray-700 file:text-sm file:px-4 file:py-1 file:border-none file:rounded-full 
               dark:file:bg-gray-800 dark:file:text-gray-200 dark:text-gray-300 placeholder-gray-400/70 
               dark:placeholder-gray-500 focus:border-blue-400 focus:outline-none focus:ring 
               focus:ring-blue-300 focus:ring-opacity-40 dark:border-gray-600 dark:bg-gray-900 
               dark:focus:border-blue-300"
                        />
                        {errors.image && <span className="text-red-500 text-xs">Image is required</span>}
                    </div>

                    {/* email fild  */}
                    <div className="relative flex items-center mt-6">
                        <span className="absolute">
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                className="w-6 h-6 mx-3 text-gray-300 dark:text-gray-500"
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
                            {...register('email', { required: true })}
                            type="email"
                            className="block w-full py-3 text-gray-700 bg-white border rounded-lg px-11 dark:bg-gray-900 dark:text-gray-300 dark:border-gray-600 focus:border-blue-400 dark:focus:border-blue-300 focus:ring-blue-300 focus:outline-none focus:ring focus:ring-opacity-40"
                            placeholder="Email address"
                        />
                    </div>
                    {errors.email && <span className="text-red-500 text-xs">Email is required</span>}

                    {/* password fild  */}
                    <div className="relative flex items-center mt-4">
                        <span className="absolute">
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                className="w-6 h-6 mx-3 text-gray-300 dark:text-gray-500"
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
                            {...register('password', { required: true, maxLength: 20, pattern: /^(?=.*[A-Z])(?=.*[@$!#%*?&])(?=.*[0-9])(?=.*[a-z])/, minLength: 6 })}
                            type="password"
                            className="block w-full px-10 py-3 text-gray-700 bg-white border rounded-lg dark:bg-gray-900 dark:text-gray-300 dark:border-gray-600 focus:border-blue-400 dark:focus:border-blue-300 focus:ring-blue-300 focus:outline-none focus:ring focus:ring-opacity-40"
                            placeholder="Password"
                        />
                    </div>
                    {errors.password && (
                        <p className="text-red-600 text-xs">
                            {errors.password.type === "required" && "Password is required"}
                            {errors.password.type === "minLength" && "Password must be at least 6 characters"}
                            {errors.password.type === "maxLength" && "Password must be less than 20 characters"}
                            {errors.password.type === "pattern" && "Password must include uppercase, lowercase, number & special character"}
                        </p>
                    )}


                    <div className="mt-6">
                        <button disabled={loading} className="w-full px-6 py-3 text-sm font-medium tracking-wide text-white capitalize transition-colors duration-300 transform bg-cyan-800 rounded-lg hover:bg-cyan-600 focus:outline-none focus:ring focus:ring-cyan-300 focus:ring-opacity-50">
                            {loading ? <div>
                                <svg
                                    aria-hidden="true"
                                    className="inline w-4 h-4 text-gray-200 animate-spin dark:text-gray-600 fill-green-500"
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
                                <span className="sr-only">Loading...</span>
                            </div> : 'Sign Up'}
                        </button>

                        <div className="mt-6 text-center">
                            <Link to='/signIn' className="text-sm text-cyan-500 hover:underline dark:text-cyan-400">
                                Already have an account?
                            </Link>
                        </div>
                    </div>
                </form>
                <button
                    onClick={handelGoogleLogin}
                    className="flex items-center justify-center px-6 py-3 mt-4 text-gray-600 
                     transition-colors duration-300 transform border rounded-lg 
                     dark:border-cyan-500 dark:text-gray-200 
                     hover:bg-cyan-800 dark:hover:bg-cyan-800 max-w-md w-full"
                >
                    <svg className="w-6 h-6 mx-2" viewBox="0 0 40 40">
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

                    <span className="mx-2 cursor-pointer">Sign in with Google</span>
                </button>
            </div>
        </section>
    );
};

export default SignUp;