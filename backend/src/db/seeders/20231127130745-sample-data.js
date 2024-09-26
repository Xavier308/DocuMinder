const db = require('../models');
const Users = db.users;

const Activities = db.activities;

const Documents = db.documents;

const Reminders = db.reminders;

const Reports = db.reports;

const ActivitiesData = [
  {
    action: 'Added new document',

    timestamp: new Date('2023-07-15T00:00:00Z'),

    // type code here for "relation_one" field
  },

  {
    action: 'Edited document information',

    timestamp: new Date('2023-07-16T00:00:00Z'),

    // type code here for "relation_one" field
  },

  {
    action: 'Deleted document',

    timestamp: new Date('2023-07-17T00:00:00Z'),

    // type code here for "relation_one" field
  },

  {
    action: 'Viewed document status',

    timestamp: new Date('2023-07-18T00:00:00Z'),

    // type code here for "relation_one" field
  },

  {
    action: 'Resolved technical issue',

    timestamp: new Date('2023-07-19T00:00:00Z'),

    // type code here for "relation_one" field
  },
];

const DocumentsData = [
  {
    title: 'Passport',

    expiration_date: new Date('2024-05-15T00:00:00Z'),

    // type code here for "files" field

    // type code here for "relation_one" field
  },

  {
    title: "Driver's License",

    expiration_date: new Date('2023-11-20T00:00:00Z'),

    // type code here for "files" field

    // type code here for "relation_one" field
  },

  {
    title: 'Work Permit',

    expiration_date: new Date('2023-12-01T00:00:00Z'),

    // type code here for "files" field

    // type code here for "relation_one" field
  },

  {
    title: 'Health Insurance',

    expiration_date: new Date('2024-01-10T00:00:00Z'),

    // type code here for "files" field

    // type code here for "relation_one" field
  },

  {
    title: 'Visa',

    expiration_date: new Date('2023-09-30T00:00:00Z'),

    // type code here for "files" field

    // type code here for "relation_one" field
  },
];

const RemindersData = [
  {
    reminder_date: new Date('2023-10-15T00:00:00Z'),

    // type code here for "relation_one" field

    // type code here for "relation_one" field
  },

  {
    reminder_date: new Date('2023-11-05T00:00:00Z'),

    // type code here for "relation_one" field

    // type code here for "relation_one" field
  },

  {
    reminder_date: new Date('2023-11-20T00:00:00Z'),

    // type code here for "relation_one" field

    // type code here for "relation_one" field
  },

  {
    reminder_date: new Date('2023-12-25T00:00:00Z'),

    // type code here for "relation_one" field

    // type code here for "relation_one" field
  },

  {
    reminder_date: new Date('2023-09-15T00:00:00Z'),

    // type code here for "relation_one" field

    // type code here for "relation_one" field
  },
];

const ReportsData = [
  {
    title: 'Monthly Document Status',

    generated_at: new Date('2023-08-01T00:00:00Z'),

    // type code here for "relation_one" field
  },

  {
    title: 'Team Document Expirations',

    generated_at: new Date('2023-08-01T00:00:00Z'),

    // type code here for "relation_one" field
  },

  {
    title: 'User Activity Report',

    generated_at: new Date('2023-08-01T00:00:00Z'),

    // type code here for "relation_one" field
  },

  {
    title: 'Compliance Audit Report',

    generated_at: new Date('2023-08-01T00:00:00Z'),

    // type code here for "relation_one" field
  },

  {
    title: 'Technical Support Log',

    generated_at: new Date('2023-08-01T00:00:00Z'),

    // type code here for "relation_one" field
  },
];

// Similar logic for "relation_many"

