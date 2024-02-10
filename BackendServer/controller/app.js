// Admission Number : P2107967
// Name : Landicho James Evans Arvesu
// Class : DIT/FT/1B/04



const express = require('express')

// dvdAccess
const dvdDB = require('../model/dvdAccess')


// Parse input from URL to str for SQL
const bodyParser = require('body-parser')

// creating a web server
const app = express()
const urlencodedParser = bodyParser.urlencoded({ extended: false })


app.use(bodyParser.json())
app.use(urlencodedParser)

var user = require('../model/user.js');
var verifyToken = require('../auth/verifyToken.js');
var cookieParser = require('cookie-parser');

//CORS - Cross origin resource service
// SOP ( Single Origin Policy ) - will only accept query from single host - client 1 to db to client 1 only , not client 1 to db to client 2

// CORS - will accept query from other origins
var cors = require('cors');

app.options('*', cors());
app.use(cors());


// to handle image uploads
const multer = require('multer');

// where the images are stored
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, '../FrontEndServer/public/image/uploads');
    },
    filename: (req, file, cb) => {
        cb(null, `${file.originalname}`);
    },
});

const upload = multer({ storage });



// app.use(cors({
//     origin: 'http://localhost:3001',
//     credentials: true
// }));

app.use(cookieParser())

// Endpoint 1 --------------------------
app.get('/actors/:actor_id', function (req, res) {

    //pick up value of num
    const actor_id = req.params.actor_id

    // call getUser to get the user record
    dvdDB.getActorID(actor_id, function (err, result) {

        if (!err) {
            if (result.length == 0) {
                res.status(204).send();
            } else {
                res.send(result)
            }

        } else {

            // 500 - Internal Server Error
            res.status(500).send(`{"Error Msg":"Internal Server Error"}`)
        }
    })
})


// Endpoint 2 --------------------------------
app.get('/actors', function (req, res) {

    //pick up values
    var limit = req.query.limit
    var offset = req.query.offset


    dvdDB.getActors(limit, offset, function (err, result) {
        if (!err) {


            res.send(result)
        } else {
            res.status(500).send(err)
        }
    })
})


// Endpoint 3 -------------------------------


app.post('/actors', verifyToken, function (req, res) {


    var first_name = req.body.first_name;
    var last_name = req.body.last_name;

    console.log({ first_name, last_name })

    dvdDB.addActor(first_name, last_name, function (err, result) {
        if (!err) {
            if (first_name === "" || last_name === "") {
                console.log("Missing Data")
                res.status(400).send(`{"error_msg":"missing data"}`)
            } else {
                console.log(result);
                res.status(201).send(`{"actor_id":${result.insertId}}`)
            }

        }

        else {
            // 500 - Internal Server Error
            res.status(500).send(`{"Error Msg":"Internal Server Error"}`)
        }

    })


})

// Endpoint 4 ---------------------------------


app.put('/actors/:actor_id', verifyToken, function (req, res) {

    // get userid
    const actor_id = req.params.actor_id

    // update values
    var first_name = req.body.first_name;
    var last_name = req.body.last_name;

    console.log({ actor_id, first_name, last_name })

    console.log("App.js--------------------\n\n")
    console.log("Input first name " + first_name)
    console.log("Input last name " + last_name)


    console.log(actor_id)

    console.log("\n")
    // follows structure from updateUser from user.js
    dvdDB.updateActor(first_name, last_name, actor_id, function (err, result) {

        // check if actor id does not exist in database
        if (!err) {
            if (result.affectedRows == '0') {
                console.log("Record does not exist!")
                res.status(204).send("Record does not exist!")


            }



            else {
                console.log(result);
                res.status(200).send(`{"success_msg":"record updated"}`)

            }

        }

        // if actor_id no input
        else if (isNaN(actor_id)) {
            res.status(204).send("No content")
        }

        else if (first_name === undefined && last_name === undefined) {
            res.status(400).send(`{"error_msg":"missing data"}`)

        }

        else {
            if (err.errno == 1048) {
                res.status(400).send(`{"error_msg":"missing data"}`)
            }
            res.send(err.statusCode);
        }

    })

});

// Endpoint 5 ----------------------------

