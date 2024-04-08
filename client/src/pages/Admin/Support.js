import { Modal } from '@mui/material';
import './Support.scss';
import React, { useEffect, useState } from 'react'
import Ticket from '../../api/ticket';
import User from '../../api/user';
import Grid from '@mui/material/Grid';

export const SupportAdmin = () => {
    const [tickets, setTickets] = useState([]);
    const [modal, setModal] = useState(false);
    const [selectedIndex, setSelectedIndex] = useState(0);
    const [reply, setReply] = useState('');

    useEffect(() => {
        getAll();
    }, [])
    
    const getAll = () => {
        Ticket.getAllByAdmin().then(res => {
            setTickets(res.data.data);
        })
    }

    const handleClose = () => {
        setModal(false);
    }

    const onReply = () => {
        let body = {
            email:{
                user: tickets[selectedIndex].by.email, 
                subject: 'Reply On ' + tickets[selectedIndex].subject,
                body: reply
            }
        }

        User.email(body).then((res) => {
            Ticket.changeStatus({
                _id: tickets[selectedIndex]._id,
                status: 2
            }).then(res => {
                setModal(false);
                getAll();
            });
        })
    }

  return (
    <div className="admin-dashboard">
            <div className="addAsset">
            <div>
                
            </div>

            </div>
            <table className="deposit-requests">
                <thead>
                    <tr>
                        <th>By</th>
                        <th>Subject</th>
                        <th>Status</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody className="deposit-requests__body">
                    {
                        tickets.map((ticket, index) => {
                            return (
                                <tr>
                                    <td>{ticket.by.email}</td>
                                    <td>{ticket.subject}</td>
                                    <td>{ticket.status}</td>
                                    <td>
                                        <button className="btn btn-primary" onClick = {() => {setSelectedIndex(index); setModal(true)}} disabled={ticket.status === 'Closed'? true: false}>View</button>
                                    </td>
                                </tr>
                            )
                        })
                    }
                </tbody>
                    </table>
                    <Modal open = {modal} onClose={handleClose}>
                    <div className="modal-main">
                    <Grid container spacing={2}>
                        <Grid item xs={12}>
                        <table class="table">
        <thead>
            <tr>
            <th scope="col"><div>By</div></th>
            <th scope="col"><div>Subject</div></th>
            <th scope="col">  <div>Status</div></th>
            </tr>
        </thead>
        <tbody>
            <tr>
            <td><div>{tickets[selectedIndex]?.by.email}</div></td>
            <td><div>{tickets[selectedIndex]?.subject}</div></td>
            <td><div>{tickets[selectedIndex]?.by.status}</div></td>
            </tr>
        
        </tbody>
        </table>

                    <p className="text-para">
                        {tickets[selectedIndex]?.body}
                    </p>
                
                    
                    <div>
                    <textarea rows={5} onChange={(e) => setReply(e.target.value)}>
                    </textarea>
                    </div>
                    <div>
                        <button type="button" onClick={onReply}>Reply</button>
                    </div>
                </Grid>
            </Grid>
            </div>
            </Modal>
        </div>
  )
}
