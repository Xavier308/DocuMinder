const db = require('../models');
const FileDBApi = require('./file');
const crypto = require('crypto');
const Utils = require('../utils');

const Sequelize = db.Sequelize;
const Op = Sequelize.Op;

module.exports = class ActivitiesDBApi {
  static async create(data, options) {
    const currentUser = (options && options.currentUser) || { id: null };
    const transaction = (options && options.transaction) || undefined;

    const activities = await db.activities.create(
      {
        id: data.id || undefined,

        action: data.action || null,
        timestamp: data.timestamp || null,
        importHash: data.importHash || null,
        createdById: currentUser.id,
        updatedById: currentUser.id,
      },
      { transaction },
    );

    await activities.setUser(data.user || null, {
      transaction,
    });

    return activities;
  }

  static async bulkImport(data, options) {
    const currentUser = (options && options.currentUser) || { id: null };
    const transaction = (options && options.transaction) || undefined;

    // Prepare data - wrapping individual data transformations in a map() method
    const activitiesData = data.map((item, index) => ({
      id: item.id || undefined,

      action: item.action || null,
      timestamp: item.timestamp || null,
      importHash: item.importHash || null,
      createdById: currentUser.id,
      updatedById: currentUser.id,
      createdAt: new Date(Date.now() + index * 1000),
    }));

    // Bulk create items
    const activities = await db.activities.bulkCreate(activitiesData, {
      transaction,
    });

    // For each item created, replace relation files

    return activities;
  }

  static async update(id, data, options) {
    const currentUser = (options && options.currentUser) || { id: null };
    const transaction = (options && options.transaction) || undefined;

    const activities = await db.activities.findByPk(id, {}, { transaction });

    await activities.update(
      {
        action: data.action || null,
        timestamp: data.timestamp || null,
        updatedById: currentUser.id,
      },
      { transaction },
    );

    await activities.setUser(data.user || null, {
      transaction,
    });

    return activities;
  }

  static async deleteByIds(ids, options) {
    const currentUser = (options && options.currentUser) || { id: null };
    const transaction = (options && options.transaction) || undefined;

    const activities = await db.activities.findAll({
      where: {
        id: {
          [Op.in]: ids,
        },
      },
      transaction,
    });

    await db.sequelize.transaction(async (transaction) => {
      for (const record of activities) {
        await record.update({ deletedBy: currentUser.id }, { transaction });
      }
      for (const record of activities) {
        await record.destroy({ transaction });
      }
    });

    return activities;
  }

  static async remove(id, options) {
    const currentUser = (options && options.currentUser) || { id: null };
    const transaction = (options && options.transaction) || undefined;

    const activities = await db.activities.findByPk(id, options);

    await activities.update(
      {
        deletedBy: currentUser.id,
      },
      {
        transaction,
      },
    );

    await activities.destroy({
      transaction,
    });

    return activities;
  }

  static async findBy(where, options) {
    const transaction = (options && options.transaction) || undefined;

    const activities = await db.activities.findOne({ where }, { transaction });

    if (!activities) {
      return activities;
    }

    const output = activities.get({ plain: true });

    output.user = await activities.getUser({
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

      if (filter.action) {
        where = {
          ...where,
          [Op.and]: Utils.ilike('activities', 'action', filter.action),
        };
      }

      if (filter.timestampRange) {
        const [start, end] = filter.timestampRange;

        if (start !== undefined && start !== null && start !== '') {
          where = {
            ...where,
            timestamp: {
              ...where.timestamp,
              [Op.gte]: start,
            },
          };
        }

        if (end !== undefined && end !== null && end !== '') {
          where = {
            ...where,
            timestamp: {
              ...where.timestamp,
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
          count: await db.activities.count({
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
      : await db.activities.findAndCountAll({
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
          Utils.ilike('activities', 'action', query),
        ],
      };
    }

    const records = await db.activities.findAll({
      attributes: ['id', 'action'],
      where,
      limit: limit ? Number(limit) : undefined,
      orderBy: [['action', 'ASC']],
    });

    return records.map((record) => ({
      id: record.id,
      label: record.action,
    }));
  }
};
