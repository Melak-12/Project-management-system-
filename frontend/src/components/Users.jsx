import { Button, DatePicker, Form, Input, Modal, Popover, Progress, Radio } from 'antd';
import axios from 'axios';

import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { Link, Navigate, useParams } from 'react-router-dom'

import { SmileOutlined, DeleteOutlined } from '@ant-design/icons'
import { fetchUserData } from '../redux/features/asyncThunkApi';
import Loading from '../Loading';

const Users = ({ proid, projectTasks }) => {
    const dispatch = useDispatch()
    const tasks = useSelector((state) => state.tasks.taskValue.tasks) || '';

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

    if (!isAdmin) {
        return <Navigate to="/userTasks"></Navigate>

    }

    return (
        <div className='pt-5' >
            {loading && <Loading />}
            <span className='text-slate-700 text-2xl pt-44'>ALL USERS</span>
            <hr className='h-1 w-full bg-slate-600 rounded-b-lg' />
            <div className="flex flex-col  mt-4">


                <div className='p-4  border-green-500 border-t-4  shadow-2xl rounded-lg mt-4'>

                    <table className='w-full h-full mt-5 text-center  '>
                        <tbody className='justify-around py-10 '>
                            <tr className='text-slate-600 text-md font-bold pt-4' style={{ textAlign: "start" }}>
                                <td className='mb-2 p-3' >Name</td>
                                <td className='mb-2 p-3' >Email</td>
                                <td className='mb-2 p-3' >No Tasks</td>
                                <td className='mb-2 p-3' >Completed Tasks</td>
                                <td className='mb-2 p-3' >Actioin</td>
                            </tr>
                            {users && users.map((user) => (
                                < >
                                    <tr key={user._id} className='py-10 mb-10 bg-slate-200  m-4 text-slate-600' style={{ textAlign: "start", margin: 32 }}>
                                        <td className='mb-2 p-3  ' ><SmileOutlined className='px-2 text-md' />{user.name.toUpperCase()}</td>
                                        <td className='mb-2 p-3  ' >{user.email}</td>
                                        <td className='mb-2 p-3  ' >{user.assignedTasks.length}
                                            <Link to={`/detail/${user._id}`} className='p-3 text-green-500'>View</Link>
                                        </td>
                                        <td className='mb-2 p-3  ' >{user.completedTasks.length}</td>
                                        <td className='mb-2 p-3  ' > <DeleteOutlined className='text-red-500' /></td>

                                    </tr>
                                    <br />

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

export default Users