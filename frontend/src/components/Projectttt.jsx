import { Button, DatePicker, Form, Input, Modal, Popover, Progress, Radio } from 'antd';
import axios from 'axios';
import dayjs from 'dayjs';

import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { Link, useAsyncValue, useParams } from 'react-router-dom'

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
  const [loading,setLoading]=useState(false)  

  const [form] = Form.useForm(); // Add this line to use Ant Design form instance

  const [open, setOpen] = useState(false);
  const hide = () => {
    setOpen(false);
  };
  const handleOpenChange = (newOpen) => {
    setOpen(newOpen);
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
  }, [users]);
  const project = projects.find((project) => project._id === id);
  const showModal = (task) => {
    setIsModalOpen(true);
    setSelectedTask(task);

  };

  const getProjectTasks = () => {
    if (project && project.tasks && tasks) {
      return tasks.filter((task) => project.tasks.includes(task._id));
    }
    return [];
  };
  const projectTasks = getProjectTasks();
  const assignTask = async (userId, taskId) => {
    try {
      setLoading(true)
      const response = await axios.post('http://localhost:9000/api/users/asigntasks', {
        userId,
        taskId,
      });

      alert('Task assigned successfully:', response.data);
    } catch (error) {
      console.error('Error assigning task:', error);
    }finally{
      setLoading(false)
    }
  };

  const content2 = (id) => {
    return (
      <div className=''>

        {users.map((user) => (
          <p className='cursor-pointer' onClick={() => assignTask(user._id, id)} key={user._id}>{user.name}</p>
        ))}
      </div>
    );
  }
  const content = (id) => {
    return (
      <div>
        <p className='text-red-600'>Are you sure you want to delete ?</p>
        <div className="flex justify-around">
          <span className='cursor-pointer' >no</span>
          <span className='cursor-pointer' onClick={() => deleteTask(id)}>yes</span>

        </div>
      </div>
    );
  }
  const deleteTask = async (id) => {

    try {
      // setLoading(true)
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

    }finally{
      setLoading(false)
    }
  }
  const getUserNameById = (taskId) => {

    const userWithTask = users.find((user) => {
      const hasTask = user.assignedTasks && user.assignedTasks.includes(taskId);
      const userr = localStorage.getItem('email')
      dispatch(fetchUserData(userr))
      return hasTask;
    });


    return userWithTask ? "assigned to " + userWithTask.name : 'task is not Assigned';
  };


  const sendStatus = async (status, taskId) => {
    // http://localhost:9000/api/tasks/657725d057a5ea392813b273

    try {
      setLoading(true)
      await axios.put(`http://localhost:9000/api/tasks/${taskId}`, { status: status }).then(response => {
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

    }finally{
      setLoading(false)
    }

    //


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
      setLoading(true)
      await axios.put(`http://localhost:9000/api/tasks/${selectedTask._id}`, { ...updatedValues, deadline: deadlineDate }).then(response => {
        console.warn('update taskss:', response.data);
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
      setLoading(false)
      setIsModalOpen(false);

    }


    console.warn('Success - Updated Values:', updatedValues);
    console.warn('Success -  Values:', selectedTask._id);
  };
  const onFinishFailed = (errorInfo) => {
    console.log('Failed:', errorInfo);
  };


  return (
    <div className='pt-5' >
      {/* {loading&&<Loading/>} */}
      <span className='text-slate-700 text-2xl pt-44'>{project && project.name}</span>
      <hr className='h-1 w-full bg-green-600 rounded-lg' />
      {project && <div className="flex flex-col  mt-4">
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
              <Popover
                content={<div className=''>
                  <span onClick={hide}>project</span> <br />
                  <span onClick={hide}>update project</span><br />
                  <span onClick={hide}>delete project</span><br />
                </div>
                }
                title="settings"
                trigger="click"
                open={open}

                onOpenChange={handleOpenChange}
              >
                <SettingOutlined className='px-1' />Settings
                {/* <Button type="primary">Click me</Button> */}
              </Popover>
              <hr />
            </div>

          </div>
          <div className="flex flex-col justify-between">
            <div>

              <h2 className='text-slate-600 text-md font-bold my-2'>deadline</h2>
              <span className='text-slate-500 font-thin text-sm'>{project.deadline}</span>
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

        </div>
        {project && (
          <div className='p-4  border-green-500 border-t-2  shadow-lg mt-4'>
            <Link to={`/createtask/${project._id}`} className='flex justify-center bg-slate-600  text-green-400  px-2 rounded-md  text-center cursor-pointer'
            >Add task</Link>
                  {/* <Tasks proid={project._id}/> */}

            <table className='w-full h-full mt-5 text-center ring-1'>
              {/* <hr /> */}
              <tbody className='justify-around py-10 '>
                <tr className='text-slate-600 text-md font-bold pt-4' style={{ textAlign: "start" }}>
                  <td>Title</td>
                  <td>Description</td>
                  <td>Deadline</td>
                  <td>Action</td>
                  <td>Status</td>
                </tr>
                {projectTasks.map((task) => (< >
                  <tr key={task._id} className='py-5' style={{ textAlign: "start" }}>
                    <td>{task.title}</td>
                    <td>{task.description}</td>
                    {/* <td>{task.completed ? "true" : "false"}</td> */}
                    <td>{task.deadline ? new Date(task.deadline).toISOString().slice(0, 10) : ''}</td>
                    <td>
                      <i className={`mx-2 ${getUserNameById(task._id) === 'task is not Assigned' ? 'bg-red-200 text-red-500 ' : 'bg-green-200 text-green-500 rounded-md font-thin px-1'}`}> {getUserNameById(task._id)}</i>
                      <Popover content={() => content(task._id)} title="Delete!" className='mx-2'>
                        <DeleteOutlined className='text-red-500' />
                      </Popover>
                      <button onClick={() => showModal(task)} type="" className='mx-2 bg-slate-600 text-green-200 p-1 m-2 rounded-md'><EditOutlined /></button>
                      <Popover content={() => content2(task._id)} title="Assign to ">
                        <SendOutlined />
                      </Popover>
                    </td>
                    <td>

                      <Radio.Group defaultValue={`${task.status}`} size="small">
                        <Radio.Button onClick={() => sendStatus("stuck", task._id)} className="text-red-500" value="stuck">stuck</Radio.Button>
                        <Radio.Button onClick={() => sendStatus("working", task._id)} className="text-yellow-500" value="working">working</Radio.Button>
                        <Radio.Button onClick={() => sendStatus("done", task._id)} className="text-green-500" value="done">done</Radio.Button>
                      </Radio.Group>


                    </td>
                  </tr>
                  <Modal
                    title="Update Task"
                    open={isModalOpen && selectedTask && selectedTask._id === task._id}
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
                        label="Task title"
                        name="title"
                        rules={[
                          {
                            // required: true,
                            message: 'Please input task title!',
                          },
                        ]}
                      >
                        <Input defaultValue={task.title} />

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
                        <Input.TextArea defaultValue={task.description} />
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
                        <DatePicker placeholder={`${task.deadline ? new Date(task.deadline).toISOString().slice(0, 10) : ''}`} />
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
                </>

                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>}
    </div>

  )
}

export default Project