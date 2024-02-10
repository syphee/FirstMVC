// Admission Number : P2107967
// Name : Landicho James Evans Arvesu
// Class : DIT/FT/1B/04


const mysql = require('mysql')

const dbconnect = {
    getConnection: function(){
        var conn = mysql.createConnection({
            host: "localhost",
            user: "bed_dvd_root",
            password: "pa$$woRD123",
            database:"bed_dvd_db",
            dateStrings: true

        })
        
        return conn;
    }
}

module.exports = dbconnect

