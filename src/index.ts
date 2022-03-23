import 'dotenv/config';
import HttpService from './services/networking/HttpService';

const httpService = new HttpService();
httpService.start();
httpService.wsService.start();
