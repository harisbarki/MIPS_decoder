var MIPS = function (command) {
    var self = {};
    self.command = command.split(" ");
    console.log(self.command);

    self.opcode = self.command[0];
    self.op1 = self.command[1];
    self.op2 = self.command[2];
    self.op3 = self.command[3];

    console.log(self.opcode);
    console.log(self.op1);
    console.log(self.op2);
    console.log(self.op3);

    self.instructionFetch = function () {

    }

    self.instructionDecode = function () {

    }

    self.execute = function() {

    }

    self.memory = function () {

    }

    return self;
};
