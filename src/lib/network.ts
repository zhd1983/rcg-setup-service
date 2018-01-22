import { exec } from 'child_process';
import * as fs from 'fs';
import * as path from 'path';
export default class Network {
  private getGateway(networkInterface, cb) {
    const cmd = `netstat -rn|grep ${networkInterface}|awk '{print$2}'|sed '/0.0.0.0/d'`;
    exec(cmd, (err, stdout) => {
      cb(stdout.replace(/[\n]/g, ''));
    });
  }
  private getIPv4(networkInterface, cb) {
    const cmd = `ifconfig ${networkInterface} |grep inet|grep -v inet6|awk '{print $2}'|cut -d ':' -f 2`;
    exec(cmd, (err, stdout) => {
      cb(stdout.replace(/[\n]/g, ''));
    });
  }
  private getMask(networkInterface, cb) {
    const cmd = `ifconfig ${networkInterface} |grep inet|grep -v inet6|awk '{print $4}'|cut -d ':' -f 2`;
    exec(cmd, (err, stdout) => {
      cb(stdout.replace(/[\n]/g, ''));
    });
  }
  private getDNS(networkInterface, cb) {
    const cmd = `cat /etc/resolv.conf|grep nameserver|awk '{print $2}'`;
    exec(cmd, (err, stdout) => {
      cb(stdout.replace(/[\n]/g, ''));
    });
  }

  // tslint:disable-next-line:member-ordering
  public parseMask(mask) {
    const maskList = mask.split('.');
    let result = 0;
    // tslint:disable-next-line:prefer-for-of
    for (let index = 0; index < maskList.length; index++) {
      result += maskList[index].lastIndexOf('1') + 1;
    }
    console.log(result);
    return result.toString();

  }
  // tslint:disable-next-line:member-ordering
  public setGateway(networkInterface, gateway: string) {
    let dhcpcd = fs.readFileSync(`/media/chris/resource/node_apps/rcg-set/dhcpcd.conf`, { encoding: 'utf8' });
    const dhcpcdList = dhcpcd.split('\n');
    // const interfaceIndex = dhcpcd.indexOf(`interface ${networkInterface}`);
    const interfaceIndex = dhcpcdList.indexOf(`interface ${networkInterface}`);
    // 如果找到'interface'
    if (interfaceIndex >= 0) {
      // dhcpcd = dhcpcd.replace(/^static ip_address=.*\n$/, `static ip_address=gateway\n`);
      const gatewayIndex = dhcpcdList.findIndex((x, idx) => {
        return idx > interfaceIndex && idx <= interfaceIndex + 3 && x.substring(0, 14) === 'static routers';
      });
      if (gatewayIndex !== -1) {
        dhcpcdList[gatewayIndex] = 'static routers=' + gateway;
      } else {
        dhcpcdList.splice(interfaceIndex + 1, 0, 'static routers=' + gateway);
      }
      dhcpcd = dhcpcdList.join('\n');
    } else {
      dhcpcd += `\ninterface ${networkInterface}\nstatic routers=${gateway}`;
    }
    // console.log(dhcpcd);
    fs.writeFileSync(`/media/chris/resource/node_apps/rcg-set/dhcpcd.conf`, dhcpcd);
  }

