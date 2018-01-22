# rcg-setup-service
一个为树莓派设置网络等相关参数的服务(建立ble周边设备服务,[rcg-setup-wx](http://git.jkr3.com/Laputa/rcg-setup-wx.git)通过微信小程序建立连接进行读写操作)
## 依赖

### Raspbian(未在其他系统上测试过)

 * Kernel version 3.6 or above
 * ```libbluetooth-dev```
 * ```bluetoothd``` disabled, if BlueZ 5.14 or later is installed. Use ```sudo hciconfig hci0 up``` to power Bluetooth adapter up after stopping or disabling ```bluetoothd```.
    * ```System V```:
      * ```sudo service bluetooth stop``` (once)
      * ```sudo update-rc.d bluetooth remove``` (persist on reboot)
    * ```systemd```
      * ```sudo systemctl stop bluetooth``` (once)
      * ```sudo systemctl disable bluetooth```(persist on reboot)


* ```typeScript```
* ```pm2```
* ```bleno```          

```sh
sudo apt-get install bluetooth bluez libbluetooth-dev libudev-dev
```
## 安装
```sh
npm install -g typescript pm2
npm init
tsc
```
## 运行
推荐用pm2守护,因为树莓派3设置静态ip,修改```/etc/dhcpcd.conf```文件后需重启设备才生效,不知道是不是还有不重启的方法?
### pm2.json
```javascript
{
  "apps":[
    {
      "name":"rcg-setup-service",
      "script":"dist/index.js"
    }
  ]
}
```
```sh
pm2 start pm2.json
```
