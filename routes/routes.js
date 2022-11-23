const express= require('express')
const admin = require('../models/data')
const controllers= require('../controllers/controllers')
const { requireAuth, checkUser } = require('../middleware/authMiddleware');
const { studentrequireAuth, studentcheckUser } = require('../middleware/studentmiddleware');
const student = require('../models/students');

const router= express.Router()

router.get('/',studentrequireAuth,controllers.home)
router.get('/upload',requireAuth,controllers.upload)
router.get('/read/:id/:id1',studentrequireAuth, controllers.views)
router.get('/category/:category',studentrequireAuth,controllers.category)
router.get("/:id/:id1/like",studentrequireAuth,controllers.likess);
router.post('/api/users',controllers.posttask)
router.get('/myblogs/:id',requireAuth,controllers.myblogs) 
router.get('/delete/:id1/:id2',controllers.deletetask)
router.get('/adminhome',controllers.adminhome)


router.get('/signup', controllers.signup_get);
router.post('/signup', controllers.signup_post);
router.get('/login', controllers.login_get); 
router.post('/login', controllers.login_post);
router.get('/logout', controllers.logout_get);

router.get('/studentsignup', controllers.studentsignup_get);
router.post('/studentsignup', controllers.studentsignup_post);
router.get('/studentlogin', controllers.studentlogin_get); 
router.post('/studentlogin', controllers.studentlogin_post);
router.get('/studentlogout', controllers.logout_get); 


module.exports=router