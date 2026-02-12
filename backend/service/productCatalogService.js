import { ProductCatalog } from '../model/index.js';
import { Op } from 'sequelize';

export const listAll = async (query = '') => {
  const where = {};
  if (query) {
    where.name = { [Op.like]: `%${query}%` };
  }
  return await ProductCatalog.findAll({
    where,
    order: [['name', 'ASC']],
  });
};

export const create = async (data) => {
  return await ProductCatalog.create(data);
};

export const findById = async (id) => {
  return await ProductCatalog.findByPk(id);
};

export const update = async (id, data) => {
  const product = await findById(id);
  if (!product) return null;
  return await product.update(data);
};

export const remove = async (id) => {
  const product = await findById(id);
  if (!product) return null;
  await product.destroy();
  return true;
};
