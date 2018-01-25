import * as bleno from 'bleno';
export default class EthCharacteristic extends bleno.Characteristic {
  [x: string]: any;
  protected pwd = 171;
  protected dhcp = 0xdc;
  protected read;
  protected write;
  // protected uuid;
  // tslint:disable-next-line:member-ordering
  protected networkInterface;
  // private reboot = 159;
  constructor(options, read, write, networkInterface) {
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
    this.networkInterface = networkInterface;
    // this.uuid = options.uuid;
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
    } else if (data[4] === this.dhcp) {
      this.write(this.networkInterface);
      callback(this.RESULT_SUCCESS);
    } else {
      callback(this.RESULT_INVALID_OFFSET);
    }
  }

}
