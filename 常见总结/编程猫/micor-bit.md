# pc 接入 micro bit 方案

## 1. 通过串口连接

```js
document.getElementById("connect").addEventListener("click", async () => {
  try {
    if ("serial" in navigator) {
      // Get all serial ports the user has previously granted the website access to.
      const ports = await navigator.serial.getPorts();

      // 过滤出 micro:bit 设备，这里可能需要根据实际情况调整过滤器参数
      // const filters = [{ vendorId: 0x0D28, productId: 0x0204 }];
      // Filter on devices with the Arduino Uno USB Vendor/Product IDs.
      const filters = [
        { usbVendorId: 0x0d28, usbProductId: 0x0204 },
        { usbVendorId: 0x2341, usbProductId: 0x0001 },
      ];
      // Prompt user to select an Arduino Uno device.
      const port = await navigator.serial.requestPort({ filters });

      const { usbProductId, usbVendorId } = port.getInfo();

      // Wait for the serial port to open.
      await port.open({ baudRate: 9600 });

      // const writer = port.writable.getWriter();

      // const data = new Uint8Array([104, 101, 108, 108, 111]); // hello
      // await writer.write(data);

      // // Allow the serial port to be closed later.
      // writer.releaseLock();

      // await port.close();
      // 如果串口显示中文乱码，多半是编码格式错误的问题，这里编码格式选择’gb2312‘
      const textDecoder = new TextDecoderStream("gb2312");
      // 接收数据前先连接管道，这样就能边接收边转换了
      const readableStreamClosed = port.readable.pipeTo(textDecoder.writable);
      // 转换后的数据读取器
      const reader = textDecoder.readable.getReader();

      while (true) {
        const { value, done } = await reader.read();
        if (done) {
          reader.releaseLock();
          break;
        }
        console.log(value);
      }

      function stringToUint8Array(str) {
        var arr = [];
        for (var i = 0, j = str.length; i < j; ++i) {
          arr.push(str.charCodeAt(i));
        }

        var tmpUint8Array = new Uint8Array(arr);
        return tmpUint8Array;
      }
      console.log("port closed");
    }
  } catch (error) {
    console.error("There was an error:", error);
  }
});
```

## 2. link（硬件助手）+ 串口连接

nodejs 串口连接

````js

const SerialPort = require('serialport');
const Readline = require('@serialport/parser-readline');

// 找到你的Micro:bit串口名称，这可能会根据你的系统和Micro:bit而变，需要替换。
// 在Windows上可能是'COM3'、'COM4'等，而在macOS和Linux上一般是'/dev/tty.usbmodem1422'或类似名称。
const port = new SerialPort('/dev/tty.usbmodem1422', {
  baudRate: 115200,
});

// 串口数据读取的Parser
const parser = port.pipe(new Readline({ delimiter: '\r\n' }));

parser.on('data', data => {
  console.log('Received data:', data);
});

// 发送字符串数据到Micro:bit
function writeToPort(data) {
  port.write(data, function(err) {
    if (err) {
      return console.error('Failed to write to port:', err.message);
    }
    console.log('Message written to micro:bit:', data);
  });
}

// 程序关闭时关闭串口
process.on('exit', (code) => {
  port.close(() => {
    console.log('Serial port closed');
  });
});

// 使用writeToPort函数发送数据到Micro:bit
writeToPort('Hello, micro:bit!');

``

## 3.蓝牙连接

```js
    document.getElementById("connect").addEventListener("click", async () => {
      try {
        if ("serial" in navigator) {
          // Get all serial ports the user has previously granted the website access to.
          const ports = await navigator.serial.getPorts();

          // 过滤出 micro:bit 设备，这里可能需要根据实际情况调整过滤器参数
          // const filters = [{ vendorId: 0x0D28, productId: 0x0204 }];
          // Filter on devices with the Arduino Uno USB Vendor/Product IDs.
          const filters = [
            { usbVendorId: 0x0d28, usbProductId: 0x0204 },
            { usbVendorId: 0x2341, usbProductId: 0x0001 },
          ];
          // Prompt user to select an Arduino Uno device.
          const port = await navigator.serial.requestPort({ filters });

          const { usbProductId, usbVendorId } = port.getInfo();

          // Wait for the serial port to open.
          await port.open({ baudRate: 9600 });


          // const writer = port.writable.getWriter();

          // const data = new Uint8Array([104, 101, 108, 108, 111]); // hello
          // await writer.write(data);

          // // Allow the serial port to be closed later.
          // writer.releaseLock();

          // await port.close();
          // 如果串口显示中文乱码，多半是编码格式错误的问题，这里编码格式选择’gb2312‘
          const textDecoder = new TextDecoderStream('gb2312');
          // 接收数据前先连接管道，这样就能边接收边转换了
          const readableStreamClosed = port.readable.pipeTo(textDecoder.writable);
          // 转换后的数据读取器
          const reader = textDecoder.readable.getReader();

          while (true) {
            const { value, done } = await reader.read();
            if (done) {
              reader.releaseLock();
              break;
            }
            console.log(value);
          }

          function stringToUint8Array(str){
              var arr = [];
              for (var i = 0, j = str.length; i < j; ++i) {
                arr.push(str.charCodeAt(i));
              }

              var tmpUint8Array = new Uint8Array(arr);
              return tmpUint8Array
            }
          console.log("port closed");
        }
      } catch (error) {
        console.error("There was an error:", error);
      }
    });
````
