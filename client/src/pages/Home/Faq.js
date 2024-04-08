import React from 'react';
import './Faq.scss';
import Footer from './Footer';
import Nav from './Nav';
import search from '../../images/search.svg';
import { useNavigate } from 'react-router-dom';

const Faq = () => {
    const Navigate = useNavigate();
    const tags = [
        "General",
        "Account and Security",
        "Investing",
        "Borrowing",
        "Deposit, Withdrawals and Exchange",
    ];
    return (
        <>

            <Nav />

            <section className='Faq'>
                <div className="Topinner">
                    <div className="searchContain">
                        <div className="searchBar">
                            <img src={search} alt="" />
                            <input type="seaech" placeholder='Search' />
                        </div>
                    </div>
                </div>

                <div className="Tags">
                    {tags.map((item, i) => {
                        return (
                            <>
                                <div className="tag" key={i} onClick={() => Navigate(`/faqdetail/${i}`)}>
                                    <p>{item}</p>
                                </div>
                            </>
                        )
                    })}
                </div>

            </section>

            <Footer />
        </>
    )
}

export default Faq
