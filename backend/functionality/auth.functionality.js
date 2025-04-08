import bcrypt from "bcryptjs"
import User from "../models/user.model.js";
import OTP from "../models/otp.model.js";
import { generateTokenAndSendCookie } from "../lib/generateTokenAndSendCookie.js";
import { sendOTPEmail } from "./nodemailer.functionaity.js";

const generateOTP = async (email, username) => {
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const expiresAt = Date.now() + 5 * 60 * 1000;

    console.log(`Generated OTP is : ${otp}`)

    await OTP.findOneAndUpdate(
        { email },
        { otp, expiresAt },
        { upsert: true, new: true }
    )

    try {
        await sendOTPEmail(email, otp, username);
        return otp;
    } catch (error) {
        console.log("Error in SendOTP function : ", error.message);
    }
}

export const login = async (req, res) => {

    try {
        const { email, password } = req.body;
        if (!email  || !password) {
            return res.status(400).json({ message: "All fields are required" })
        }

        if (!email.trim()  || !password.trim()) {
            return res.status(400).json({ message: "All fields are required" })
        }

        if (password.trim().length < 6) {
            return res.status(401).json({ message: "Password must be atleast 6 characters" })
        }

        const emailRegex = /^[A-Za-z0-9._%+-]+@[A-Za-z0-9-]+(\.[A-Za-z]{2,})+$/;

        if (!emailRegex.test(email)) {
            return res.status(400).json({ message: "Invalid email format" })
        }

        const user = await User.findOne({ email });

        if (!user) {
            return res.status(401).json({ message: "User don't exists,Signup First!" });
        }

        if (email !== user.email) {
            return res.status(401).json({ message: "Inavlid username or email" });
        }

        const isPasswordCorrect = await bcrypt.compare(password, user.password);

        if (!isPasswordCorrect) {
            return res.status(401).json({ message: "Incorrect Password" });
        }

        await generateTokenAndSendCookie(user._id, res);

        return res.status(201).json({ user });

    } catch (error) {
        console.log(`Error in login controller : ${error.message}`);
        res.status(500).json({ error: "Internal server error" })
    }
};

export const resendOTP = async (req, res) => {
    try {
        const { email, username } = req.body;

        if (!email || !username) {
            return res.status(400).json({ message: "Email and username are required" });
        }

        const otp = Math.floor(100000 + Math.random() * 900000).toString();
        const expiresAt = new Date(Date.now() + 5 * 60 * 1000); // Expires in 5 mins

        await OTP.findOneAndUpdate(
            { email },
            { otp, expiresAt },
            { upsert: true, new: true }
        );

        await sendOTPEmail(email, otp, username);
        return res.status(200).json({ message: "OTP resent successfully" });

    } catch (error) {
        console.error(`Error in resendOTP controller: ${error.message}`);
        res.status(500).json({ error: "Internal server error" });
    }
};

export const signup = async (req, res) => {
    try {

        console.log(req.body)

        const { email, username, password } = req.body;

        if (!email || !username || !password) {
            return res.status(400).json({ message: "All fields are required" });
        }

        if (!email.trim() || !username.trim() || !password.trim()) {
            return res.status(400).json({ message: "All fields are required" });
        }

        if (password.trim().length < 6) {
            return res.status(401).json({ message: "Password must be at least 6 characters" });
        }

        const emailRegex = /^[A-Za-z0-9._%+-]+@[A-Za-z0-9-]+(\.[A-Za-z]{2,})+$/;

        if (!emailRegex.test(email)) {
            return res.status(400).json({ message: "Invalid email format" });
        }


        const doUserExist = await User.findOne({ email });

        if (doUserExist) return res.status(401).json({ message: "User already exists!" })

        await generateOTP(email, username)

        console.log("OTP sent on given email");

        return res.status(201).json({ message: "OTP sent on given email" });

    } catch (err) {
        console.log(`Error in signup controller : ${err.message}`);
        res.status(500).json({ error: "Internal server error" });
    }
};

const verifyOTP = async (originalOTP, userOTP) => {
    try {

        if (userOTP !== originalOTP) {
            return { success: false, message: "Invalid OTP!" }
        }
        return { success: true, message: "Account Created successfully !" };

    } catch (error) {
        console.log("Error in verifyOTP controller : ", error.message);
        return res.status(500).json({ error: "Internal Server Error" });
    }
}

export const logout = async (req, res) => {
    try {
        res.clearCookie("jwt", {
            maxAge: 0,
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production', // Only set secure in production
            sameSite: 'lax' // Or 'strict'
        });
        return res.status(200).json({ message: "Loggedout successful" })
    } catch (error) {
        console.log(`Error in logout controller : ${error.message}`);
        return res.status(500).json({ error: "Internal server error" });
    }
};

export const checkAuth = async (req, res) => {
    try {
        return res.status(200).json(req.user); // Correct status code
    } catch (error) {
        console.error(`Error in checkAuth : ${error.message}`); // Log full error in server console
        return res.status(500).json({ message: "Internal server error" }); // More informative message
    }
}

export const getUserDataVerifyAndSaveUser = async (req, res) => {

    try {

        console.log(req.body.userOTP)

        const { email, username, password, userOTP } = req.body;

        const otpEntry = await OTP.findOne({ email }); // Gives whole document

        if (!otpEntry) {
            return res.status(400).json({ message: "OTP not found. Please request a new OTP." });
        }

        if (Date.now() > otpEntry.expiresAt) {
            return res.status(401).json({ message: "OTP expired. Please request a new OTP." });
        }

        const verificationResult = await verifyOTP(otpEntry.otp, userOTP);

        if (!verificationResult.success) {
            return res.status(401).json({ message: verificationResult.message });
        }

        console.log("OTP verified");

        // naya user tab tak creat enahi hona chahiye jab tak email verify na ho jaaye 

        const hashedPassword = await bcrypt.hash(password, 12);

        const newUser = new User({
            email,
            username,
            password: hashedPassword
        });

        if (!newUser) {
            return res.status(401).json({ message: "Failed to create account" });
        }

        await generateTokenAndSendCookie(newUser._id, res);

        const saveUser = await newUser.save();

        if (!saveUser) {
            console.log("User not saved")
        }

        console.log("Account Created Successfully !")

        return res.status(200).json({ message: "Account Created Successfully !" });

    } catch (error) {
        console.log("Error in getUserDataVerifyAndSaveUser : ", error.message);
        return res.status(500).json({ error: "Internal Server Error" });
    }
}