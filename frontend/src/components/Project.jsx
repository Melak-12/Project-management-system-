import { Alert, Button, DatePicker, Form, Input, Modal, Popover, Progress, Radio } from 'antd';
import axios from 'axios';
import dayjs from 'dayjs';

import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { Link, Navigate, useAsyncValue, useParams } from 'react-router-dom'

import { DeleteOutlined, EditOutlined, SendOutlined, SettingOutlined } from '@ant-design/icons'
import { fetchTaskData, fetchUserData, fetchprojectData } from '../redux/features/asyncThunkApi';
import Tasks from './Tasks';
import Loading from '../Loading';

const Project = () => {
    const { id } = useParams()
    const dispatch = useDispatch()
    // const userEmail = useSelector((state) => state.user.userValue.email) || '';
    const projects = useSelector((state) => state.projects.projectValue.projects) || '';
    const tasks = useSelector((state) => state.tasks.taskValue.tasks) || '';
    const [users, setUsers] = useState([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedTask, setSelectedTask] = useState(null);
    const [countdown, setCountdown] = useState('');

    const [form] = Form.useForm();

    const project = projects.find((project) => project._id === id);

    const showModal = (project) => {
        setIsModalOpen(true);
        setSelectedTask(project);

    };



    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const response = await axios.get('http://localhost:9000/api/users/getme');
                setUsers(response.data);
            } catch (error) {
                console.error('Error fetching users:', error);
            }
        };

        fetchUsers();
        if (project) {
            const deadlineDate = new Date(project.deadline);

            const updateCountdown = () => {
                const currentDate = new Date();
                const timeDifference = deadlineDate - currentDate;

                if (timeDifference <= 0) {
                    clearInterval(timer);
                    setCountdown('Deadline passed!');
                    return;
                }

                const days = Math.floor(timeDifference / (1000 * 60 * 60 * 24));
                const hours = Math.floor((timeDifference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
                const minutes = Math.floor((timeDifference % (1000 * 60 * 60)) / (1000 * 60));
                const seconds = Math.floor((timeDifference % (1000 * 60)) / 1000);

                setCountdown(`${days} D, ${hours} HR, ${minutes} MIN, ${seconds} sec remaining`);
            };

            const timer = setInterval(updateCountdown, 1000);

            return () => clearInterval(timer);
        }
    }, [project]);

    const getProjectTasks = () => {
        if (project && project.tasks && tasks) {
            return tasks.filter((task) => project.tasks.includes(task._id));
        }
        return [];
    };
    const projectTasks = getProjectTasks();

    const content = (id) => {
        return (
            <div>
                <p className='text-red-600'>Are you sure you want to delete ?</p>
                <div className="flex justify-around">
                    <span className='cursor-pointer' >no</span>
                    {/* <span className='cursor-pointer' onClick={() => deleteTask(id)}>yes</span> */}

                </div>
            </div>
        );
    }
    const deleteTask = async (id) => {

        try {
            //
            await axios.delete(`http://localhost:9000/api/tasks/${id}`).then(response => {
                console.warn('API delete data:', response.data);
                dispatch(fetchTaskData())
                dispatch(fetchprojectData())
                const userr = localStorage.getItem('email');
                dispatch(fetchUserData(userr))

            })
                .catch(error => {
                    console.error('API Error:', error);
                });

        } catch (error) {
            console.error('API Error:', error);

        }
    }

    const handleOk = () => {
        setSelectedTask(null)
        setIsModalOpen(false);

    };
    const handleCancel = () => {
        setSelectedTask(null)

        setIsModalOpen(false);
    };

    const onFinish = async (values) => {
        const { deadline } = values;
        const deadlineDate = deadline?._d || new Date(deadline);
        // alert(deadlineDate)
        const updatedValues = Object.keys(values)
            .filter((key) => form.isFieldTouched(key))
            .reduce((obj, key) => {
                obj[key] = values[key];
                return obj;
            }, {});

        try {
            await axios.put(`http://localhost:9000/api/projects/${selectedTask._id}`, { ...updatedValues, deadline: deadlineDate }).then(response => {
                console.warn('update projects:', response.data);
                dispatch(fetchTaskData())
                dispatch(fetchprojectData())
                const userr = localStorage.getItem('email')
                dispatch(fetchUserData(userr))

            })
                .catch(error => {
                    console.error('API Error:', error);
                });

            dispatch(fetchTaskData())
            dispatch(fetchprojectData())

        } catch (error) {
            console.error('API Error:', error);

        } finally {
            setSelectedTask(null);
            form.resetFields();

            setIsModalOpen(false);

        }


        console.warn('Success - Updated Values:', updatedValues);
        console.warn('Success -  Values:', selectedTask._id);
    };
    const onFinishFailed = (errorInfo) => {
        console.log('Failed:', errorInfo);
    };
    const isAdmin = localStorage.getItem('isAdmin')==="true"

    if (!isAdmin) {
        return <Navigate to="/userTasks"></Navigate>

    }

    return (
        <div className='pt-5' >
            <span className='text-slate-700 text-2xl pt-44'>{project && project.name.toUpperCase()}</span>
            <hr className='h-1 w-full bg-slate-600 rounded-b-lg' />
            {project && <div className="flex flex-col  mt-4 ">
                <div className='flex flex-row w-full justify-around '>
                    <div className="flex flex-col justify-between">
                        <div>

                            <h2 className='text-slate-600 text-md font-bold my-2'>Project Name</h2>
                            <span className='text-slate-500 font-thin text-sm'>{project.name}</span>
                            <hr />
                        </div>
                        <div>
                            <h2 className='text-slate-600 text-md font-bold my-2'>Project Description</h2>
                            <i className='text-slate-500 font-thin text-sm'>{project.description}</i>
                            <hr />
                        </div>
                        <div className='text-slate-600 text-lg cursor-pointer'>

                            <Popover content={() => content(project._id)} title="Delete!" className='mx-2'>
                                <DeleteOutlined className='text-red-500' />
                            </Popover>
                            <button onClick={() => showModal(project)} type="" className='mx-2 p-1 m-2 rounded-md'><EditOutlined /></button>
                            <hr />
                        </div>

                    </div>
                    <div className="flex flex-col justify-between">
                        <div>

                            <h2 className='text-slate-600 text-md font-bold my-2'>deadline</h2>
                            <span className='text-yellow-600 text-sm font-thin'>
                                {countdown}
                            </span>

                            {/* <span className='text-slate-500 font-thin text-sm'>{project.deadline ? new Date(project.deadline).toISOString().slice(0, 10) : ''}</span> */}
                            <hr />
                        </div>
                        <div>

                            <h2 className='text-slate-600 text-md font-bold my-2'>Progress</h2>
                            <Progress type="circle" size="small" status='normal' percent={project.progress} />

                            <hr />
                        </div>
                        <div>
                            <h2 className='text-slate-600 text-md font-bold my-2'>Total tasks</h2>
                            <span className='text-slate-500 font-thin text-sm'>{project.tasks.length}</span>
                            <hr />
                        </div>


                    </div>
                    <Modal key={project._id}
                        title="Update project"
                        open={isModalOpen && selectedTask && selectedTask._id === project._id}
                        onOk={() => {
                            form
                                .validateFields()
                                .then((values) => {
                                    form.resetFields();
                                    handleOk();
                                })
                                .catch((info) => {
                                    console.log('Validate Failed:', info);
                                });
                        }}
                        onCancel={handleCancel}
                    >
                        <Form
                            // key={project._id}
                            form={form}
                            name="basic"
                            initialValues={{

                            }}
                            labelCol={{
                                span: 8,
                            }}
                            wrapperCol={{
                                span: 16,
                            }}
                            style={{
                                maxWidth: 600,
                            }}
                            onFinish={onFinish}
                            onFinishFailed={onFinishFailed}
                            autoComplete="off"
                            className=' text-center'
                        >
                            <Form.Item
                                label="project name"
                                name="name"
                                rules={[
                                    {
                                        // required: true,
                                        message: 'Please input project name!',
                                    },
                                ]}
                            >
                                <Input defaultValue={project.name} />

                            </Form.Item>

                            <Form.Item
                                label="Description"
                                name="description"
                                rules={[
                                    {
                                        // required: true,
                                        message: 'Please input task  description!',
                                    },
                                ]}
                            >
                                <Input.TextArea defaultValue={project.description} />
                            </Form.Item>
                            <Form.Item
                                label="Progress in %"
                                name="progress"
                                rules={[
                                    {
                                        // required: true,
                                        message: 'Please input project  progress!',
                                    },
                                ]}
                            >
                                <Input defaultValue={project.progress} type='number' />
                            </Form.Item>

                            <Form.Item
                                label="Deadline"
                                name="deadline"
                                rules={[
                                    {
                                        required: true,
                                        message: 'Please input project due Date',
                                    },
                                ]}
                            >
                                <DatePicker placeholder={`${project.deadline ? new Date(project.deadline).toISOString().slice(0, 10) : ''}`} />
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
                    </Modal>
                </div>
                {project && (
                    <Tasks key={project._id} proid={project._id} projectTasks={projectTasks} />

                )}
            </div>}
        </div>

    )
}

export default Project