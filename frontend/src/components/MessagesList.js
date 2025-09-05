import { useState } from "react";
import PropTypes from "prop-types";

export default function MessagesList({ messages=[], onSend }){
  const [text,setText]=useState("");
  const valid=text.trim().length>=2;

  function send(e){
    e.preventDefault();
    if(!valid) return;
    onSend?.({who:"u1",text:text.trim(),at:new Date().toISOString()});
    setText("");
  }

  return (
    <section className="card card-pad grid">
      <h3 className="m0">Messages</h3>
      <ul className="list">
        {messages.map((m,i)=>(
          <li key={i} className="msg-item">
            <div className={`msg ${m.who==="u1"?"msg-me":""}`}>
              <strong>{m.who}</strong>: {m.text}
            </div>
          </li>
        ))}
      </ul>
      <form className="form mt2" onSubmit={send}>
        <label className="label" htmlFor="msg">Check-in message</label>
        <input id="msg" className={`input ${!valid && text ? "is-invalid":""}`}
               placeholder="Write an update…" value={text} onChange={e=>setText(e.target.value)}/>
        <div className="flex">
          <button className="btn btn-primary" type="submit" disabled={!valid}>Post</button>
          <span className="help">Minimum 2 characters.</span>
        </div>
      </form>
    </section>
  );
}
MessagesList.propTypes={ messages:PropTypes.array, onSend:PropTypes.func };
