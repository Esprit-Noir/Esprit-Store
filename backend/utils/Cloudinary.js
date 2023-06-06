const cloudinary = require('cloudinary');

// Configuration
cloudinary.v2.config({
  cloud_name: 'djjgf8y3f',
  api_key: '117245284786912',
  api_secret: 'UQrKN00YTDrfdcpCsnwop3PS97g',
});

// Upload
exports.cloudinaryUploadImg = async (fileToUploads) => {
  return new Promise((resolve) => {
    cloudinary.v2.uploader.upload(fileToUploads, (result) => {
      resolve(
        {
          url: result.secure_url,
        },
        {
          resource_type: 'auto',
        }
      );
    });
  });
};
