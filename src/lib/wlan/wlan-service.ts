
import * as bleno from 'bleno';

import WlanCharacteristic from './wlan-characteristic';
export default class WlanService extends bleno.PrimaryService {
constructor(options, wlan, networkInterface) {

    super({
      // uuid: '123456',
      uuid: options.uuid,
      characteristics: [
          // gateway
          new WlanCharacteristic(options.gateway, wlan.getGateway, wlan.setGateway, networkInterface),
          new WlanCharacteristic(options.ip, wlan.getIPv4, wlan.setIPv4, networkInterface),
          new WlanCharacteristic(options.mask, wlan.getMask, wlan.setMask, networkInterface),
          new WlanCharacteristic(options.dns, wlan.getDNS, wlan.setDNS, networkInterface),
          new WlanCharacteristic(options.dhcp, null, wlan.setDHCP, networkInterface),
          new WlanCharacteristic(options.ssid, wlan.getSSID, wlan.setSSID, networkInterface),
          new WlanCharacteristic(options.psk, null, wlan.setPSK, networkInterface),
      ],
    });
  }
}
