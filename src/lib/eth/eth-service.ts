
import * as bleno from 'bleno';

import EthCharacteristic from './eth-characteristic';
export default class EthService extends bleno.PrimaryService {
constructor(options, eth, networkInterface) {

    super({
      // uuid: '123456',
      uuid: options.uuid,
      characteristics: [
          // gateway
          new EthCharacteristic(options.gateway, eth.getGateway, eth.setGateway, networkInterface),
          new EthCharacteristic(options.ip, eth.getIPv4, eth.setIPv4, networkInterface),
          new EthCharacteristic(options.mask, eth.getMask, eth.setMask, networkInterface),
          new EthCharacteristic(options.dns, eth.getDNS, eth.setDNS, networkInterface),
          new EthCharacteristic(options.dhcp, null, eth.setDHCP, networkInterface),
      ],
    });
  }
}
