
import * as bleno from 'bleno';

import NetworkCharacteristic from './network-characteristic';
export default class NetworkService extends bleno.PrimaryService {
constructor(options, network) {

    super({
      // uuid: '123456',
      uuid: options.eth0.uuid,
      characteristics: [
          // gateway
          new NetworkCharacteristic(options.eth0.gateway, network.getGateway, network.setGateway),
          new NetworkCharacteristic(options.eth0.ip, network.getIPv4, network.setIPv4),
          new NetworkCharacteristic(options.eth0.mask, network.getMask, network.setMask),
          new NetworkCharacteristic(options.eth0.dns, network.getDNS, network.setDNS),
          new NetworkCharacteristic(options.eth0.save, network.reboot, network.reboot),
      ],
    });
  }
}
