import { Radio } from 'antd';
import axios from 'axios';

import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { Link, useParams } from 'react-router-dom'

import { DeleteOutlined, EditOutlined, SendOutlined } from '@ant-design/icons'
import { fetchTaskData, fetchUserData, fetchprojectData } from '../redux/features/asyncThunkApi';
import Loading from '../Loading';

const UserDetail = ({ proid, projectTasks }) => {
    const { id } = useParams()

    const dispatch = useDispatch()
    const tasks = useSelector((state) => state.tasks.taskValue.tasks) || '';
    const userTasks = useSelector((state) => state.user.userValue.assignedTasks) || [];
    const [loading, setLoading] = useState(false)

    const [users, setUsers] = useState([]);

    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const response = await axios.get('https://pmsbackend-orpin.vercel.app/api/users/getme');
                setUsers(response.data);
            } catch (error) {
                console.error('Error fetching users:', error);
            }
        };

        fetchUsers();
    }, []);

    useEffect(() => {
        const userr = localStorage.getItem('email');
        dispatch(fetchUserData(userr));
    }, [dispatch]);

    const isAdmin = localStorage.getItem("isAdmin") === 'true';
    const isUser = localStorage.getItem("email")

    const currentUser = users.find(user => user._id === id);

    const userTasksData = tasks.filter(task => currentUser && currentUser.assignedTasks.includes(task._id));


    return (
        <div className='pt-5' >
            {loading && <Loading />}
            <span className='text-slate-700 text-2xl pt-44'>USER TASKS</span>
            <hr className='h-1 w-full bg-slate-600 rounded-b-lg' />
            <div className="flex flex-col  mt-4">


                <div className='p-4  border-green-500 border-t-4  shadow-2xl rounded-lg mt-4'>
                    {/* {isAdmin && <Link to={`/createtask/${proid}`} className='flex justify-center bg-slate-600  text-green-400  px-2 rounded-md  text-center cursor-pointer'
                    >Add task</Link>} */}
                    <table className='w-full h-full mt-5 text-center  '>
                        {/* <hr /> */}
                        <tbody className='justify-around py-10 '>
                            <tr className='text-slate-600 text-md font-bold pt-4' style={{ textAlign: "start" }}>
                                <td className='mb-2 p-3' >Title</td>
                                <td className='mb-2 p-3' >Description</td>
                                <td className='mb-2 p-3' >Deadline</td>
                                <td className='mb-2 p-3' >Status</td>
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
                                                        <Radio.Button  className="text-red-500" value="stuck">stuck</Radio.Button>
                                                        <Radio.Button  className="text-yellow-500" value="working">working</Radio.Button>
                                                        <Radio.Button  className="text-green-500" value="done">done</Radio.Button>
                                                    </Radio.Group>


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

export default UserDetail