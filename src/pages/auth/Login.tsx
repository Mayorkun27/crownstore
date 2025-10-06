import { useState } from 'react';
import { useFormik } from "formik";
import * as Yup from "yup";
import { assets } from "../../assets/assets.ts"
import { IoEyeOffOutline, IoEyeOutline } from "react-icons/io5";
import { toast } from 'sonner';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const API_URL = import.meta.env.VITE_API_BASE_URL

const Login = () => {
    const [isVisible, setIsVisible] = useState<boolean>(false)
    const navigate = useNavigate()

    const formik = useFormik({
        initialValues: {
            username: "",
            password: "",
        },
        validationSchema: Yup.object({
            username: Yup.string()
                .required("Username is required!."),
            password: Yup.string()
                .min(8, "Password must be at least 8 characters")
                .required("Password is required!."),
        }),
        onSubmit: async (values, { setSubmitting }) => {
            console.log("Login values", values)
            setSubmitting(true)

            try {
                const response = await axios.post(`${API_URL}/api/login`, values, {
                    headers: {
                        'Content-Type': 'application/json',
                    },
                });

                console.log('Login response:', response);

                if (response.status === 200) {
                const { token, user } = response.data;
                localStorage.setItem('token', token);
                localStorage.setItem('role', user.role);
                localStorage.setItem('user', JSON.stringify(user));
                toast.success('Login successful');
                
                // Clear any existing toasts
                toast.dismiss();
                
                // Role-based redirection
                if (user.role === 'admin') {
                    toast('Redirecting to admin dashboard...');
                    navigate('/adminhome');
                } else {
                    toast('Redirecting to receptionist log...');
                    navigate('/home');
                }
                }
            } catch (err) {
                console.error('Login error:', err);
                if (axios.isAxiosError(err) && err.response && err.response.status === 401) {
                    toast.error(err.response.data.message || 'Invalid credentials');
                } else {
                    toast.error('Login failed. Please try again.');
                }
            } finally {
                setSubmitting(false);
            }
        }
    })

    return (
        <div className='w-screen h-screen flex items-center justify-center p-4'>
            <div className="md:w-1/2 w-full md:p-8 p-4 shadow-2xl rounded-xl text-center">
                <img src={assets.logo} alt="Crownstore logo" className='w-14 mx-auto' />
                <h3 className='text-3xl font-bold'>Login</h3>
                <form onSubmit={formik.handleSubmit} className='flex flex-col gap-6 my-4'>
                    <div className="text-start flex flex-col gap-1">
                        <label className='font-medium' htmlFor="username">Username</label>
                        <input 
                            type="text"
                            id='username'
                            name='username'
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            className='w-full h-[45px] border border-black/30 outline-0 indent-3 rounded-md'
                        />
                        {formik.touched.username && formik.errors.username && (<small className='text-red-600'>{formik.errors.username}</small>)}
                    </div>
                    <div className="text-start flex flex-col gap-1">
                        <label className='font-medium' htmlFor="password">Password</label>
                        <div className='flex items-center w-full h-[45px] border border-black/30 outline-0 rounded-md overflow-hidden pe-2'>
                            <input 
                                type={`${isVisible ? "text" : "password"}`}
                                id='password'
                                name='password'
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                                className='w-full h-full border-0 outline-0 indent-3 pr-2'
                            />
                            <button
                                type='button'
                                onClick={() => setIsVisible(!false)}
                            >
                                {isVisible ? <IoEyeOutline size={20} /> : <IoEyeOffOutline size={20} />}
                            </button>
                        </div>
                        {formik.touched.password && formik.errors.password && (<small className='text-red-600'>{formik.errors.password}</small>)}
                    </div>
                    <button
                        type='submit'
                        disabled={!formik.isValid || formik.isSubmitting}
                        className='bg-black text-white mt-5 h-[50px] rounded-md cursor-pointer opacity-100 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-500'
                    >
                        {formik.isSubmitting ? "Logging in..." : "Log In"}
                    </button>
                </form>
            </div>
        </div>
    )
}

export default Login