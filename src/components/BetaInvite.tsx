import React, { useRef, useState } from 'react';
import emailjs from '@emailjs/browser';
import "./BetaInvite.css"

function BetaInvite() {
    const [signUp, setSignUp] = useState(false)
    const signedUp = () => setSignUp(true)

    const form = useRef();
    /* const sendEmail = (e: any) => {
        e.preventDefault();

        emailjs.sendForm("service_ftaajgg", "template_mizgh86", form.current, "p2SCl2yxugtT4mMcC")
            .then((result) => {
                console.log(result.text);
            }, (error) => {
                console.log(error.text);
            });
    }; */
    return (
        <div className="beta-invite-container">
            <div className="beta-invite-container-strip">
            </div>
            {/* <div className={!signUp ? "beta-invite-container-join" : "beta-invite-container-join-hidden"}>
                <h1>We are in private beta. To join our waitlist, add your email below. No spam, only an invitation to start investing in Polybit DETFs.</h1>
                <form className="beta-invite-container-join-form" ref={form} onSubmit={sendEmail}>
                    <input className="invite-input" type="email" name="user_email" placeholder="Input your email" />
                    <button className="btn-black" type="submit" value="Send" onClick={signedUp}>Join&nbsp;&nbsp;<i class="fa-solid fa-right-long"></i></button>
                </form>
            </div> */}
            <div className={signUp ? "beta-invite-container-thanks" : "beta-invite-container-thanks-hidden"}>
                <h1>Thanks for your interest in Polybit. We can't wait to extend an invite to you in the near future.</h1>
            </div>
        </div>
    )
}

export default BetaInvite