app.delete('/actors/:actor_id', verifyToken, function (req, res) {

    // get userid
    const actor_id = req.params.actor_id


    // follows structure from updateUser from user.js
    dvdDB.deleteActor(actor_id, function (err, result) {
        if (!err) {
            if (result.affectedRows == '0') {
                res.status(204).send("Record does not exist")
            } else {
                res.status(200).send(`{"success_msg":"actor deleted"}`)

            }




        }
        // extra 
        else if (isNaN(actor_id)) {
            res.status(204).send("No content")
        }
        else {
            res.send(err.statusCode);

        }

    })

});

// Endpoint 6 ----------------------------
app.get('/film_categories/:category_id/films', function (req, res) {

    // get cat id
    const category_id = req.params.category_id

    dvdDB.getFilmByID(category_id, function (err, result) {
        if (!err) {
            res.send(result)
        } else {
            console.log(err)

            res.status(500).send(err)
        }
    })
})

// Endpoint 7 ----------------------------
app.get('/customer/:customer_id/payment', function (req, res) {
    const customer_id = req.params.customer_id

    const start_date = req.query.start_date
    const end_date = req.query.end_date

    console.log({ customer_id, start_date, end_date })
    dvdDB.getCustomerPayment(customer_id, start_date, end_date, function (err, result) {
        if (!err) {

            var totalRent = 0;

            for (var i = 0; i < result.length; i++) {
                totalRent += result[i].amount
            }
            res.status(200).send({ "rental": result, "total": totalRent.toFixed(2) })
        } else {
            console.log(err)

            res.status(500).send(err)
        }
    })
})


// Endpoint 8 ----------------------------
app.post('/customers', verifyToken, function (req, res) {

    var store_id = req.body.store_id
    var first_name = req.body.first_name
    var last_name = req.body.last_name
    var email = req.body.email
    var address = req.body.address

    console.log({ store_id, first_name, last_name, email, address });
    // console.log(store_id + "\n" + first_name+ "\n" +last_name+ "\n" +email+ "\n" +address)

    dvdDB.addCustomer(store_id, first_name, last_name, email, address, function (err, result) {

        if (!err) {
            if (store_id === "" || first_name === "" || last_name === "" || email === "" || address === "") {
                res.status(400).send(`{"error_msg":"missing data"}`)
            } else {

                res.status(201).send(`{"customer_id":${result.insertId}}`);
            }

        } else {

            // check if email already exists
            if (err.errno == 1062) {
                res.status(409).send(`{"error_msg" :"email already exist"}`)
            } else {

                res.send(err.statusCode);

            }

        }

    })


})

// ADDITIONAL ENDPOINTS

// ADDITIONAL EP 1

// {
//     "store_id": "1",
//     "first_name":"Jabba",
//     "last_name": "the hutt",
//     "email":"Jabba_thehutt@gmail.com",
//     "address": {
//       "address_line1": "773 elm street",
//       "address_line2": "",
//       "district": "Californiasa",
//       "city_id": "4419",
//       "postal_code": "178186",
//       "phone": "6325-85196"
//     }
//   }



app.put('/customers/:address_id', verifyToken, function (req, res) {

    // update values
    var store_id = req.body.store_id
    var first_name = req.body.first_name
    var last_name = req.body.last_name
    var email = req.body.email
    var address = req.body.address



    // get customer id
    var address_id = req.params.address_id

    dvdDB.updateCustomer(store_id, first_name, last_name, email, address, address_id, function (err, result) {

        if (!err) {
            if (result.affectedRows == '0') {
                console.log("Record does not exist!")
                res.status(204).send("Record does not exist!")


            }



            else {
                console.log(result);
                res.status(200).send(`{"success_msg":"record updated"}`)

            }

        }

        // if customer_id no input
        else if (isNaN(customer_id)) {
            res.status(204).send("No content")
        }

        else {
            res.send(err.statusCode);
        }


    })
})

app.post('/user', verifyToken, function (req, res) {

    var username = req.body.username;
    var email = req.body.email;
    var role = req.body.role;
    var password = req.body.password;
    var pic = req.body.pic;

    user.addUser(username, email, role, password, pic, function (err, result) {
        if (!err) {
            res.status(200);
            res.send(result);
        } else {
            res.status(500);
            res.send("{\"message\":\"Some error!\"}");
        }
    });
});


