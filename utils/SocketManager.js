// 'use strict';

// const io = require('./socket');

// const { createUser, createMessage, createChat } = require('./Factories');

// let connectedUsers = { };

// let communityChat = createChat();

// module.exports = function(socket){
					
//   // console.log('\x1bc'); //clears console
//   console.log('Socket Id:' + socket.id);

//   let sendMessageToChatFromUser;

//   let sendTypingFromUser;

//   //Verify Username
//   socket.on('VERIFY_USER', (user)=>({
//     username:createUser({username:user.username, socketId:socket.id})
//   })
//   );

//   //User Connects with username
//   socket.on('USER_CONNECTED', (user)=>{
//     user.socketId = socket.id;
//     connectedUsers = addUser(connectedUsers, user);
//     socket.user = user;

//     sendMessageToChatFromUser = sendMessageToChat(user.username);
//     sendTypingFromUser = sendTypingToChat(user.username);

//     console.log('CONNECTED USERS FROM USER_CONNECTED',connectedUsers);
//     io.io.emit('USER_CONNECTED', connectedUsers);
//   });
	
//   //User disconnects
//   socket.on('disconnect', ()=>{
//     if('user' in socket){
//       connectedUsers = removeUser(connectedUsers, socket.user.username);

//       io.io.emit('USER_DISCONNECTED', connectedUsers);
//       console.log('Disconnect', connectedUsers);
//     }
//   });

//   //User logsout
//   socket.on('LOGOUT', ()=>{
//     connectedUsers = removeUser(connectedUsers, socket.user.username);
//     io.io.emit('USER_DISCONNECTED', connectedUsers);
//     console.log('Disconnect', connectedUsers);

//   });

//   //Get Community Chat
//   // socket.on('COMMUNITY_CHAT', (callback)=>{
//   // 	callback(communityChat)
//   // })

//   socket.on('MESSAGE_SENT', ({chatId, message})=>{
//     sendMessageToChatFromUser(chatId, message);
//   });

//   socket.on('TYPING', ({chatId, isTyping})=>{
//     sendTypingFromUser(chatId, isTyping);
//   });

//   socket.on('PRIVATE_MESSAGE', ({reciever, sender})=>{
//     console.log('RECIEVER',reciever); 
//     console.log('SENDER',sender); 
//     console.log('CONNECTED USERS', connectedUsers);
//     if(reciever in connectedUsers){
//       const newChat = createChat({ name:`Conversation between you & ${sender.firstName}`, users:[reciever, sender.username] });
//       const recieverSocket = connectedUsers[reciever].socketId;
//       socket.to(recieverSocket).emit('PRIVATE_MESSAGE', newChat);
//       socket.emit('PRIVATE_MESSAGE', newChat);
//     }
//   });
// };

// function sendTypingToChat(user){
//   return (chatId, isTyping)=>{
//     io.io.emit(`TYPING-${chatId}`, {user, isTyping});
//   };
// }

// function sendMessageToChat(sender){
//   return (chatId, message)=>{
//     console.log('CHATID BEING RECIEVED WITH NEW MESSAGE:', chatId);
//     io.io.emit(`MESSAGE_RECIEVED-${chatId}`, createMessage({message, sender}));
//   };
// }

// function addUser(userList, user) {
//   console.log('USERLIST FROM ADD USER', userList);
//   let newList = Object.assign({}, userList);
//   newList[user.username] = user; 
//   console.log('NEWLIST FROM ADD USER',newList);
//   return newList;
// }

// function removeUser(userList, username){
//   let newList = Object.assign({}, userList);
//   delete newList[username];
//   return newList;
// }

// function isUser(userList, username){
//   	return username in userList;
// }