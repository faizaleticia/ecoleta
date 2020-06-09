import { Request, Response, request } from 'express';
import knex from '../database/connection';

class PointsController {
  async index(request: Request, response: Response) {
    const { city, uf, items } = request.query;

    let points;

    if (items) {
      const parsedItems = String(items)
      .split(',')
      .map(item => Number(item.trim()));

      points = await knex('points')
        .join('point_items', 'points.id', '=', 'point_items.point_id')
        .whereIn('point_items.item_id', parsedItems)
        .where('city', String(city))
        .where('uf', String(uf))
        .distinct()
        .select('points.*');
    } else {
      points = await knex('points')
        .join('point_items', 'points.id', '=', 'point_items.point_id')
        .where('city', String(city))
        .where('uf', String(uf))
        .distinct()
        .select('points.*');
    }

    for (let index = 0; index < points.length; index++) {
      const point = points[index];
      let items = await knex('point_items')
        .join('items', 'items.id', '=', 'point_items.item_id')
        .where('point_items.point_id', String(point.id))
        .select('items.title');

      items = items.map(item => item.title);

      points[index].items = items.join(', ');
      points[index].image_url = `http://192.168.1.104:3333/uploads/markets/${point.image}`;
    }

    return response.json(points);
  }

  async show(request: Request, response: Response) {
    const { id } = request.params;

    const point = await knex('points').where('id', id).first();

    if (!point) {
      return response.status(400).json({ message: 'Point not found.' });
    }

    const items = await knex('items')
      .join('point_items', 'items.id', '=', 'point_items.item_id')
      .where('point_items.point_id', id)
      .select('items.title');

    const serializedPoint = {
      ...point,
      image_url: `http://192.168.1.104:3333/uploads/markets/${point.image}`
    }

    return response.json({ point: serializedPoint, items });
  }

  async create (request: Request, response: Response) {
    const {
      name,
      email,
      whatsapp,
      latitude,
      longitude,
      city,
      uf,
      items
    } = request.body;

    const trx = await knex.transaction();

    const point = {
      image: request.file.filename,
      name,
      email,
      whatsapp,
      latitude,
      longitude,
      city,
      uf
    };

    const insertedIds = await trx('points').insert(point);

    const pointId = insertedIds[0];

    const pointItems = items
      .split(',')
      .map((itemId: string) => Number(itemId.trim()))
      .map((itemId: number) => {
        return {
          item_id: itemId,
          point_id: pointId,
        };
      });

    await trx('point_items').insert(pointItems);

    await trx.commit();

    return response.json({ 
      id: pointId,
      ...point, 
    });
  }
}

export default PointsController;