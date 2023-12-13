import React, { useState } from 'react';
import { Button, DatePicker, Form, Input } from 'antd';
import axios from 'axios';
import { useDispatch } from 'react-redux';
import { fetchTaskData, fetchprojectData } from '../redux/features/asyncThunkApi';
import { Navigate } from 'react-router-dom';
import Loading from '../Loading';
const AddProject = () =>{
    const dispatch = useDispatch()
    const [added, setAdded] = useState(false)
  const [loading,setLoading]=useState(false)  

    const onFinish =async (values) => {
        console.log('Success:', values);
        const { deadline } = values;
        const deadlineDate = deadline?._d || new Date(deadline);
    
    
        console.log(' to be added  :', values);
        const updatedValues = { ...values,     deadline: deadlineDate,        progress: parseInt(values.progress), 

        };
        console.log(' project id  :', updatedValues);
    
        try {
            setLoading(true)
            await axios.post('https://pmsbackend-orpin.vercel.app/api/projects/create/', updatedValues).then(response => {
                console.warn('API Response add projects:', response.data);
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
      const isAdmin = localStorage.getItem('isAdmin')==="true"

      if (!isAdmin) {
          return <Navigate to="/userTasks"></Navigate>
  
      }
    return <div className='my-4 pt-4'>
        {loading&&<Loading/>}
        <span className='text-slate-700 text-2xl pt-44'>Add project</span>
        <hr className='h-2 w-full bg-green-600 rounded-b-lg mb-5' />
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
            className=' text-center'
        >
            <Form.Item
                label="Project Name"
                name="name"
                rules={[
                    {
                        required: true,
                        message: 'Please input project name!',
                    },
                ]}
            >
                <Input />
            </Form.Item>

            <Form.Item
                label="description"
                name="description"
                rules={[
                    {
                        required: true,
                        message: 'Please input project description!',
                    },
                ]}
            >
                <Input.TextArea />
            </Form.Item>
            <Form.Item
                label="Deadline"
                name="deadline"
                rules={[
                    {
                        required: true,
                        message: 'Please input Date',
                    },
                ]}
            >
                <DatePicker />
            </Form.Item>
            <Form.Item
                label="Progress in %"
                name="progress"
                rules={[
                    {
                        required: true,
                        message: 'Please input progress value!',
                    },
                ]}
            >
                <Input  />
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
    </div>
}

export default AddProject;