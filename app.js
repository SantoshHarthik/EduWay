const express= require('express')
const app= express()
const connectdb= require('./database')
const router= require('./routes/routes')
const cloudinary = require('cloudinary')
app.set('view engine','ejs')
const { requireAuth, checkUser } = require('./middleware/authMiddleware');
const { studentrequireAuth, studentcheckUser } = require('./middleware/studentmiddleware');


const User = require('./models/User');
app.use(express.json())
app.use(express.static('public'));
app.use(express.urlencoded({extended:true}))
const cookieParser = require('cookie-parser');


app.use(cookieParser());

connectdb()
app.use(express.static('public'));
app.get('*', checkUser);
app.get('*', studentcheckUser);
app.use(router);
// router(app)
app.listen(3000)