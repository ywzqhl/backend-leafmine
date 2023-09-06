const express =require('express');
const mongoose= require('mongoose');
const app = express();
const cors = require('cors');
app.use(cors());
const {Donate,User,Request} = require("./model");
const jwt =require('jsonwebtoken');
const middleware = require('./middleware');
// const User = require("./model");
app.use(express.json())
const port = process.env.PORT || 5000
// app.use(cors());
mongoose.connect('mongodb+srv://pavan147:pavan123@cluster0.xaedvyt.mongodb.net/',{
    useNewUrlParser:true,
    useUnifiedTopology:true
}).then(()=>
    console.log("DB connected")
).catch(err=>console.log(err))

app.get('/',(req,res)=>{
    res.send("hello world");
})
app.post('/donation', async(req,res)=>{
    const {name,mobilenumber,address,bloodtype} =req.body;
    try{
        const newData = new Donate({name:name,mobilenumber:mobilenumber,address:address,bloodtype:bloodtype});
        await newData.save();
        return res.json(await Donate.find());
        console.log(req.body);
        // const data = JSON.parse(response.data);
        // console.log(data)


    }
    catch(err){
        console.log(err)
    }

})
app.post('/request', async(req,res)=>{
    const {name,mobilenumber,address,bloodtype} =req.body;
    try{
        const newData = new Request({name:name,mobilenumber:mobilenumber,address:address,bloodtype:bloodtype});
        await newData.save();
        return res.json(await Request.find());
        console.log(req.body);
        // const data = JSON.parse(response.data);
        // console.log(data)


    }
    catch(err){
        console.log(err)
    }

})
app.post('/user', async(req, res) => {
    try {
        const { email, password } = req.body;
        const existingUser = await User.findOne({ email });

        if (!existingUser) {
            return res.status(400).send("User does not exist");
        }

        if (existingUser.password !== password) {
            return res.status(400).send("Invalid credentials");
        }

        let payload = {
            user: {
                id: existingUser._id
            }
        }

        jwt.sign(payload, 'jwtPassword', { expiresIn: 3600000000 }, (err, token) => {
            if (err) throw err;
            res.json({
                message: "Login Success",
                token: token
            });
        });

    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
});
app.post('/register', async(req,res)=>{
    const {firstname,lastname,email,password} =req.body;
    try{
        const newData = new User({firstname:firstname,lastname:lastname,email:email,password:password});
        await newData.save();
        return res.json(await User.find());
        console.log(req.body);
        // const data = JSON.parse(response.data);
        // console.log(data)


    }
    catch(err){
        console.log(err)
    }

})
app.get('/login', async(req,res)=>{
    console.log('Inside /donation route')
    try{
        const da = await User.find();
        return res.json(da);

    }
    catch(err){
        console.log(err);
    }

})
app.get('/myprofile',middleware, async(req,res)=>{
    console.log('Inside /donation route')
    try{
        const data = await User.findById(req.user.id);
        return res.json(data);

    }
    catch(err){
        console.log(err);
    }

})
app.get('/donate', async(req,res)=>{
    try{
        const donation = await Donate.find();
        return res.json(donation);

    }
    catch(err){
        console.log(err);
    }

})
app.get('/requestdata', async(req,res)=>{
    try{
        const requestdata = await Request.find();
        return res.json(requestdata);

    }
    catch(err){
        console.log(err);
    }

})
app.listen(port,()=>
console.log("server running..")
)