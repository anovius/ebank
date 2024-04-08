import { Modal } from '@material-ui/core';
import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import Transaction from '../../api/transaction';

function UserDetails(props) {
    const { email } = useParams();
    const [transactions, setTransactions] = useState([]);
    const [emailModal, setEmailModal] = useState(false);
    const [selectedIndex, setSelectedIndex] = useState(0);
    const [newAmount, setNewAmount] = useState(0);

    useEffect(() => {
        getAll();
    }, []);

    const getAll = () => {
        Transaction.getUser(email).then((res) => {
            setTransactions(res.data.data);
        })
    }

    const handleClose = () => {
        setEmailModal(false);
    }

    const update = () => {
        let body = {
            id: transactions[selectedIndex].id,
            amount: newAmount
        }

        Transaction.update(body).then(res => {
            handleClose();
        })
    }

    const handleModal = async (index) => {
        if(transactions[index].status === 'Pending') return;
        await setNewAmount(transactions[index]?.amount);
        await setSelectedIndex(index)
        await setEmailModal(true);
    }

    const formatDate = (date) => {
        let newDate = new Date(date);
        let month = newDate.getMonth();
        let day = newDate.getDate();
        let year = newDate.getFullYear();
    
        if (month === 12) {
          month = 1;
        } else {
          month++;
        }
    
        return `${day}/${month}/${year}`;
    }

    return (
        <>
        <div className="admin-dashboard">
        <h3>Transaction Details</h3><br/>
        <table className="deposit-requests">
            <thead>
                <tr>
                    <th>ID</th>
                    <th>Currency</th>
                    <th>Amount</th>
                    <th>Status</th>
                    <th>Date</th>
                    <th></th>
                </tr>
            </thead>
            <tbody className="deposit-requests__body">
                {transactions.map((t, index) => 
                    <tr>
                        <td>{index+1}</td>
                        <td>{t.asset}</td>
                        <td>{t.amount}</td>
                        <td>{t.status}</td>
                        <td>{formatDate(t.time)}</td>
                        <td className="ml-auto" onClick={() => {handleModal(index)}}>
                            <i class="fa-solid fa-user-pen"></i>
                        </td>
                    </tr>
                )}
            </tbody>
            </table>
            <Modal open = {emailModal} onClose={handleClose}>
                      <div className="modal-main">
                      <div className="addAsset-modal">
                      <div className="close" onClick={handleClose}><i class="fa-solid fa-circle-xmark"></i></div>
                        <form>
                          <div className="form-group">
                            <label htmlFor="assetName">{transactions[selectedIndex]?.asset}</label>
                            <input type="text" className="form-control" value={newAmount} placeholder="Amount" onChange = {(e) => {setNewAmount(e.target.value)}}/>
                          </div>
                          <button type="button" className="btn btn-primary" onClick = {update}>Update</button>
                        </form>
                      </div>
                      </div>
                    </Modal>
        {transactions.length === 0 && <h4 className="error-msg"><br/>No transactions found</h4>}
        
    </div>
        </>
    )
}

export default UserDetails