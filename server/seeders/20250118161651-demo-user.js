'use strict';
const bcrypt = require('bcrypt');
const randomUserAvatar = require('../utils/randomUserAvatar'); // Import fungsi randomAvatar

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    const hashedPassword = await bcrypt.hash('12345', 10); // Hash the password

    await queryInterface.bulkInsert(
      'Users',
      [
        {
          fullname: 'John Doe',
          email: 'johndoe@example.com',
          password: hashedPassword,
          role: 'seller',
          birthday: '1990-01-01',
          gender: 'male',
          avatar: randomUserAvatar(),
          phone: '1234567890',
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          fullname: 'Jane Smith',
          email: 'janesmith@example.com',
          password: hashedPassword,
          role: 'seller',
          birthday: '1992-02-02',
          gender: 'female',
          avatar: randomUserAvatar(),
          phone: '0987654321',
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          fullname: 'Alice Johnson',
          email: 'alicejohnson@example.com',
          password: hashedPassword,
          role: 'seller',
          birthday: '1985-03-03',
          gender: 'female',
          avatar: randomUserAvatar(),
          phone: '1122334455',
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          fullname: 'Bob Brown',
          email: 'bobbrown@example.com',
          password: hashedPassword,
          role: 'seller',
          birthday: '1988-04-04',
          gender: 'male',
          avatar: randomUserAvatar(),
          phone: '6677889900',
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          fullname: 'Charlie Davis',
          email: 'charliedavis@example.com',
          password: hashedPassword,
          role: 'seller',
          birthday: '1995-05-05',
          gender: 'male',
          avatar: randomUserAvatar(),
          phone: '0813787456321',
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          fullname: 'michael jackson',
          email: 'customer01@example.com',
          password: hashedPassword,
          role: 'customer',
          birthday: '1992-03-05',
          gender: 'male',
          avatar: randomUserAvatar(),
          phone: '0878987456321',
          createdAt: new Date(),
          updatedAt: new Date(),
        },

        {
          fullname: 'michelle jeneva',
          email: 'customer02@example.com',
          password: hashedPassword,
          role: 'customer',
          birthday: '2001-06-05',
          gender: 'female',
          avatar: randomUserAvatar(),
          phone: '0812987456321',
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          fullname: 'Alex jovovich',
          email: 'customer03@example.com',
          password: hashedPassword,
          role: 'customer',
          birthday: '1992-11-11',
          gender: 'male',
          avatar: randomUserAvatar(),
          phone: '0821987456321',
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          fullname: 'admin marketplace',
          email: 'admin@example.com',
          password: hashedPassword,
          role: 'admin',
          birthday: '1995-05-05',
          gender: 'male',
          avatar: randomUserAvatar(),
          phone: '081276543210',
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ],
      {},
    );
  },

  async down(queryInterface, Sequelize) {
    // Revert the seed by deleting the users
    await queryInterface.bulkDelete('Users', { role: 'seller' }, {});
  },
};
