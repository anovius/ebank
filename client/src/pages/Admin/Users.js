import { useEffect, useState } from "react";
import { Modal } from "@material-ui/core";
import Switch, { SwitchProps } from '@mui/material/Switch';
import User from "../../api/user";
import { Link } from "react-router-dom";
import InputUnstyled from '@mui/base/InputUnstyled';


function Users(){

    const [users, setUsers] = useState([]);
    const [emailModal, setEmailModal] = useState(false);
    const [detailModal, setDetailModal] = useState(false);
    const [selectedUser, setSelectedUser] = useState({});
    const [subject, setSubject] = useState("");
    const [emailBody, setBody] = useState("");
    const [selectedIndex, setSelectedIndex] = useState(-1);

    useEffect(() => {
        getAllUser();
    },[])

    const getAllUser = () => {
        User.getAll().then((res) => {
            setUsers(res.data.data.users);
        })
    }

    const handleClose = () => {
        setEmailModal(false);
        setDetailModal(false);
    }

    const openModal = (type, index) => {
        if(type === 1){
            setEmailModal(true);
            setSelectedIndex(index);
        }
    }

    const handleSubmit = () => {
        if(selectedIndex !== -1){
            let body = {
                email:{
                    user: users[selectedIndex].email, 
                    subject: subject,
                    body: emailBody
                }
            }
    
            User.email(body).then((res) => {
                setEmailModal(false);
                console.log(res.data);
            })
        }

        else{
            let body = {
                email:{
                    subject: subject,
                    body: emailBody
                }
            }

            User.emailAll(body).then((res) => {
                setEmailModal(false);
                console.log(res.data);
            })
        }
    }

    const changeStatus = (index, status) => {
        let body = {
            user: {
                email: users[index].email,
                status: status ? 1 : 0
            }
        }

        User.changeStatus(body).then((res) => {
            getAllUser();
        })
    }

    const search = (data) => {
        User.search({search: data}).then((res) => {
            setUsers(res.data.data.users);
        })
    }

    return(
        <div className="admin-dashboard">
            <div className="addAsset">
            <div>
                <div className="form-group">
                    <input type="text" className="form-control" id="search" placeholder="Search" onChange = {(e) => {search(e.target.value)}}/>
                </div>
            </div>
            <button className="btn btn-success" onClick = {() => setEmailModal(true)}>
                <i class="fa-solid fa-envelope"></i> Email All
            </button>
            </div>
            <table className="deposit-requests">
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Name</th>
                        <th>Email</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody className="deposit-requests__body">
                    {users.map((user, index) => {
                        return(
                            <tr>
                                <td>{index+1}</td>
                                <td onClick={() => {
                                    setSelectedUser(user);
                                    setDetailModal(true);
                                }}>{user.name}</td>
                                <td>{user.email}</td>
                                <td>
                                <div style={{display: 'flex'}}>
                                <Switch checked={user.status} onChange={(e)=>{changeStatus(index, e.target.checked)}} name="jason" />
                                    <button className="btn btn-success" onClick = {() => openModal(1, index)}>
                                    <i class="fa-solid fa-envelope"></i>
                                    </button>
                                    
                                <Link to={"/admin/users/"+user.email}><button className="btn btn-primary">
                                    <i class="fa-solid fa-eye"></i>
                                </button></Link>
                                    </div>
                                </td>  
                            </tr>
                        )
                    })}
                </tbody>
            </table>
            <Modal open = {emailModal} onClose={handleClose}>
              <div className="modal-main">
              <div className="addAsset-modal">
              <div className="close" onClick={handleClose}><i class="fa-solid fa-circle-xmark"></i></div>
                <form>
                  <div className="form-group">
                    <label htmlFor="assetName">Subject</label>
                    <input type="text" className="form-control" id="assetName" placeholder="Email Subject" onChange = {(e) => {setSubject(e.target.value)}}/>
                  </div>
                  <div className="form-group">
                    <label htmlFor="assetName">Body</label>
                    <textarea className="form-control" placeholder="Email Body" onChange = {(e) => {setBody(e.target.value)}}></textarea>
                  </div>
                  <button type="button" className="btn btn-primary" onClick={handleSubmit}>Send</button>
                </form>
              </div>
              </div>
            </Modal>

            <Modal open = {detailModal} onClose={handleClose}>
              <div className="modal-main">
              <div className="addAsset-modal">
              <div className="close" onClick={handleClose}><i class="fa-solid fa-circle-xmark"></i></div>
              <h3>Referral Used By: </h3>
              <table className="deposit-requests">
              <thead>
                  <tr>
                      <th>ID</th>
                      <th>Name</th>
                      <th>Email</th>
                  </tr>
              </thead>
              <tbody className="deposit-requests__body">
                  {
                        selectedUser?.referralUsedBy?.map((user, index) => {
                            return(
                                <tr>
                                    <td>{index+1}</td>
                                    <td>{user.name}</td>
                                    <td>{user.email}</td>
                                </tr>
                            )
                        })
                  }
              </tbody>
          </table>
                {selectedUser?.referralUsedBy?.length === 0 ? <p className="text-center">No Referral Used By</p> : null}
              </div>
              </div>
            </Modal>
        </div>
    );
}

export default Users;