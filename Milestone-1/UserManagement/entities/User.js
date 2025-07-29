import mongoose from 'mongoose';

const addressSchema = new mongoose.Schema({
  street: { type: String, required: true },
  city: { type: String, required: true },
  state: { type: String, required: true },
  zip: { type: String, required: true }
});

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  age: { type: String, required: true },
  gender: { type: String, required: true },
  phone: { type: String, required: true },
  created_at: { type: Date, default: Date.now },
  addresses: { type: [addressSchema], default: [] },
  pageAccess: [{ type: String }],
});

const User = mongoose.model('User', userSchema);

export default User;
