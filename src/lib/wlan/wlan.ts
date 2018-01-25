import { exec } from 'child_process';
import Eth from '../eth/eth';
export default class Wlan extends Eth {
  private getSSID(cb) {
    const wpaFile = '/media/chris/resource/node_apps/rcg-set/wpa_supplicant.conf';
    // const wpaFile = '/etc/wpa_supplicant/wpa_supplicant.conf';
    const cmdSelect = `sed -n '/network={/,/}/s/\\(ssid="\\)\\(.*\\)"/\\2/p' ${wpaFile}`;
    exec(cmdSelect, (err, stdout) => {
      const result = stdout.replace(/[\n]/g, '');
      cb(result);
    });
  }
  private setSSID(ssid) {
    const wpaFile = '/media/chris/resource/node_apps/rcg-set/wpa_supplicant.conf';
    // const wpaFile = '/etc/wpa_supplicant/wpa_supplicant.conf';
    // 查找有无network节点,有则继续查找ssid,无则直接插入整个节点
    const cmdSelectNetwork = `sed -n '/network={/,/}/p' ${wpaFile}`;
    exec(cmdSelectNetwork, (e1, s1) => {
      const resultNetwork = s1.replace(/[\n]/g, '');
      if (resultNetwork !== '') {
        // 查找有无ssid节点,有则更改ssid节点,无则插入
        const cmdSelectSSID = `sed -n '/network={/,/}/s/\\(ssid=\\).*/\\1"${ssid}"/p' ${wpaFile}`;
        exec(cmdSelectSSID, (e2, s2) => {
          const resultSSID = s2.replace(/[\n]/g, '');
          if (resultSSID !== '') {
            const cmdReplaceSSID = `sed -i '/network={/,/}/s/\\(ssid=\\).*/\\1"${ssid}"/' ${wpaFile}`;
            exec(cmdReplaceSSID);
          } else {
            const cmdAddSSID = `sed -i '/network={/a\\ssid="${ssid}"' ${wpaFile}`;
            exec(cmdAddSSID);
          }
        });
      } else {
        const cmdAddNetwork = `sed -i '$a network={\\nssid="${ssid}"\\n}' ${wpaFile}`;
        exec(cmdAddNetwork);
      }
    });
  }
  private getPSK(cb) {
    const wpaFile = '/media/chris/resource/node_apps/rcg-set/wpa_supplicant.conf';
    // const wpaFile = '/etc/wpa_supplicant/wpa_supplicant.conf';
    const cmdSelect = `sed -n '/network={/,/}/s/\\(psk="\\)\\(.*\\)"/\\2/p' ${wpaFile}`;
    exec(cmdSelect, (err, stdout) => {
      const result = stdout.replace(/[\n]/g, '');
      cb(result);
    });
  }

  private setPSK(psk) {
    const wpaFile = '/media/chris/resource/node_apps/rcg-set/wpa_supplicant.conf';
    // const wpaFile = '/etc/wpa_supplicant/wpa_supplicant.conf';
    // 查找有无network节点,有则继续查找psk,无则直接插入整个节点
    const cmdSelectNetwork = `sed -n '/network={/,/}/p' ${wpaFile}`;
    exec(cmdSelectNetwork, (e1, s1) => {
      const resultNetwork = s1.replace(/[\n]/g, '');
      if (resultNetwork !== '') {
        // 如果密码是空则添加key_mgmt=NONE
        if (psk === '') {
          const cmdAddKeymgmt = `sed -i '/network/a\\key_mgmt=NONE' ${wpaFile}`;
          exec(cmdAddKeymgmt);
          const cmdDelSSID = `sed -i '/psk/d' ${wpaFile}`;
          exec(cmdDelSSID);
        } else {
          const cmdDelKeymgmt = `sed -i '/key_mgmt=NONE/d' ${wpaFile}`;
          exec(cmdDelKeymgmt);
          // }
          // 查找有无psk节点,有则更改psk节点,无则插入
          const cmdSelectPSK = `sed -n '/network={/,/}/s/\\(psk=\\).*/\\1"${psk}"/p' ${wpaFile}`;
          exec(cmdSelectPSK, (e2, s2) => {
            const resultPSK = s2.replace(/[\n]/g, '');
            if (resultPSK !== '') {
              const cmdReplacePSK = `sed -i '/network={/,/}/s/\\(psk=\\).*/\\1"${psk}"/' ${wpaFile}`;
              exec(cmdReplacePSK);
            } else {
              const cmdAddPSK = `sed -i '/network={/a\\psk="${psk}"' ${wpaFile}`;
              exec(cmdAddPSK);
            }
          });
        }
      } else {
        if (psk === '') {
          const cmdAddNetwork = `sed -i '$a network={\\nkey_mgmt=NONE\\n}' ${wpaFile}`;
          exec(cmdAddNetwork);
          // const cmdAddKeymgmt = `sed -i '/network/a\\key_mgmt=NONE' ${wpaFile}`;
          // exec(cmdAddKeymgmt);
        } else {
          const cmdAddNetwork = `sed -i '$a network={\\npsk="${psk}"\\n}' ${wpaFile}`;
          exec(cmdAddNetwork);
        }

      }
    });
  }
}
