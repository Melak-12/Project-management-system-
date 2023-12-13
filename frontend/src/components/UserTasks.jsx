import { Input, Popover, Radio } from 'antd';
import axios from 'axios';

import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom'

import { DeleteOutlined, EditOutlined, SendOutlined } from '@ant-design/icons'
import { fetchTaskData, fetchUserData, fetchprojectData } from '../redux/features/asyncThunkApi';
import Loading from '../Loading';

const UserTasks = ({ proid, projectTasks }) => {
    const dispatch = useDispatch()
    // const projects = useSelector((state) => state.projects.projectValue.projects) || '';
    const tasks = useSelector((state) => state.tasks.taskValue.tasks) || '';
    const userTasks = useSelector((state) => state.user.userValue.assignedTasks) || [];
    const [loading, setLoading] = useState(false)
    const [issueText, setIssueText] = useState({});

    useEffect(() => {
        const userr = localStorage.getItem('email');
        dispatch(fetchUserData(userr));
    }, [dispatch]);

    const [open, setOpen] = useState(false);
    const hide = () => {
        setOpen(false);
    };
    const handleOpenChange = (newOpen) => {
        setOpen(newOpen);
    };
    const [popoverVisible, setPopoverVisible] = useState({});
    const hidePopover = (taskId) => {
        setPopoverVisible({ ...popoverVisible, [taskId]: false });
    };
    const handlePopoverOpenChange = (taskId, newOpen) => {
        setPopoverVisible({ ...popoverVisible, [taskId]: newOpen });
    };
    const handleTextAreaChange = (taskId, value) => {
        setIssueText({ ...issueText, [taskId]: value });
    };
    const handleSubmitIssue = (taskId) => {
        const text = issueText[taskId]; // Text from the specific task's textarea
        console.log(`Task ID: ${taskId}, Issue: ${text}`);
        // You can perform further actions with the issue text here
    };
    const sendStatus = async (status, taskId) => {
        try {
            setLoading(true)
            await axios.put(`https://pmsbackend-orpin.vercel.app/api/tasks/${taskId}`, { status: status }).then(response => {
                console.warn('update stutus:', response.data);
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
            setLoading(false)
        }

        //


    }

    const isAdmin = localStorage.getItem("isAdmin") === 'true';
    const isUser = localStorage.getItem("email")

    const userTasksData = tasks.filter(task => userTasks.includes(task._id));


    return (
        <div className='pt-5' >
            {loading && <Loading />}
            <span className='text-slate-700 text-2xl pt-44'>MY TASKS</span>
            <hr className='h-1 w-full bg-slate-600 rounded-b-lg' />
            <div className="flex flex-col  mt-4">


                <div className='p-4  border-green-500 border-t-4  shadow-2xl rounded-lg mt-4'>
                    {isAdmin && <Link to={`/createtask/${proid}`} className='flex justify-center bg-slate-600  text-green-400  px-2 rounded-md  text-center cursor-pointer'
                    >Add task</Link>}
                    <table className='w-full h-full mt-5 text-center  '>
                        {/* <hr /> */}
                        <tbody className='justify-around py-10 '>
                            <tr className='text-slate-600 text-md font-bold pt-4' style={{ textAlign: "start" }}>
                                <td className='mb-2 p-3' >Title</td>
                                <td className='mb-2 p-3' >Description</td>
                                <td className='mb-2 p-3' >Deadline</td>
                                <td className='mb-2 p-3' >Status</td>
                                <td className='mb-2 p-3 text-red-500' >Issue</td>
                            </tr>
                            {userTasksData
                                && userTasksData
                                    //  .filter(task => isAdmin ? true : userTasks.includes(task._id)) 
                                    .map((task) => (
                                        < >
                                            <tr key={task._id} className='py-10 mb-10 text-slate-500' style={{ textAlign: "start", margin: 32 }}>
                                                <td className='mb-2 p-3' >{task.title}</td>
                                                <td className='mb-2 p-3' >{task.description}</td>
                                                <td className='mb-2 p-3' >{task.deadline ? new Date(task.deadline).toISOString().slice(0, 10) : ''}</td>
                                                <td className='mb-2 p-3' >

                                                    <Radio.Group defaultValue={`${task.status}`} size="small">
                                                        <Radio.Button onClick={() => sendStatus("stuck", task._id)} className="text-red-500" value="stuck">stuck</Radio.Button>
                                                        <Radio.Button onClick={() => sendStatus("working", task._id)} className="text-yellow-500" value="working">working</Radio.Button>
                                                        <Radio.Button onClick={() => sendStatus("done", task._id)} className="text-green-500" value="done">done</Radio.Button>
                                                    </Radio.Group>


                                                </td>
                                                <td className='mb-2 p-3 text-md font-medium cursor-pointer' >

                                                    <Popover
                                                        content={
                                                            <>
                                                                <Input.TextArea onChange={(e) => handleTextAreaChange(task._id, e.target.value)} />
                                                                <div className="flex justify-around m-2">
                                                                    <span className='cursor-pointer' onClick={() => hidePopover(task._id)}>Close</span>
                                                                    <span className='bg-green-500 text-white rounded-sm px-2 cursor-pointer' onClick={() => handleSubmitIssue(task._id)}>Submit</span>
                                                                </div>

                                                            </>
                                                        }
                                                        title="Write the issue you got!"
                                                        trigger="click"
                                                        visible={popoverVisible[task._id]}
                                                        onVisibleChange={(newOpen) => handlePopoverOpenChange(task._id, newOpen)}
                                                    >
                                                        <span type="primary">found issue</span>
                                                    </Popover>
                                                </td>

                                            </tr>

                                        </>

                                    ))
                            }
                        </tbody>
                    </table>
                </div>

            </div>
        </div>

    )
}

export default UserTasks