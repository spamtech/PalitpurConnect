
import { query } from "../config/database.js";
import { successResponse } from "../utils/response.js";

/*
|--------------------------------------------------------------------------
| GET /directory
|--------------------------------------------------------------------------
*/

export async function getDirectory(req, res, next) {
  try {
    const result = await query(`
      SELECT
        id,
        name,
        category,
        description,
        phone,
        email,
        address,
        image_url,
        website_url,
        is_active,
        created_at,
        updated_at
      FROM directory_entries
      WHERE is_active = true
      ORDER BY name ASC
    `);

    return successResponse(
      res,
      result.rows,
      "Directory retrieved"
    );
  } catch (error) {
    next(error);
  }
}

/*
|--------------------------------------------------------------------------
| GET /directory/:id
|--------------------------------------------------------------------------
*/

export async function getDirectoryById(req, res, next) {
  try {
    const { id } = req.params;

    const result = await query(
      `
        SELECT
          id,
          name,
          category,
          description,
          phone,
          email,
          address,
          image_url,
          website_url,
          is_active,
          created_at,
          updated_at
        FROM directory_entries
        WHERE id = $1
        LIMIT 1
      `,
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Directory entry not found",
      });
    }

    return successResponse(
      res,
      result.rows[0],
      "Directory entry retrieved"
    );
  } catch (error) {
    next(error);
  }
}

/*
|--------------------------------------------------------------------------
| POST /admin/directory
|--------------------------------------------------------------------------
*/

export async function createDirectoryEntry(req, res, next) {
  try {
    const {
      name,
      category,
      description,
      phone,
      email,
      address,
      image_url,
      website_url,
      is_active,
    } = req.body;

    if (!name?.trim()) {
      return res.status(400).json({
        success: false,
        message: "Directory name is required.",
      });
    }

    if (!category?.trim()) {
      return res.status(400).json({
        success: false,
        message: "Category is required.",
      });
    }

    const result = await query(
      `
        INSERT INTO directory_entries
        (
          name,
          category,
          description,
          phone,
          email,
          address,
          image_url,
          website_url,
          is_active,
          created_by
        )
        VALUES
        (
          $1,
          $2,
          $3,
          $4,
          $5,
          $6,
          $7,
          $8,
          $9,
          $10
        )
        RETURNING
          id,
          name,
          category,
          description,
          phone,
          email,
          address,
          image_url,
          website_url,
          is_active,
          created_by,
          created_at,
          updated_at
      `,
      [
        name.trim(),
        category.trim(),
        description || null,
        phone || null,
        email || null,
        address || null,
        image_url || null,
        website_url || null,
        is_active !== false,
        req.user?.id || null,
      ]
    );

    return successResponse(
      res,
      result.rows[0],
      "Directory entry created successfully.",
      201
    );
  } catch (error) {
    next(error);
  }
}

/*
|--------------------------------------------------------------------------
| PUT /admin/directory/:id
|--------------------------------------------------------------------------
*/

export async function updateDirectoryEntry(req, res, next) {
  try {
    const { id } = req.params;

    const {
      name,
      category,
      description,
      phone,
      email,
      address,
      image_url,
      website_url,
      is_active,
    } = req.body;

    if (!name?.trim()) {
      return res.status(400).json({
        success: false,
        message: "Directory name is required.",
      });
    }

    if (!category?.trim()) {
      return res.status(400).json({
        success: false,
        message: "Category is required.",
      });
    }

    const result = await query(
      `
        UPDATE directory_entries
        SET
          name = $1,
          category = $2,
          description = $3,
          phone = $4,
          email = $5,
          address = $6,
          image_url = $7,
          website_url = $8,
          is_active = $9,
          updated_at = NOW()
        WHERE id = $10
        RETURNING
          id,
          name,
          category,
          description,
          phone,
          email,
          address,
          image_url,
          website_url,
          is_active,
          created_by,
          created_at,
          updated_at
      `,
      [
        name.trim(),
        category.trim(),
        description || null,
        phone || null,
        email || null,
        address || null,
        image_url || null,
        website_url || null,
        is_active !== false,
        id,
      ]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Directory entry not found.",
      });
    }

    return successResponse(
      res,
      result.rows[0],
      "Directory entry updated successfully."
    );
  } catch (error) {
    next(error);
  }
}

/*
|--------------------------------------------------------------------------
| DELETE /admin/directory/:id
|--------------------------------------------------------------------------
*/

export async function deleteDirectoryEntry(req, res, next) {
  try {
    const { id } = req.params;

    const result = await query(
      `
        DELETE FROM directory_entries
        WHERE id = $1
        RETURNING id
      `,
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Directory entry not found.",
      });
    }

    return successResponse(
      res,
      { id: result.rows[0].id },
      "Directory entry deleted successfully."
    );
  } catch (error) {
    next(error);
  }
}
