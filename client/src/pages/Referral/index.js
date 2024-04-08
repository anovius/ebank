import { Modal } from '@material-ui/core';
import React, { useEffect, useState } from 'react'
import User from '../../api/user';
import Header from "../../components/Header";
import "./style.scss";

function Referral() {

    const [referrals, setReferrals] = useState([]);

useEffect(() => {
    User.getReferrals().then((res) => {
        setReferrals(res.data.data.referrals);
    })
}, [])

  return (
    <main className="support">
        <Header page="Referral" style={"margin-top: 100px;"} />
        <section className="content">
        <table>
        <thead>
          <tr>
            <th style={{ textAlign: "start" }}>
                ID
            </th>
            <th>
                Name
            </th>
            <th>
                Email
            </th>
          </tr>
        </thead>
        <tbody>
        {
            referrals.map((r, i) => {
                return (
                    <tr key={i}>
                        <td>
                            {i+1}
                        </td>
                        <td>
                            {r.name}
                        </td>
                        <td>
                            {r.email}
                        </td>
                    </tr>
                )
            })
        }
        </tbody>
      </table>
        </section>
    </main>
  )
}

export default Referral