import * as bleno from 'bleno';
export default class SystemCharacteristic extends bleno.Characteristic {
  [x: string]: any;
  private reboot = 159;
  private read;
  private write;
  private networkInterface;
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
      this.read((d) => {
        const data = Buffer.from(d);
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
    // tslint:disable-next-line:triple-equals
    } else if (data[4] == this.reboot) {
      this.write();
      callback(this.RESULT_SUCCESS);
    } else {
      callback(this.RESULT_INVALID_OFFSET);
    }
  }

}
