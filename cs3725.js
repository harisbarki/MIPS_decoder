var MIPS = function (command, registerValues) {
    var self = {};
    self.idBuffer = null;
    self.command = command.split(" ");
    // console.log(self.command);

    self.opcode = self.command[0];
    self.op1 = self.command[1];
    self.op2 = self.command[2];
    self.op3 = self.command[3];

    // console.log(self.opcode);
    // console.log(self.op1);
    // console.log(self.op2);
    // console.log(self.op3);

    self.programCounter = 8;
    // self.readData = 0;

    self.instructionFetch = function () {

      self.readData1 = registerValues[self.op1];
      self.readData2 = registerValues[self.op2];
      if(self.opcode === "add" || self.opcode === "sub") {
        self.destRegister = registerValues[self.op3];
      }

      self.readAddress = self.command[4];
      self.readData = self.command[5];
      self.writeAddress = self.command[6];
      self.writeData = self.command[7];

      let ifBody = $("#if-body");
      if(self.opcode === "add" || self.opcode === "sub") {
        // R Format Instruction
        if(self.op1 && self.readData1 && self.op2 && self.readData2) {
          ifBody.append(
            '<tr>' +
              '<td>' + self.op1 + '</td>' +
              '<td>' + self.readData1 + '</td>' +
            '</tr>' +
            '<tr>' +
              '<td>' + self.op2 + '</td>' +
              '<td>' + self.readData2 + '</td>' +
            '</tr>'
          );
        }
      } else {
        // I Format Instruction
        if(self.op1 && self.readData1 && self.op2 && self.readData2 && self.op3) {
          ifBody.append(
            '<tr>' +
              '<td>' + self.op1 + '</td>' +
              '<td>' + self.readData1 + '</td>' +
            '</tr>' +
            '<tr>' +
              '<td>' + self.op2 + '</td>' +
              '<td>' + self.readData2 + '</td>' +
            '</tr>' +
            '<tr>' +
              '<td>Offset</td>' +
              '<td>' + self.op3 + '</td>' +
            '</tr>'
          );
        }
      }

      $("#readAddress").text(self.readAddress);
      $("#readData").text(self.readData);
      $("#writeAddress").text(self.writeAddress);
      $("#writeData").text(self.writeData);


      self.programCounter += 4;

      switch(self.opcode) {
        case "add":
          // PC, OP, RS , RT, RD, SHAMT, FUNCT
          self.idBuffer = [self.programCounter, 0, self.op1, self.op2, self.op3, 0, 32];
          break;
        case "sub":
          // PC, OP, RS , RT, RD, SHAMT, FUNCT
          self.idBuffer = [self.programCounter, 40, self.op1, self.op2, self.op3, 0, 34];
          break;
        case "lw":
          // PC, OP, RS , RT, OFFSET
          self.idBuffer = [self.programCounter, 35, self.op1, self.op2, self.op3];
          break;
        case "sw":
          // PC, OP, RS , RT, OFFSET
          self.idBuffer = [self.programCounter, 43, self.op1, self.op2, self.op3];
          break;
        default:
          // PC, OP, RS , RT, OFFSET
          self.idBuffer = [self.programCounter, 4, self.op1, self.op2, self.op3];
      }

      console.log(self.idBuffer);

      let idBufferHead = $("#idBufferHead");
      let idBufferBody = $("#idBufferBody");

      if(self.opcode === "add" || self.opcode === "sub") {
        // R Format Instruction
        idBufferHead.append(
          '<tr>' +
            '<th>PC</th>' +
            '<th>OP</th>' +
            '<th>RS</th>' +
            '<th>RT</th>' +
            '<th>RD</th>' +
            '<th>SHAMT</th>' +
            '<th>FUNCT</th>' +
          '</tr>'
        );

        idBufferBody.append(
          '<tr>' +
            '<td>' + self.idBuffer[0] + '</td>' +
            '<td>' + self.idBuffer[1] + '</td>' +
            '<td>' + self.idBuffer[2] + '</td>' +
            '<td>' + self.idBuffer[3] + '</td>' +
            '<td>' + self.idBuffer[4] + '</td>' +
            '<td>' + self.idBuffer[5] + '</td>' +
            '<td>' + self.idBuffer[6] + '</td>' +
          '</tr>'
        );
      } else {
        // I Format Instruction
        idBufferHead.append(
          '<tr>' +
            '<th>PC</th>' +
            '<th>OP</th>' +
            '<th>RS</th>' +
            '<th>RT</th>' +
            '<th>OFFSET</th>' +
          '</tr>'
        );

        idBufferBody.append(
          '<tr>' +
            '<td>' + self.idBuffer[0] + '</td>' +
            '<td>' + self.idBuffer[1] + '</td>' +
            '<td>' + self.idBuffer[2] + '</td>' +
            '<td>' + self.idBuffer[3] + '</td>' +
            '<td>' + self.idBuffer[4] + '</td>' +
          '</tr>'
        );
      }
      

      return self.idBuffer;
    }

    self.csv = {};

    self.updateControlSignalVector = function (opcode) {
  		// load Control Signal Vector depending on the instruction type
  		if (self.opcode === "add" || self.opcode === "sub") {
  			self.csv["RegDst"] = 1;
  			self.csv["ALUOp1"] = 1;
  			self.csv["ALUOp0"] = 0;
  			self.csv["ALUSrc"] = 0;
  			self.csv["Branch"] = 0;
  			self.csv["MemRead"] = 0;
  			self.csv["MemWrite"] = 0;
  			self.csv["RegWrite"] = 1;
  			self.csv["MemToReg"] = 0;

  		}
  		else if (self.opcode === ("lw")) {
  			self.csv["RegDst"] = 0;
  			self.csv["ALUOp1"] = 0;
  			self.csv["ALUOp0"] = 0;
  			self.csv["ALUSrc"] = 1;
  			self.csv["Branch"] = 0;
  			self.csv["MemRead"] = 1;
  			self.csv["MemWrite"] = 0;
  			self.csv["RegWrite"] = 1;
  			self.csv["MemToReg"] = 1;
  		}
  		else if (self.opcode === ("sw")) {
  			self.csv["RegDst"] = 0;
  			self.csv["ALUOp1"] = 0;
  			self.csv["ALUOp0"] = 0;
  			self.csv["ALUSrc"] = 1;
  			self.csv["Branch"] = 0;
  			self.csv["MemRead"] = 0;
  			self.csv["MemWrite"] = 1;
  			self.csv["RegWrite"] = 0;
  			self.csv["MemToReg"] = 0;
  		}
  		else {
  			self.csv["RegDst"] = 0;
  			self.csv["ALUOp1"] = 0;
  			self.csv["ALUOp0"] = 1;
  			self.csv["ALUSrc"] = 0;
  			self.csv["Branch"] = 1;
  			self.csv["MemRead"] = 0;
  			self.csv["MemWrite"] = 0;
  			self.csv["RegWrite"] = 0;
  			self.csv["MemToReg"] = 0;
  		}

      let controlVector = $("#controlVector");
      controlVector.append(
        '<td>' + self.csv["RegDst"] + '</td>' +
        '<td>' + self.csv["ALUOp1"] + '</td>' +
        '<td>' + self.csv["ALUOp0"] + '</td>' +
        '<td>' + self.csv["ALUSrc"] + '</td>' +
        '<td>' + self.csv["Branch"] + '</td>' +
        '<td>' + self.csv["MemRead"] + '</td>' +
        '<td>' + self.csv["MemWrite"] + '</td>' +
        '<td>' + self.csv["RegWrite"] + '</td>' +
        '<td>' + self.csv["MemToReg"] + '</td>'
      );

  	}

    self.instructionDecode = function () {
        var html = '';
        html += "Read register 1 (rs) is $" + self.idBuffer[2] + ".";
        html += "Read data 1 is " + self.readData1 + ".";
        html += "Read register 2 (rt) is $" + self.idBuffer[3] + ".";
        html += "Read data 2 is " + self.readData2 + ".";

        if (self.opcode.equals("add") || self.opcode.equals("sub"))
			html += "Instruction[15-0] (offset) is not needed for R-type instructions, like add or sub.";
		else
			html += "Instruction[15-0] (offset) is " + self.idBuffer[4];

		if (self.opcode.equals("add") || self.opcode.equals("sub"))
		{
			html += "Instruction[20-16] (rt) is $" + self.idBuffer[3] + ".";
			html += "Instruction[15-11] (rd) is $" + self.idBuffer[4] + ".";
		}
		else
		{
			html += "Instruction[20-16] (rt) is $" + self.idBuffer[3] + ".";
			html += "Instruction[15-11] (rd) is not needed for I-type instructions, like lw, sw or beq.";
        }
        
        // Load op code here

        
    }

    self.execute = function() {

    }

    self.memory = function () {

    }

    self.instructionFetch();
    self.updateControlSignalVector();

    return self;
};
