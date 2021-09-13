const User = require("../models/User");
const Foundation = require("../models/Foundation");
const jwt = require("jsonwebtoken");
const config = require("../config/index");

const createUser = async (req, res, next) => {
  console.log(req.body.role);
  if (req.body.role === "user") {
    try {
      const newUser = await new User(req.body);
      await newUser.save();
      res.status(201).json(newUser);
    } catch (err) {
      if (err.name === "ValidationError") {
        console.log("Validation Error:", err.errors);
        res.status(422).json(err.errors);
      } else {
        next(err);
        console.log(err);
      }
    }
  } else if (req.body.role === "foundation") {
    console.log(req.body.role);
    try {
      const newFoundation = await new Foundation(req.body);
      await newFoundation.save();
      res.status(201).json(newFoundation);
    } catch (err) {
      if (err.name === "ValidationError") {
        console.log("Validation Error:", err.errors);
        res.status(422).json(err.errors);
        console.log(err);
      } else {
        next(err);
        console.log(err);
      }
    }
  }
};

const getUser = async (req, res, next) => {
  console.log(req.body.email);
  try {
    const user = await User.findOne({ email: req.body.email });
    console.log(user);
    res.status(201).json(user);
  } catch (err) {
    if (err.name === "ValidationError") {
      console.log("Validation Error:", err.errors);
      res.status(422).json(err.errors);
    } else {
      next(err);
      console.log(err);
    }
  }
};

const login = async (req, res) => {
  const { email, password } = req.body;

  let user = await User.authenticate(email, password);

  if (user) {
    const token = jwt.sign({ userId: user._id }, config.jwtKey);
    res.json({ token, user });
  } else {
    user = await Foundation.authenticate(email, password);
    if (user) {
      const token = jwt.sign({ userId: user._id }, config.jwtKey);
      res.json({ token, user });
    } else {
      res.status(401).json({ error: "Invalid credentials" });
    }
  }
};

Pet = require("../models/Pet");
mongoose = require("mongoose");

const listPets = async (req, res, next) => {
  try {
    const pets = await Pet.find({ foundationId: req.params.id });
    res.status(200).json(pets);
  } catch (e) {
    return next(e);
  }
};

const destroyPet = async (req, res, next) => {
  try {
    await Pet.deleteOne({ _id: req.params.id });
    res.status(204).end();
  } catch (e) {
    return next(e);
  }
};
const listFoundations = async (req, res, next) => {
  try {
    const foundations = await Foundation.find(
      {},
      { password: 0, __v: 0, role: 0 }
    ).limit(10);
    res.status(200).json(foundations);
  } catch (e) {
    return next(e);
  }
};

module.exports = {
  createUser,
  getUser,
  login,
  destroyPet,
  listPets,
  listFoundations,
};
