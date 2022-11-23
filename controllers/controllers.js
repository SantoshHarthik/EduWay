const basic = require('../models/data')
const User= require('../models/User')
const student= require('../models/students')
const jwt = require('jsonwebtoken')

exports.home = async (req, res) => {
  try {
    if(req.query)
    {
      const {sort}= req.query;
      if(sort=='likes'){
        const blogs = await basic.find({}).sort({likes:-1})
        res.render('index', { blogs })
      }
      else{
        const blogs = await basic.find({}).sort({views:-1})
        res.render('index', { blogs })       
      }
    }
    else{
    const blogs = await basic.find({})
    res.render('index', { blogs })
    }
    // console.log(blogs);
  } catch (err) {
    // console.log(err);
    res.send(err)
  }
}

exports.upload = async (req, res) => {
  try {
    const blogs = await basic.find({})
    res.render('upload')
    // console.log(blogs);
  } catch (err) {
    // console.log(err);
    res.send(err)
  }
}

exports.posttask = async (req, res) => {
  try {
    const blog = await basic.create(req.body)
    // res.send(req.body)
    // const result = await cloudinary.v2.uploader.upload(req.file.path) 
    // res.send(result)
    // console.log(blog);
    // console.log(blog,User._id);
    // res.redirect(`/ex/${blog._id}`)
    // res.send(req.body)
    // console.log(blog);
    res.redirect('/upload')
  } catch (error) {
    res.status(500).send({ message: error })
  }
}


exports.myblogs = async (req, res) => {
  try {
    const iddd = req.params.id;
    const blog = await basic.find({ 'writer': iddd })
    res.render('myblogs', { blogs: blog })
    // console.log(blog);
  } catch (error) {
    res.status(500).send({ message: error })
  }
  // console.log(req.params.id);
}

exports.deletetask = async (req, res) => {
  try {
    const { id1,id2 } = req.params
    // const id1 = req.params.id
    const blog = await basic.findByIdAndDelete(id1)
    if (!blog) {
      return res.status(404).json({ msg: ' No blog with that Id no. ' })
    }
    res.redirect(`/myblogs/${id2}`)
  }
  catch (error) {
    res.status(500).send({ msg: error })
  }

  // console.log(req.params);
}

exports.adminhome=async(req,res)=>{
  // res.redirect('')
}


exports.readmore= async(req,res)=>{
  try {
    const blogid= req.params.id;
    const userid= req.params.id1;
    const blogs= await basic.findById({_id:blogid})
    const blogs1= await student.findById({_id:userid})
    // console.log(userid) ;
    res.render('readmore',{blogs})
    if (!blogs1.views.includes(userid)){
      await post.updateOne({ $push: { views: userid } });
      // await post.updateOne({ $push: { likestatus: 'dislike' } });
      // res.status(200).json("The post has been liked");
    } else {
      await post.updateOne({ $pull: { views: userid} });
      // res.status(200).json("The post has been disliked");
    }
  } catch (error) {
    res.send(error)
  }
}


exports.likess= async (req, res) => {
  try {
    const post = await basic.findById(req.params.id);
    const post1=await student.findById(req.params.id1)

    if (!post.likes.includes(post1.id)){
      await post.updateOne({ $push: { likes: post1.id } });
      // await post.updateOne({ $push: { likestatus: 'dislike' } });
      // res.status(200).json("The post has been liked");
    } else {
      await post.updateOne({ $pull: { likes: post1.id } });
      // res.status(200).json("The post has been disliked");
    }
    res.redirect(`/read/${post.id}/${post1.id}`)
  } catch (err) {
    res.status(500).json(err);
  }
}

exports.views= async (req, res) => {
  try {
    const post = await basic.findById(req.params.id);
    const post1=await student.findById(req.params.id1)
    res.render('readmore',{blogs:post})

    if (!post.views.includes(post1.id)){
      await post.updateOne({ $push: { views: post1.id } });
      // await post.updateOne({ $push: { likestatus: 'dislike' } });
      // res.status(200).json("The post has been liked");
    }
  } catch (err) {
    res.status(500).json(err);
  }
}