  // tslint:disable-next-line:member-ordering
  public setIPv4(networkInterface, ip: string) {
    let dhcpcd = fs.readFileSync(`/media/chris/resource/node_apps/rcg-set/dhcpcd.conf`, { encoding: 'utf8' });
    const dhcpcdList = dhcpcd.split('\n');
    // const interfaceIndex = dhcpcd.indexOf(`interface ${networkInterface}`);
    const interfaceIndex = dhcpcdList.indexOf(`interface ${networkInterface}`);
    // 如果找到'interface'
    if (interfaceIndex >= 0) {
      // dhcpcd = dhcpcd.replace(/^static ip_address=.*\n$/, `static ip_address=gateway\n`);
      const ipIndex = dhcpcdList.findIndex((x, idx) => {
        return idx > interfaceIndex && idx <= interfaceIndex + 3 && x.substring(0, 17) === 'static ip_address';
      });
      if (ipIndex !== -1) {
        const mask = dhcpcdList[ipIndex].split('/')[1];
        dhcpcdList[ipIndex] = 'static ip_address=' + ip;
        if (mask) {
          dhcpcdList[ipIndex] += '/' + mask;
        }
      } else {
        dhcpcdList.splice(interfaceIndex + 1, 0, 'static ip_address=' + ip);
      }
      dhcpcd = dhcpcdList.join('\n');
    } else {
      dhcpcd += `\ninterface ${networkInterface}\nstatic ip_address=${ip}`;
    }
    // console.log(dhcpcd);
    fs.writeFileSync(`/media/chris/resource/node_apps/rcg-set/dhcpcd.conf`, dhcpcd);
  }
   // tslint:disable-next-line:member-ordering
  public setMask(networkInterface, mask: string) {
    // const that = this;
    let dhcpcd = fs.readFileSync(`/media/chris/resource/node_apps/rcg-set/dhcpcd.conf`, { encoding: 'utf8' });
    const dhcpcdList = dhcpcd.split('\n');
    // const interfaceIndex = dhcpcd.indexOf(`interface ${networkInterface}`);
    const interfaceIndex = dhcpcdList.indexOf(`interface ${networkInterface}`);
    // 如果找到'interface'
    let result = 0;
    const maskList = mask.split('.');
    // tslint:disable-next-line:prefer-for-of
    for (let index = 0; index < maskList.length; index++) {
      result += parseInt(maskList[index], 10).toString(2).lastIndexOf('1') + 1;
    }
    // console.log(result);
    if (interfaceIndex >= 0) {
      // dhcpcd = dhcpcd.replace(/^static ip_address=.*\n$/, `static ip_address=gateway\n`);
      const maskIndex = dhcpcdList.findIndex((x, idx) => {
        return idx > interfaceIndex && idx <= interfaceIndex + 3 && x.substring(0, 17) === 'static ip_address';
      });
      if (maskIndex !== -1) {
        const ip = dhcpcdList[maskIndex].split('/')[0];
        dhcpcdList[maskIndex] = ip + '/' + result;
      } else {
        dhcpcdList.splice(interfaceIndex + 1, 0, 'static ip_address=' + '/' + result);
      }
      dhcpcd = dhcpcdList.join('\n');
    } else {
      dhcpcd += `\ninterface ${networkInterface}\nstatic ip_address=/${result}`;
    }
    // console.log(dhcpcd);
    fs.writeFileSync(`/media/chris/resource/node_apps/rcg-set/dhcpcd.conf`, dhcpcd);
  }
  // tslint:disable-next-line:member-ordering
  public setDNS(networkInterface, dns: string) {
    let dhcpcd = fs.readFileSync(`/media/chris/resource/node_apps/rcg-set/dhcpcd.conf`, { encoding: 'utf8' });
    const dhcpcdList = dhcpcd.split('\n');
    // const interfaceIndex = dhcpcd.indexOf(`interface ${networkInterface}`);
    const interfaceIndex = dhcpcdList.indexOf(`interface ${networkInterface}`);
    // 如果找到'interface'
    if (interfaceIndex >= 0) {
      // dhcpcd = dhcpcd.replace(/^static ip_address=.*\n$/, `static ip_address=gateway\n`);
      const dnsIndex = dhcpcdList.findIndex((x, idx) => {
        return idx > interfaceIndex && idx <= interfaceIndex + 3 && x.substring(0, 26) === 'static domain_name_servers';
      });
      if (dnsIndex !== -1) {
        dhcpcdList[dnsIndex] = 'static domain_name_servers=' + dns;
      } else {
        dhcpcdList.splice(interfaceIndex + 1, 0, 'static domain_name_servers=' + dns);
      }
      dhcpcd = dhcpcdList.join('\n');
    } else {
      dhcpcd += `\ninterface ${networkInterface}\nstatic domain_name_servers=${dns}`;
    }
    // console.log(dhcpcd);
    fs.writeFileSync(`/media/chris/resource/node_apps/rcg-set/dhcpcd.conf`, dhcpcd);
  }

  // tslint:disable-next-line:member-ordering
  public reboot() {
    // const cmd = `ifconfig ${networkInterface} |grep inet|grep -v inet6|awk '{print $2}'|cut -d ':' -f 2`;
    exec('sudo reboot');
  }
}
