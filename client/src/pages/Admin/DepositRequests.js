import { useEffect, useState } from "react";
import { Modal } from "@material-ui/core";
import Transaction from "../../api/transaction";
import { environment } from "../../constants";
import Header from "../../components/Header";

function DepositRequests(){
    const [depositRequests, setDepositRequests] = useState([]);
    const [modalOpen, setModalOpen] = useState(false);
    const [modalImage, setModalImage] = useState("");

    const changeStatus = async (id, status) => {
        Transaction.changeStatus(id, status).then(res => {
            Transaction.getAllAdmin().then((res) => {
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

    const openModal = (img) => {
        setModalImage(environment.file_url+'/'+img);
        setModalOpen(true)
    }


    useEffect(() => {
        Transaction.getAllAdmin().then((res) => {
            setDepositRequests(res.data.data.transactions);
        })
    }, [])
    return (
        <div className="admin-dashboard">
            <table className="deposit-requests">
                <thead>
                    <tr>
                        <th>Email</th>
                        <th>Hash</th>
                        <th>Currency</th>
                        <th>Amount</th>
                        <th>Date</th>
                        <th>Status</th>
                        <th>Screenshot</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody className="deposit-requests__body">
                    {depositRequests.map((depositRequest) => 
                        <tr>
                            <td>{depositRequest.by.email}</td>
                            <td className="truncate">{depositRequest.hash === ''? '---': depositRequest.hash}</td>
                            <td>{depositRequest.asset}</td>
                            <td>{depositRequest.amount}</td>
                            <td>{formatDate(depositRequest.time)}</td>
                            <td>{depositRequest.status}</td>
                            <td className={depositRequest.screenshot === '' ? 'viewImageDisabled': 'viewImage'}>
                                <i className="fa-solid fa-eye" onClick={() => openModal(depositRequest.screenshot)}></i>
                            </td>
                            <td>
                                {depositRequest.status !== "Completed" && <button className="btn btn-success" onClick={() => changeStatus(depositRequest.id, 1)} >Approve</button>}
                                {depositRequest.status !== "Pending" && <button className="btn btn-primary" onClick={() => changeStatus(depositRequest.id, 0)} >Pending</button>}
                                {depositRequest.status !== "Failed" && <button className="btn btn-danger" onClick={() => changeStatus(depositRequest.id, 2)}>Reject</button>}
                            </td>
                        </tr>
                    )}
                </tbody>
            </table>
            <Modal open={modalOpen}>
                        <div className="modalImage">
                            <div className="close" onClick={() => setModalOpen(false)}>
                                <i class="fa-solid fa-xmark"></i>
                            </div>
                            <img src = {modalImage} width="70%"/>
                        </div>
            </Modal>
        </div>
    );
}

export default DepositRequests;