const express = require('express');
const cors = require('cors');
const mongoose = require("mongoose");
const User = require('./models/User');
const Post = require('./models/Post');
const bcrypt = require('bcryptjs');
const app = express();
const jwt = require('jsonwebtoken');
const cookieParser = require('cookie-parser');
const multer = require('multer');
const uploadMiddleware = multer({ dest: 'uploads/' });
const fs = require('fs');
const port = process.env.PORT || 5000;

const corsOptions = {
  origin: 'https://web.telegram.org', // Update with the correct origin
  optionsSuccessStatus: 200
};

app.use(cors(corsOptions));

// const salt = bcrypt.genSaltSync(10);
// const secret = 'asdfe45we45w345wegw345werjktjwertkj';

// app.use(cors({credentials:true,origin:'http://localhost:3000'}));
// app.use(express.json());
// app.use(cookieParser());
// app.use('/uploads', express.static(__dirname + '/uploads'));

// mongoose.connect('mongodb+srv://pavan147:pavan123@cluster0.xaedvyt.mongodb.net/',{
//     useNewUrlParser:true,
//     useUnifiedTopology:true
// }).then(()=>
//     console.log("DB connected")
// ).catch(err=>console.log(err))

// app.post('/register', async (req,res) => {
//   const {username,password} = req.body;
//   try{
//     const userDoc = await User.create({
//       username,
//       password:bcrypt.hashSync(password,salt),
//     });
//     res.json(userDoc);
//   } catch(e) {
//     console.log(e);
//     res.status(400).json(e);
//   }
// });

// app.post('/login', async (req,res) => {
//   const {username,password} = req.body;
//   const userDoc = await User.findOne({username});
//   const passOk = bcrypt.compareSync(password, userDoc.password);
//   if (passOk) {
//     // logged in
//     jwt.sign({username,id:userDoc._id}, secret, {}, (err,token) => {
//       if (err) throw err;
//       res.cookie('token', token).json({
//         id:userDoc._id,
//         username,
//       });
//     });
//   } else {
//     res.status(400).json('wrong credentials');
//   }
// });

// app.get('/profile', (req,res) => {
//   const {token} = req.cookies;
//   jwt.verify(token, secret, {}, (err,info) => {
//     if (err) throw err;
//     res.json(info);
//   });
// });

// app.post('/logout', (req,res) => {
//   res.cookie('token', '').json('ok');
// });

// app.post('/post', uploadMiddleware.single('file'), async (req,res) => {
//   const {originalname,path} = req.file;
//   const parts = originalname.split('.');
//   const ext = parts[parts.length - 1];
//   const newPath = path+'.'+ext;
//   fs.renameSync(path, newPath);

//   const {token} = req.cookies;
//   jwt.verify(token, secret, {}, async (err,info) => {
//     if (err) throw err;
//     const {title,summary,content} = req.body;
//     const postDoc = await Post.create({
//       title,
//       summary,
//       content,
//       cover:newPath,
//       author:info.id,
//     });
//     res.json(postDoc);
//   });

// });

// app.put('/post',uploadMiddleware.single('file'), async (req,res) => {
//   let newPath = null;
//   if (req.file) {
//     const {originalname,path} = req.file;
//     const parts = originalname.split('.');
//     const ext = parts[parts.length - 1];
//     newPath = path+'.'+ext;
//     fs.renameSync(path, newPath);
//   }

//   const {token} = req.cookies;
//   jwt.verify(token, secret, {}, async (err,info) => {
//     if (err) throw err;
//     const {id,title,summary,content} = req.body;
//     const postDoc = await Post.findById(id);
//     const isAuthor = JSON.stringify(postDoc.author) === JSON.stringify(info.id);
//     if (!isAuthor) {
//       return res.status(400).json('you are not the author');
//     }
//     await postDoc.update({
//       title,
//       summary,
//       content,
//       cover: newPath ? newPath : postDoc.cover,
//     });

//     res.json(postDoc);
//   });

// });

// app.get('/post', async (req,res) => {
//   res.json(
//     await Post.find()
//       .populate('author', ['username'])
//       .sort({createdAt: -1})
//       .limit(20)
//   );
// });

// app.get('/post/:id', async (req, res) => {
//   const {id} = req.params;
//   const postDoc = await Post.findById(id).populate('author', ['username']);
//   res.json(postDoc);
// })


//

// const TelegramBot = require('node-telegram-bot-api');

// const token = '7041763974:AAHRVMVsFza1HneXfKDifYY2or2ydoX93S8'; // Replace with your own bot token
// const bot = new TelegramBot(token, { polling: true });

// bot.on('message', (msg) => {
//   const chatId = msg.chat.id;
//   const messageText = msg.text;
//   console.log(msg.from.id)

//   if (messageText === '/start') {
//     bot.sendMessage(chatId, 'Welcome to the bot!');
//   }
  
  
// });


// app.listen(4000);

const TelegramBot = require('node-telegram-bot-api');
const { hostname } = require('os');
const token = '7041763974:AAHRVMVsFza1HneXfKDifYY2or2ydoX93S8';
const bot = new TelegramBot(token, {polling: true});

bot.on('message', (msg) => {
  const chatId = msg.chat.id;
  const messageText = msg.text;
  const userId = msg.from.id;
  const username = msg.from.username;
  console.log(userId);

  if (messageText === '/start') {
    // Create an inline keyboard with a "Play" button
    const keyboard = {
      inline_keyboard: [
        [
          {
            text: 'Play',
            callback_data: 'play'
          }
        ]
      ]
    };

    // Construct a message with the inline keyboard
    const welcomeMessage = `Welcome to the bot, ${username}!`;
    const options = {
      reply_markup: JSON.stringify(keyboard)
    };

    // Send the welcome message with the inline keyboard
    bot.sendMessage(chatId, welcomeMessage, options);
  }
});

// Handle callback queries (button clicks)
bot.on('callback_query', (query) => {
  const userId = query.from.id;
  const chatId = query.message.chat.id;
  const username = query.from.username;

  if (query.data === 'play') {
    const webAppUrl = `https://t.me/LeafMineBot/LeafMine?userId=${userId}`;
    const playMessage = `Hey ${username}, click the link below to play the game:\n${webAppUrl}`;

    bot.sendMessage(chatId, playMessage);
  }
});







