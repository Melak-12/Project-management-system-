import { Progress, Space, Table } from 'antd';
import { DatabaseOutlined, WarningOutlined, SnippetsOutlined, TeamOutlined } from '@ant-design/icons'
import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux';
import { Link, Navigate } from 'react-router-dom';
import Project from './Project'
import axios from 'axios';

const Dashboard = () => {
    const userName = useSelector((state) => state.user.userValue.name) || '';
    const projects = useSelector((state) => state.projects.projectValue.projects) || '';
    const tasks = useSelector((state) => state.tasks.taskValue.tasks) || '';
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
    const columns = [
        {
            title: (<span className='text-slate-600 text-md'>Project Name</span>),
            dataIndex: 'name',
            key: 'name',
            render: (text) => <span className='text-slate-500'>{text}</span>,
        },
        {
            title: (<span className='text-slate-600 text-md'>Description</span>),
            dataIndex: 'description',
            key: 'description',
            render: (text) => <span className='text-slate-600'>{text}</span>,

        },

        {
            title: (<span className='text-slate-600 text-md'>Progress</span>),
            key: 'progress',
            // dataIndex: 'progress',

            render: (_, record) => (
                <div style={{ width: 100 }}>
                    <Progress percent={record.progress} status="primary" />
                </div>
            ),
        },
        {
            title: (<span className='text-slate-600 text-md'>Action</span>),
            key: 'action',
            render: (_, record) => (
                <Space size="middle">
                    <Link to={`/project/${record._id}`} className='bg-green-600 text-green-200 p-1 px-2 rounded-sm hover:text-white'>Detail</Link>
                </Space>
            ),
        },
    ];

    const user = localStorage.getItem("email");
    // const isAdmin = localStorage.getItem("isAdmin");
    if (!user) {
        return <Navigate to="/login"></Navigate>
    }

    const isAdmin = localStorage.getItem("isAdmin") === 'true';

    // if (!isAdmin) {
    //     return <Navigate to="/tasks" />;
    // }

    return (
        <div className='pt-5' >

            <span className='text-slate-700 text-2xl pt-44 px-1'>DASHBOARD</span>
            <hr className='h-2 w-full bg-green-600 rounded-b-lg' />
            <div className='shadow-md w-full p-5 mt-5 text-green-800'>Wellcome {userName}! </div>

            <div className="flex flex-row  mt-4">
                <div className='w-2/3'>
                    <Table
                        dataSource={projects.map(project => ({ ...project, key: project._id }))}
                        columns={columns}
                        className='shadow-xl rounded-lg border-l-4 border-green-500'
                        onRow={(record) => ({
                            // onClick: () => onRowClick(record),

                        })}

                    />;

                </div>
                <div className='flex flex-col w-1/3 overflow-y-scroll h-full'>

                    <Link to={'/alltasks'} className='p-5 flex flex-row justify-between  m-3 shadow-lg rounded-md bg-slate-300 font-sans'>
                        <div>
                            <span>{tasks.length}</span>
                            <br />
                            <span className='text-sm font-bold text-green-800'>Total tasks</span>
                        </div>
                        <Progress type="circle" size="small" status='normal' percent={40} />

                        <div>

                            <span className='flex justify-end text-slate-400 text-2xl disabled '><SnippetsOutlined /></span>
                        </div>
                    </Link>
                    <Link to={'/'} className='p-5 flex flex-row justify-between  m-3 shadow-lg rounded-md bg-slate-100 font-sans'>
                        <div>
                            <span>{projects.length}</span>
                            <br />
                            <span className='text-sm font-bold text-green-800'>Total projects</span>
                        </div>
                        <div>
                            <span className='flex justify-end text-slate-400 text-2xl disabled '><DatabaseOutlined /></span>
                        </div>
                    </Link>

                    <span className='p-5 flex flex-row justify-between  m-3 shadow-lg rounded-md bg-red-100 font-sans'>
                        <div>
                            <span>5</span>
                            <br />
                            <span className='text-sm font-bold text-red-700'>Total issues</span>
                        </div>
                        <div>
                            <span className='flex justify-end text-red-600 text-2xl disabled '><WarningOutlined /></span>
                        </div>
                    </span>
                    {isAdmin && <Link to={'/users'} className='p-5 flex flex-row justify-between  m-3 shadow-lg rounded-md bg-slate-300 font-sans'>
                        <div>
                            <span>{users.length}</span>
                            <br />

                            <span className='text-sm font-bold text-slate-700'>Total users</span>
                        </div>
                        <div>
                            <span className='flex justify-end text-slate-600 text-2xl disabled '><TeamOutlined /><TeamOutlined /></span>
                        </div>
                    </Link>}

                    <Link to={'/alltasks'} className='p-5 flex flex-row justify-between  m-3 shadow-lg rounded-md bg-green-200 font-sans'>
                        <div>
                            <span>{tasks.length}</span>
                            <br />
                            <span className='text-sm font-bold text-green-700'>Completed Projects</span>
                        </div>
                        <Progress type="circle" size="small" status='success' percent={100} />

                        <div>

                            <span className='flex justify-end text-slate-400 text-2xl disabled '><SnippetsOutlined /></span>
                        </div>
                    </Link>
                </div>
            </div>
        </div>
    )
}

export default Dashboard