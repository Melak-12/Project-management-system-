import React, { useState } from 'react';
import axios from 'axios'
import { Button, Form, Input } from 'antd';
import { Link, Navigate } from 'react-router-dom';
import { useDispatch } from 'react-redux'
import { fetchUserData } from '../redux/features/asyncThunkApi'
import Loading from '../Loading';

const LoginPage = () => {
  const [errors, setError] = useState('')
  const [logedIn, setLogedIn] = useState(false)
  const [loading,setLoading]=useState(false)  
  const dispatch = useDispatch();
  const onFinish = async (values) => {
    console.log('Success:', values);
    try {
      setLoading(true)
      await axios.post('http://localhost:9000/api/users/login', values).then(response => {
        console.warn('API Response login data:', response.data);
        localStorage.setItem('email', response.data.email);
        localStorage.setItem('name', response.data.name);
        localStorage.setItem('isAdmin', response.data.isAdmin);
        console.warn(' is admin:', response.data.isAdmin);

      })
        .catch(error => {
          console.error('API Error:', error);
          setError('Failed to log in. Please try again.');
        });
      dispatch(fetchUserData(values.email))
      setLogedIn(true)
      console.warn(values.email, "is email")

    } catch (error) {
      console.error('API Error:', error);
      setError('Failed to log in. Please try again.');

    }finally{
      setLoading(false)
    }
  };
  const onFinishFailed = (errorInfo) => {
    console.log('Failed:', errorInfo);

  };
  if (logedIn) {
    return<Navigate to="/"></Navigate>
  }

  return <div className='my-4 pt-4'>
        {loading&&<Loading/>}
    <span className='text-slate-700 text-2xl pt-44'>Login </span>
    <hr className='h-2 w-full bg-green-600 rounded-lg mb-5' />
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
      className='ml-12 mt-12 text-center'
    >
      <span>{errors && errors}</span>

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
        label="Password"
        name="password"
        rules={[
          {
            required: true,
            message: 'Please input  password',
          },
        ]}
      >
        <Input type='password' />
      </Form.Item>




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
    <span className='flex justify-center text-sm text-slate-500 font-thin'>you don't have accout ? <Link to="/register">Register </Link></span>
  </div>

};
export default LoginPage;