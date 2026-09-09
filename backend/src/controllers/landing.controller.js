import { pool } from "../config/database.js";

export const getLandingContent = async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM landing_content ORDER BY updated_at DESC");
    
    const formattedData = result.rows.map(row => {
      let imagesList = [];
      try {
        if (typeof row.image_url === 'string' && row.image_url.startsWith('[')) {
          imagesList = JSON.parse(row.image_url);
        } else if (Array.isArray(row.image_url)) {
          imagesList = row.image_url;
        } else if (row.image_url) {
          imagesList = [row.image_url];
        }
      } catch {
        imagesList = row.image_url ? [row.image_url] : [];
      }

      let parsedAreas = [];
      if (row.areas) {
        try {
          parsedAreas = typeof row.areas === 'string' ? JSON.parse(row.areas) : row.areas;
        } catch {
          parsedAreas = [];
        }
      }

      return { ...row, images: imagesList, areas: parsedAreas };
    });

    res.status(200).json({ success: true, data: formattedData });
  } catch (error) {
    console.error("Error fetching landing content:", error);
    res.status(500).json({ success: false, message: "Internal server error." });
  }
};

export const upsertLandingContent = async (req, res) => {
  try {
    const { section_key, title, subtitle, existing_images, image_url, online_image, gallery_metadata, areas } = req.body;
    
    // 1. Capture newly uploaded files from Multer
    const uploadedFiles = req.files || (req.file ? [req.file] : []);
    let newFilePaths = uploadedFiles.map(file => `/uploads/${file.filename}`);

    let finalImages = [];

    // 2. Handle Village Gallery with structural metadata (url, title, description)
    if (section_key === "village_gallery" && gallery_metadata) {
      let metadata = [];
      try {
        metadata = typeof gallery_metadata === 'string' ? JSON.parse(gallery_metadata) : gallery_metadata;
      } catch {
        metadata = [];
      }

      let fileIndex = 0;
      finalImages = metadata.map(item => {
        let imageUrl = item.url;
        // If this item was a file upload rather than an online URL link, grab the next available uploaded file path
        if (!imageUrl && fileIndex < newFilePaths.length) {
          imageUrl = newFilePaths[fileIndex];
          fileIndex++;
        }
        return {
          url: imageUrl,
          title: item.title || "Palitpur Moment",
          description: item.description || "Captured moment from village life."
        };
      }).filter(item => item.url);
    } else {
      // 3. Standard handling for other sections (Hero, Community, Villages, etc.)
      let parsedExisting = [];
      if (existing_images) {
        try {
          parsedExisting = typeof existing_images === 'string' ? JSON.parse(existing_images) : existing_images;
        } catch {
          parsedExisting = Array.isArray(existing_images) ? existing_images : [existing_images];
        }
      }

      let onlineLinks = [];
      const linkInput = image_url || online_image;
      if (linkInput) {
        if (typeof linkInput === 'string' && linkInput.trim() !== '') {
          if (linkInput.startsWith('[')) {
            try { onlineLinks = JSON.parse(linkInput); } catch { onlineLinks = [linkInput]; }
          } else {
            onlineLinks = linkInput.split(',').map(url => url.trim()).filter(Boolean);
          }
        } else if (Array.isArray(linkInput)) {
          onlineLinks = linkInput;
        }
      }

      finalImages = [...parsedExisting, ...newFilePaths, ...onlineLinks].filter(Boolean);
    }

    const imagesJsonString = JSON.stringify(finalImages);

    // 4. Handle areas JSON payload for custom neighborhood/area cards
    let parsedAreas = null;
    if (areas) {
      try {
        parsedAreas = typeof areas === 'string' ? JSON.parse(areas) : areas;
      } catch {
        parsedAreas = null;
      }
    }

    const query = `
      INSERT INTO landing_content (section_key, title, subtitle, image_url, areas, updated_at)
      VALUES ($1, $2, $3, $4, $5, CURRENT_TIMESTAMP)
      ON CONFLICT (section_key)
      DO UPDATE SET 
        title = EXCLUDED.title, 
        subtitle = EXCLUDED.subtitle, 
        image_url = EXCLUDED.image_url,
        areas = EXCLUDED.areas,
        updated_at = CURRENT_TIMESTAMP
      RETURNING *;
    `;

    const values = [section_key, title, subtitle, imagesJsonString, parsedAreas ? JSON.stringify(parsedAreas) : null];
    const result = await pool.query(query, values);

    res.status(200).json({ 
      success: true, 
      message: "Landing content successfully updated.", 
      data: result.rows[0] 
    });
  } catch (error) {
    console.error("Error updating landing content:", error);
    res.status(500).json({ success: false, message: "Internal server error." });
  }
};

export const deleteLandingContent = async (req, res) => {
  try {
    const { key } = req.params;

    const result = await pool.query(
      "DELETE FROM landing_content WHERE section_key = $1 RETURNING *",
      [key]
    );

    if (result.rowCount === 0) {
      return res.status(404).json({
        success: false,
        message: "Section content not found.",
      });
    }

    res.status(200).json({
      success: true,
      message: "Landing content successfully deleted/reset.",
    });
  } catch (error) {
    console.error("Error deleting landing content:", error);
    res.status(500).json({ success: false, message: "Internal server error." });
  }
};

export const getAllLandingContent = async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM landing_content ORDER BY updated_at DESC");
    res.status(200).json({ success: true, data: result.rows });
  } catch (error) {
    console.error("Error fetching all landing history:", error);
    res.status(500).json({ success: false, message: "Internal server error." });
  }
};