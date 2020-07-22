import dotenv from 'dotenv';
import bcrypt from 'bcryptjs';
import model from './user.model';

const saltRounds = 10;
dotenv.config();
class UserController {
  model: typeof model;

  bcrypt: typeof bcrypt;

  constructor() {
    this.model = model;
    this.bcrypt = bcrypt;
  }

  getUsers(req, res) {
    return this.model.findAll()
      .then((users) => res.status(200).json({ users }))
      .catch((e) => res.status(500).json({ message: `Unable to get users, ${e.message}` }));
  }

  validatePin(pin) { // eslint-disable-line class-methods-use-this
    const valid = (typeof pin === 'number' && pin.toString().length === 4); return valid;
  }

  async create(req, res) {
    let hash;
    const { username, password, pin } = req.body;
    if (!username || !password || !pin || !this.validatePin(pin)) {
      return res.status(400).json({ message: 'Invalid create user request' });
    }
    try { hash = await this.bcrypt.hash(password, saltRounds); } catch (e) {
      return res.status(500).json({ message: `Failed to create user, ${e.message}` });
    }
    return this.model.create({ username, password: hash, pin })
      .then((user) => res.status(200).json({ message: `created user: ${user.username}` }))
      .catch((e) => res.status(500).json({ message: `Failed to create user, ${e.message}` }));
  }

  checkPin(req, res) {
    const matchedUsers = [];
    const { pin } = req.body;
    if (!pin || !this.validatePin(pin)) {
      return res.status(400).json({ message: 'Submit a valid 4-digit pin' });
    }
    return this.model.findAll({ where: { pin } })
      .then((results) => {
        if (results.length === 0) return res.status(404).json({ message: 'There are no users with that pin' });
        return res.status(200).json({ users: matchedUsers });
      }).catch((e) => res.status(500).json({ message: `Unable to get users with pin: ${pin}, ${e.message}` }));
  }

  async checkPassword(user, password, res) {
    let isMatch;
    try { isMatch = await this.bcrypt.compare(password, user.password); } catch (e) { return res.status(500).json({ message: `${e.message}` }); }
    if (!isMatch) return res.status(400).json({ message: 'Incorrect password' });
    return res.status(200).json({ message: 'Logged In' });
  }

  async loginUser(req, res) {
    let user;
    const { username, password } = req.body;
    if (!username) { return res.status(400).json({ message: 'Please submit a username' }); }
    if (!password) { return res.status(400).json({ message: 'Please submit a valid password' }); }
    try { user = await this.model.findOne({ where: { username } }); } catch (e) { return res.status(500).json({ message: `${e.message}` }); }
    if (!user) return res.status(404).json({ message: `${username} was not found` });
    return this.checkPassword(user, password, res);
  }

  updateUser(req, res) {
    const { id } = req.params;
    const requiredFields = ['username', 'password', 'pin'];
    if (!id) {
      return res.status(400).json({ message: 'User id is missing' });
    }
    if (!this.validatePin(req.body.pin)) return res.status(400).json({ message: 'Submit a valid 4-digit pin' });
    for (let i = 0; i < requiredFields.length; i += 1) {
      const field = requiredFields[i];// eslint-disable-line security/detect-object-injection
      if (!(field in req.body)) return res.status(400).json({ message: 'Invalid request to update user' });
    }
    return this.model.update({ username: req.body.username, password: req.body.password, pin: req.body.pin },
      { where: { id } })
      .then(() => res.status(200).json({ message: 'updated user successfully' }))
      .catch((e) => res.status(500).json({ message: `There was an error updating this user, ${e.message}` }));
  }

  deleteUser(req, res) {
    const storedId = req.params.id;
    return this.model.destroy({ where: { id: `${storedId}` } })
      .then((user) => res.status(200).json({ message: `deleted user: ${user}` }))
      .catch((e) => res.status(500).json({ message: `Failed to delete user, ${e.message}` }));
  }
}
export default new UserController();
