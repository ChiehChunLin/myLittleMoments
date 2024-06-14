const conn = require("../database/connDB");
const imageDB = require("../database/imageDB");
const { getImageCDN } = require("../utils/getCdnFile");

const testS3Controller = async (req, res, next) => {
  try {
    const rows = await imageDB.getImageByDate(conn, 1, "2024-06-14");
    const directory = "2024-06-14";
    const filename = "512545600198148227";
    const imgUrl = getImageCDN(`${directory}/${filename}`);
    res.status(200).render("imageDisplay", { imgUrl });
  } catch (error) {
    next(error);
  }
};

module.exports = { testS3Controller };
