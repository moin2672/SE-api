const express = require('express');
const bodyParser = require('body-parser');
const mogoose = require("mongoose");

const itemRoutes=require('./routes/items');
const orderRoutes=require('./routes/orders');
const customerRoutes=require('./routes/customers');
const invoiceRoutes=require('./routes/invoices');
const shopRoutes=require('./routes/shops');
const userRoutes = require("./routes/users");

const app = express();

mogoose.connect("mongodb+srv://meanapp:"+process.env.MONGO_ALTAS_PW+"@cluster0.fgaaw.mongodb.net/superelectronicsproject", { useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex:true })
        .then(()=>{console.log("Connected to Database")})
        .catch(()=>{console.log("Db connection failed!")});

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));

app.use((req, res, next)=>{
    res.setHeader('Access-Control-Allow-Origin','*');
    res.setHeader('Access-Control-Allow-Headers','Origin, X-Requested-With, Content-Type, Accept, Authorization');
    res.setHeader('Access-Control-Allow-Methods','GET, POST, PUT, PATCH, DELETE, OPTIONS');
    next()
});

app.use("/api/items",itemRoutes)
app.use("/api/orders",orderRoutes)
app.use("/api/customers",customerRoutes)
app.use("/api/invoices",invoiceRoutes)
app.use("/api/shops",shopRoutes)
app.use("/api/users",userRoutes);

module.exports = app;
