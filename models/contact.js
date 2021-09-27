const mongoose = require('mysql');
const Schema = mongoose.Schema;

const blogSchema = new Schema({
   Company:{
        type:String
    },
    Website:{
        type:String
    },
    ContactName:{
        type:String
    },
    FirstName:{
        type:String
    },
    LastName:{
        type:String
    },
    Title:{
        type:String
    },
    Email:{
        type:String
    },
    Country:{
        type:String
    },
    CompanyPhone:{
        type:String
    },
    Industry:{
        type:String
    },
    Employees:{
        type:String
    },
}, { timestamps: true });

const Contact = mongoose.model('contact', blogSchema);
module.exports = Contact;