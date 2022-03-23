import 'colors';
import { createWriteStream, readFileSync } from 'fs';
import { stripColors } from 'colors';

export default class Logger {
  private static file = `./logs/${new Date()
    .toLocaleDateString()
    .replace(/\//g, '-')}.log`;
  private static stream = createWriteStream(Logger.file);
  private static first = false;

  public static log(...messages: any[]) {
    const text = [];
    for (const m of messages) {
      if (typeof m === 'object') {
        let t: string;
        try {
          t = JSON.stringify(m, null, 2);
        } catch (ignored) {}
        if (!t) {
          t = m.toString();
        }
        text.push(t);
      } else {
        text.push(m);
      }
    }

    const info = Logger._getInfo();

    const d = new Date();
    let month: string | number = d.getMonth() + 1;
    if (month < 10) month = `0${month}`;
    let date: string | number = d.getDate();
    if (date < 10) date = `0${date}`;
    let hour: string | number = d.getHours();
    if (hour < 10) hour = `0${hour}`;
    let minutes: string | number = d.getMinutes();
    if (minutes < 10) minutes = `0${minutes}`;
    let sec: string | number = d.getSeconds();
    if (sec < 10) sec = `0${sec}`;
    const now = `${d.getFullYear()}/${month}/${date} ${hour}:${minutes}:${sec}`;

    const log = `[${now.yellow}] [${info.blue}] ${text.join(' ').magenta}`;

    Logger.fileLog(stripColors(log));
    console.log(log);
  }

  private static _getInfo() {
    let info: string;
    try {
      throw new Error();
    } catch (e: any) {
      const lines = e.stack.split('\n');
      const line = lines[3];
      const matched = line.match(/([\w\d\-_.]*:\d+:\d+)/);
      info = matched[1];
    }

    return info;
  }

  public static fileLog(log: string) {
    Logger.stream.write(log + '\n');
  }

  public static init() {
    if (Logger.first) return;

    let file: Buffer;
    try {
      file = readFileSync(Logger.file);
    } catch (ignored) {}
    if (file) Logger.stream.write(file.toString('utf8'));
  }
}

Logger.init();
