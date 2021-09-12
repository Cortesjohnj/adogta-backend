const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

const foundationSchema = mongoose.Schema({
  email: {
    type: String,
    match: /.+\@.+\..+/,
    required: [true, "Email is required"],
    validate: {
      validator: async function (value) {
        const foundation = await Foundation.findOne({ email: value });
        return foundation === null;
      },
      message: "Email is already taken",
    },
  },
  password: {
    type: String,
    required: [true, "Password is required"],
  },
  name: {
    type: String,
    required: [true, "Name is required"],
  },
  address: {
    type: String,
  },
  phoneNumber: {
    type: String,
  },
  role: {
    default: "foundation",
    type: String,
    required: [true, " Role is required"],
  },
  photoUrl: {
    type: String,
  },
});

foundationSchema.pre("save", async function (next) {
  try {
    const hash = await bcrypt.hash(this.password, 10);
    this.password = hash;
    next();
  } catch (err) {
    next(err);
  }
});

foundationSchema.statics.authenticate = async (email, password) => {
  const foundation = await Foundation.findOne({ email });
  if (foundation) {
    const result = await bcrypt.compare(password, foundation.password);
    return result === true ? foundation : null;
  }

  return null;
};

const Foundation = mongoose.model("Foundation", foundationSchema);

module.exports = Foundation;