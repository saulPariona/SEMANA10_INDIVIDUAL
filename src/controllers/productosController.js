import { pool } from '../config/db.js';

function validateProductInput(body, partial = false) {
  const errors = [];
  const allowedFields = ['nombre', 'descripcion', 'precio', 'stock'];

  if (partial && Object.keys(body).length === 0) {
    errors.push('Debe enviar al menos un campo para actualizar');
  }

  for (const field of Object.keys(body)) {
    if (!allowedFields.includes(field)) {
      errors.push(`Campo no permitido: ${field}`);
    }
  }

  if (!partial || body.nombre !== undefined) {
    if (typeof body.nombre !== 'string' || body.nombre.trim().length < 2) {
      errors.push('El nombre debe ser un texto de al menos 2 caracteres');
    }
  }

  if (!partial || body.descripcion !== undefined) {
    if (body.descripcion !== null && typeof body.descripcion !== 'string') {
      errors.push('La descripción debe ser texto o null');
    }
  }

  if (!partial || body.precio !== undefined) {
    const price = Number(body.precio);
    if (!Number.isFinite(price) || price < 0) {
      errors.push('El precio debe ser un número mayor o igual a 0');
    }
  }

  if (!partial || body.stock !== undefined) {
    if (!Number.isInteger(body.stock) || body.stock < 0) {
      errors.push('El stock debe ser un entero mayor o igual a 0');
    }
  }

  return errors;
}

function parseId(value) {
  const id = Number(value);
  return Number.isInteger(id) && id > 0 ? id : null;
}

export async function listarProductos(_req, res, next) {
  try {
    const [rows] = await pool.execute(
      'SELECT id, nombre, descripcion, precio, stock, created_at, updated_at FROM productos ORDER BY id DESC'
    );
    res.status(200).json(rows);
  } catch (error) {
    next(error);
  }
}

export async function obtenerProducto(req, res, next) {
  const id = parseId(req.params.id);
  if (!id) {
    return res.status(400).json({ error: 'El id debe ser un entero positivo' });
  }

  try {
    const [rows] = await pool.execute(
      'SELECT id, nombre, descripcion, precio, stock, created_at, updated_at FROM productos WHERE id = ?',
      [id]
    );
    if (rows.length === 0) {
      return res.status(404).json({ error: 'Producto no encontrado' });
    }
    return res.status(200).json(rows[0]);
  } catch (error) {
    return next(error);
  }
}

export async function crearProducto(req, res, next) {
  const errors = validateProductInput(req.body);
  if (errors.length > 0) {
    return res.status(400).json({ error: 'Datos inválidos', details: errors });
  }

  const { nombre, descripcion = null, precio, stock } = req.body;
  try {
    const [result] = await pool.execute(
      'INSERT INTO productos (nombre, descripcion, precio, stock) VALUES (?, ?, ?, ?)',
      [nombre.trim(), descripcion, Number(precio), stock]
    );
    const [rows] = await pool.execute(
      'SELECT id, nombre, descripcion, precio, stock, created_at, updated_at FROM productos WHERE id = ?',
      [result.insertId]
    );
    return res.status(201).json(rows[0]);
  } catch (error) {
    return next(error);
  }
}

export async function actualizarProducto(req, res, next) {
  const id = parseId(req.params.id);
  if (!id) {
    return res.status(400).json({ error: 'El id debe ser un entero positivo' });
  }

  const errors = validateProductInput(req.body, true);
  if (errors.length > 0) {
    return res.status(400).json({ error: 'Datos inválidos', details: errors });
  }

  const fields = Object.keys(req.body);
  const values = fields.map((field) =>
    field === 'nombre' ? req.body[field].trim() : req.body[field]
  );
  const assignments = fields.map((field) => `${field} = ?`).join(', ');

  try {
    const [result] = await pool.execute(
      `UPDATE productos SET ${assignments} WHERE id = ?`,
      [...values, id]
    );
    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Producto no encontrado' });
    }

    const [rows] = await pool.execute(
      'SELECT id, nombre, descripcion, precio, stock, created_at, updated_at FROM productos WHERE id = ?',
      [id]
    );
    return res.status(200).json(rows[0]);
  } catch (error) {
    return next(error);
  }
}

export async function eliminarProducto(req, res, next) {
  const id = parseId(req.params.id);
  if (!id) {
    return res.status(400).json({ error: 'El id debe ser un entero positivo' });
  }

  try {
    const [result] = await pool.execute('DELETE FROM productos WHERE id = ?', [id]);
    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Producto no encontrado' });
    }
    return res.status(204).send();
  } catch (error) {
    return next(error);
  }
}
