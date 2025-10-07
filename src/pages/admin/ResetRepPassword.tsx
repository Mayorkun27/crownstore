import { useEffect, useState } from 'react'
import Layout from '../../layout/Layout'
import { useFormik } from 'formik';
import * as Yup from "yup";
import axios from 'axios';
import { toast } from 'sonner';
import { IoEyeOffOutline, IoEyeOutline } from 'react-icons/io5';

const API_URL = import.meta.env.VITE_API_BASE_URL;

interface User {
  id: string;
  name: string;
  email: string;
  role: string;
}
interface Rep {
  id: string;
  name: string;
  email: string;
  username: string;
}

const ResetRepPassword = () => {
    const token = localStorage.getItem("token")
    const [isVisible, setIsVisible] = useState<boolean>(false);
    const [reps, setReps] = useState<Rep[]>([]);
    const [isFetchingReps, setIsFetchingReps] = useState<boolean>(false);

    const fetchReps = async () => {
        setIsFetchingReps(true)
        try {
            const response = await axios.get(`${API_URL}/api/users/sales-reps`, {
                headers: {
                    Accept: "application/json",
                    Authorization: `Bearer ${token}`,
                },
            });

            console.log("rep response", response)

            if (response.status === 200) {
                toast.success(response.data.message || "Reps retrieved successfully");
                setReps(response.data.data);
            } else {
                toast.error(response.data.message || "Failed to retrieve reps");
            }
        } catch (error) {
            console.error("Error deleting product:", error);
            if (axios.isAxiosError(error) && error.response) {
                console.error("Delete error details:", error.response.data);
                toast.error(error.response.data.message || "Failed to delete product");
            } else {
                toast.error("Error deleting product. Please try again.");
            }
        } finally {
            setIsFetchingReps(false)
        }
    }

    useEffect(() => {
        fetchReps();
    }, [])

    const formik = useFormik({
        initialValues: {
            repId: "",
            username: "",
            password: "",
        },
        validationSchema: Yup.object({
            repId: Yup.string()
                .required("Rep to reset id is required!."),
            username: Yup.string()
                .required("Username is required!."),
            password: Yup.string()
                .min(8, "Password must be at least 8 characters")
                .required("Password is required!."),
        }),
        onSubmit: async (values, { setSubmitting }) => {
            console.log("Reset values", values)
            setSubmitting(true)

            try {
                const response = await axios.put(`${API_URL}/api/sales-reps/${values.repId}`, values, {
                    headers: {
                        'Content-Type': 'application/json',
                        "Authorization": `Bearer ${token}`,
                    },
                });

                console.log('reset response:', response);

                if (response.status === 200) {
                    toast.success(response.data.message);
                    toast.dismiss();
                    fetchReps();
                }
            } catch (err:any) {
                console.error('Reset error:', err);
                toast.error(err?.response?.data?.message || 'Reset failed. Please try again.');
            } finally {
                setSubmitting(false);
            }
        }
    })

    return (
        <Layout>
            <h3 className='text-xl mb-4 font-semibold'>Reset Sales rep. password</h3>
            <div className="lg:w-3/4 mx-auto w-full md:p-8 p-4 shadow-2xl rounded-xl text-center">
                <form onSubmit={formik.handleSubmit} className='grid md:grid-cols-2 grid-cols-1 gap-6 my-4'>
                    <div className="md:col-span-2 col-span-1 text-start flex flex-col gap-1">
                        <label className='font-medium' htmlFor="reppId">Reps</label>
                        <select 
                            name="repId" 
                            id="repId"
                            className='w-full h-[45px] border border-black/30 outline-0 indent-3 rounded-md'
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                        >
                            {
                                isFetchingReps ? (
                                    <option value="">Fetching reps...</option>
                                ) : (
                                    reps.map((rep, index) => (
                                        <option key={index} value={rep.id}>{rep?.name} - {rep?.username}</option>
                                    ))
                                )
                            }
                        </select>
                        {formik.touched.username && formik.errors.username && (<small className='text-red-600'>{formik.errors.username}</small>)}
                    </div>
                    <div className="text-start flex flex-col gap-1">
                        <label className='font-medium' htmlFor="username">New Username</label>
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
                    <div className="col-span-1 text-start flex flex-col gap-1">
                        <label className='font-medium' htmlFor="password">New Password</label>
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
                    <div className="md:col-span-2 col-span-1">
                        <button
                            type='submit'
                            disabled={!formik.isValid || formik.isSubmitting}
                            className='bg-black md:w-1/2 w-full text-white mt-5 h-[50px] rounded-md cursor-pointer opacity-100 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-500'
                        >
                            {formik.isSubmitting ? "Resetting..." : "Reset Credentials"}
                        </button>
                    </div>
                </form>
            </div>
        </Layout>
    )
}

export default ResetRepPassword