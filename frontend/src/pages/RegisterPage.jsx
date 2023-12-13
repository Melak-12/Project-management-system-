import React, { useState } from 'react';
import { Button,  Form, Input } from 'antd';
import { Link, Navigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import axios from 'axios';
import { fetchTaskData, fetchprojectData } from '../redux/features/asyncThunkApi';
import Loading from '../Loading';
const RegisterPage = () => {
    const [added, setAdded] = useState(false)
    const [loading,setLoading]=useState(false)  
  
      const dispatch = useDispatch()
    const onFinish = async (values) => {
        // const { id } = useParams()
        const { deadline } = values;
        const deadlineDate = deadline?._d || new Date(deadline);
      
        console.log(' to be added  :', values);
        const updatedValues = { ...values,
        };
        console.log(' project id  :', updatedValues);

        try {
            setLoading(true)
            await axios.post('https://pmsbackend-orpin.vercel.app/api/users/', updatedValues).then(response => {
                console.warn('API Response add user:', response.data);
                dispatch(fetchTaskData())
                dispatch(fetchprojectData())
            })
                .catch(error => {
                    console.error('API Error:', error);
                });
                setAdded(true)

            dispatch(fetchTaskData())
            dispatch(fetchprojectData())

        } catch (error) {
            console.error('API Error:', error);

        }finally{
            setLoading(false)
        }
    };
    const onFinishFailed = (errorInfo) => {
        console.log('Failed:', errorInfo);
    };
    if (added) {
        return<Navigate to={`/`}></Navigate>
      }
    return(
    <div className='my-4 pt-4'>
                {loading&&<Loading/>}

        <span className='text-slate-700 text-2xl pt-44 px-4'>Register </span>
        <hr className='h-2 w-full bg-green-600 rounded-b-lg mb-5' />
        <div className='-ml-28 flex justify-center '>

        <Form
            name="basic"
            labelCol={{
                span: 8,
            }}
            wrapperCol={{
                span: 16,
            }}
            style={{
                maxWidth: 600,
            }}
            initialValues={{
                remember: true,
            }}
            onFinish={onFinish}
            onFinishFailed={onFinishFailed}
            autoComplete="off"
            className=' mt-12 flex flex-col text-center justify-center w-2/3'
            >
            <Form.Item
                label="Name"
                name="name"
                rules={[
                    {
                        required: true,
                        message: 'Please input your name!',
                    },
                ]}
            >
                <Input />
            </Form.Item>

            <Form.Item
                label="Email"
                name="email"
                rules={[
                    {
                        required: true,
                        message: 'Please input your email!',
                    },
                ]}
            >
                <Input type='email' />
            </Form.Item>
            <Form.Item
                label=" New Password"
                name="password"
                rules={[
                    {
                        required: true,
                        message: 'Please input new password',
                    },
                ]}
            >
                <Input type='password' />
            </Form.Item>
            <Form.Item
                label=" Conifrm Password"
                name="password"
                rules={[
                    {
                        required: true,
                        message: 'Please input  password again',
                    },
                ]}
            >
                <Input type='password' />
            </Form.Item>
            {/* <Form.Item
                label="Role"
                name="progress"

            >
                <Input />
            </Form.Item> */}


            <Form.Item
                wrapperCol={{
                    offset: 8,
                    span: 16,
                }}
            >
                <Button className='w-full bg-green-600 text-slate-200 hover:text-slate-100' htmlType="submit">
                    Submit
                </Button>
            </Form.Item>
        </Form>
        </div>
        <span className='flex justify-center text-sm text-slate-500 font-thin'>are you already registered ? <Link to="/login">Login</Link></span>
    </div>

);}
export default RegisterPage;