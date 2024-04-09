const { faker } = require('@faker-js/faker');
const mysql = require('mysql2');
const express = require('express');


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

const q = "INSERT INTO user(id,username,email,password) VALUES ?";
const users = [[1,"Priyanshu","skwdw@gmail.com","1234"],
               [2,"Akshat","sksddw@gmail.com","1235"]];
const data = [];
for(let i=0; i<100; i++) {
    let curr = createRandomUser();
    data.push(curr);
}

try {
    connection.query(q,[data], (err,result)=>{
        if(err) throw err;
         console.log(result);
    });
} catch(err) {
    console.log(err);
}

