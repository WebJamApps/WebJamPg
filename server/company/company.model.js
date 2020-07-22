const Sequelize = require('sequelize');
const sequelize = require('../../config/db');
const User = require('../user/user.model');

const CompanyModel = sequelize.define('company', {
  // attributes
  name: { type: Sequelize.STRING, allowNull: false },
  type: { type: Sequelize.STRING },
  slogan: { type: Sequelize.STRING },
  number_employees: { type: Sequelize.INTEGER },
}, {
  // options
});
CompanyModel.hasMany(User);// makes foreign key
module.exports = CompanyModel;
