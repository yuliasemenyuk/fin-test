import { Router } from 'express';
import { getDbPool } from '../../database/config';
import { db } from '../../database/knex';

const router = Router();

router.get('/', async (req, res) => {
  try {
    // Option 1: Using Knex query builder
    const users = await db('Person')
      .select('*')
      .orderBy('id');
    
    res.status(200).json(users);
  } catch (error) {
    console.error('Error fetching users:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch users'
    });
  }
});

router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    
    // Option 2: Using raw SQL when needed
    const pool = await getDbPool();
    const result = await pool.request()
      .input('id', id)
      .query('SELECT * FROM Person WHERE id = @id');
    
    if (result.recordset.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    res.status(200).json(result.recordset[0]);
  } catch (error) {
    console.error('Error fetching user:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch user'
    });
  }
});

export { router }; 