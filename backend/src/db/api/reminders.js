const db = require('../models');
const FileDBApi = require('./file');
const crypto = require('crypto');
const Utils = require('../utils');

const Sequelize = db.Sequelize;
const Op = Sequelize.Op;

module.exports = class RemindersDBApi {
  static async create(data, options) {
    const currentUser = (options && options.currentUser) || { id: null };
    const transaction = (options && options.transaction) || undefined;

    const reminders = await db.reminders.create(
      {
        id: data.id || undefined,

        reminder_date: data.reminder_date || null,
        importHash: data.importHash || null,
        createdById: currentUser.id,
        updatedById: currentUser.id,
      },
      { transaction },
    );

    await reminders.setDocument(data.document || null, {
      transaction,
    });

    await reminders.setUser(data.user || null, {
      transaction,
    });

    return reminders;
  }

  static async bulkImport(data, options) {
    const currentUser = (options && options.currentUser) || { id: null };
    const transaction = (options && options.transaction) || undefined;

    // Prepare data - wrapping individual data transformations in a map() method
    const remindersData = data.map((item, index) => ({
      id: item.id || undefined,

      reminder_date: item.reminder_date || null,
      importHash: item.importHash || null,
      createdById: currentUser.id,
      updatedById: currentUser.id,
      createdAt: new Date(Date.now() + index * 1000),
    }));

    // Bulk create items
    const reminders = await db.reminders.bulkCreate(remindersData, {
      transaction,
    });

    // For each item created, replace relation files

    return reminders;
  }

  static async update(id, data, options) {
    const currentUser = (options && options.currentUser) || { id: null };
    const transaction = (options && options.transaction) || undefined;

    const reminders = await db.reminders.findByPk(id, {}, { transaction });

    await reminders.update(
      {
        reminder_date: data.reminder_date || null,
        updatedById: currentUser.id,
      },
      { transaction },
    );

    await reminders.setDocument(data.document || null, {
      transaction,
    });

    await reminders.setUser(data.user || null, {
      transaction,
    });

    return reminders;
  }

  static async deleteByIds(ids, options) {
    const currentUser = (options && options.currentUser) || { id: null };
    const transaction = (options && options.transaction) || undefined;

    const reminders = await db.reminders.findAll({
      where: {
        id: {
          [Op.in]: ids,
        },
      },
      transaction,
    });

    await db.sequelize.transaction(async (transaction) => {
      for (const record of reminders) {
        await record.update({ deletedBy: currentUser.id }, { transaction });
      }
      for (const record of reminders) {
        await record.destroy({ transaction });
      }
    });

    return reminders;
  }

  static async remove(id, options) {
    const currentUser = (options && options.currentUser) || { id: null };
    const transaction = (options && options.transaction) || undefined;

    const reminders = await db.reminders.findByPk(id, options);

    await reminders.update(
      {
        deletedBy: currentUser.id,
      },
      {
        transaction,
      },
    );

    await reminders.destroy({
      transaction,
    });

    return reminders;
  }

  static async findBy(where, options) {
    const transaction = (options && options.transaction) || undefined;

    const reminders = await db.reminders.findOne({ where }, { transaction });

    if (!reminders) {
      return reminders;
    }

    const output = reminders.get({ plain: true });

    output.document = await reminders.getDocument({
      transaction,
    });

    output.user = await reminders.getUser({
      transaction,
    });

    return output;
  }

  static async findAll(filter, options) {
    var limit = filter.limit || 0;
    var offset = 0;
    const currentPage = +filter.page;

    offset = currentPage * limit;

    var orderBy = null;

    const transaction = (options && options.transaction) || undefined;
    let where = {};
    let include = [
      {
        model: db.documents,
        as: 'document',
      },

      {
        model: db.users,
        as: 'user',
      },
    ];

    if (filter) {
      if (filter.id) {
        where = {
          ...where,
          ['id']: Utils.uuid(filter.id),
        };
      }

      if (filter.reminder_dateRange) {
        const [start, end] = filter.reminder_dateRange;

        if (start !== undefined && start !== null && start !== '') {
          where = {
            ...where,
            reminder_date: {
              ...where.reminder_date,
              [Op.gte]: start,
            },
          };
        }

        if (end !== undefined && end !== null && end !== '') {
          where = {
            ...where,
            reminder_date: {
              ...where.reminder_date,
              [Op.lte]: end,
            },
          };
        }
      }

      if (
        filter.active === true ||
        filter.active === 'true' ||
        filter.active === false ||
        filter.active === 'false'
      ) {
        where = {
          ...where,
          active: filter.active === true || filter.active === 'true',
        };
      }

      if (filter.document) {
        var listItems = filter.document.split('|').map((item) => {
          return Utils.uuid(item);
        });

        where = {
          ...where,
          documentId: { [Op.or]: listItems },
        };
      }

      if (filter.user) {
        var listItems = filter.user.split('|').map((item) => {
          return Utils.uuid(item);
        });

        where = {
          ...where,
          userId: { [Op.or]: listItems },
        };
      }

      if (filter.createdAtRange) {
        const [start, end] = filter.createdAtRange;

        if (start !== undefined && start !== null && start !== '') {
          where = {
            ...where,
            ['createdAt']: {
              ...where.createdAt,
              [Op.gte]: start,
            },
          };
        }

        if (end !== undefined && end !== null && end !== '') {
          where = {
            ...where,
            ['createdAt']: {
              ...where.createdAt,
              [Op.lte]: end,
            },
          };
        }
      }
    }

    let { rows, count } = options?.countOnly
      ? {
          rows: [],
          count: await db.reminders.count({
            where,
            include,
            distinct: true,
            limit: limit ? Number(limit) : undefined,
            offset: offset ? Number(offset) : undefined,
            order:
              filter.field && filter.sort
                ? [[filter.field, filter.sort]]
                : [['createdAt', 'desc']],
            transaction,
          }),
        }
      : await db.reminders.findAndCountAll({
          where,
          include,
          distinct: true,
          limit: limit ? Number(limit) : undefined,
          offset: offset ? Number(offset) : undefined,
          order:
            filter.field && filter.sort
              ? [[filter.field, filter.sort]]
              : [['createdAt', 'desc']],
          transaction,
        });

    //    rows = await this._fillWithRelationsAndFilesForRows(
    //      rows,
    //      options,
    //    );

    return { rows, count };
  }

  static async findAllAutocomplete(query, limit) {
    let where = {};

    if (query) {
      where = {
        [Op.or]: [
          { ['id']: Utils.uuid(query) },
          Utils.ilike('reminders', 'reminder_date', query),
        ],
      };
    }

    const records = await db.reminders.findAll({
      attributes: ['id', 'reminder_date'],
      where,
      limit: limit ? Number(limit) : undefined,
      orderBy: [['reminder_date', 'ASC']],
    });

    return records.map((record) => ({
      id: record.id,
      label: record.reminder_date,
    }));
  }
};
