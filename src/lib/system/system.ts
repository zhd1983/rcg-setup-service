import { exec } from 'child_process';
import * as os from 'os';
export default class System {
  private reboot() {
    // const cmd = `ifconfig ${networkInterface} |grep inet|grep -v inet6|awk '{print $2}'|cut -d ':' -f 2`;
    exec('sudo reboot');
  }
  // private getHostname() {
  //   return os.hostname();
  // }
  // private getUptime() {
  //   return os.uptime();
  // }
  private getLoadAvg(cb) {
    const temp = os.loadavg();
    for (let index = 0; index < temp.length; index++) {
      temp[index] = parseFloat(temp[index].toFixed(1));

    }
    const result = temp.join(',');
    return cb(result);
  }
  private getUsedMem(cb) {
    const result = ((1 - os.freemem() / os.totalmem()) * 100).toFixed(0);
    return cb(result);
  }
  private getUsedDisk(cb) {
    const cmd = `df |grep /dev/root|awk '{print$5}'`;
    exec(cmd, (err, stdout) => {
      cb(stdout.replace(/[\n%]/g, ''));
    });
  }
}
