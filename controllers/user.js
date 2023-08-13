import User from "../Models/user.js";
import nodemailer from "nodemailer";
import jwt from "jsonwebtoken"
export const loginPage = (req, res) => {
  req.session.loggedIn
    ? res.redirect("/products")
    : res.render("login", { error: null });
};

export const signupPage = (req, res) => {
  req.session.loggedIn
    ? res.redirect("/products")
    : res.render("signup", { error: null });
};
export const forgotPassword = (req, res) => {
  req.session.loggedIn
    ? res.redirect("/products")
    : res.render("forgotpassword", {message: null});
};
export const forgotPasswordPost = async (req, res) => {
  const email = req.body.email;

  const oldUser = await User.findOne({email});
  if(!oldUser){
    res.render('forgotpassword', {message :"User does not exist"})
  }
  else{

    const token = jwt.sign({ email }, process.env.SECRET, {
      expiresIn: '1d', 
    })
    const verificationLink = `http://localhost:8000/users/resetpassword?token=${token}`;
    async function main() {
           
      let transporter = nodemailer.createTransport({
        host: process.env.HOST, 
        port: process.env.MAILPORT, 
        secure: true, 
        auth: {
          user: process.env.USER, 
          pass: process.env.PASS, 
        },
      });
      
      let info = await transporter.sendMail({
        from: `"Test" <${process.env.USER}>`,
        to: email,
        subject: "Reset your password",
        html: `
        <h1>Hello there, click here to reset password</h1>
        <a href='${verificationLink}'>Link</a>
        `,
      });
    
      console.log(info.messageId);
    }
    
    main()
    res.render("forgotpassword", {message: "An email is sent to you"})
  }
};

export const addUser = async (req, res) => {
  const username = req.body.username;
  const password = req.body.password;
  const confirmPassword = req.body.confirmpassword;
  const profilePic = req.file.filename;
  const email = req.body.email;

  let error = '';
  let success = '';
  try {
    
    if (!username || !password || password.length < 8) {
      error = "Password must be at least 8 characters long";
      return res.render("signup", { error, success: "something" });
    }

    if (!/[A-Z]/.test(password)) {
      error = "Password must contain at least one capital letter" ;
      return res.render("signup", { error, success: "something"});
    }

    if (!/\d/.test(password)) {
      error = "Password must contain at least one number";
      return res.render("signup", { error, success: "something" });
    }

    if (!/[!@#$%^&*()_+{}\[\]:;<>,.?~\-]/.test(password)) {
      error = "Password must contain at least one special character";
      return res.render("signup", { error, success: "something" });
    }

    if (password !== confirmPassword) {
      res.render("signup", { error: "Confirm password does not match", success: "something" });
    } 
    else {
      let oldUser = await User.findOne({ username });
  
      if (oldUser) {
        error = "User already exists";
        res.render("signup", { error, success: "something"});
      } else {
        
          const token = jwt.sign({ username, profilePic, email, password }, process.env.SECRET, {
            expiresIn: '1d', 
          })
          const verificationLink = `http://localhost:8000/users/verify?token=${token}`;

          async function main() {
         
            let transporter = nodemailer.createTransport({
              host: process.env.HOST, 
              port: process.env.MAILPORT, 
              secure: true, 
              auth: {
                user: process.env.USER, 
                pass: process.env.PASS, 
              },
            });
            
            let info = await transporter.sendMail({
              from: `"Test" <${process.env.USER}>`,
              to: email,
              subject: "Verify to shopping App",
              html: `
              <h1>Hello there, click here to verify</h1>
              <a href='${verificationLink}'>Link</a>
              `,
            });
          
            console.log(info.messageId);
          }
          
          main()
          
          success=  'Signup successful. Please check your email for verification link.'
          res.render('signup', { error: "Successful, check mail"});
      }
    }
  } catch (err) {
    console.log(err);
    return;
  }
};
export const userLogin = async (req, res) => {
  const username = req.body.username;
  const password = req.body.password;

  try {
    if (!username || !password) {
      return res.render("login", { error: "Invalid username or password" });
    }
    let oldUser = await User.findOne({ username });

    if (oldUser) {
      if(oldUser.password === password){
        req.session.username = username;
        req.session.loggedIn = true;
        req.session.profile = oldUser.profilePic;
        res.redirect("/products");
      }
      else{
        res.render("login", {error: "Password does not match"});
      }
    } 
    else{
      res.render("login", {error: "User does ot exist"});
    }
  } catch (err) {
    console.log(err);
    return;
  }
};
export const logoutUser = (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      console.error("Error while destroying session:", err);
      res.status(500).json({ message: "Error occurred while logging out" });
    } else {
      res.redirect("/");
    }
  });
};

export const verifyUser = async (req, res) => {
  const token = req.query.token;

  try {
    const decoded = jwt.verify(token, process.env.SECRET);
    req.session.username = decoded.username;
    req.session.loggedIn = true;
    req.session.profile = decoded.profilePic;
    const email = decoded.email;

    await User.create({
      username: decoded.username,
      email:email,
      password: decoded.password,
      profilePic: decoded.profilePic
    })

    res.redirect('/products'); 
  } catch (error) {
    res.status(400).send('Invalid token');
  }
};

export const resetPassword = async (req, res) => {
  const token = req.query.token;
  const decoded = jwt.verify(token, process.env.SECRET);
  const email = decoded.email;
  res.render('resetpassword', {email});
};

export const changePassword = async (req, res) => {
  const newpassword = req.body.newpassword;
  const confirmpassword = req.body.confirmpassword;
  const username = req.body.username;

  if (newpassword !== confirmpassword) {
    res.render('resetpassword', { 
      error: "Confirm password does not match"
    });
  } 
  else{
    await User.findOneAndUpdate({ username }, { $set: { password: newpassword } });
    res.redirect('/users/login');
  }
}