async function associateActivityWithUser() {
  const relatedUser0 = await Users.findOne({
    offset: Math.floor(Math.random() * (await Users.count())),
  });
  const Activity0 = await Activities.findOne({
    order: [['id', 'ASC']],
    offset: 0,
  });
  if (Activity0?.setUser) {
    await Activity0.setUser(relatedUser0);
  }

  const relatedUser1 = await Users.findOne({
    offset: Math.floor(Math.random() * (await Users.count())),
  });
  const Activity1 = await Activities.findOne({
    order: [['id', 'ASC']],
    offset: 1,
  });
  if (Activity1?.setUser) {
    await Activity1.setUser(relatedUser1);
  }

  const relatedUser2 = await Users.findOne({
    offset: Math.floor(Math.random() * (await Users.count())),
  });
  const Activity2 = await Activities.findOne({
    order: [['id', 'ASC']],
    offset: 2,
  });
  if (Activity2?.setUser) {
    await Activity2.setUser(relatedUser2);
  }

  const relatedUser3 = await Users.findOne({
    offset: Math.floor(Math.random() * (await Users.count())),
  });
  const Activity3 = await Activities.findOne({
    order: [['id', 'ASC']],
    offset: 3,
  });
  if (Activity3?.setUser) {
    await Activity3.setUser(relatedUser3);
  }

  const relatedUser4 = await Users.findOne({
    offset: Math.floor(Math.random() * (await Users.count())),
  });
  const Activity4 = await Activities.findOne({
    order: [['id', 'ASC']],
    offset: 4,
  });
  if (Activity4?.setUser) {
    await Activity4.setUser(relatedUser4);
  }
}

async function associateDocumentWithUser() {
  const relatedUser0 = await Users.findOne({
    offset: Math.floor(Math.random() * (await Users.count())),
  });
  const Document0 = await Documents.findOne({
    order: [['id', 'ASC']],
    offset: 0,
  });
  if (Document0?.setUser) {
    await Document0.setUser(relatedUser0);
  }

  const relatedUser1 = await Users.findOne({
    offset: Math.floor(Math.random() * (await Users.count())),
  });
  const Document1 = await Documents.findOne({
    order: [['id', 'ASC']],
    offset: 1,
  });
  if (Document1?.setUser) {
    await Document1.setUser(relatedUser1);
  }

  const relatedUser2 = await Users.findOne({
    offset: Math.floor(Math.random() * (await Users.count())),
  });
  const Document2 = await Documents.findOne({
    order: [['id', 'ASC']],
    offset: 2,
  });
  if (Document2?.setUser) {
    await Document2.setUser(relatedUser2);
  }

  const relatedUser3 = await Users.findOne({
    offset: Math.floor(Math.random() * (await Users.count())),
  });
  const Document3 = await Documents.findOne({
    order: [['id', 'ASC']],
    offset: 3,
  });
  if (Document3?.setUser) {
    await Document3.setUser(relatedUser3);
  }

  const relatedUser4 = await Users.findOne({
    offset: Math.floor(Math.random() * (await Users.count())),
  });
  const Document4 = await Documents.findOne({
    order: [['id', 'ASC']],
    offset: 4,
  });
  if (Document4?.setUser) {
    await Document4.setUser(relatedUser4);
  }
}

async function associateReminderWithDocument() {
  const relatedDocument0 = await Documents.findOne({
    offset: Math.floor(Math.random() * (await Documents.count())),
  });
  const Reminder0 = await Reminders.findOne({
    order: [['id', 'ASC']],
    offset: 0,
  });
  if (Reminder0?.setDocument) {
    await Reminder0.setDocument(relatedDocument0);
  }

  const relatedDocument1 = await Documents.findOne({
    offset: Math.floor(Math.random() * (await Documents.count())),
  });
  const Reminder1 = await Reminders.findOne({
    order: [['id', 'ASC']],
    offset: 1,
  });
  if (Reminder1?.setDocument) {
    await Reminder1.setDocument(relatedDocument1);
  }

  const relatedDocument2 = await Documents.findOne({
    offset: Math.floor(Math.random() * (await Documents.count())),
  });
  const Reminder2 = await Reminders.findOne({
    order: [['id', 'ASC']],
    offset: 2,
  });
  if (Reminder2?.setDocument) {
    await Reminder2.setDocument(relatedDocument2);
  }

  const relatedDocument3 = await Documents.findOne({
    offset: Math.floor(Math.random() * (await Documents.count())),
  });
  const Reminder3 = await Reminders.findOne({
    order: [['id', 'ASC']],
    offset: 3,
  });
  if (Reminder3?.setDocument) {
    await Reminder3.setDocument(relatedDocument3);
  }

  const relatedDocument4 = await Documents.findOne({
    offset: Math.floor(Math.random() * (await Documents.count())),
  });
  const Reminder4 = await Reminders.findOne({
    order: [['id', 'ASC']],
    offset: 4,
  });
  if (Reminder4?.setDocument) {
    await Reminder4.setDocument(relatedDocument4);
  }
}

