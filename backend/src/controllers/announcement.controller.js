
import { query } from "../config/database.js";

/**
 * GET ALL ANNOUNCEMENTS FOR ADMIN
 *
 * Admin sees every announcement until it is deleted.
 */
export async function getAnnouncements(req, res, next) {
  try {
    const result = await query(`
      SELECT
        id,
        title,
        description,
        category,
        image_url,
        is_published,
        published_at,
        created_by,
        created_at,
        updated_at
      FROM announcements
      ORDER BY created_at DESC
    `);

    return res.status(200).json({
      success: true,
      message: "All announcements fetched successfully",
      data: {
        announcements: result.rows,
      },
    });
  } catch (error) {
    next(error);
  }
}


/**
 * GET SINGLE ANNOUNCEMENT FOR ADMIN
 */
export async function getAnnouncementById(req, res, next) {
  try {
    const { id } = req.params;

    const result = await query(
      `
        SELECT
          id,
          title,
          description,
          category,
          image_url,
          is_published,
          published_at,
          created_by,
          created_at,
          updated_at
        FROM announcements
        WHERE id = $1
        LIMIT 1
      `,
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Announcement not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Announcement fetched successfully",
      data: {
        announcement: result.rows[0],
      },
    });
  } catch (error) {
    next(error);
  }
}


/**
 * CREATE ANNOUNCEMENT
 */
export async function createAnnouncement(req, res, next) {
  try {
    const {
      title,
      description,
      category = "general",
      image_url = null,
      is_published = true,
      published_at = null,
    } = req.body;

    if (!title?.trim()) {
      return res.status(400).json({
        success: false,
        message: "Title is required",
      });
    }

    if (!description?.trim()) {
      return res.status(400).json({
        success: false,
        message: "Description is required",
      });
    }

    const result = await query(
      `
        INSERT INTO announcements (
          title,
          description,
          category,
          image_url,
          is_published,
          published_at,
          created_by
        )
        VALUES (
          $1,
          $2,
          $3,
          $4,
          $5,
          $6,
          $7
        )
        RETURNING
          id,
          title,
          description,
          category,
          image_url,
          is_published,
          published_at,
          created_by,
          created_at,
          updated_at
      `,
      [
        title.trim(),
        description.trim(),
        category,
        image_url,
        is_published,
        published_at || null,
        req.user?.id || null,
      ]
    );

    return res.status(201).json({
      success: true,
      message: "Announcement created successfully",
      data: {
        announcement: result.rows[0],
      },
    });
  } catch (error) {
    next(error);
  }
}


/**
 * UPDATE ANNOUNCEMENT
 */
export async function updateAnnouncement(req, res, next) {
  try {
    const { id } = req.params;

    const {
      title,
      description,
      category,
      image_url,
      is_published,
      published_at,
    } = req.body;

    const result = await query(
      `
        UPDATE announcements
        SET
          title = COALESCE($1, title),
          description = COALESCE($2, description),
          category = COALESCE($3, category),
          image_url = $4,
          is_published = COALESCE($5, is_published),
          published_at = $6,
          updated_at = CURRENT_TIMESTAMP
        WHERE id = $7
        RETURNING
          id,
          title,
          description,
          category,
          image_url,
          is_published,
          published_at,
          created_by,
          created_at,
          updated_at
      `,
      [
        title?.trim() || null,
        description?.trim() || null,
        category || null,
        image_url || null,
        typeof is_published === "boolean"
          ? is_published
          : null,
        published_at || null,
        id,
      ]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Announcement not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Announcement updated successfully",
      data: {
        announcement: result.rows[0],
      },
    });
  } catch (error) {
    next(error);
  }
}


/**
 * DELETE ANNOUNCEMENT
 *
 * This is the ONLY normal operation that permanently
 * removes an announcement from the admin list.
 */
export async function deleteAnnouncement(req, res, next) {
  try {
    const { id } = req.params;

    const result = await query(
      `
        DELETE FROM announcements
        WHERE id = $1
        RETURNING id
      `,
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Announcement not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Announcement deleted successfully",
      data: {
        id: result.rows[0].id,
      },
    });
  } catch (error) {
    next(error);
  }
}

