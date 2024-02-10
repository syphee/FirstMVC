// Admission Number : P2107967
// Name : Landicho James Evans Arvesu
// Class : DIT/FT/1B/04




const { query } = require("express")
const db = require("./databaseConfig")

const dvdDB = {

    // EP 1
    getActorID: function (actor_id, callback) {
        const conn = db.getConnection()

        conn.connect(function (err) {

            // Connecting to database
            if (err) {
                console.log("Error connecting to database")

                return callback(err, null)
            } else {
                // SQL accessed
                console.log("Getting DB..")

                const sql = 'select actor_id,first_name,last_name from bed_dvd_db.actor where actor_id = ?'

                conn.query(sql, [actor_id], function (err, result) {
                    conn.end()

                    if (err) {
                        console.Log(err)
                        return callback(err, null)

                    } else {
                        return callback(null, result)
                        // if (result.length == 0) {
                        //     return callback(err, null)
                        // } else {
                        //     console.log(result)
                        //     return callback(null, result)
                        // }
                    }


                })
            }
        })
    },

    // EP 2
    // put + limit inside sql str because of sql injection
    getActors: function (limit, offset, callback) {
        const conn = db.getConnection()

        conn.connect(function (err) {
            if (err) {
                console.log(err)

                return callback(err, null)
            } else {
                console.log("Getting DB..")
                // parse input from str to int

                limit = parseInt(limit)
                offset = parseInt(offset)

                // set default values
                if (limit == null || limit == "" || isNaN(limit)) {
                    limit = 20
                }
                if (offset == null || offset == "" || isNaN(offset)) {
                    offset = 0
                }
                var sql = 'select * from bed_dvd_db.actor order by first_name asc limit ? offset ?'

                conn.query(sql, [limit, offset], function (err, result) {
                    conn.end()

                    if (err) {
                        console.log(err)
                        return callback(err, null)
                    } else {
                        return callback(null, result)
                    }
                })
            }
        })
    },
    // EP 3
    addActor: function (first_name, last_name, callback) {
        var conn = db.getConnection();

        conn.connect(function (err) {
            if (err) {
                console.log(err)
                return callback(err, null);
            } else {
                console.log("Posting db...")

                var sql = 'insert into bed_dvd_db.actor (first_name,last_name) values (?,?)'

                conn.query(sql, [first_name, last_name], function (err, result) {
                    conn.end();

                    if (err) {
                        console.log(err);
                        return callback(err, null);

                    } else {

                        console.log(result.InsertId);

                        return callback(null, result);

                    }
                })
            }
        })
    },

    // EP 4
    updateActor: function (first_name, last_name, actor_id, callback) {

        var conn = db.getConnection();

        conn.connect(function (err) {
            if (err) {
                console.log(err);
                return callback(err, null);
            }
            else {
                console.log("Connected!");

                console.log("dvdAccess--------------------\n\n")
                console.log(first_name)
                console.log(last_name)

                console.log(actor_id)


                console.log("\n---------------------------")
                // check if nan
                console.log("Last name undefined? : " + last_name === undefined)
                console.log("First name undefined? : " + first_name === undefined)


                if (first_name === undefined || first_name == "") {

                    var sql = 'Update bed_dvd_db.actor set last_name=? where actor_id=?'

                    conn.query(sql, [last_name, actor_id], function (err, result) {
                        conn.end();

                        if (err) {
                            console.log(err);
                            return callback(err, null);

                        } else {

                            console.log(result);

                            return callback(null, result);

                        }
                    });
                }

                // if last name no input
                else if (last_name === undefined || last_name == "") {

                    var sql = 'Update bed_dvd_db.actor set first_name=? where actor_id=?'

                    conn.query(sql, [first_name, actor_id], function (err, result) {
                        conn.end();

                        if (err) {
                            console.log(err);
                            return callback(err, null);

                        } else {

                            console.log(result);

                            return callback(null, result);

                        }
                    });

                    // if first name and last name exists
                } else if (last_name !== undefined && first_name !== undefined || first_name != "" && last_name != "") {
                    var sql = 'Update bed_dvd_db.actor set first_name=?,last_name=? where actor_id=?'

                    conn.query(sql, [first_name, last_name, actor_id], function (err, result) {
                        conn.end();

                        if (err) {
                            console.log(err);
                            return callback(err, null);

                        } else {

                            console.log(result);

                            return callback(null, result);

                        }
                    });

                    // if is inside body but no input letters
                } else if (last_name.length == 0 || first_name.length == 0) {
                    return callback(err, null)
                }




            }

        });
    },

    // EP 5
    deleteActor: function (actor_id, callback) {

        var conn = db.getConnection();

        conn.connect(function (err) {
            if (err) {
                console.log(err);
                return callback(err, null);
            }
            else {
                console.log("Connected!");

                var sql = 'Delete from bed_dvd_db.actor where actor_id=?'

                conn.query(sql, [actor_id], function (err, result) {
                    conn.end();

                    if (err) {
                        console.log(err);
                        return callback(err, null);

                    } else {

                        return callback(null, result);

                    }
                });

            }

        });
    },

    // EP 6
    getFilmByID: function (category_id, callback) {
        const conn = db.getConnection()

        conn.connect(function (err) {
            if (err) {
                console.log("Error connecting to database")
                return callback(err, null)
            } else {
                // SQL Commands
                console.log("Getting DB..")
                // const sql = 'select * from category where cat_id =?'
                const sql = 'select film.film_id, film.title,category.name as category, rating, release_year, length as duration from film , category,film_category where film_category.category_id = ? and film.film_id = film_category.film_id and category.category_id = film_category.category_id'
                conn.query(sql, [category_id], function (err, result) {
                    conn.end()

                    if (err) {
                        console.log(err)
                        return callback(err, null)
                    } else {
                        console.log()
                        return callback(null, result)
                    }
                })

            }
        })
    },

    getFilms:function(callback){
        const conn = db.getConnection()

        conn.connect(function(err){
            if(err){
                console.log("Error connecting to database")
                return callback(err,null)
            }else{
                const sql = 'select film.film_id, film.title,category.name as category, rating, release_year, length as duration , film.rental_rate from film , category,film_category where  film_category.category_id = category.category_id and film.film_id = film_category.film_id and category.category_id = film_category.category_id '
                conn.query(sql,function(err,result){
                    conn.end()

                    if(err){
                        console.log(err)
                        return callback(err,null)
                    }else{
                        console.log(result)
                        return callback(null,result)
                    }
                })
            }
        })
    },
    // getFilmByName:function(name,callback){
    //     const conn = db.getConnection()

    //     conn.connect(function(err){
    //         if(err){
    //             console.log("Error connecting to database")
    //             return callback(err,null)
    //         }else{
    //             const sql = 'select film.film_id, film.title,film.description as description,category.name as category, rating,actor.first_name,actor.last_name, release_year, length as duration , film.rental_rate , film.replacement_cost,film.special_features,film.last_update from film ,actor, category,film_category,film_actor where film_category.category_id = category.category_id and film.film_id = film_category.film_id and category.category_id = film_category.category_id and actor.actor_id = film_actor.actor_id and film_actor.film_id = film.film_id and title = ?'
    //             conn.query(sql,[name],function(err,result){
    //                 conn.end()

    //                 if(err){
    //                     console.log(err)
    //                     return callback(err,null)
    //                 }else{
    //                     console.log(result)
    //                     return callback(null,result)
    //                 }
    //             })
    //         }
    //     })
    // },
    //               
    //select distinct film.film_id, film.title,film.description as description,category.name as category, rating, release_year, length as duration , film.rental_rate , film.replacement_cost,film.special_features,film.last_update from film ,actor, category,film_category,film_actor where film_category.category_id = category.category_id and film.film_id = film_category.film_id and category.category_id = film_category.category_id and title = "AMADEUS HOLY"
    getFilmByName:function(name,callback){
        const conn = db.getConnection()

        conn.connect(function(err){
            if(err){
                console.log("Error connecting to database")
                return callback(err,null)
            }else{
                const sql = 'select distinct film.film_id, film.title,film.description as description,category.name as category, rating, release_year, length as duration , film.rental_rate , film.replacement_cost,film.special_features,film.last_update,film.pic from film ,actor, category,film_category,film_actor where film_category.category_id = category.category_id and film.film_id = film_category.film_id and category.category_id = film_category.category_id and title = ?'
                conn.query(sql,[name],function(err,result){
                    conn.end()

                    if(err){
                        console.log(err)
                        return callback(err,null)
                    }else{
                        console.log(result)
                        return callback(null,result)
                    }
                })
            }
        })
    },
    
    getActorsByFilmName:function(name,callback){
        const conn = db.getConnection()

        conn.connect(function(err){
            if(err){
                console.log("Error connecting to database")
                return callback(err,null)
            }else{
                const sql = 'select first_name,last_name from actor,film,film_actor where film.film_id = film_actor.film_id and film_actor.actor_id = actor.actor_id and film.title = ?'
                conn.query(sql,[name],function(err,result){
                    conn.end()

                    if(err){
                        console.log(err)
                        return callback(err,null)
                    }else{
                        console.log(result)
                        return callback(null,result)
                    }
                })
            }
        })
    },

    // search api

    // getFilmByNameAndOrCategory: function (name, price, category, callback) {
    //     const conn = db.getConnection()

    //     conn.connect(function (err) {
    //         if (err) {
    //             console.log("Error connecting to database")
    //             return callback(err, null)
    //         } else {

    //             if (name != '' && price != '' && category != '') {
    //                 console.log("Query for name and price and category")
    //                 console.log(`Name : ${name} , Price : ${price} , Category : ${category}`)
    //                 // SQL Commands
    //                 console.log("Getting DB..")
                    

    //                 // parse name search to allow %% to work
    //                 const keyword = ("%" + name + "%")

    //                 const sql = 'select film.film_id, film.title,category.name as category, rating, release_year, length as duration , film.rental_rate from film , category,film_category where film.title like ? and film.rental_rate < ? and category.name = ? and film_category.category_id = category.category_id and film.film_id = film_category.film_id and category.category_id = film_category.category_id  '
    //                 conn.query(sql, [keyword, price, category], function (err, result) {
                        
    //                     conn.end()

    //                     if (err) {
    //                         console.log(err)
    //                         return callback(err, null)
    //                     } else {
    //                         console.log(result)
    //                         return callback(null, result)
    //                     }
    //                 })
    //             }



    //             else if (category == '') {

    //                 if (price != '') {
    //                     console.log("Query for name and price only")
    //                     console.log(`Name : ${name} , Price : ${price}`)
    //                     // SQL Commands
    //                     console.log("Getting DB..")
    //                     // const sql = 'select * from category where cat_id =?'

    //                     // parse name search to allow %% to work
    //                     const keyword = ("%" + name + "%")

    //                     const sql = 'select film.film_id, film.title,category.name as category, rating, release_year, length as duration , film.rental_rate from film , category,film_category where film.title like "%?%" and film.rental_rate < ? and film_category.category_id = category.category_id and film.film_id = film_category.film_id and category.category_id = film_category.category_id '
    //                     conn.query(sql, [keyword,price], function (err, result) {
    //                         conn.end()

    //                         if (err) {
    //                             console.log(err)
    //                             return callback(err, null)
    //                         } else {
    //                             console.log()
    //                             return callback(null, result)
    //                         }
    //                     })
    //                 } 
    //                 else {
    //                     console.log("Query for name only")
    //                     console.log(`Name : ${name}`)
    //                     // SQL Commands
    //                     console.log("Getting DB..")
    //                     // const sql = 'select * from category where cat_id =?'
    //                     // parse name search to allow %% to work
    //                     const keyword = ("%" + name + "%")

    //                     const sql = 'select film.film_id, film.title,category.name as category, rating, release_year, length as duration , film.rental_rate from film , category,film_category where film.title like "%?%"  and film_category.category_id = category.category_id and film.film_id = film_category.film_id and category.category_id = film_category.category_id '
    //                     conn.query(sql, [keyword], function (err, result) {
    //                         conn.end()

    //                         if (err) {
    //                             console.log(err)
    //                             return callback(err, null)
    //                         } else {
    //                             console.log()
    //                             return callback(null, result)
    //                         }
    //                     })
    //                 }

    //             }
    //             else if (name == '') {

    //                 if (price != '') {
    //                     console.log("Query for category and price only")
    //                     console.log(`Name : ${category} , Price : ${price}`)
    //                     // SQL Commands
    //                     console.log("Getting DB..")
    //                     // const sql = 'select * from category where cat_id =?'
    //                     const sql = 'select film.film_id, film.title,category.name as category, rating, release_year, length as duration , film.rental_rate from film , category,film_category where category.name = ? and film.rental_rate < ? and film_category.category_id = category.category_id and film.film_id = film_category.film_id and category.category_id = film_category.category_id '
    //                     conn.query(sql, [category,price], function (err, result) {
    //                         conn.end()

    //                         if (err) {
    //                             console.log(err)
    //                             return callback(err, null)
    //                         } else {
    //                             console.log()
    //                             return callback(null, result)
    //                         }
    //                     })
    //                 } else{
    //                     console.log("Query for category only")
    //                     console.log(`Name : ${category}`)
    //                     // SQL Commands
    //                     console.log("Getting DB..")
    //                     // const sql = 'select * from category where cat_id =?'
    //                     const sql = 'select film.film_id, film.title,category.name as category, rating, release_year, length as duration , film.rental_rate from film , category,film_category where category.name = ?  and film_category.category_id = category.category_id and film.film_id = film_category.film_id and category.category_id = film_category.category_id '
    //                     conn.query(sql, [category,price], function (err, result) {
    //                         conn.end()

    //                         if (err) {
    //                             console.log(err)
    //                             return callback(err, null)
    //                         } else {
    //                             console.log()
    //                             return callback(null, result)
    //                         }
    //                     })
    //                 }
    //             }









    //         }
    //     })
    // },


    // get all


    // EP 7
    // dateStrings to format date properly - stored in databaseConfig
    getCustomerPayment: function (customer_id, start_date, end_date, callback) {
        const conn = db.getConnection()


        conn.connect(function (err) {
            if (err) {
                console.log("Error connecting to database")
                return callback(err, null)
            } else {
                // SQL Commands
                console.log("Getting DB..")
                // const sql = 'select * from category where cat_id =?'
                const sql = 'select film.title, payment.amount, payment.payment_date from payment,rental,film,customer,inventory where customer.customer_id = ? and customer.customer_id = rental.customer_id and payment.rental_id = rental.rental_id  and inventory.inventory_id = rental.inventory_id and inventory.film_id = film.film_id and payment.payment_date >= ? and payment.payment_date <= ? '

                conn.query(sql, [customer_id, start_date, end_date], function (err, result) {
                    conn.end()
                    console.log(sql)
                    if (err) {
                        console.log(err)
                        return callback(err, null)
                    } else {

                        return callback(null, result)
                    }
                })

            }
        })

    },

    // EP 8
    addCustomer: function (store_id, first_name, last_name, email, address, callback) {

        const conn = db.getConnection()

        console.log({ store_id, first_name, last_name, email, address, callback })
        conn.connect(function (err) {
            if (err) {
                console.log("Error connecting to database")
                console.log(err)
                return callback(err, null)
            } else {
                console.log("Getting db...")

                var sql = 'insert into address (address,address2,district,city_id,postal_code,phone) values (?,?,?,?,?,?)'

                conn.query(sql, [address.address_line1, address.address_line2, address.district, address.city_id, address.postal_code, address.phone], function (err, result) {


                    if (err) {
                        console.log(err)
                        return callback(err, null)
                    } else {


                        var sql_2 = 'insert into customer (store_id,first_name,last_name,email,address_id) values (?,?,?,?,?)'



                        conn.query(sql_2, [store_id, first_name, last_name, email, result.insertId], function (err, result) {

                            // close conn
                            conn.end()

                            if (err) {

                                return callback(err, null)
                            } else {
                                return callback(null, result)
                            }
                        })
                    }
                })

            }
        })
    },


    // Additional End points

    // ADDITIONAL EP 1


    updateCustomer: function (store_id, first_name, last_name, email, address, address_id, callback) {
        var conn = db.getConnection();

        conn.connect(function (err) {
            if (err) {
                console.log(err)
                return callback(err, null)
            } else {
                console.log("Connected!")

                var sql = ' update bed_dvd_db.address set address=?,address2=?,district=?,postal_code=?,phone=? where address.address_id = ? '

                conn.query(sql, [address.address_line1, address.address_line2, address.district, address.postal_code, address.phone, address_id], function (err, result) {
                    if (err) {
                        console.log(err)
                        return callback(null, result)
                    } else {
                        var sql_2 = 'update bed_dvd_db.customer set store_id = ?,first_name = ? ,last_name = ?,email = ? where customer.address_id = ?'

                        conn.query(sql_2, [store_id, first_name, last_name, email, address_id], function (err, result) {

                            conn.end()

                            if (err) {
                                console.log(err)
                                return callback(err, null)
                            } else {
                                console.log(result)
                                return callback(null, result)
                            }
                        })
                    }
                })
            }
        })
    },
    // addFilm: function (title, language_id, category_name, rating, release_year, length_duration, callback) {
    //     //select film.film_id, film.title,category.name as category, rating, release_year, length as duration from film , category,film_category where film_category.category_id = 2 and film.film_id = film_category.film_id and category.category_id = film_category.category_id

    //     // parse length
    //     length_duration = parseInt(length_duration)

    //     var conn = db.getConnection();

    //     conn.connect(function (err) {
    //         if (err) {
    //             console.log(err)
    //             return callback(err, null);
    //         } else {
    //             console.log("Posting db...")

    //             var sql = 'insert into bed_dvd_db.category (name) values (?)'

    //             conn.query(sql, [category_name], function (err, result) {
    //                 //conn.end();

    //                 if (err) {
    //                     console.log(err);
    //                     return callback(err, null);

    //                 } else {
    //                     var sql_2 = 'insert into bed_dvd_db.film (title,language_id,rating,release_year,length,film_id) values (?,?,?,?,?,?)'

    //                     conn.query(sql_2, [title, language_id, rating, release_year, length_duration, result.InsertId], function (err, result) {
    //                         conn.end();

    //                         if (err) {
    //                             console.log(err);
    //                             return callback(err, null);

    //                         } else {


    //                             return callback(null, result)



    //                         }
    //                     })


    //                 }
    //             })
    //         }
    //     })
    // },
    addFilm: function(title, description, release_year, language_id, rental_duration, rental_rate, length, replacement_cost, rating,special_features, category_name,uploadedFile, callback) {
        var conn = db.getConnection();

        
        console.dir(`Uploaded file : ${uploadedFile}`)

        conn.connect(function (err) {
            if (err) {
                console.log(err);
                return callback(err, null);
            } else {
                console.log("Connected to database...");
    
                var sql1 = `INSERT INTO film (title, description, release_year, language_id, rental_duration, rental_rate, length, replacement_cost, rating,special_features,pic) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?,?,?)`;
    
                conn.query(sql1, [title, description, release_year, language_id, rental_duration, rental_rate, length, replacement_cost, rating,special_features,uploadedFile], function (err, result) {
                    if (err) {
                        console.log(err);
                        conn.end();
                        return callback(err, null);
                    } else {

                        // to find id associated with film, then take the value of the category_id to link the film and category together
                        var film_id = result.insertId;
                        console.log("Film inserted with id: " + film_id);
    
                        var sql2 = "SELECT category_id FROM category WHERE name = ?";
    
                        conn.query(sql2, [category_name], function (err, result) {
                            if (err) {
                                console.log(err);
                                conn.end();
                                return callback(err, null);
                            } else {
                                var category_id = result[0].category_id;
                                console.log("Category id: " + category_id);
    
                                var sql3 = "INSERT INTO film_category (film_id, category_id) VALUES (?, ?)";
    
                                conn.query(sql3, [film_id, category_id], function (err, result) {
                                    conn.end();
    
                                    if (err) {
                                        console.log(err);
                                        return callback(err, null);
                                    } else {
                                        console.log("Category added for film: " + film_id);
                                        return callback(null, result);
                                    }
                                });
                            }
                        });
                    }
                });
            }
        });
    },

    getAllFilmCategories: function (callback) {

        var conn = db.getConnection()

        conn.connect(function (err) {
            if (err) {
                console.log(err)
                return callback(err, null);
            } else {
                console.log("Retrieving all categories...")

                var sql = 'select distinct category.name from category'

                conn.query(sql, function (err, result) {
                    //conn.end();

                    if (err) {
                        console.log(err)
                        return callback(err, null)
                    } else {
                        console.log(result)
                        return callback(null, result)
                    }
                })
            }
        })
    }


}

module.exports = dvdDB;