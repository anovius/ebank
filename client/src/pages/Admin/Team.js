import { Modal } from "@material-ui/core";
import { useEffect, useState } from "react";
import Upload from "../../api/upload";
import User from "../../api/user";
import { environment } from "../../constants";

function Team(){
    const [team, setTeam] = useState([]);
    const [modal, setModal] = useState(false);
    const [image, setImage] = useState(null);
    const [name, setName] = useState(null);
    const [designation, setDesignation] = useState(null);

    const handleClose = () => {
        setModal(false);
    }

    const onFileChange = (e) => {
        const file = e.target.files[0];
        let formData = new FormData();
        formData.append('file', file);
        Upload.upload(formData).then(res => {
            setImage(res.data.url);
        })
    }

    const openModal = () => {
        setModal(true);
    }

    const onSubmit = () => {
        let body = {
            team:{
                name: name,
                img: image,
                designation: designation
            }
        }

        User.addTeam(body).then(res => {
            getAllUsers();
            setModal(false);
        })
    }

    const getAllUsers = () => {
        User.getAllTeam().then(res => {
            setTeam(res.data.data);
        })
    }

    useEffect(() => {
        getAllUsers();
    }, [])

    return (
        <div className="admin-dashboard">
            <div className="addAsset">
            <button className="btn btn-success" onClick={openModal}>
                <i class="fa-solid fa-plus"></i> Add
            </button>
            </div>
            <table className="deposit-requests">
                <thead>
                    <tr>
                        <th>Photo</th>
                        <th>Name</th>
                        <th>Designation</th>
                    </tr>
                </thead>
                <tbody className="deposit-requests__body">
                    {
                        team.map((team, index) => {
                            return (
                                <tr>
                                    <td><img src={environment.file_url + '/' + team.img} alt="" width="35px" height = "35px" className="teamProfileImage"/></td>
                                    <td>{team.name}</td>
                                    <td>{team.designation}</td>
                                </tr>
                            )
                        })
                    }
                </tbody>
            </table>
            <Modal open = {modal} onClose={handleClose}>
              <div className="modal-main">
              <div className="addAsset-modal">
              <div className="close" onClick={handleClose}><i class="fa-solid fa-circle-xmark"></i></div>
                <form>
                <div className="form-group">
                      <label htmlFor="assetIcon">Image</label>
                      <div className="inputFile">
                        <input type="file" className="form-control" id="assetIcon" placeholder="Profile Photo" onChange = {(e) => onFileChange(e)} />
                      </div>
                    </div>
                  <div className="form-group">
                    <label htmlFor="assetName">Name</label>
                    <input type="text" className="form-control" id="assetName" placeholder="Full Name" onChange = {(e) => setName(e.target.value) }/>
                  </div>
                  <div className="form-group">
                    <label htmlFor="assetName">Designation</label>
                    <input type="text" className="form-control" id="assetName" placeholder="Designation"  onChange = {(e) => setDesignation(e.target.value) }/>
                  </div>
                  <button type="button" className="btn btn-primary" onClick={onSubmit}>Add</button>
                </form>
              </div>
              </div>
            </Modal>
        </div>


    );
}

export default Team;