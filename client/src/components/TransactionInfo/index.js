import { useEffect, useState } from 'react';
import Upload from '../../api/upload';
import Transaction from '../../api/transaction';
import './style.css';

function TransactionInfo({ transaction, setPopup }) {
    const [file, setFile] = useState("");
    const [fileName, setFileName] = useState("Upload Screenshot");
    const [hash, setHash] = useState("");
    
    const onFileChange = (e) => {
        const file = e.target.files[0];
        setFileName(file.name)
        let formData = new FormData();
        formData.append('file', file);
        Upload.upload(formData).then(res => {
            setFile(res.data.url);
        })
    }

    const handleChange = (e) => {
        setHash(e.target.value);
    };

    const copyToClipboard = () => {
        const el = document.createElement('textarea');
        el.value = transaction.address;
        document.body.appendChild(el);
        el.select();
        document.execCommand('copy');
        document.body.removeChild(el);
    }

    const handleSubmit = () => {
        const data = {
            ...transaction,
            hash: hash,
            screenshot: file
        }
        
        Transaction.deposit({transaction: data}).then(res => {
            setPopup(0);
        });
    }

    return(
        <>
            <div className = "transactionInfo">
                <div>
                <div className="withDrawHead">
                <h2>Deposit Info</h2>
                </div>
                <p>Amount: {transaction.amount} {transaction.asset}  <br/><br/>
                Make deposit to the {transaction.asset}  Address below <br/><br/>
                <span class="address">
                    <span class="line-Clamp">{transaction.address}</span> <i class="fa-solid fa-copy" onClick={copyToClipboard}></i>
                </span>
                <p className="afterDeposit">After making deposit, kindly fill in the Deposit Info below: </p> 
                </p> 
                <div className="input-file">
                <div className='transaction'>
                <label>{fileName}</label>
                <input className='input1' type="file" onChange={(e)=> onFileChange(e)}/> </div>
                </div>
                <div className='transaction'>
                <label>Transaction Hash</label>
                <input className='input' type="text" placeholder="Enter Transaction Hash" onChange={handleChange} /></div>
                <button className='deposit' onClick={handleSubmit}>Complete Deposit</button>
                </div>
                
            </div>
        </>
    )
}

export default TransactionInfo;