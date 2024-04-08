import { Modal } from '@material-ui/core';
import React, { useEffect } from 'react'
import http from '../../api/axios';

function Config() {
    const [config, setConfig] = React.useState({
        referralReward: 0,
        tenUsersReward: 0,
    });
    const [modal, setModal] = React.useState(false);
    const [selectedEdit, setSelectedEdit] = React.useState('');

    useEffect(() => {
        http.get('/config').then(res => {
            setConfig(res.data.data);
        })
    }, [])

    const handleClose = () => {
        setModal(false);
    }

    const update = () => {
        http.put('/config', config).then(res => {
            setModal(false);
        })
    }
  return (
    <div className="admin-dashboard">
            <table className="deposit-requests">
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Name</th>
                        <th>Value</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody className="deposit-requests__body">
                    <tr>
                        <td>1</td>
                        <td>Referral Reward</td>
                        <td>{config.referralReward}</td>
                        <td>
                            <button className="btn btn-primary" onClick = {() => {
                                setSelectedEdit('referral');
                                setModal(true);
                            }}>Edit</button>
                        </td>
                    </tr>
                    <tr>
                        <td>1</td>
                        <td>Ten Users Referral Reward</td>
                        <td>{config.tenUsersReward}</td>
                        <td>
                            <button className="btn btn-primary" onClick = {() => {
                                setSelectedEdit('tenDays');
                                setModal(true);
                            }}>Edit</button>
                        </td>
                    </tr>
                </tbody>
            </table>

            <Modal open = {modal} onClose={handleClose}>
              <div className="modal-main">
              <div className="addAsset-modal">
              <div className="close" onClick={handleClose}><i class="fa-solid fa-circle-xmark"></i></div>
                <form>
                  { selectedEdit === "referral" && <div className="form-group">
                    <label htmlFor="assetName">Referral Reward</label>
                    <input type="number" className="form-control" id="assetName" placeholder="0" value = {config.referralReward} onChange = {(e) => setConfig({...config, referralReward: e.target.value})}/>
                  </div>}
                  { selectedEdit === "tenDays" && <div className="form-group">
                    <label htmlFor="assetName">Ten Users Referral Reward</label>
                    <input type="number" className="form-control" id="assetName" placeholder="0" value = {config.tenUsersReward} onChange = {(e) => setConfig({...config, tenUsersReward: e.target.value})}/>
                  </div>}
                  <button type="button" className="btn btn-primary" onClick = {update}>Update</button>
                </form>
              </div>
              </div>
            </Modal>
        </div>
  )
}

export default Config