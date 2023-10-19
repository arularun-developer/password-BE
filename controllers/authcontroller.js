import { Console } from "console";
import User from "../models/userSchema.js";
import sendResetPasswordEmail from "../services/emailservice.js";
import bcrypt from "bcrypt";
import crypto from "crypto";

export const registerUser = async (req, res) => {
  const { firstname, lastname, email, password } = req.body;

  try {
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new User({
      firstname,
      lastname,
      email,
      password: hashedPassword,
    });

    await newUser.save();

    res.status(201).json({

      message: "User registered successfully",
      data: newUser
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const forgotPassword = async (req, res) => {
  const { email } = req.body;
  try {
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const resetToken = crypto.randomBytes(20).toString("hex");
    user.resetPasswordToken = resetToken;
    user.resetPasswordExpires = Date.now() + 18000;
    await user.save();

    const resetLink = `${process.env.FRONTURL}/reset-password/${resetToken}`;
    await sendResetPasswordEmail(email, resetLink);
    res.json({
      message: "Reset password email sent",
      data: resetToken
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const resetPassword = async (req, res) => {
  const { newPassword } = req.body;
  console.log("🚀 ~ file: authcontroller.js:66 ~ resetPassword ~ newPassword:", newPassword)
  const { token } = req.params;
  console.log("🚀 ~ file: authcontroller.js:67 ~ resetPassword ~ token:", token)

  try {
    const user = await User.findOne({
      resetPasswordToken: token,
    //  resetPasswordExpires: { $gt: Date.now() },
    });
console.log(user);
    if (!user) {
      return res.status(400).json({ message: "Invalid or expired token" });
    }
    user.password = bcrypt.hashSync(newPassword, 10);
    user.resetPasswordToken = undefined;
    user.resetPasswordExpires = undefined;

    await user.save();
    res.json({ message: "Password reset successful" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }

};