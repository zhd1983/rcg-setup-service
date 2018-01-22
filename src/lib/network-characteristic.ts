import * as bleno from 'bleno';
export default class NetworkCharacteristic extends bleno.Characteristic {
  [x: string]: any;
  private pwd = 171;
  private reboot = 159;
  private read;
  private write;
  private networkInterface= 'eno1';
  constructor(options, read, write) {
    super(
      {
        uuid: options.uuid,
        properties: options.properties,
        descriptors: [
          new bleno.Descriptor(options.descriptor),
        ],
      },
    );
    this.read = read;
    this.write = write;
  }
  public onReadRequest(offset, callback) {
    if (offset) {
      callback(this.RESULT_ATTR_NOT_LONG, null);
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
    } else if (data[4] === this.reboot) {
      this.write();

    } else {
      callback(this.RESULT_INVALID_OFFSET);
    }
  }

}
