
import { query } from "../config/database.js";

/*
|--------------------------------------------------------------------------
| Get Published Announcements
|--------------------------------------------------------------------------
|
| Public endpoint used by the citizen portal.
|
| GET /api/v1/announcements
|
*/

export async function getPublishedAnnouncements(req, res, next) {
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
        created_at,
        updated_at
      FROM announcements
      WHERE is_published = TRUE
      ORDER BY
        COALESCE(published_at, created_at) DESC,
        created_at DESC
    `);

    return res.status(200).json({
      success: true,
      message: "Published announcements fetched successfully",
      data: {
        announcements: result.rows,
      },
    });
  } catch (error) {
    next(error);
  }
}


/*
|--------------------------------------------------------------------------
| Get Single Published Announcement
|--------------------------------------------------------------------------
|
| GET /api/v1/announcements/:id
|
*/

export async function getPublishedAnnouncementById(
  req,
  res,
  next
) {
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
          created_at,
          updated_at
        FROM announcements
        WHERE id = $1
          AND is_published = TRUE
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