// add film
app.post('/film', verifyToken,upload.single('image'), function (req, res) {

    var title = req.body.title
    var language_id = req.body.language_id
    var category_name = req.body.category_name
    var rating = req.body.rating
    var release_year = req.body.release_year
    var rental_duration = req.body.rental_duration
    var rental_rate = req.body.rental_rate
    var length = req.body.length
    var replacement_cost = req.body.replacement_cost
    var description = req.body.description
    var special_features = req.body.special_features
    var uploadedFile = req.file.originalname

    console.log(`uploadedFile : ${uploadedFile}`)



    //title,category_name,rating,release_year,length_duration
    // console.log(store_id + "\n" + first_name+ "\n" +last_name+ "\n" +email+ "\n" +address)
    // title, description, release_year, language_id, rental_duration, rental_rate, length, replacement_cost, rating, category_name,
    dvdDB.addFilm(title, description, release_year, language_id, rental_duration, rental_rate, length, replacement_cost, rating, special_features, category_name,uploadedFile, function (err, result) {
        if (!err) {
            if (title === "" || description === "" || release_year === "" || language_id === "" || rental_duration === "" || rental_rate === "" || length === "" || replacement_cost === "" || rating === "" || category_name === "" || special_features === "" || uploadedFile ==="") {
                res.status(400).send(`{"error_msg":"missing data"}`)
            } else {
                res.status(201).send(`{"film_id":${result.insertId}}`);
            }

        } else {

            // check if title already exists
            if (err.errno == 1062) {
                res.status(409).send(`{"error_msg" :"Duplicate entry"}`)
            } else {

                res.send(err.statusCode);

            }

        }

    })


}),


    // Login user
    app.post('/user/login', function (req, res) {
        console.log("Log in user")
        var email = req.body.email;
        var password = req.body.password;

        user.loginUser(email, password, function (err, token, result) {
            console.log(`Token : ${token}`)
            //store token in cookie *****************

            res.cookie("token", token, {

                httpOnly: true,
                secure: true,
                sameSite: 'none',
            });
            if (!err) {



                console.log(`headers: ` + req.headers)
                console.log(`Cookie token : ${req.cookies.token}`)

                res.statusCode = 200;

                res.setHeader('Content-Type', 'application/json');


                delete result[0]['password'];//clear the password in json data, do not send back to client




                res.json({ success: true, UserData: JSON.stringify(result), token: token, status: 'You are successfully logged in!' });



                res.send();
            } else {
                res.status(500);
                res.sendStatus(err.statusCode);
            }
        });
    });

// Update user details 
app.put('/user', verifyToken, function (req, res) {
    var username = req.body.username;
    var email = req.body.email;
    var role = req.body.role;


    user.updateUser(username, email, role, function (err, result) {
        if (!err) {
            console.log("Update successful");
            res.statusCode = 200;
            res.setHeader('Content-Type', 'application/json');
            res.json({ success: true, result: result, status: 'Record updated successfully!' });
        } else {
            res.status(500);
            res.send(err.statuscode);
        }
    })
});

// search by title of dvd

// app.get('/film/search', function (req, res) {

//     // get title
//     const title = req.query.title
//     const price = req.query.price
//     const category = req.query.category



//     console.log(`Query :  ${title} , ${price} , ${category}`)

//     dvdDB.getFilmByNameAndOrCategory(title, price,category, function (err, result) {
//         if (!err) {
//             console.log(result)
//             res.send(result)

//         } else {
//             console.log(err)

//             res.status(500).send(err)
//         }
//     })
// })

// get all dvd, then filter out in backend
app.get('/films/search', function (req, res) {


    dvdDB.getFilms(function (err, result) {
        if (!err) {
            console.log(result)
            res.send(result)

        } else {
            console.log(err)

            res.status(500).send(err)
        }
    })
})

app.get('/film/search', function (req, res) {

    const title = req.query.title

    console.log(`Query for DVD :  ${title} `)

    dvdDB.getFilmByName(title, function (err, result) {
        if (!err) {
            console.log(result)
            res.send(result)

        } else {
            console.log(err)

            res.status(500).send(err)
        }
    })
})

app.get('/film/search/actors', function (req, res) {

    const title = req.query.title

    console.log(`Query for DVD :  ${title} `)

    dvdDB.getActorsByFilmName(title, function (err, result) {
        if (!err) {
            console.log(result)
            res.send(result)

        } else {
            console.log(err)

            res.status(500).send(err)
        }
    })
})

// get all different category names
app.get('/film/categories', function (req, res) {
    dvdDB.getAllFilmCategories(function (err, result) {
        if (!err) {
            console.log(result)
            res.send(result)

        } else {
            console.log(err)

            res.status(500).send(err)
        }
    })
})
module.exports = app;
