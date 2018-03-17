Example2 = function () {
	var self = {};

	self.command = "beq 7 1 9";
	self.registerValues = [13, 26, 19, 11, 10, 27, 29, 18, 19, 18, 17, 12, 1, 28, 18, 10, 23, 24, 10, 0, 29, 29, 12, 17, 20, 24, 20, 26, 8, 25];
	self.readAddr = 8;
	self.readData = 11;
	self.writeAddr = 15;
	self.writeData = 17;

	return self;
};