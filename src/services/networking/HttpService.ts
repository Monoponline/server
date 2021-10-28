import * as core from 'express-serve-static-core';
import express from 'express';
import cors from 'cors';
import fs from 'fs';
import http from 'http';
import https from 'https';
import Logger from '../logger/Logger';
import SocketService from './SocketService';
import PlayerService from '../player/PlayerService';

export default class HttpService {
  public engine: core.Express;
  public server: http.Server;
  public wsService: SocketService;
  public players = [] as string[];

  constructor(useHttps = false) {
    this.engine = express();
    this.server = (useHttps ? https : http).createServer(
      {
        key: useHttps ? fs.readFileSync('privkey.pem') : undefined,
        cert: useHttps ? fs.readFileSync('fullchain.pem') : undefined
      },
      this.engine
    );
    this.server.on('upgrade', (req) => {
      Logger.log('[WS ROUTER]'.green, req.method.cyan, req.url.magenta);
    });
    this.wsService = new SocketService(this.server);
  }

  public start() {
    this.engine.use(express.static(__dirname + '/public'));
    this.engine.use(express.json());
    this.engine.use(express.urlencoded({ extended: true }));
    this.engine.use(
      cors({
        origin: '*', //https://monoponline.skydonald.com
        methods: 'GET',
        optionsSuccessStatus: 200
      })
    );
    this.engine.use((req, res, next) => {
      Logger.log('[HTTP ROUTER]'.green, req.method.cyan, req.url.magenta);
      next();
    });
    this.engine.get('/is-username-taken', (req, res) => {
      res.json(
        PlayerService.instance.contains(req.query['username'] as string)
      );
    });

    this.wsService.start();

    this.server.listen(process.env.PORT, () => {
      Logger.log('Listening to port:', process.env.PORT);
    });
  }
}
