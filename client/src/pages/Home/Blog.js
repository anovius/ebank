import React, { useEffect, useState } from "react";
import './Blog.scss';
import Nav from "./Nav";
import Footer from './Footer';
import { Link } from 'react-router-dom'
import moneyBg from '../../images/money.jpg'
import User from "../../api/user";
import { environment } from "../../constants";

function Blog({ post, mini = false, noBottomText = false }) {

    const tags = [
        "EBankc Update",
        "EBCT News",
        "DeFi News",
        "Crypto New",
        "EBankc University",
        "EBankc Business",
    ];

    const mainPost = {
        title: "How stablecoins can help you increase ebtc in a bear market",
        text: "Traditional and digital assets are in a bear market due to rising inflation and threat of interest rate hikes from the US Federal Reserve",
        link: "stablecoins increase ebtc in bear market",
        img: "money.jpg",
    };

    const subPosts = [
        {
            title:
                "Why stablecoins are making the news: PayPal and the future of money",
            text: "PayPal has been in the news with plans to issue its own stablecoin",
            link: "stablecoins are making the news",
            img: "money.jpg",
        },
        {
            title: "EBankc App celebrates V2 launch with 20% YLD lock-up promotion!",
            text: "Today marks a momentous occasion in the history of EBankc App as we launch what many of us have been excitedly anticipating",
            link: "EBankc app celebrates v2 launch",
            img: "money.jpg",
        },
    ];

    const allPosts = [
        {
            title:
                "Why stablecoins are making the news: PayPal and the future of money",
            text: "PayPal has been in the news with plans to issue its own stablecoin",
            link: "stablecoins are making the news",
            img: "money.jpg",
        },
        {
            title: "EBankc App celebrates V2 launch with 20% YLD lock-up promotion!",
            text: "Today marks a momentous occasion in the history of EBankc App as we launch what many of us have been excitedly anticipating",
            link: "stablecoins are making the news",
            img: "money.jpg",
        },
        {
            title:
                "Why stablecoins are making the news: PayPal and the future of money",
            text: "PayPal has been in the news with plans to issue its own stablecoin",
            link: "stablecoins are making the news",
            img: "money.jpg",
        },
        {
            title: "EBankc App celebrates V2 launch with 20% YLD lock-up promotion!",
            text: "Today marks a momentous occasion in the history of EBankc App as we launch what many of us have been excitedly anticipating",
            link: "stablecoins are making the news",
            img: "money.jpg",
        },
        {
            title:
                "Why stablecoins are making the news: PayPal and the future of money",
            text: "PayPal has been in the news with plans to issue its own stablecoin",
            link: "stablecoins are making the news",
            img: "money.jpg",
        },
        {
            title: "EBankc App celebrates V2 launch with 20% YLD lock-up promotion!",
            text: "Today marks a momentous occasion in the history of EBankc App as we launch what many of us have been excitedly anticipating",
            link: "stablecoins are making the news",
            img: "money.jpg",
        },
    ];
    const bg = `linear-gradient(180deg, rgba(1, 50, 32, 0), #013220),url("${moneyBg}")`;

    const [blogs, setBlogs] = useState([]);

    const getAllBlogs = () => {
        User.getAllBlog().then(res => {
            setBlogs(res.data.data);
        })
    }

    useEffect(() => {
        getAllBlogs();
    }, []);

    return (
        <>
            <Nav />

            <div className="blog">
                <section>
                    <h1>Blog</h1>
                    <p>Stay Updated with EBankc</p>
                </section>

                <section className="tags">
                    <h2>Tags</h2>
                    <div className="tagGrid">
                        {tags.map((tag, i) => (
                            <div key={i} className="tag">
                                <p>{tag}</p>
                            </div>
                        ))}
                    </div>
                </section>

                <section className="posts">
                    <div className="mainPost">
                        {blogs.length > 0 && <Link to={"/blog/detail/"+blogs[0].slug}>
                            <div className="blogPost">
                                <section
                                    className="titleSection"
                                    style={{
                                        background: `linear-gradient(180deg, rgba(1, 50, 32, 0), #013220),url("${environment.file_url + '/' + blogs[0]?.cover}")`,
                                        borderRadius: "0.5rem 0.5rem 0 0"
                                    }}
                                >
                                    <h1>{blogs[0]?.title}</h1>
                                </section>

                                <section className="textSection">
                                    <p>{blogs[0]?.body}</p>
                                    <div className="overGradient" />
                                </section>
                            </div>
                        </Link>}

                        <div className="subPosts">
                            {blogs.map((post, i) => (
                                i>0 &&
                                <Link to={"/blog/detail/"+post.slug}>
                                <div className="blogPost" key={i}>

                                    <section
                                        className="titleSection"
                                        style={{
                                            background: `linear-gradient(180deg, rgba(1, 50, 32, 0), #013220),url("${environment.file_url + '/' + post?.cover}")`,
                                            borderRadius: "0.5rem 0.5rem 0 0"
                                        }}
                                    >
                                        <h1>{post.title}</h1>
                                    </section>

                                    <section className="textSection">
                                        <p>{post.body}</p>
                                        <div className="overGradient" />
                                    </section>
                                </div>
                                </Link>
                            ))}
                        </div>
                    </div>

                </section>


            </div>


            <Footer />
        </>
    );
}

export default Blog;