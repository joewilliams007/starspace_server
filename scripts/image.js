// Image Upload

module.exports = (req, res) => {
	var { path } = req.params;

    var fs = require("fs"); // Load the filesystem module

	var imgpath = "/home/joe/starspace/uploads/" + path;


		// var stats = fs.statSync(imgpath)
	//	var fileSizeInBytes = stats.size;
		// Convert the file size to megabytes (optional)
		// var fileSizeInMegabytes = fileSizeInBytes / (1024*1024);
	//	console.log("download "+fileSizeInMegabytes+" mb "+path)
	
		res.sendFile("/home/joe/starspace/uploads/" + path);

	

		
	
}