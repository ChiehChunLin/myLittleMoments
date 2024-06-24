const cdnURL = process.env.AWS_S3_CDN_URL

function getImageCDN (key) {
  return cdnURL + key
}

module.exports = { getImageCDN }
