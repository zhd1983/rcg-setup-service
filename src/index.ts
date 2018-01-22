import * as bleno from 'bleno';
import { setTimeout } from 'timers';
import Network from './lib/network';
import NetworkService from './lib/network-service';
import Utils from './lib/utils';

const BlenoPrimaryService = bleno.PrimaryService;
const bleOptions = {
  eth0: {
    uuid: '1fe00000000000000000000000000000',
    gateway: {
      uuid: 'ce',
      properties: ['read', 'write'],
      descriptor: {
        uuid: '2903',
        value: 'rcg eth0 gateway.',
      },
    },
    ip: {
      uuid: 'ad',
      properties: ['read', 'write'],
      descriptor: {
        uuid: '2903',
        value: 'rcg eth0 ip.',
      },
    },
    mask: {
      uuid: 'df',
      properties: ['read', 'write'],
      descriptor: {
        uuid: '2903',
        value: 'rcg eth0 mask.',
      },
    },
    dns: {
      uuid: '66',
      properties: ['read', 'write'],
      descriptor: {
        uuid: '2903',
        value: 'rcg dns.',
      },
    },
    save: {
      uuid: 'ae',
      properties: ['write'],
      descriptor: {
        uuid: '2903',
        value: 'rcg save.',
      },
    },
  },
};
const networkService = new NetworkService(bleOptions, new Network());
// new Network().setGateway('eth1', '123');
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
      bleno.startAdvertising(name, [networkService.uuid], (err) => {
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
    console.log('advertising...');
    //
    // Once we are advertising, it's time to set up our services,
    // along with our characteristics.
    //
    bleno.setServices([
      networkService,
    ]);
  } else {
    console.log(err);
  }
});
