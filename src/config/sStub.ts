const findAllReturns = {
  addUser: ():any => Promise.resolve(true),
};
const sStub = {
  drop: () => Promise.resolve(true),
  queryInterface: { bulkDelete: () => Promise.resolve(true), bulkInsert: () => Promise.resolve(true) },
  close: () => {},
  QueryTypes: { select: '' },
  // query: () => Promise.resolve(true),
  authenticate: () => Promise.resolve(true),
  define: () => ({
    hasMany: () => {},
    // count: () => Promise.resolve(true),
    sync: () => Promise.resolve(true),
    findOne: () => Promise.resolve({ name: 'test.jpg', set: () => {}, save: () => Promise.resolve({ name: 'Max', id: '123' }) }),
    destroy: () => Promise.resolve(true),
    findAll: () => Promise.resolve([findAllReturns, findAllReturns, findAllReturns, {}, {}, {}, {}, {}, findAllReturns]),
    create: () => Promise.resolve({ id: '123' }),
    update: () => Promise.resolve(true),
  }),
  options: {
    logging: false,
  },
};
export default { sStub, findAllReturns };
