Example1 = function () {
	var self = {};

	self.command = "add 2 5 7";
	self.registerValues = [21, 14, 5, 1, 12, 10, 29, 26, 19, 17, 9, 5, 14, 10, 9, 18, 20, 21, 20, 4, 12, 8, 6, 16, 26, 19, 15, 13, 7, 26];
	self.readAddr = 7;
	self.readData = 22;
	self.writeAddr = 8;
	self.writeData = 21;

	return self;
};