exports.category = async (req, res) => {
  try {
    const blog = await basic.find({ 'subject': req.params.category })
    const title = req.params.category
    res.render('category', { blogs: blog, title })
  } catch (error) {
    res.status(500).send({ message: error })
  }
}



module.exports.signup_get = (req, res) => {
  res.render('signup');
}

module.exports.login_get = (req, res) => {
  res.render('login');
}

module.exports.studentsignup_get = (req, res) => {
  res.render('studentsignup');
}

module.exports.studentlogin_get = (req, res) => {
  res.render('studentlogin');
}


module.exports.signup_post = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.create({ email, password });
    // console.log(user);
    const token = createToken(user._id);
    res.cookie('jwt', token, { httpOnly: true, maxAge: maxAge * 1000 });
    res.status(201).json({ user: user._id });
  }
  catch (err) {
    const errors = handleErrors(err);
    res.status(400).json({ errors });
  }
}


module.exports.login_post = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.login(email, password);
    // console.log(user);
    const token = createToken(user._id);
    res.cookie('jwt', token, { httpOnly: true, maxAge: maxAge * 1000 });
    res.status(200).json({ user: user._id });
  }
  catch (err) {
    const errors = handleErrors(err);
    res.status(400).json({ errors });
  }

}


module.exports.logout_get = (req, res) => {
  res.cookie('jwt', '', { maxAge: 1 });
  res.redirect('/login');
}



const handleErrors = (err) => {
  console.log(err.message, err.code);
  let errors = { email: '', password: '' };

  // incorrect email
  if (err.message === 'incorrect email') {
    errors.email = 'That email is not registered, Register now!!';
  }

  // incorrect password
  if (err.message === 'incorrect password') {
    errors.password = 'That password is incorrect';
  }

  // duplicate email error
  if (err.code === 11000) {
    errors.email = 'that email is already registered, Please try logging in..';
    return errors;
  }

  // validation errors
  if (err.message.includes('user validation failed')) {
    // console.log(err);
    Object.values(err.errors).forEach(({ properties }) => {
      // console.log(val);
      // console.log(properties);
      errors[properties.path] = properties.message;
    });
  }

  return errors;
}
// create json web token
const maxAge = 15 * 24 * 60 * 60;
const createToken = (id) => {
  return jwt.sign({ id }, 'secret key', {
    expiresIn: maxAge
  });
};




module.exports.studentsignup_post = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await student.create({ email, password });
    // console.log(user);
    const token = createToken(user._id);
    res.cookie('jwt', token, { httpOnly: true, maxAge: studentmaxAge * 1000 });
    res.status(201).json({ user: user._id });
  }
  catch (err) {
    const errors = studenthandleErrors(err);
    res.status(400).json({ errors });
  }

}


module.exports.studentlogin_post = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await student.login(email, password);
    // console.log(user);
    const token = createToken(user._id);
    res.cookie('jwt', 
    token, { httpOnly: true, maxAge: studentmaxAge * 1000 });
    res.status(200).json({ user: user._id });
  }
  catch (err) {
    const errors = studenthandleErrors(err);
    res.status(400).json({ errors });
  }

}



module.exports.studentlogout_get = (req, res) => {
  res.cookie('jwt', '', { maxAge: 1 });
  res.redirect('/');
}


const studenthandleErrors = (err) => {
  console.log(err.message, err.code);
  let errors = { email: '', password: '' };

  // incorrect email
  if (err.message === 'incorrect email') {
    errors.email = 'That email is not registered, Register now!!';
  }

  // incorrect password
  if (err.message === 'incorrect password') {
    errors.password = 'That password is incorrect';
  }

  // duplicate email error
  if (err.code === 11000) {
    errors.email = 'that email is already registered, Please try logging in..';
    return errors;
  }

  // validation errors
  if (err.message.includes('user validation failed')) {
    // console.log(err);
    Object.values(err.errors).forEach(({ properties }) => {
      // console.log(val);
      // console.log(properties);
      errors[properties.path] = properties.message;
    });
  }

  return errors;
}
// create json web token
const studentmaxAge = 15 * 24 * 60 * 60;
const studentcreateToken = (id) => {
  return jwt.sign({ id }, 'secret key', {
    expiresIn: studentmaxAge
  });
};

