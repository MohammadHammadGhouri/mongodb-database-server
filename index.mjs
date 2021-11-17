import express from "express";
import cors from "cors";
import mongoose from 'mongoose';

mongoose.connect("mongodb+srv://hammad:hammad123@cluster0.j2hqn.mongodb.net/myFirstDatabase?retryWrites=true&w=majority");

const User = mongoose.model("User", {
    name: String,
    email: String,
    address: String
})

const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());
app.use(cors());
app.use((req, res, next) => {
    console.log("a request came", req.body);
    next()
});

app.use((req, res, next) => {
    console.log("A request came ", Date.now());
    next()
});


app.get('/users', (req, res) => {
    User.find({}, (err, users) => {
        if (!err) {
            res.send(users);
        } else {
            res.status(500).send("Error Happened");
        }
    });
})
app.get('/user/:id', (req, res) => {
    User.find({}, (err, users) => {
        if (!err) {
            res.send(users)
        } else {
            res.status(500).send("error happened")
        }
    });
});
app.post('/user', (req, res) => {
    if (!req.body.name || !req.body.email || !req.body.address) {
        res.status(400).send("Invalid Data");
    } else {
        const newUser = new User({
            name: req.body.name,
            email: req.body.email,
            address: req.body.address
        });
        newUser.save().then(() => {
            console.log('user created success')
            res.send("User Created Successfully");
        });
    }
})
app.put('/user/:id', (req, res) => {
    let updateObj = {}
    if (req.body.name || req.body.name == "") {
        updateObj.name = req.body.name
    }
    if (req.body.email || req.body.email == "") {
        updateObj.email = req.body.email
    }
    if (req.body.address || req.body.address == "") {
        updateObj.address = req.body.address
    }
    User.findByIdAndUpdate(req.params.id, updateObj, { new: true },
        (err, data) => {
            if (!err) {
                res.send(data)
            } else {
                res.status(500).send("error happened")
            }
        });
})

app.delete('/user/:id', (req, res) => {
    User.findByIdAndRemove(req.params.id, (err, data) => {
        if (!err) {
            res.send("user deleted")
        } else {
            res.status(500).send("error happened")
        }
    })
})

app.get('/home', (req, res) => {
    res.send('here is your home')
})
app.get('/', (req, res) => {
    res.send('Hi I am a hello world Server program by Hammad Raza')
})

app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`)
})