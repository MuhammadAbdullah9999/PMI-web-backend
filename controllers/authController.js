const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const { saltRounds, secretKey } = require('../config');
const User = require('../model/userModel');
const {connectToMongoDB}=require('../services/authService')

const signUp = async (req, res) => {
    const userData = {
        name: req.body.name,
        email: req.body.email,
        phoneNumber: req.body.phoneNumber,
        password: req.body.password,
    };

    try {
        await connectToMongoDB();
        const existingUser = await User.findOne({ email: userData.email });

        if (existingUser) {
            return res.status(409).json({ message: "User already exists!" });
        }

        const hashedPassword = bcrypt.hashSync(userData.password, saltRounds);
        userData.password = hashedPassword;

        const user = new User(userData);
        await user.save();

        jwt.sign(userData, secretKey, { expiresIn: "1h" }, (err, token) => {
            if (err) {
                return res.status(500).json({ message: "Error generating token" });
            }

            const response = {
                name: userData.name,
                email: userData.email,
            };

            res.status(200)
                .cookie("jwt", token, {
                    expires: new Date(Date.now() + 3600000),
                    httpOnly: true,
                    secure: process.env.NODE_ENV === 'production',
                    sameSite: 'Lax',
                    path: '/',
                })
                .json(response);
        });
    } catch (error) {
        console.error('Error in signUp:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

const signIn = async (req, res) => {
    const { email, password } = req.body;

    try {
        await connectToMongoDB();
        const user = await User.findOne({ email });

        if (!user) {
            return res.status(401).json({ message: "Invalid credentials" });
        }

        const isMatch = bcrypt.compareSync(password, user.password);

        if (!isMatch) {
            return res.status(401).json({ message: "Invalid credentials" });
        }

        const userData = {
            name: user.name,
            email: user.email,
        };

        jwt.sign(userData, secretKey, { expiresIn: "1h" }, (err, token) => {
            if (err) {
                return res.status(500).json({ message: "Error generating token" });
            }

            res.status(200)
                .cookie("jwt", token, {
                    expires: new Date(Date.now() + 3600000),
                    httpOnly: true,
                    secure: process.env.NODE_ENV === 'production',
                    sameSite: 'Lax',
                    path: '/',
                })
                .json(userData);
        });
    } catch (error) {
        console.error('Error in signIn:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};
const logout=async(req,res)=>{
   await res.clearCookie('jwt');
    res.status(200).send({message:"Logged out successfully"});
}
module.exports = {
    signUp,
    signIn,
    logout
};
