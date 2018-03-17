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
      self.idBuffer = {};
      self.idBuffer.PC = self.programCounter;
      self.idBuffer.RS = self.op1;
      self.idBuffer.RT = self.op2;

      switch(self.opcode) {
          case "add":
          // PC, OP, RS , RT, RD, SHAMT, FUNCT
        //   self.idBuffer = [self.programCounter, 0, self.op1, self.op2, self.op3, 0, 32];
          self.idBuffer.OP = 0;
          self.idBuffer.RD = self.op3;
          self.idBuffer.SHAMT = 0;
          self.idBuffer.FUNCT = 32;
          self.idBuffer.OFFSET = null;
          break;
          case "sub":
          // PC, OP, RS , RT, RD, SHAMT, FUNCT
          //   self.idBuffer = [self.programCounter, 40, self.op1, self.op2, self.op3, 0, 34];
          self.idBuffer.OP = 40;
          self.idBuffer.RD = self.op3;
          self.idBuffer.SHAMT = 0;
          self.idBuffer.FUNCT = 34;
          self.idBuffer.OFFSET = null;
          break;
          case "lw":
          // PC, OP, RS , RT, OFFSET
          //   self.idBuffer = [self.programCounter, 35, self.op1, self.op2, self.op3];
          self.idBuffer.OP = 35;
          self.idBuffer.OFFSET = self.op3;
          self.idBuffer.RD = null;
          self.idBuffer.SHAMT = null;
          self.idBuffer.FUNCT = null;
          break;
          case "sw":
          // PC, OP, RS , RT, OFFSET
          //   self.idBuffer = [self.programCounter, 43, self.op1, self.op2, self.op3];
          self.idBuffer.OP = 43;
          self.idBuffer.OFFSET = self.op3;
          self.idBuffer.RD = null;
          self.idBuffer.SHAMT = null;
          self.idBuffer.FUNCT = null;
          break;
          default:
          // PC, OP, RS , RT, OFFSET
          //   self.idBuffer = [self.programCounter, 4, self.op1, self.op2, self.op3];
          self.idBuffer.OP = 4;
          self.idBuffer.OFFSET = self.op3;
          self.idBuffer.RD = null;
          self.idBuffer.SHAMT = null;
          self.idBuffer.FUNCT = null;
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
            '<td>' + self.idBuffer.PC + '</td>' +
            '<td>' + self.idBuffer.OP + '</td>' +
            '<td>' + self.idBuffer.RS + '</td>' +
            '<td>' + self.idBuffer.RT + '</td>' +
            '<td>' + self.idBuffer.RD + '</td>' +
            '<td>' + self.idBuffer.SHAMT + '</td>' +
            '<td>' + self.idBuffer.FUNCT + '</td>' +
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
            '<td>' + self.idBuffer.PC + '</td>' +
            '<td>' + self.idBuffer.OP + '</td>' +
            '<td>' + self.idBuffer.RS + '</td>' +
            '<td>' + self.idBuffer.RT + '</td>' +
            '<td>' + self.idBuffer.OFFSET + '</td>' +
          '</tr>'
        );
      }

      return self.idBuffer;
    }

    self.csv = {};

    self.updateControlSignalVector = function () {
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
        var instructionDecodeHtml = '';
        instructionDecodeHtml += "Read register 1 (rs) is $" + self.idBuffer.RS + ".";
        instructionDecodeHtml += "<br>";
        instructionDecodeHtml += "Read data 1 is " + self.readData1 + ".";
        instructionDecodeHtml += "<br>";
        instructionDecodeHtml += "Read register 2 (rt) is $" + self.idBuffer.RT + ".";
        instructionDecodeHtml += "<br>";
        instructionDecodeHtml += "Read data 2 is " + self.readData2 + ".";
        instructionDecodeHtml += "<br>";

        if (self.opcode === "add" || self.opcode === "sub")
        instructionDecodeHtml += "Instruction[15-0] (offset) is not needed for R-type instructions, like add or sub.";
		else
        instructionDecodeHtml += "Instruction[15-0] (offset) is " + self.idBuffer.OFFSET;

        instructionDecodeHtml += "<br>";

		if (self.opcode === "add" || self.opcode === "sub")
		{
            instructionDecodeHtml += "Instruction[20-16] (rt) is $" + self.idBuffer.RT + ".";
            instructionDecodeHtml += "<br>";
			instructionDecodeHtml += "Instruction[15-11] (rd) is $" + self.idBuffer.RD + ".";
		}
		else
		{
            instructionDecodeHtml += "Instruction[20-16] (rt) is $" + self.idBuffer.RT + ".";
            instructionDecodeHtml += "<br>";
			instructionDecodeHtml += "Instruction[15-11] (rd) is not needed for I-type instructions, like lw, sw or beq.";
        }
        instructionDecodeHtml += "<br>";


        var instruction15_0 = null;
        var instruction15_11 = null;
        if(self.opcode === "add" || self.opcode === "sub") {
            instruction15_0 = self.idBuffer.RD = 'N/A';
            instruction15_11 = self.idBuffer.RD;
        } else {
            instruction15_0 = self.idBuffer.RD;
            instruction15_11 = 'N/A';
        }

        self.updateControlSignalVector();

        var idExBufferHtml = '';
        idExBufferHtml += '<td>' + self.idBuffer.PC + '</td>';
        idExBufferHtml += '<td>' + self.readData1 + '</td>';
        idExBufferHtml += '<td>' + self.readData2 + '</td>';
        idExBufferHtml += '<td>' + instruction15_0 + '</td>';
        idExBufferHtml += '<td>' + self.idBuffer.RT + '</td>';
        idExBufferHtml += '<td>' + instruction15_11 + '</td>';


        $('#instruction-decode-stage').html(instructionDecodeHtml);
        $('#id-ex-buffer').html(idExBufferHtml);
    }

    self.execute = function() {
      let pc = self.idBuffer.PC;
      let firstOperand = self.idBuffer.RS;
      let readData2 = self.readData2;
      let offset = self.idBuffer.OFFSET;
      let rt = self.idBuffer.RT;
      let rd = self.idBuffer.RD;

      let addResult = 0;
      let secondOperand = 0;
      let aluResult = 0;
      let zero = 0;
      let destReg = 0;

      self.memBuffer = {};

      // calculate branch target address for beq operation
      if (self.opcode === "beq") {
        addResult = pc + (4 * offset);
        $("#branchTargetAddress").text(addResult + ".");
      } else {
        $("#branchTargetAddress").text("'" + self.opcode + "'" + " is not a branch operation.");
      }

      $("#aluFO").text(firstOperand + ".");

      // calculate second operand input to the ALU
      if (self.csv["ALUSrc"] === 0) {
        $("#aluSO").text(readData2 + " since ALU Source is 0.");
        secondOperand = readData2;
      } else {
        $("#aluSO").text(offset + " since ALU Source is 1.");
        secondOperand = offset;
      }

      // calculate the ALUresult
      if (self.csv["ALUOp1"] === 0 && self.csv["ALUOp0"] === 0)	{
        // lw or sw operation
        $("#aluInfo").text("Both ALUOp1 and ALUOp0 are 0, this must be a lw or sw operation. ");
        aluResult = parseInt(firstOperand) + parseInt(secondOperand);
        $("#aluRes").text(firstOperand + " + " + secondOperand + " = " + aluResult);
      }
      else if (self.csv["ALUOp1"] === 1 && self.csv["ALUOp0"] === 0)	{
        // add or sub operation
        $("#aluInfo").text("ALUOp1 is 1 and ALUOp0 is 0, ");

        if (self.opcode === "add") {
          $("#aluInfo").append("<span>and the funct field is 32, this must be an add operation.</span>");
          aluResult = parseInt(firstOperand) + parseInt(secondOperand);
          $("#aluRes").text(firstOperand + " + " + secondOperand + " = " + aluResult);
        }
        else {
          $("#aluInfo").append("<span>and the funct field is 34, this must be a sub operation.</span>");
          aluResult = parseInt(firstOperand) - parseInt(secondOperand);
          $("#aluRes").text(firstOperand + " - " + secondOperand + " = " + aluResult);
        }
      }
      else if (self.csv["ALUOp1"] === 0 && self.csv["ALUOp0"] === 1)	{
        // beq operation
        $("#aluInfo").text("ALUOp1 is 0 and ALUOp0 is 1, this must be a beq operation.");
        $("#aluRes").text("Not required for beq operation.");
      }

      // determine if the operands are equal
      if (firstOperand === secondOperand) {
        zero = 1;
        $("#zero").text("1, because the operands are equal.");
      } else {
        zero = 0;
        $("#zero").text("0, because the operands are not equal.");
      }

      // determine the destination register
      if (self.csv["RegDst"] === 0) {
        destReg = rt;
        $("#dstReg").text("RegDst is 0, hence $" + destReg + " is the destination register.");
      } else {
        destReg = rd;
        $("#dstReg").text("RegDst is 1, hence $" + destReg + " is the destination register.");
      }

      // Build and return buffer for next stage (MEM)
      self.memBuffer.ADDRes = addResult;
      self.memBuffer.ZERO = zero;
      self.memBuffer.ALURes = aluResult;
      self.memBuffer.RD2 = readData2;
      self.memBuffer.DSTReg = destReg;

      let exBufferBody = $("#exBufferBody");

      if (self.memBuffer.ADDRes === 0)
        exBufferBody.append("<td>N/A</td>");
      else
        exBufferBody.append("<td>" + self.memBuffer.ADDRes + "</td>");
        exBufferBody.append("<td>" + self.memBuffer.ZERO + "</td>");
      if (self.opcode === "beq")
        exBufferBody.append("<td>N/A</td>");
      else
        exBufferBody.append("<td>" + self.memBuffer.ALURes);
        exBufferBody.append("<td>" + self.memBuffer.RD2 + "</td>");
      if (self.memBuffer.DSTReg === 0)
        exBufferBody.append("<td>N/A</td>");
      else
        exBufferBody.append("<td>" + self.memBuffer.DSTReg);


      return self.memBuffer;
    }

    self.memory = function () {
		// Extract buffer contents
		var branchTargetAddress = self.memBuffer.branchTargetAddress;
		var zero = self.memBuffer.ZERO;
		var readAddress = self.memBuffer.readAddress;
        var writeAddress = self.memBuffer.writeAddress;
        var aluResult = self.memBuffer.aluResult;
		var writeData = self.memBuffer.writeData;
		var destReg = self.memBuffer.destReg;

        // Determine whether to branch
        console.log(self.csv);
        var html = '';
		if(self.csv.Branch == 0 && zero == 0)
		{
			html+="Branch is 0 and Zero is 0. This is not a beq operation and the operands are not equal. Hence, we do not branch.";
			html += "The next instruction will be retrieved from the next sequential address (PC + 4): " + self.idBuffer.programCounter + ".";
		}
		else if(self.csv.Branch == 0 && zero == 1)
		{
			html += "Branch is 0 and Zero is 1. Even though the operands are equal, this is not a beq operation. Hence, we do not branch.";
			html += "The next instruction will be retrieved from the next sequential address (PC + 4): " + self.idBuffer.programCounter + ".";
		}
		else if (self.csv.Branch == 1 && zero == 0)
		{
			html += "Branch is 1 and Zero is 0. This is a beq operation, but the operands are not equal. Hence, we do not branch.";
			html += "The next instruction will be retrieved from the next sequential address (PC + 4): " + self.idBuffer.programCounter + ".";
		}
		else
		{
			html += "Branch is 1 and Zero is 1. This is a beq operation and the operands are equal. Hence, we must branch.";
			html += "The next instruction will be retrieved from the branch target address (PC + 4 + 4 * offset): " + branchTargetAddress + ".";
		}

		// Determine if need to read from or write to data memory
		if (self.csv.MemWrite == 1 && self.csv.MemRead == 0)						// sw operation
			html += "MemWrite is 1, hence " + writeData + " is written to address $" + writeAddress + " in the data memory.";

		if (self.csv.MemWrite == 0 && self.csv.MemRead == 1)						// lw operation
			html += "MemRead is 1, hence " + readData + " is read from address $" + readAddress + " in the data memory.";

		if (self.csv.MemWrite == 0 && self.csv.MemRead == 0)						// other
			html += "Both MemWrite and MemRead are 0, hence this operation does not require data to be read from or written to the data memory.";

		// Build buffer for next stage (WB)
		self.bufferWB = {readData: self.readData, aluResult: aluResult, destReg: destReg};

        console.log(html);
		// Print buffer
		// System.out.println("");
		// System.out.println("MEM/WB Buffer:");
		// System.out.println("-------------------------------------------");
		// System.out.println("| Read Data | ALU Result | Dest. Register |");
		// System.out.println("===========================================");
		// System.out.print("|     " + bufferWB[0] + "     |     ");
		// if (opcode.equals("beq"))
		// 	System.out.print("N/A");
		// else
		// 	System.out.print("" + bufferWB[1]);
		// System.out.println("      |       " + bufferWB[2] + "        |");
		// System.out.println("-------------------------------------------");
		// System.out.println("");

    }

    self.writeBack = function () {

  		let readData = self.bufferWB.readData;		// read data from data memory
  		let aluResult = self.bufferWB.aluResult;	// result from ALU
  		let destReg = self.bufferWB.destReg;	    // destination register
  		let writeData = 0;			                  // data for write register

  		if (self.csv["MemToReg"] === 1 && self.csv["RegWrite"] === 1) {
  			writeData = readData;
  			$("#write-back-stage").append(
          "<p>MemToReg is 1 and RegWrite is 1, hence memory data " + writeData + " will be written to write register $" + destReg + ".</p>"
        );
  		}
  		else if (self.csv["MemToReg"] === 0 && self.csv["RegWrite"] === 1) {
  			writeData = aluResult;
  			$("#write-back-stage").append(
          "<p>MemToReg is 0 and RegWrite is 1, hence ALU result " + writeData + " will be written to write register $" + destReg + ".</p>"
        );
  		}
  		else {
  			$("#write-back-stage").append(
          "<p>This is either a sw or beq operation. Hence, no data is to be written to the register.</p>"
        );
      }
    }

    self.instructionFetch();
    // self.updateControlSignalVector();
    self.instructionDecode();
    self.execute();
    self.memory();
    self.writeBack();

    return self;
};
