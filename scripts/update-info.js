// Update Info

module.exports = (req, res) => {

var {version_name, version_code} = require('./version');
var fs = require("fs"); // Load the filesystem module
var stats = fs.statSync("/home/joe/AndroidStudioProjects/StarSpace/app/release/app-release.apk")
var fileSizeInBytes = stats.size;
// Convert the file size to megabytes (optional)
var fileSizeInMegabytes = fileSizeInBytes / (1024*1024);

    res.status(200).json({
        success: true,
        version_name: version_name,
        version_code: version_code,
        size: fileSizeInMegabytes.toFixed(2) + " mb"
    });
}