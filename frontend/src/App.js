import { BrowserRouter as Router, Route, Routes, Navigate, } from 'react-router-dom';
import { Avatar, Badge, Layout } from 'antd';
import { useEffect, useState } from 'react';
import SideBar from './components/SideBar';
import { Link } from 'react-router-dom';
import { LoginOutlined, MessageOutlined } from '@ant-design/icons'
import Dashboard from './components/Dashboard';
import Issues from './components/Issues';
import RegisterPage from './pages/RegisterPage';
import LoginPage from './pages/LoginPage';
import AddProject from './components/AddProject';
import AddTask from './components/AddTask';
import { useDispatch, useSelector } from 'react-redux';
import { fetchTaskData, fetchUserData, fetchprojectData } from './redux/features/asyncThunkApi';
import { logOut } from './redux/features/authSlice';
import Project from './components/Project';
import Tasks from './components/Tasks';
import UserTasks from './components/UserTasks';
import AllTasks from './components/AllTasks';
import Users from './components/Users';
import UserDetail from './components/UserDetail';

function App() {

  const { Content } = Layout;

  const dispatch = useDispatch();
  const [out, setOut] = useState(false)
  useEffect(() => {
    dispatch(fetchTaskData())
    dispatch(fetchprojectData())
    const user = localStorage.getItem("user")
    const email = localStorage.getItem("email")
    if (user || email) {
      dispatch(fetchUserData(email))
    }
  }, [dispatch])
  const userEmail = useSelector((state) => state.user.userValue.email) || '';
  const userName = useSelector((state) => state.user.userValue.name) || '';
  // const isAdmin = useSelector((state) => state.user.userValue.isAdmin) || false;
  const notfication = useSelector((state) => state.user.userValue.assignedTasks.length) || 0;
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
  //   return<Navigate to="/login"></Navigate>
  // }
  const isAdmin = localStorage.getItem('isAdmin') === "true"
  const isUser = localStorage.getItem("email")

  return (
    <>
      <Router>
        <div className="md:block hidden">
          <Layout style={{ minHeight: '100vh' }} className=''>

            {isUser && <SideBar />}
            <Layout className=''>

              {/* <Header className='bg-slate-800' > */}
              <div className="flex justify-between bg-slate-800 p-4  rounded-b-lg">
                <span className='flex justify-end text-slate-500'>logo</span>
                <div className='flex justify-between text-slate-400'>
                  <Link to={'/'} className='px-3 rounded-3xl  hover:bg-slate-600 cursor-pointer' >home</Link>
                  <span className='px-3 rounded-3xl  hover:bg-slate-600 cursor-pointer'>contact us</span>
                  <span className='px-3 rounded-3xl  hover:bg-slate-600 cursor-pointer'>services</span>
                </div>
                <span className='flex justify-end text-white   rounded-xl  cursor-pointer'>
                  {
                    userEmail ?
                      <>
                        <span className='bg-black text-green-600 -text-sm font-thin px-3 rounded-lg mx-4'>wellcome {userName} !</span>
                        {!isAdmin && <Badge size="small" count={notfication}>
                          <Avatar size="small" className='text-green-500' icon={<MessageOutlined />} />
                        </Badge>}
                        {
                          <Link to={'/createproject'} className=' bg-slate-700 text-green-500 px-3 rounded-md'>Add new Project</Link>
                        }
                        <Link className='shadow-lg ring-1 mx-3 ring-red-500 text-red-300 hover:text-slate-400 hover:bg-slate-700 px-2 rounded-md bg-slate-700'
                          onClick={logOutUser}> <LoginOutlined className='px-2' />
                          LogOut
                        </Link>
                      </> :
                      <>
                        <Link className='shadow-lg text-slate-400 hover:text-slate-400 hover:bg-green-700 px-2 mx-3 rounded-md bg-slate-700'
                          to={'/login'}> <LoginOutlined className='px-2' />
                          Login
                        </Link>
                        <Link className='shadow-lg text-slate-400 hover:text-slate-400 hover:bg-green-700 px-2 rounded-md bg-slate-700'
                          to={'/register'}> <LoginOutlined className='px-2' />
                          Register
                        </Link>
                      </>
                  }


                </span>
              </div>
              {/* </Header> */}
              <div className="">
                <Content style={{ margin: '0 16px' }} className=''>

                  <Routes>
                    <Route path="/" element={<Dashboard />} />

                    <Route path="/createproject" element={<AddProject />} />
                    <Route path="/register" element={<RegisterPage />} />
                    <Route path="/createtask/:id" element={<AddTask />} />
                    <Route path="/login" element={<LoginPage />} />
                    <Route path="/project/:id" element={<Project />} />
                    <Route path="/tasks/" element={<Tasks />} />
                    <Route path="/usertasks/" element={<UserTasks />} />
                    <Route path="/alltasks/" element={<AllTasks />} />
                    <Route path="/users/" element={<Users />} />
                    <Route path="/detail/:id" element={<UserDetail />} />

                  </Routes>
                </Content>
              </div>
            </Layout>
          </Layout>
        </div>
        <div className='md:hidden block'>
          Please use your computer to see the project!
          <br/>
          <i>will be done for mobile soon!</i>
        </div>
      </Router>
    </>
  );
}

export default App;