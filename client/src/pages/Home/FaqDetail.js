import React, { useState } from 'react';
import './FaqDetail.scss';
import Footer from './Footer';
import Nav from './Nav';
import Accordion from '@mui/material/Accordion';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';
import Typography from '@mui/material/Typography';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { useParams } from 'react-router-dom';
import { style } from '@mui/system';


const FaqDetail = () => {
    const { id } = useParams();
    const [selIndex, setSelIndex] = useState(id);
    const tags = [
        "General",
        "Account and Security",
        "Investing",
        "Borrowing",
        "Deposit, Withdrawals and Exchange",
    ];
    const questions = [
        [
            {
                q: "Why was EBankc Created?",
                a: `The company was created to provide credit
                services within the Defi markets, which has
                limited access to simple products like crypto
                lending and interest on assets. We deliver this
                through our well-organized Defi Banking
                platform.`,
            },
            {
                q: "Why EBankc?",
                a: `Whether you are interested in Defi or just looking
                for an alternative investment that yields high
                returns, EBankc is perfect for you.
                <br/>
                We have a consumer-centric structure; offer the
                best rates plus the highest degree of security in
                the Defi ecosystem. Additionally, we provide our
                services in full compliance with regulatory
                standards.
                `
            },
            {
                q: "Who can use EBankc?",
                a: `The platform is open to everyone legally
                permitted to buy, sell, exchange, and invest
                within their jurisdiction.
                <br/>
                How do | open an account and start earning interest?
                <br/>
                1) Visit www.EBankc.app to register using your
                email address.
                <br/>

                After registration,

               <br/>
                2)Complete verification. This process is
                automatic and takes just a few seconds.
                <br/>
                3)Deposit and start earning Enable 2FA.
                `,
            },
            {
                q: "What are the benefits of using EBankc?",
                a: `EBankc is a regulated financial institution
                created to provide credit services within the Defi
                markets, which has limited access to simple
                products like crypto lending and daily interest on
                your assets.
                <br/>
                EBankc provides clients with the ability to earn
                high crypto interest while holding. Interest
                compounds after 30days (monthly); this
                immensely increases the potential earnings of
                long-term holders.
                <br/>
                We also operate a fee-less crypto exchange on
                EBankc Swap.
                <br/>
                
                `,
            },

        ],
        [
            {
                q: " Is KYC compulsory?",
                a: `
                EBankc requires all users to verify identity and
                enable 2FA for extra security within the platform.
                `,
                q: "How to complete KYC level 1?",
                a: `KYC level 1 verification usually takes about 5
                minutes but might take longer in some cases.
                <br/>
                Before verification, ensure that:
                <br/>
                ‘You are at least 18 years Old
                <br/>
                ‘You are submitting a valid and unexpired
                document
                <br/>
                ‘You are submitting an original document
                <br/>
                ‘You've not already verified on EBankc.
                <br/>
                
                You will need one or two of the following
                <br/>
                documents for KYC level 1 verification:
                <br/>
                ‘National ID card
                <br/>
                
                *-Passport
                <br/>
                
                ‘Drivers license
                <br/>
                
                N/B: Documents should be visible in your
                photos.
                <br/>
                
                Verification Steps:
                <br/>
                
                ‘Log into your account and go to “Account
                verification” in your account settings.
                *Click on “Start KYC Verification 1”
                ‘Accept the terms and conditions
                <br/>
                
                *Select your Nationality
                <br/>
                
                ‘Choose document type
                <br/>
                
                -You can upload the document from your
                pictures or take a snapshot
                <br/>
                
                ‘Take a selfie of your face
                <br/>
                
                ‘Review your entered data. If correct, then
                submit verification.`,

            },
            {
                q: "How to complete KYC level 2?",
                a: `KYC level 2 verification usually takes about 24
                hours but might take longer in some cases.
                This KYC level verifies the users prove of
                residence; below are the documents required:
                ‘Bank Statements
                <br/>
                -Tax statement
                <br/>
                Utility bill
                <br/>
                ‘Document should not be more than three
                months old
                <br/>
                Before verification, ensure that :
                <br/>
                -You are at least 18 years Old
                <br/>
                -You are submitting a valid and unexpired
                document
                <br/>
                -You are submitting an original file or a high-
                resolution photo
                <br/>
                -You've not already verified on EBankc.
                <br/>
                Verification Steps:
                <br/>
                ‘Log into your account and go to “Account
                verification” in your account settings.
                <br/>
                *Go to “Start KYC Verification 2”
                <br/>
                ‘Accept the terms and conditions
                -Choose document type
                <br/>
                -You can upload the document from your
                pictures or take a snapshot the
                <br/>
                ‘Review entry and Submit.
                
                `,
            },
            {
                q: "Is 2FA Verification necessary?",
                a: `We recommend enabling 2FA for maximum
                security of your account.
                <br/>
                `,
            },
            {
                q: "How do | enable 2FA?",
                a: `To get started, follow the steps below:
                <br/>
                -Go to your Account Security settings;
                <br/>
                -Go to Enable 2FA, copy the 2FA
                <br/>
                ‘Download Google authentication app on your
                device,
                <br/>
                ‘Open the Authenticator and scan the QR code
                or manually input the code
                <br/>
                ‘Label authenticator as EBankc;
                <br/>
                ‘Set Authenticator to time-base. Google
                Authenticator will generate a six-digit code every
                30 seconds
                <br/>
                ‘Copy and Input the code into the “enter one-
                time code’ field on your app and submit;
                ‘Write down your 2FA recovery code, which will
                be used to recover your 2FA if need be.
                <br/>
                | forgot my password; how do | reset it?
                lf you forget your password follow the steps
                below to reset:
                <br/>
                ‘Go to the log-in page.
                <br/>
                ‘Under login, you will find the “Forgot Password”
                link; click on it.
                <br/>
                ‘Enter your login email address and continue
                <br/>
                -A password reset link will be sent to your email;
                open your mailbox and click on the link
                <br/>
                ‘Enter and confirm your new password
                <br/>
                How do | change my account email address?
                You will need to contact our team visit
                support@ebankc.app `,
            },
            {
                q: `How do | change my personal information;
               name, photo, address, etc?`,
                a: ` Your personal information can be changed on
                your profile.
                <br/>
            However, to change your address visit
    support@ebankc.app.
                `
            }

        ],
        [
            {
                q: "How does Ebankc Holding work?",
                a: `The EBankc Holding is an EBankc wallet feature
                that enables the user earn daily passive interest
                on their assets.
                <br/>
                <br/>
                To start earning:
                <br/>
                Deposit an asset
                <br/>
                Tap on the drop down by the side of the asset
                on your dashboard.
                <br/>
                Tap on "Hold"
                <br/>
                Enter amount and confirm
                <br/>
                After this, you interest start to accrued starting
                from the next day and it's credited to your
                account after 30 days.`,
            },
            {
                q: `What type of returns should I expect on EBankc?`,
                a: `We offer the best market yield return rates.
                For instance,
                <br/>
                On Stablecoins, we offer a minimum of 5%
                <br/>
                interest in 30 days; interest compounds every 30
                <br/>
                days. At this rate, the user earns an annual
                <br/>
                compounded interest of 81 % APY.
                <br/>
                Explore our interest rates here `,
            },
            {
                q: `How does the company generate income or
                guarantee returns?`,
                a: `Although we offer the best market interest rates,
                <br/>
                we believe in balancing the highest possible
                <br/>
                interest returns against the lowest risk
                <br/>
                opportunity. We also believe in evaluating our
                <br/>
                income/available assets against the returns paid
                <br/>
                to users; this helps us minimize losses and
                <br/>
                secure users funds.
                <br/>
                EBankc platform is designed for profitability and
                <br/>
                sustainability; we generate income from
                <br/>
                interests paid by both individual and corporate
                <br/>
                borrowers . Reserved funds from the token sale
                <br/>
                provide safety during high market volatility, It
                <br/>
                ensures a better collateral ratio when needed the
                <br/>
                most, acting as a safety cushion during a
                <br/>
                shortfall. To know more about our business
                <br/>
                model, go through the White-paper.`
                ,
            },
            {
                q: `What are the supported crypto assets?`,
                a: `We support a variety of crypto assets on EBankc
                <br/>
                and will continue to add more crypto assets. The
                <br/>
                EBankc team will notify clients through WebApp,
                <br/>
                emails, and social media platforms. Check out
                <br/>
                our supported assets and their rates..`,
            },
            {
                q: `Who manages the assets on EBankc?`,
                a: `The assets and funds on the EBankc platform
                <br/>
                are managed with premium management tools
                <br/>
                and technology by our management experts.
                <br/>
                <br/>
                Are daily gains reinvested automatically?
                <br/>
                <br/>
                No, interest accrues daily but is only paid after
                <br/>
                30days to the principal account. After interest is
                <br/>
                paid (added to the user's account balance), the
                <br/>
                total amount is compounded (starts earning
                <br/>
                interest).
                `,
            },
            {
                q: `How does compounding work?`,
                a: `Compound interest occurs
                <br/>
                when interest gets added to the principal
                <br/>
                amount invested, and then the interest rate
                <br/>
                applies to a new(more significant) balance.
                <br/>
                Practical Example 1:
                <br/>
                Mrs. Roswith deposited 10,000 USDT to her
                <br/>
                EBankc account, operating on the level four
                <br/>
                karma which offers 9% monthly interest (30
                <br/>
                days) on USDT. If stored her tokens for 365 days,
                <br/>
                let's calculate her total earnings.
                <br/>
                <br/>
                eVariables
                <br/>
                <br/>
                Compounded monthly interest (Cl) = ?
                <br/>
                Deposited Amount or Principal (P) = $1000
                <br/>
                Number of 30days in 365 = 365/30 = 12.167
                <br/>
                Monthly interest rate (R) = 9%
                <br/>
                <br/>
                Time (T) = 1 year
                <br/>
                <br/>
                eSolution
                <br/>
                Cl=P(1+R* 12.167 )412.167*n
                <br/>
                12.167
                <br/>
                Cl = $1000 (1 + 0.09 * 12.167 )412.167%1
                <br/>
                12.167
                <br/>
                <br/>
                Cl = $1000 (1 + 1.09503 )"12.167
                12.167
                <br/>
                <br/>
                <br/>
                Cl = $1000 (1 + 0.09 )"12.167
                Cl = $1000 (1.09)'12.167
                Cl = $1000 * 2.8534
                <br/>
                <br/>
                Cl = $2,853.44
                <br/>
                <br/>
                eCalculating APY for 1 year.
                <br/>
                <br/>
                Practical Example:
                <br/>
                <br/>
                Calculate the Annual percentage yield, for
                example, 1
                <br/>
                <br/>
                Solution :
                <br/>
                <br/>
                Percentage Yield
                <br/>
                = Total investment - Cost of Investment x 100
                <br/>
                Cost of Investment
                <br/>
                <br/>
                
                Yield% = 2853.36-1000 x 100
                <br/>
                1000
                <br/>
                Yield% = 1853.436 x 100
                <br/>
                1000
                <br/>
                <br/>
                
                Yield% = 185.3%
                <br/>
                <br/>
                
                Therefore he receives 185.3% APY after one
                year.
                <br/>
                
                `,
            },
            {
                q: `What is EBankc Karma?`,
                a: `A client's EBankc karma determines the interest
                <br/>
                rate he earns on his holdings. The EBankc karma
                <br/>
                depends on the number of EBCT tokens the user
                <br/>
                is holding on his account.
                <br/>
                The four levels of the EBankc karma are:
                <br/>
                <br/>
                
                eKarma level 1: Email verification is compulsory.
                <br/>
                Hold (0 - 4,999) EBCT tokens.
                <br/>
                eKarma level 2: KYC level 1 verification is
                <br/>
                compulsory. Hold (5,000 - 19,000) EBCT tokens.
                <br/>
                <br/>
                
                eKarma level 3: KYC level 2 verification is
                <br/>
                compulsory. Hold (20,000- 100,000) EBCT
                <br/>
                tokens.
                <br/>

                eKarma level 4: Hold above 100,000 EBCT tokens
                `
            }
        ],
        [
            {
                q: `How does the EBankc loan work?`,
                a: `EBankc allows you to collateralize your
               <br/>
               cryptocurrency to borrow Stable Coins. Users
               <br/>
               are eligible to borrow a loan amount of 50% of
               <br/>
               their collateral.
               `
            },
            {
                q: `What type of asset can | borrow?`,
                a: `Currently, you can only Borrow Stable Coins like
            <br/>
            USDT and USDC.`
            },
            {
                q: `How do | repay the loan?`,
                a: `We support several loan repayment options; in
               <br/>
               Stable coins, EBCT tokens, or selling the
               <br/>
               collateralised asset.
               <br/>
               <br/>
               How do | apply for a loan as a Corporate body?
               <br/>
               On the main menu go to Corporate account, fill
               <br/>
               this application form and submit.
               <br/>
               Our team will review your request and get back
               <br/>
               to you. When approved, you will receive a one-
               <br/>
               time account login, which you must change after
               <br/>
               log in.
               <br/>
               <br/>
               DEPOSITS WITHDRAWAL AND TRADE
               `
            },
            {
                q: `How do | add funds to my account?`,
                a: `To deposit into your EBankc account, follow the
               <br/>
               steps below:
               <br/>
               <br/>
               @ Log into your account
               <br/>
               <br/>
               e On your dashboard, go to “Fund Account”
               <br/>
               <br/>
               e Select asset
               <br/>
               e Copy or scan address and make transfer.
               <br/>
               Make sure you are transferring to the correct
               <br/>
               wallet.
               <br/>
               <br/>
               e The deposit reflects on account after network
               <br/>
                confirmation.
               `
            },
          

        ],
        [
            {
                q: `What is the Minimum Deposit?`,
                a: `There's no minimum deposit amount. However,
                <br/>
                you will need to have
                <br/>
                <br/>
                $500 to activate passive interest on your savings.
                <br/>
                
                `
            },
            {
                q: `How long does a crypto deposit take?`,
                a: `Deposit reflects after the cryptocurrency has
                <br/>
                completed the required block confirmation.`
            },
            {
                q: `How do I withdraw?`,
                a: `To make a withdrawal from your EBankc
                <br/>
                account, follow the steps
                <br/>
                below:
                <br/>
                • The deposit reflects on account after network
                <br/>
                confirmation.
                <br/>
               
                `
            },
            {
                q: `What is the Minimum Deposit?`,
                a: `There's no minimum deposit amount. However,
                <br/>
                you will need to have
                <br/>
                $500 to activate passive interest on your savings.
                <br/>
                How long does a crypto deposit take?
                <br/>
                Deposit reflects after the cryptocurrency has
                <br/>
                completed the required block confirmation. 
                `
            },
            {
                q: `Why EBankc Swap?`,
                a: `Thanks to the Smart Routing system, the EBankc
                <br/>
                Swap simultaneously connects to several
                <br/>
                exchanges to identify the best market price
                <br/>
                orders base on the trade volume. Plus, we offer
                <br/>
                a free crypto exchange.`
            },
            {
                q: `How do I add funds to my account?`,
                a: `To deposit into your EBankc account, follow the
                <br/>
                steps below:
                <br/>
                • Log into your account
                <br/>
                • On your dashboard, go to "Fund Account"
                <br/>
                • Select asset
                <br/>
                • Copy or scan address and make transfer.
                <br/>
                Make sure you are transferring to the correct
                <br/>
                wallet.
                <br/>
                • The deposit reflects on account after network
                <br/>
                confirmation.`
            }
        ],
        [],
    ];
    return (
        <>
            <Nav />

            <div className="FaqDetail">
                <div className="main">
                    <div className="faqLinks">
                        <a href="#">EBankc App</a>
                        <span><i className="fas fa-chevron-right"></i></span>
                        <a href="#">{tags[selIndex]}</a>

                    </div>
                    <h1>{tags[selIndex]}</h1>



                    {questions[selIndex].map((question, i) => {
                        const { q, a } = question;
                        return (
                            <>
                                <Accordion>
                                    <AccordionSummary
                                        expandIcon={<ExpandMoreIcon />}
                                        aria-controls="panel1a-content" id="panel1a-header">
                                        <Typography><div className='accord_title'>{q}</div> </Typography>
                                    </AccordionSummary>
                                    <AccordionDetails>
                                        <Typography>
                                            <div className="ans" dangerouslySetInnerHTML={{ __html: a }}></div>
                                        </Typography>
                                    </AccordionDetails>
                                </Accordion>
                            </>
                        )
                    })

                    }


                </div>
            </div>

            <Footer />
        </>
    )
}

export default FaqDetail
