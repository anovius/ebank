import { Modal } from "@material-ui/core";
import { useEffect, useState } from "react";
import Upload from "../../api/upload";
import User from "../../api/user";
import { environment } from "../../constants";

function Blogs(){
    const [blogs, setBlogs] = useState([]);
    const [modal, setModal] = useState(false);
    const [modal2, setModal2] = useState(false);
    const [image, setImage] = useState(null);
    const [title, setTitle] = useState(null);
    const [body, setBody] = useState(null);
    const [slug, setSlug] = useState(null);

    const handleClose = () => {
        setModal(false);
        setModal2(false);
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
        let data = {
            blog:{
                title: title,
                cover: image,
                body: body
            }
        }

        User.blog(data).then(res => {
            getAllBlogs();
            setModal(false);
        })
    }

    const getAllBlogs = () => {
        User.getAllBlog().then(res => {
            setBlogs(res.data.data);
        })
    }

    const deleteBlog = (slug) => {
        User.updateBlog(slug, {blog: {status: 0}}).then(res => {
            getAllBlogs();
        })
    }

    const editBlog = (blog) => {
        setTitle(blog.title);
        setBody(blog.body);
        setImage(blog.cover);
        setSlug(blog.slug);
        setModal2(true);
    }

    const onSubmitEdit = () => {
        let data = {
            blog:{
                title: title,
                cover: image,
                body: body
            }
        }
        User.updateBlog(slug, data).then(res => {
            getAllBlogs();
            handleClose();
        })
    }

    useEffect(() => {
        getAllBlogs();
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
                        <th>ID</th>
                        <th>Cover</th>
                        <th>Title</th>
                        <th>Action</th>
                    </tr>
                </thead>
                <tbody className="deposit-requests__body">
                    {
                        blogs.map((blog, index) => {
                            return (
                                <tr>
                                    <td>{index+1}</td>
                                    <td><img src={environment.file_url + '/' + blog.cover} alt="" width="35px" height = "35px" className="teamProfileImage"/></td>
                                    <td>{blog.title}</td>
                                    <td>
                                        <button className="btn btn-success" onClick={() => editBlog(blog)}>
                                            <i class="fa-solid fa-edit"></i>
                                        </button>

                                        <button className="btn btn-danger" onClick={() => deleteBlog(blog.slug)}>
                                            <i class="fa-solid fa-trash"></i>
                                        </button>
                                    </td>
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
                      <label htmlFor="assetIcon">Cover</label>
                      <div className="inputFile">
                        <input type="file" className="form-control" id="assetIcon" placeholder="Profile Photo" onChange = {(e) => onFileChange(e)} />
                      </div>
                    </div>
                  <div className="form-group">
                    <label htmlFor="assetName">Title</label>
                    <input type="text" className="form-control" id="assetName" placeholder="Blog Title" onChange = {(e) => setTitle(e.target.value) }/>
                  </div>
                  <div className="form-group">
                    <label htmlFor="assetName">Body</label>
                    <textarea className="form-control" placeholder="Blog Body"  onChange = {(e) => setBody(e.target.value) }></textarea>
                  </div>
                  <button type="button" className="btn btn-primary" onClick={onSubmit}>Add</button>
                </form>
              </div>
              </div>
            </Modal>


            <Modal open = {modal2} onClose={handleClose}>
              <div className="modal-main">
              <div className="addAsset-modal">
              <div className="close" onClick={handleClose}><i class="fa-solid fa-circle-xmark"></i></div>
                <form>
                <div className="form-group">
                      <label htmlFor="assetIcon">Cover</label>
                      <div className="inputFile">
                        <input type="file" className="form-control" id="assetIcon" placeholder="Profile Photo" onChange = {(e) => onFileChange(e)} />
                      </div>
                    </div>
                  <div className="form-group">
                    <label htmlFor="assetName">Title</label>
                    <input type="text" className="form-control" value={title} id="assetName" placeholder="Blog Title" onChange = {(e) => setTitle(e.target.value) }/>
                  </div>
                  <div className="form-group">
                    <label htmlFor="assetName">Body</label>
                    <textarea className="form-control" placeholder="Blog Body" value={body}  onChange = {(e) => setBody(e.target.value) }></textarea>
                  </div>
                  <button type="button" className="btn btn-primary" onClick={onSubmitEdit}>Update</button>
                </form>
              </div>
              </div>
            </Modal>
        </div>


    );
}

export default Blogs;