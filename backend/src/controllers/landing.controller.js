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
      return { ...row, images: imagesList };
    });

    res.status(200).json({ success: true, data: formattedData });
  } catch (error) {
    console.error("Error fetching landing content:", error);
    res.status(500).json({ success: false, message: "Internal server error." });
  }
};

export const upsertLandingContent = async (req, res) => {
  try {
    const { section_key, title, subtitle, existing_images, image_url, online_image } = req.body;
    
    // 1. Parse existing images if passed from frontend
    let parsedExisting = [];
    if (existing_images) {
      parsedExisting = typeof existing_images === 'string' ? JSON.parse(existing_images) : existing_images;
    }

    // 2. Capture online image links passed from frontend inputs
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

    // 3. Capture newly uploaded files from Multer
    const uploadedFiles = req.files || (req.file ? [req.file] : []);
    const newFilePaths = uploadedFiles.map(file => `/uploads/${file.filename}`);
    
    // 4. Combine all sources into a single clean array
    const finalImages = [...parsedExisting, ...newFilePaths, ...onlineLinks];

    const imagesJsonString = JSON.stringify(finalImages);

    const query = `
      INSERT INTO landing_content (section_key, title, subtitle, image_url, updated_at)
      VALUES ($1, $2, $3, $4, CURRENT_TIMESTAMP)
      ON CONFLICT (section_key)
      DO UPDATE SET 
        title = EXCLUDED.title, 
        subtitle = EXCLUDED.subtitle, 
        image_url = EXCLUDED.image_url,
        updated_at = CURRENT_TIMESTAMP
      RETURNING *;
    `;

    const values = [section_key, title, subtitle, imagesJsonString];
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