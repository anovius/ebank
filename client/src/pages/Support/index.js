import { Modal } from '@material-ui/core';
import React, { useEffect, useState } from 'react'
import Header from "../../components/Header";
import "./style.scss";
import Ticket from '../../api/ticket';

function Support() {


const [open, setOpen] = useState(false);
const [tickets, setTickets] = useState([]);
const [subject, setSubject] = useState('');
const [body, setBody] = useState('');

useEffect(() => {
    getAllTickets();
}, [])

  const handleClose = () => {
    setOpen(false);
  }

  const getAllTickets = () => {
    Ticket.getAll()
      .then(res => {
        setTickets(res.data.data);
      })
  }

  const handleSubmit = () => {
      let data = {
          ticket: {
                subject: subject,
                body: body,
          }
      }

      Ticket.add(data).then(res => {
        handleClose();
        getAllTickets();
      })
  }

  return (
    <main className="support">
        <Header page="Support" style={"margin-top: 100px;"} />
        <section className="content">
        <div className='text-right'>
        <button class="newBtn" onClick={() => {setOpen(true)}}>New +</button></div>
        <table>
        <thead>
          <tr>
            <th style={{ textAlign: "start" }}>
                ID
            </th>
            <th>
                Subject
            </th>
            <th>
                Status
            </th>
            <th>
                Action
            </th>
          </tr>
        </thead>
        <tbody>
                {tickets.map((ticket, index) => {
                    return (
                        <tr key={index}>
                            <td>{index+1}</td>
                            <td>{ticket.subject}</td>
                            <td>{ticket.status}</td>
                            <td> <i class="fa-solid fa-eye"></i> </td>
                        </tr>
                    )
                })}
        </tbody>
      </table>
        </section>

        <Modal open = {open} onClose={handleClose}>
        <div className="modal-main">
                <div className="addAsset-modal">
                <div className="close" onClick={handleClose}><i class="fa-solid fa-circle-xmark"></i></div>

                <form>
                    <div className="form-group">
                      <label htmlFor="assetName">Subject</label>
                        <input type="text" className="form-control" id="assetName" placeholder="Ticket Subject" onChange={(e) => {setSubject(e.target.value)}} />
                    </div>
                    <div className="form-group">
                      <label htmlFor="assetSymbol">Body</label>
                      <textarea type="text" className="form-control" id="assetSymbol" placeholder="Ticket Body" onChange={(e) => {setBody(e.target.value)}}></textarea>
                    </div>
                    <button type="button" className="btn btn-primary" onClick={handleSubmit}>Submit</button>
                  </form>

                </div>
              </div>
        </Modal>
    </main>
  )
}

export default Support