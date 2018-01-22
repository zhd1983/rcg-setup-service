import {exec} from 'child_process';

export default class Utils {
  public static getCPUSerialNo(cb) {
    const cmd = 'cat /proc/cpuinfo | grep Serial | awk \' {print $3}\'';
    exec(cmd, (err, stdout) => {
      cb(stdout.replace(/[\n]/g, ''));
    });
  }
  public static getGateway(networkInterface, cb) {
    const cmd = `netstat -rn|grep ${networkInterface}|awk '{print$2}'|sed '/0.0.0.0/d'`;
    exec(cmd, (err, stdout) => {
      cb(stdout.replace(/[\n]/g, ''));
    });
  }
}
