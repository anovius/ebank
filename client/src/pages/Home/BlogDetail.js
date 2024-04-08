import React, { useState, useEffect } from "react";
import "./BlogDetail.scss";
import Nav from "./Nav";
import Footer from "./Footer";
import moneyBg from "../../images/money.jpg";
import User from "../../api/user";
import { environment } from "../../constants";
import { useParams } from "react-router-dom";

function BlogDetail() {  
  const [blog, setBlog] = useState({});
  const {slug} = useParams();
  const getBlog = () => {
    User.getBlog(slug).then((res) => {
        setBlog(res.data.data);
    })
  };

  useEffect(() => {
    getBlog();
  }, []);

  return (
    <>
      <Nav />

      <div className="posts-outer">
        <section className="posts">
          <div className="mainPost">
            <div className="blogPost">
              <section
                className="titleSection"
                style={{
                  background: `linear-gradient(180deg, rgba(1, 50, 32, 0), #013220),url("${
                    environment.file_url + "/" + blog?.cover
                  }")`,
                  borderRadius: "0.5rem 0.5rem 0 0",
                }}
              >
                <h1>{blog?.title}</h1>
              </section>

              <section className="textSection">
              <div className="overGradient" />
              </section>
              </div>
              <p>{blog?.body}</p>
          </div>
        </section>
      </div>

      <Footer />
    </>
  );
}

export default BlogDetail;
