import Sequelize from 'sequelize';
import sequelize from '../config/db';

const UserModel = sequelize.define('user', {
  // attributes
  username: {
    type: Sequelize.STRING,
  },
  password: {
    type: Sequelize.STRING,
  },
  pin: {
    type: Sequelize.STRING,
  },
  companyId: { type: Sequelize.INTEGER },
}, {

  timestamps: false,

});

export default UserModel;
