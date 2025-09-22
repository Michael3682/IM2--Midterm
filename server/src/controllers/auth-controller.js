const bcrypt = require("bcryptjs");
const nodemailer = require("nodemailer");
const jwt = require("jsonwebtoken");
const User = require("../models/auth-model");
const generateUUID = require("../utils/generateUUID");

const handleField = (fields) => {
  let errors = [];

  for (let [field, value] of Object.entries(fields)) {
    if (!value || value.trim() === "") {
      errors.push({ message: `${field} is required` });
    }
  }

  return errors;
};

const isEmailValid = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  return emailRegex.test(email);
};

const isPasswordValid = (password) => {
  return password.length >= 8;
};

const register = async (req, res) => {
  const { email, password } = req.body;

  const errors = handleField({ email, password });

  if (email && !isEmailValid(email)) {
    errors.push({
      field: "email",
      message: "Invalid email format."
    });
  }

  if (password && !isPasswordValid(password)) {
    errors.push({
      field: "password",
      message: "Password must be at least 8 characters.",
    });
  }

  if (errors.length > 0) return res.status(400).json(errors);

  try {
    const emailExists = await User.findUserByEmail(email);

    if (emailExists) return res.status(400).json({ message: "Email already exist" });

    const hashedPassword = await bcrypt.hash(password, 10);
    await User.createUser(email, hashedPassword);
    const user = await User.findUserByEmail(email);
    const token = jwt.sign({ id: user.id, email: user.email }, process.env.JWT_SECRET || "secret", { expiresIn: "1h" });
    res.status(201).json({ message: "User has been created.", token });
  } catch (error) {
    console.error(error);
  }
};

const login = async (req, res) => {
  const { email, password } = req.body;

  const errors = handleField({ email, password });
  if (errors.length > 0) return res.status(400).json(errors);

  try {
    const user = await User.findUserByEmail(email);
    if (!user) return res.status(401).json({ message: "Email doesn't exist." });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(401).json({ message: "Invalid password." });

    const token = jwt.sign({ id: user.id, email: user.email }, process.env.JWT_SECRET || "secret", { expiresIn: "1h" });
    res.status(200).json({
      message: "Login sucessfully",
      email: user.email,
      token
    });
  } catch (error) {
    console.error(error);
  }
};

const forgotPassword = async (req, res) => {
  const { email } = req.body;

  const errors = handleField({ email });
  if (errors.length > 0) return res.status(400).json(errors);

  const user = await User.findUserByEmail(email);
  if (!user) return res.status(404).json({ message: "Email doesn't exist." });

  const token = generateUUID();
  const expiry = Date.now() + 3600000;

  await User.setResetToken(email, token, expiry);

  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASSWORD,
    },
  });

  const resetLink = `http://localhost:3000/reset-password?token=${token}`;
  try {
    await transporter.sendMail({
      to: email,
      subject: "Password Reset",
      text: `Click here to reset your password: ${resetLink}`,
    });
  } catch (error) {
    console.error("Nodemailer error:", error);
    return res.status(500).json({ message: "Email sending failed", error: error.message });
  }

  res.status(200).json({ message: "Password reset link has been sent to your email." });
}

const resetPassword = async (req, res) => {
  const { token, newPassword } = req.body;
  if (!token || !newPassword) return res.status(400).json({ message: "Token and new password are required." });

  const user = await User.findUserByResetToken(token);
  if (!user) return res.status(400).json({ message: "Invalid or expired token." });

  if (user.resetTokenExpiry < Date.now()) {
    return res.status(400).json({ message: "Token has expired." });
  }

  if (!isPasswordValid(newPassword)) {
    return res.status(400).json({ message: "Password must be at least 8 characters." });
  }

  const hashedPassword = await bcrypt.hash(newPassword, 10);
  await User.updatePassword(user.email, hashedPassword);

  res.status(200).json({ message: "Password has been reset successfully." });
}

const saveOnboardingInfo = async (req, res) => {
  try {
    const { userId, name, age, address } = req.body;
    await User.saveOnboardingInfo(userId, name, age, address);
    res.json({ message: "Onboarding info saved!" });
  } catch (error) {
    res.status(500).json({ message: "Error saving onboarding info." });
  }
};

const getProfile = async (req, res) => {
  try {
    const email = req.query.email;
    if (!email) return res.status(400).json({ message: "Email is required" });
    const user = await User.findUserByEmail(email);
    if (!user) return res.status(404).json({ message: "User not found" });
    res.json({
      name: user.name || "",
      age: user.age || "",
      address: user.address || ""
    });
  } catch (err) {
    res.status(500).json({ message: "Error fetching profile" });
  }
};

const changePassword = async (req, res) => {
  const { email, oldPassword, newPassword } = req.body;
  if (!email || !oldPassword || !newPassword) {
    return res.status(400).json({ message: "All fields are required." });
  }
  if (!isPasswordValid(newPassword)) {
    return res.status(400).json({ message: "Password must be at least 8 characters." });
  }
  try {
    const user = await User.findUserByEmail(email);
    if (!user) return res.status(404).json({ message: "User not found." });
    if (!user.password) return res.status(400).json({ message: "Google account password cannot be changed." });
    const isMatch = await bcrypt.compare(oldPassword, user.password);
    if (!isMatch) return res.status(401).json({ message: "Old password is incorrect." });
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    await User.updatePassword(user.email, hashedPassword);
    res.status(200).json({ message: "Password changed successfully." });
  } catch (err) {
    res.status(500).json({ message: "Error changing password." });
  }
};


module.exports = {
  register,
  login,
  forgotPassword,
  resetPassword,
  saveOnboardingInfo,
  getProfile,
  changePassword
};
