Example3 = function () {
	var self = {};

	self.command = "lw 1 4 6";
	self.registerValues = [5, 27, 20, 6, 0, 29, 22, 15, 13, 5, 3, 28, 4, 8, 13, 9, 25, 20, 17, 19, 25, 24, 4, 4, 29, 2, 18, 8, 21, 4];
	self.readAddr = 8;
	self.readData = 10;
	self.writeAddr = 12;
	self.writeData = 14;

	return self;
};