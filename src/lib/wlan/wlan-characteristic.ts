import EthCharacteristic from '../eth/eth-characteristic';
export default class WlanCharacteristic extends EthCharacteristic {
  public onReadRequest(offset, callback) {
    if (offset) {
      callback(this.RESULT_ATTR_NOT_LONG, null);
    } else if (this.uuid === '551d0000000000000000000000000001') {
       this.read((d) => {

        const data = Buffer.from(d);
        callback(this.RESULT_SUCCESS, data);
      });
    } else {
      this.read(this.networkInterface, (d) => {
        const tempData = d.split('.');
        const data = new Buffer(tempData.length);
        for (let index = 0; index < tempData.length; index++) {
          data.writeUInt8(parseInt(tempData[index], 10), index);

        }
        callback(this.RESULT_SUCCESS, data);
      });

    }
  }
  // withoutResponse
  public onWriteRequest(data, offset, withoutResponse, callback) {
    if (offset) {
      callback(this.RESULT_ATTR_NOT_LONG);
    } else if (this.uuid === '05000000000000000000000000000001' || this.uuid === '551d0000000000000000000000000001') {
      this.write(data.toString());
      callback(this.RESULT_SUCCESS);
    } else if (data.length !== 5) {
      callback(this.RESULT_INVALID_ATTRIBUTE_LENGTH);
    } else if (data[4] === this.pwd) {
      let writeData = '';
      for (let index = 0; index < data.length - 1; index++) {
        writeData += `${data.readUInt8(index)}.`;
      }
      writeData = writeData.substring(0, writeData.length - 1);
      this.write(this.networkInterface, writeData);
      callback(this.RESULT_SUCCESS);
    } else if (data[4] === this.dhcp) {
      this.write(this.networkInterface);
      callback(this.RESULT_SUCCESS);
    } else {
      callback(this.RESULT_INVALID_OFFSET);
    }
  }
}
