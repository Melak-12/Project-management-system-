import React, { useState } from 'react';
import { Alert, Button, DatePicker, Form, Input } from 'antd';
import axios from 'axios';
import { useDispatch } from 'react-redux';
import { fetchTaskData, fetchprojectData } from '../redux/features/asyncThunkApi';
import { Navigate, useParams } from 'react-router-dom';
import Loading from '../Loading';

const AddTask = () => {
    const { id } = useParams()
  const [added, setAdded] = useState(false)
  const [loading,setLoading]=useState(false)  
  const [successMessage, setSuccessMessage] = useState('');

    const dispatch = useDispatch()
    const onFinish = async (values) => {
        const { deadline } = values;
        const deadlineDate = deadline?._d || new Date(deadline);
      
        console.log(' to be added  :', values);
        const updatedValues = { ...values, project: id ,    deadline: deadlineDate,
        };
        console.log(' project id  :', updatedValues);

        try {
            setLoading(true)
            await axios.post('https://pmsbackend-orpin.vercel.app/api/tasks/create/', updatedValues).then(response => {
                setSuccessMessage('Task added successfully!');
                console.warn('API Response add data:', response.data);
                dispatch(fetchTaskData())
                dispatch(fetchprojectData())
                // return  <Alert message="Success Tips" type="success" showIcon />

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
        return<Navigate to={`/project/${id}`}></Navigate>
      }
    
      const isAdmin = localStorage.getItem('isAdmin')==="true"

      if (!isAdmin) {
          return <Navigate to="/userTasks"></Navigate>
  
      }
   if(successMessage)   { 
    return  <Alert message={successMessage} type="success" showIcon closable onClose={() => setSuccessMessage('')} />
    }
    return (
        <div className='my-4 pt-4'>
            {loading&&<Loading/>}
            <span className='text-slate-700 text-2xl pt-44'>Add Task</span>
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
                    label="Task title"
                    name="title"
                    rules={[
                        {
                            required: true,
                            message: 'Please input task title!',
                        },
                    ]}
                >
                    <Input />
                </Form.Item>

                <Form.Item
                    label="Description"
                    name="description"
                    rules={[
                        {
                            required: true,
                            message: 'Please input task  description!',
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
                            message: 'Please input task due Date',
                        },
                    ]}
                >
                    <DatePicker />
                </Form.Item>
                {/* <Form.Item
                    label="Project"
                    // name="project"
                    rules={[
                        {
                            // required: true,
                            message: 'Please input progress value!',
                        },
                    ]}
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
        </div>

    )
}
export default AddTask;