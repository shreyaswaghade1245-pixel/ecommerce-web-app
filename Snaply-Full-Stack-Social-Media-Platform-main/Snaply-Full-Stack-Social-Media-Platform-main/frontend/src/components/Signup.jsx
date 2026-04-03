import React, { useEffect, useState } from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import axios from 'axios'
import instalogo2 from '../assets/instalogo2.png'
import { useNavigate } from 'react-router-dom'
import toast from 'react-hot-toast'
import { Link } from 'react-router-dom'
import { useSelector } from 'react-redux'

const Signup = () => {
    const navigate = useNavigate();
    const [input, setInput] = useState({
        username: "",
        email: "",
        password: "",
    });
    const { user } = useSelector(store=>store.auth);

    const submitHandler = async (e) => {
        e.preventDefault();
        if (!input.username || !input.email || !input.password) {
            toast.error("All fields are required");
            return;
        }
        try {
            // setLoading(true);
            const res = await axios.post('http://localhost:8000/api/v1/user/register', input, {
                headers: {
                    'Content-Type': 'application/json',
                },
                withCredentials: true
            })
            if (res.data.success) {
                toast.success(res.data.message);
                setInput({
                    username: "",
                    email: "",
                    password: "",
                });
                navigate('/login')
            }
        }
        catch (error) {
            console.log(error);
            toast.error(error.response.data.message);
        }
    }

    useEffect(()=>{
        if(user){
            navigate('/')
        }
    },[])

    return (
        <div className='flex items-center w-screen h-screen justify-center'>
            <form className='shadow-lg flex flex-col gap-2 p-8' onSubmit={submitHandler}>
                <div className='my-4 flex flex-col items-center'>
                    <img src={instalogo2} alt="" className='h-19 w-38' />
                    <p className='text-sm text-center'>Signup to see photos & videos from your freinds</p>
                </div>
                <div>
                    <span className='font-medium'>Username</span>
                    <Input
                        type='text'
                        className='focus-visible:ring-transparent my-2'
                        name='username'
                        onChange={(e) => {
                            setInput({ ...input, username: e.target.value });
                        }}
                        value={input.username}
                    />
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
                        <Button type='submit' className='mt-3 hover:cursor-pointer h-10'>Signup</Button>
                    // )
                }
                <span className='text-center'>Already have an account? <Link className='text-blue-600' to='/login'>Login</Link> </span>
            </form>
        </div>
    )
}

export default Signup
