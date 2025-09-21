const User = require("../models/auth-model");
const bcrypt = require("bcryptjs");
const nodemailer = require("nodemailer");
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
  const { name, email, password } = req.body;

  const errors = handleField({ name, email, password });

  if (email && !isEmailValid(email)) {
    errors.push({
      field: "email",
      message: "Invalid email format."
    }
    );
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

    await User.createUser(name, email, hashedPassword);
    res.status(201).json({ message: "User has been created." });
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

    res.status(200).json({
      message: "Login sucessfully",
      name: user.name,
      email: user.email,
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
    serveice: "gmail",
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    }
  })

  const resetLink = `http://localhost:5000/reset-password?token=${token}`;
  await transporter.sendMail({
    to: email,
    subject: "Password Reset",
    text: `Click here to reset your password: ${resetLink}`,
  });

  res.status(200).json({ message: "Password reset link has been sent to your email."});
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
    const { userId, name, bio, avatar } = req.body;
    await User.saveOnboardingInfo(userId, name, bio, avatar);
    res.json({ message: "Onboarding info saved!" });
  } catch (error) {
    res.status(500).json({ message: "Error saving onboarding info." });
  }
};

module.exports = { register, login, forgotPassword, resetPassword, saveOnboardingInfo };
