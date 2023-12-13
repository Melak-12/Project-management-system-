import React, { useEffect, useState } from 'react';
import { DatabaseOutlined, HomeOutlined, CheckCircleOutlined,UserOutlined, ContainerOutlined, FolderAddOutlined, LogoutOutlined, WarningOutlined, TeamOutlined, } from '@ant-design/icons';
import { Layout, Menu } from 'antd';
import { Link, Navigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { logOut } from '../redux/features/authSlice';
import axios from 'axios';

const { Sider } = Layout;
const { Item, SubMenu } = Menu;

const SideBar = ({ handleMenu }) => {
    const [collapsed, setCollapsed] = useState(false);
    // style={{ backgroundColor: "#3f4c1ci" }}
    const projects = useSelector((state) => state.projects.projectValue.projects) || '';

    const dispatch = useDispatch()
    const [out, setOut] = useState(false)
    const isAdmin = localStorage.getItem("isAdmin") === 'true';
    const isUser = localStorage.getItem("email")
    const [users, setUsers] = useState([]);

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
    }, []);
    const logOutUser = async (e) => {

        e.preventDefault();
        try {
            localStorage.clear();
            dispatch(logOut())
            setOut(true)
        } catch (error) {
            console.log('Cannot log out', error);
        }
    };

    // if (out) {
    //     return <Navigate to="/login"></Navigate>

    // }
    return (

        <Sider theme='none' collapsible collapsed={collapsed} onCollapse={(value) => setCollapsed(value)} className=' w-[60vh]' collapsedWidth={100} width={250}>
            <div className="text-left text-2xl text-slate-400 mb-5 p-5  bg-slate-800 ">
                PMS
                <Menu theme='none' defaultSelectedKeys={['1']} mode="inline" className='text-md font-bold bg-slate-800 text-slate-400 pt-5'

                >
                    <Item className='hover:bg-slate-700' key='1' icon={<HomeOutlined size={10} />} >
                        <Link className='hover:text-slate-400' to="/">Dashboard</Link>
                    </Item>
                    {isAdmin && <><SubMenu key='sub1' icon={<DatabaseOutlined />} title='Projects'>
                        <Item className='hover:bg-slate-700' key='3' icon={<FolderAddOutlined />}>
                            <Link className='hover:text-green-500' to="/createproject">Add project</Link>
                        </Item>

                        {(projects&& isAdmin) && projects.map((project) => (<Item className='hover:bg-slate-700' key='4' icon={<ContainerOutlined />}>
                            <Link className='hover:text-slate-400' to={`/project/${project._id}`}>
                                {project.name.toUpperCase()}
                            </Link>
                        </Item>))}
                    </SubMenu>
                        <SubMenu key='sub2' icon={<TeamOutlined />} title='Users'>
                          {(users&& isAdmin) && users.map((user) => (<Item className='hover:bg-slate-700' key='4' icon={<UserOutlined />}>
                            <Link className='hover:text-slate-400' to={`/detail/${user._id}`}>
                                {user.name}
                            </Link>
                        </Item>))}
                        </SubMenu></>}
                        
                    <Item className='hover:bg-slate-700' key='10' icon={<CheckCircleOutlined />}>
                        {isAdmin ? <Link className='hover:text-slate-400' to="/alltasks">Tasks</Link> :
                            <Link className='hover:text-slate-400' to="/usertasks">Tasks</Link>
                        }
                    </Item>
                    <Item className='hover:bg-slate-700' key='9' icon={<WarningOutlined />}>
                        <Link className='hover:text-slate-400' to="/issues">Issues</Link>
                    </Item>
                    <Item key='11' icon={<LogoutOutlined />} className='text-red-500 hover:text-red-400 '>
                        <span onClick={logOutUser} className=' hover:text-red-400'>Log out</span>
                    </Item>
                </Menu>
            </div>
        </Sider>
    );
};

export default SideBar;