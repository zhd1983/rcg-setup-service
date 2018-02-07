import * as bleno from 'bleno';
import * as config from 'config';
import * as moment from 'moment';
import { setTimeout } from 'timers';
import Eth from './lib/eth/eth';
import EthService from './lib/eth/eth-service';
import System from './lib/system/system';
import SystemService from './lib/system/system-service';
import Utils from './lib/utils';
import Wlan from './lib/wlan/wlan';
import WlanService from './lib/wlan/wlan-service';
// const BlenoPrimaryService = bleno.PrimaryService;

const ethOptions = config.eth0;
const wlanOptions = config.wlan0;
const systemOptions = config.system;
const ethService = new EthService(ethOptions, new Eth(), 'eth0');
const wlanService = new WlanService(wlanOptions, new Wlan(), 'wlan0');
const systemService = new SystemService(systemOptions, new System());

let name = 'rcg-';
Utils.getCPUSerialNo((cpu) => {
  name += cpu || '110';
});

bleno.on('stateChange', (state) => {
  if (state === 'poweredOn') {
    //
    // We will also advertise the service ID in the advertising packet,
    // so it's easier to find.
    //
    setTimeout(() => {
      bleno.startAdvertising(name, [], (err) => {
        if (err) {
          console.log(err);
        }
      });
    }, 1000);

  } else {
    bleno.stopAdvertising();
  }
});
bleno.on('advertisingStart', (err) => {
  if (!err) {
    console.log(`${moment().format('YYYY-MM-DD HH:mm:ss')} [ble://${name}] advertising...`);
    //
    // Once we are advertising, it's time to set up our services,
    // along with our characteristics.
    //
    bleno.setServices([
      ethService,
      wlanService,
      systemService,
    ]);
  } else {
    console.log(err);
  }
});
bleno.on('accept', (clientAddress) => {
  console.log(`${moment().format('YYYY-MM-DD HH:mm:ss')} ${clientAddress} connected to [ble://${name}]!!`);
});
bleno.on('disconnect', (clientAddress) => {
  console.log(`${moment().format('YYYY-MM-DD HH:mm:ss')} ${clientAddress} disconnected to [ble://${name}]!!`);
});
