import { useEffect, useState } from "react";
import { Modal } from "@material-ui/core";
import Transaction from "../../api/transaction";
import { environment } from "../../constants";
import Header from "../../components/Header";

function WithdrawRequests(){
    const [depositRequests, setDepositRequests] = useState([]);

    const changeStatus = async (id, status) => {
        Transaction.changeStatus(id, status).then(res => {
            Transaction.getAllAdmin({type: 2}).then((res) => {
                setDepositRequests(res.data.data.transactions);
            })
        })
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

    const copyToClipboard = (copyText) => {
        navigator.clipboard.writeText(copyText);
    }

    useEffect(() => {
        Transaction.getAllAdmin({type: 2}).then((res) => {
            setDepositRequests(res.data.data.transactions);
        })
    }, [])
    return (
        <div className="admin-dashboard">
            <table className="deposit-requests">
                <thead>
                    <tr>
                        <th>Email</th>
                        <th>Address</th>
                        <th>Currency</th>
                        <th>Amount</th>
                        <th>Date</th>
                        <th>Status</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody className="deposit-requests__body">
                    {depositRequests.map((request) => 
                        <tr>
                            <td>{request.by.email}</td>
                            <td className="truncate " onClick = {() => copyToClipboard(request.address)}>{request.address === ''? '---': request.address}</td>
                            <td>{request.asset}</td>
                            <td>{request.amount}</td>
                            <td>{formatDate(request.time)}</td>
                            <td>{request.status}</td>
                            <td>
                                { request.status === "Pending" && <>
                                    <button className="btn btn-success" onClick={() => changeStatus(request.id, 1)} >Approve</button>
                                    <button className="btn btn-danger" onClick={() => changeStatus(request.id, 2)}>Reject</button>
                                    </>}

                                { request.status !== "Pending" && <>
                                    {request.status}
                                </>}
                            </td>
                        </tr>
                    )}
                </tbody>
            </table>
        </div>
    );
}

export default WithdrawRequests;