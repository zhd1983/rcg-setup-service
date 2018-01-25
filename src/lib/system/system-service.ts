
import * as bleno from 'bleno';

import SystemCharacteristic from './system-characteristic';
export default class SystemService extends bleno.PrimaryService {
constructor(options, system) {

    super({
      uuid: options.uuid,
      characteristics: [
          // gateway
          new SystemCharacteristic(options.reboot, null, system.reboot),
          new SystemCharacteristic(options.avg, system.getLoadAvg, null),
          new SystemCharacteristic(options.mem, system.getUsedMem, null),
          new SystemCharacteristic(options.disk, system.getUsedDisk, null),

      ],
    });
  }
}
