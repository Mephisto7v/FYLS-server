const express = require("express");
const app = express();
const mysql = require("mysql");
const cors = require("cors");

app.use(cors());
app.use(express.json());

const db = mysql.createConnection({
    host: "localhost",
    user:"root",
    password: "Mfcmv74!",
    database: "databasewebsite"
});

mysql.createConnection({multipleStatements: true});

app.post("/api/AddUser", (req, res) => {
    const {email,mdp,prenom,nom,ville,adresse} = req.body.data;
    var admin =false;
    if(req.body.data.admin && req.body.data.admin === 'on') {
    }
    db.query(
      "INSERT INTO user (UserEmail, UserPassword, UserFirstName, UserLastName, UserCity, UserAddress,admin) VALUES (?,?,?,?,?,?,?)",
      [email, mdp, prenom, nom, ville, adresse, admin],
      (err, result) => {
        if (err) {
          console.log(err);
        } else {
          db.query("SELECT UserID, UserFirstName, admin FROM user where UserEmail=? and UserPassword=?",
            [email, mdp], 
            (err, result) => {
            if (err) {
              console.log(err);
            } else {
              res.send(result);
            }
          });
        }
      }
    )
})

app.get("/api/VerifyUser", (req, res) => {
  const email = req.query.data['email'];
  const mdp = req.query.data['mdp'];
  db.query("SELECT UserID, UserFirstName, admin FROM user where UserEmail=? and UserPassword=?",
  [email, mdp], 
  (err, result) => {
    if (err) {
      console.log(err);
    } else {
      res.send(result);
    }
  });
});

app.post("/api/addOrder", (req, res) => {
  const cart = req.body.data.objects[0];
  const userID = req.body.data.objects[1];
  const amount = req.body.data.objects[2];
  const totalQty = req.body.data.objects[3];
  let address = "";
  var city = "";
  db.query("SELECT * FROM user where UserID=?",
  [userID], 
  (err, result) => {
    if (err) {
      console.log(err);
    } else {
      address = result[0].UserAddress;
      city = result[0].UserCity;
      db.query("INSERT INTO orders (OrderUserID, OrderAmount, OrderShipAddress, OrderCity, DetailQuantity, OrderState) VALUES (?,?,?,?,?,'Commande passée')",
      [userID, amount, address, city, totalQty], 
      (err, result) => {
      if (err) {
        console.log(err);
      } else {
        for(let product of cart){
          db.query("INSERT INTO orderdetails (DetailOrderID,DetailProductID,DetailName,DetailPrice,DetailQuantity) VALUES (?,?,?,?,?)",
          [result.insertId, product.ProductID, product.ProductName, product.ProductPrice, product.qty], 
          (err, result) => {
          if (err) {
            console.log(err);
          } else {
            res.send(result);
          }
        })
          db.query("UPDATE products set ProductStock = ProductStock - ? where ProductID = ?;",
          [product.qty, product.ProductID], 
          (err, result) => {
          if (err) {
            console.log(err);
          } else {
            console.log(result);
          }
        })
      }
      }
      });
    }
  });
  
});


app.post("/api/insertProduit", (req, res) => {
  const nom = req.body.data.nom;
  const prix = req.body.data.prix;
  const stock = req.body.data.stock;
  const description = req.body.data.description;
  const fileName = req.body.file;
  db.query(
    "INSERT INTO products (ProductName, ProductPrice, ProductStock, ProductDescription, ProductImage) VALUES (?,?,?,?,?);",
    [nom, prix, stock, description, fileName],
    (err, result) => {
      if (err) {
        console.log(err);
        res.send("Une erreur est survenu lors de l'ajout du produit")
      } else {
        res.send("Le produit a été ajouter avec succès");
      }
    }
  )
})

app.get("/api/getProduct", (req, res) => {
  db.query("SELECT * FROM Products", (err, result) => {
    if (err) {
      console.log(err);
    } else {
      res.send(result);
    }
  });
});

app.get("/api/getUsers", (req, res) => {
  db.query("SELECT * FROM user", (err, result) => {
    if (err) {
      console.log(err);
    } else {
      res.send(result);
    }
  });
});

app.post("/api/deleteUser", (req, res) => {
  const UserID = req.body.data;
  db.query("DELETE FROM user where UserID = ?",[UserID], (err, result) => {
    if (err) {
      console.log(err);
    } else {
      res.send(result);
    }
  });
});

app.listen(3001, () => {
});