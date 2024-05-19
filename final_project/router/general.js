const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();

const doesExist = (username)=>{
    let userswithsamename = users.filter((user)=>{
      return user.username === username
    });
    if(userswithsamename.length > 0){
      return true;
    } else {
      return false;
    }
  }

public_users.post("/register", (req,res) => {
    const username = req.body.username;
    const password = req.body.password;
    if (username && password) {
      if (!doesExist(username)) {
        users.push({"username":username,"password":password});
        return res.status(200).json({message: "User successfully registred. Now you can login"});
      } else {
        return res.status(404).json({message: "User already exists!"});
      }
    }
    return res.status(404).json({message: "Unable to register user."});
});

// Get the book list available in the shop
public_users.get('/',function (req, res) {
    new Promise((resolve, reject) => {
        resolve(books);
      }).then((data) => {
        res.status(200).json(data);
      }).catch((error) => {
        res.status(500).json({ message: "Error fetching books", error });
      });
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn',function (req, res) {
    const isbn = req.params.isbn;

  new Promise((resolve, reject) => {
    if (books[isbn]) {
      resolve(books[isbn]);
    } else {
      reject('Book not found');
    }
  }).then((data) => {
    res.status(200).json(data);
  }).catch((error) => {
    res.status(404).json({ message: error });
  });
 });
  
// Get book details based on author
public_users.get('/author/:author',function (req, res) {
  const author = req.params.author
  let filtered = Object.values(books).filter((book)=> book.author === author)
  res.send(filtered)
});

// Get all books based on title
public_users.get('/title/:title',function (req, res) {
    const title = req.params.title;

    new Promise((resolve, reject) => {
      const book = Object.values(books).find(b => b.title === title);
      if (book) {
        resolve(book);
      } else {
        reject('Book not found');
      }
    }).then((data) => {
      res.status(200).json(data);
    }).catch((error) => {
      res.status(404).json({ message: error });
    });
});

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
  const review = req.params.review
  const isbn = req.params.isbn
  res.send(books[isbn].reviews)
});

module.exports.general = public_users;
