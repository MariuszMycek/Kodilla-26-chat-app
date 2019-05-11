import React, { Component } from 'react';
import { hot } from 'react-hot-loader';
import io from 'socket.io-client';
import styles from './App.css';

import MessageForm from './MessageForm';
import MessageList from './MessageList';
import UsersList from './UsersList';
import UserForm from './UserForm';

const socket = io('/');

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      users: [],
      messages: [],
      text: '',
      name: ''
    };
  }

  componentDidMount() {
    socket.on('message', message => this.messageReceive(message));
    socket.on('update', ({ users }) => this.chatUpdate(users));
    socket.on('disconnect', () => this.handleDisconnect());
    socket.on('reconnecting', () => this.handleReconecting());
    socket.on('reconnect', () => this.handleReconnect());
  }

  messageReceive(message) {
    const messages = [message, ...this.state.messages];
    this.setState({ messages });
  }

  chatUpdate(users) {
    this.setState({ users });
  }

  handleMessageSubmit(message) {
    const messages = [message, ...this.state.messages];
    this.setState({ messages });
    socket.emit('message', message);
  }

  handleUserSubmit(name) {
    if (name !== '') {
      this.setState({ name });
      socket.emit('join', name);
    }
  }
  handleDisconnect() {
    if (this.state.name !== '') {
      const disconnectMessage = {
        from: 'System',
        text: 'Disconnected from chat...'
      };
      const messages = [disconnectMessage, ...this.state.messages];
      this.setState({ messages });
    }
  }

  handleReconecting() {
    if (this.state.name !== '') {
      const reconnectingMessage = {
        from: 'System',
        text: 'Reconnecting...'
      };
      const messages = [reconnectingMessage, ...this.state.messages];
      this.setState({ messages });
    }
  }

  handleReconnect() {
    if (this.state.name !== '') {
      const reconnectMessage = {
        from: 'System',
        text: 'Reconnected to server!'
      };
      const messages = [reconnectMessage, ...this.state.messages];
      this.setState({ messages });
      socket.emit('join', this.state.name);
    }
  }

  render() {
    return this.state.name !== '' ? this.renderLayout() : this.renderUserForm();
  }

  renderLayout() {
    return (
      <div className={styles.App}>
        <div className={styles.AppHeader}>
          <div className={styles.AppTitle}>Chat App</div>
          <div className={styles.AppRoom}>App room</div>
        </div>
        <div className={styles.AppBody}>
          <UsersList users={this.state.users} name={this.state.name} />
          <div className={styles.MessageWrapper}>
            <MessageList messages={this.state.messages} />
            <MessageForm
              onMessageSubmit={message => this.handleMessageSubmit(message)}
              name={this.state.name}
            />
          </div>
        </div>
      </div>
    );
  }
  renderUserForm() {
    return <UserForm onUserSubmit={name => this.handleUserSubmit(name)} />;
  }
}

export default hot(module)(App);