async function associateReminderWithUser() {
  const relatedUser0 = await Users.findOne({
    offset: Math.floor(Math.random() * (await Users.count())),
  });
  const Reminder0 = await Reminders.findOne({
    order: [['id', 'ASC']],
    offset: 0,
  });
  if (Reminder0?.setUser) {
    await Reminder0.setUser(relatedUser0);
  }

  const relatedUser1 = await Users.findOne({
    offset: Math.floor(Math.random() * (await Users.count())),
  });
  const Reminder1 = await Reminders.findOne({
    order: [['id', 'ASC']],
    offset: 1,
  });
  if (Reminder1?.setUser) {
    await Reminder1.setUser(relatedUser1);
  }

  const relatedUser2 = await Users.findOne({
    offset: Math.floor(Math.random() * (await Users.count())),
  });
  const Reminder2 = await Reminders.findOne({
    order: [['id', 'ASC']],
    offset: 2,
  });
  if (Reminder2?.setUser) {
    await Reminder2.setUser(relatedUser2);
  }

  const relatedUser3 = await Users.findOne({
    offset: Math.floor(Math.random() * (await Users.count())),
  });
  const Reminder3 = await Reminders.findOne({
    order: [['id', 'ASC']],
    offset: 3,
  });
  if (Reminder3?.setUser) {
    await Reminder3.setUser(relatedUser3);
  }

  const relatedUser4 = await Users.findOne({
    offset: Math.floor(Math.random() * (await Users.count())),
  });
  const Reminder4 = await Reminders.findOne({
    order: [['id', 'ASC']],
    offset: 4,
  });
  if (Reminder4?.setUser) {
    await Reminder4.setUser(relatedUser4);
  }
}

async function associateReportWithUser() {
  const relatedUser0 = await Users.findOne({
    offset: Math.floor(Math.random() * (await Users.count())),
  });
  const Report0 = await Reports.findOne({
    order: [['id', 'ASC']],
    offset: 0,
  });
  if (Report0?.setUser) {
    await Report0.setUser(relatedUser0);
  }

  const relatedUser1 = await Users.findOne({
    offset: Math.floor(Math.random() * (await Users.count())),
  });
  const Report1 = await Reports.findOne({
    order: [['id', 'ASC']],
    offset: 1,
  });
  if (Report1?.setUser) {
    await Report1.setUser(relatedUser1);
  }

  const relatedUser2 = await Users.findOne({
    offset: Math.floor(Math.random() * (await Users.count())),
  });
  const Report2 = await Reports.findOne({
    order: [['id', 'ASC']],
    offset: 2,
  });
  if (Report2?.setUser) {
    await Report2.setUser(relatedUser2);
  }

  const relatedUser3 = await Users.findOne({
    offset: Math.floor(Math.random() * (await Users.count())),
  });
  const Report3 = await Reports.findOne({
    order: [['id', 'ASC']],
    offset: 3,
  });
  if (Report3?.setUser) {
    await Report3.setUser(relatedUser3);
  }

  const relatedUser4 = await Users.findOne({
    offset: Math.floor(Math.random() * (await Users.count())),
  });
  const Report4 = await Reports.findOne({
    order: [['id', 'ASC']],
    offset: 4,
  });
  if (Report4?.setUser) {
    await Report4.setUser(relatedUser4);
  }
}

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await Activities.bulkCreate(ActivitiesData);

    await Documents.bulkCreate(DocumentsData);

    await Reminders.bulkCreate(RemindersData);

    await Reports.bulkCreate(ReportsData);

    await Promise.all([
      // Similar logic for "relation_many"

      await associateActivityWithUser(),

      await associateDocumentWithUser(),

      await associateReminderWithDocument(),

      await associateReminderWithUser(),

      await associateReportWithUser(),
    ]);
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('activities', null, {});

    await queryInterface.bulkDelete('documents', null, {});

    await queryInterface.bulkDelete('reminders', null, {});

    await queryInterface.bulkDelete('reports', null, {});
  },
};
