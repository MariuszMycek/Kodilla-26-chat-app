import React from 'react';
import styles from './MessageList.css';

const Message = props => {
  let style = styles.Message + ' ';
  if (props.from === 'System') {
    style += styles.SystemMessage;
  } else if (props.from === 'Server message') {
    style += styles.ServerMessage;
  }
  return (
    <div className={style}>
      <strong>{props.from}: </strong>
      <span>{props.text}</span>
    </div>
  );
};

const MessageList = props => (
  <div className={styles.MessageList}>
    <div className={styles.MessageWrapper}>
      {props.messages.map((message, i) => {
        return <Message key={i} from={message.from} text={message.text} />;
      })}
    </div>
  </div>
);

export default MessageList;
