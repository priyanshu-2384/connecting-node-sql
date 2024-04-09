const express = require('express');
const app = express();
const port = 8080;
const { faker } = require('@faker-js/faker');
const mysql = require('mysql2');
const path = require('path');
const methodOverride = require("method-override");

app.use(methodOverride("_method"));
app.use(express.urlencoded({extended : true}));
app.set('view engine', 'ejs');
app.set("views",path.join(__dirname,"/views"));
const connection = mysql.createConnection({
    host : 'localhost',
    user : 'root',
    database : 'delta_app',
    password : 'Priyanshu#23'
});

const createRandomUser = () => {
    return [
      faker.datatype.uuid(),
      faker.internet.userName(),
      faker.internet.email(),
      faker.internet.password()
    ];
  };

app.listen(port, () => {
    console.log('Server is running on port 8080');
});

//Home route
app.get("/", (req,res) => {
    let q = 'SELECT count(*) FROM user';
    try {
        connection.query(q,(err,result)=>{
            if(err)throw err;
            let count = result[0]['count(*)'];
            res.render('home.ejs',{ count });
        });
    } catch(err) {
        console.log(err);
        res.send("Some err in database");
    }
});

//Users data route
app.get("/users", (req,res) => {
    let q = 'SELECT * FROM user';
    try {
        connection.query(q,(err,users)=>{
            if(err) throw err;
            res.render('users.ejs',{ users });
        });
    } catch(err) {
        console.log(err);
        res.send("Some err in database");
    }
});

app.get("/users/:id/edit",(req,res) => {
    let {id} = req.params;
    let q = `SELECT * FROM user WHERE id="${id}"`;
    try {
        connection.query(q,(err,result)=>{
            if(err) throw err;
            let user = result[0];
            res.render("edit.ejs",{user});
        });
    } catch(err) {
        console.log(err);
        res.send("Some err in database");
    }
});

//Update routein database
app.patch("/users/:id", (req,res) => {
    let {id} = req.params;
    let q = `SELECT * FROM user WHERE id="${id}"`;
    let {password : formPassword, username:newUsername} = req.body;
    try {
        connection.query(q,(err,result)=>{
            if(err) throw err;
            let user = result[0];
            console.log(result);
            console.log(formPassword);
            console.log(user.PASSWORD);
            console.log(user.email);
            if(formPassword!=user.PASSWORD) {
                res.send("Wrong Password");
            } else {
                let q2 = `UPDATE user SET username='${newUsername}' WHERE id='${id}'`
                try {
                    connection.query(q2, (err,result)=>{
                        if(err) throw err;
                        res.redirect("/users");
                    });
                } catch(err) {
                    console.log(err);
                    res.send("Some err in database");
                }
            }
        });
    } catch(err) {
        console.log(err);
        res.send("Some err in database");
    }
});