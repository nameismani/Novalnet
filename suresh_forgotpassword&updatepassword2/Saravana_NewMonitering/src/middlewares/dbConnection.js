var mariadb = require('mariadb');

//~ var novalnetDb = mariadb.createPool({
  //~ connectionLimit:5,
  //~ host: "dbext.novalnet.de",
  //~ user: "novalnet",
  //~ password: "5ht8qRTf",
  //~ database:"novalnet"
//~ });

var monitorDb = mariadb.createPool({
  connectionLimit:5,
  host: "localhost",
  user: "dev2_fobits",
  password: "fiu@foBUheofhgjweo7gw",
  database:"dev2_fobits"
});

module.exports = {
    //~ "novalnet": novalnetDb,
    "monitor": monitorDb
}
