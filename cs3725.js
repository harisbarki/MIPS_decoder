var MIPS = function (command, registerValues) {
    var self = {};
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

    self.instructionDecode = function () {

    }

    self.execute = function() {

    }

    self.memory = function () {

    }

    self.instructionFetch();

    return self;
};
