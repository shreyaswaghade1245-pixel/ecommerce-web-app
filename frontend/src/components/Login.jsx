import React, { useEffect, useState } from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import axios from 'axios'
import instalogo2 from '../assets/instalogo2.png'
import toast from 'react-hot-toast'
import { Loader, Loader2 } from 'lucide-react'
import { Link, useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { setAuthUser } from '../redux/authSlice'

const Login = () => {
    const [input, setInput] = useState({
        email: "",
        password: "",
    });

    const { user } = useSelector(store=>store.auth);
    // const [loading, setLoading] = useState(false);
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const submitHandler = async (e) => {
        e.preventDefault();
        if (!input.email || !input.password) {
            toast.error("All fields are required");
            return;
        }
        try {
            // setLoading(true);
            const res = await axios.post('http://localhost:8000/api/v1/user/login', input, {
                headers: {
                    'Content-Type': 'application/json',
                },
                withCredentials: true
            })
            if (res.data.success) {
                dispatch(setAuthUser(res.data.user))
                toast.success(res.data.message);
                setInput({
                    email: "",
                    password: "",
                });
                navigate('/');
            }
        }
        catch (error) {
            console.log(error);
            toast.error(error.response.data.message);
        }
        // finally {
        //     setLoading(false);
        // }
    }

    useEffect(()=>{
        if(user){
            navigate('/')
        }
    },[])

    return (
        <div className='flex items-center w-screen h-screen justify-center'>
            <form className='shadow-lg flex flex-col gap-3 p-8' onSubmit={submitHandler}>
                <div className='my-4 flex flex-col items-center'>
                    <img src={instalogo2} alt="" className='h-18 w-36' />
                    <p className='text-sm text-center'>Signup to see photos & videos from your freinds</p>
                </div>
                <div>
                    <span className='font-medium'>Email</span>
                    <Input
                        type='text'
                        className='focus-visible:ring-transparent my-2'
                        name='email'
                        onChange={(e) => {
                            setInput({ ...input, email: e.target.value });
                        }}
                        value={input.email}
                    />
                </div>
                <div>
                    <span className='font-medium'>Password</span>
                    <Input
                        type='password'
                        className='focus-visible:ring-transparent my-2'
                        name='password'
                        onChange={(e) => {
                            setInput({ ...input, password: e.target.value });
                        }}
                        value={input.password}
                    />
                </div>
                {
                    // loading ? (
                    //     <Button>
                    //         <Loader2 className='mr-2 h-10 w-4 animate-spin' />
                    //         Please wait
                    //     </Button>
                    // ) : (
                        <Button type='submit' className='mt-3 hover:cursor-pointer h-10'>Login </Button>
                    // )
                }
                <span className='text-center'>Don't have an account? <Link className='text-blue-600' to='/register'>Signup</Link> </span>
            </form>
        </div>
    )
}

export default Login
