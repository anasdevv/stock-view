import { HttpService } from '@nestjs/axios';
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { catchError, map } from 'rxjs';
import { GetIndexDataParams } from './interface/get-index-data.interface';
import { getCurrentDate, getYesterdayDate } from 'src/utils/helper';

@Injectable()
export class StockService {
  //   private readonly baseUrl: string;
  constructor(
    private readonly configService: ConfigService,
    private readonly httpService: HttpService,
  ) {}
  async getAllIndicesSymbols() {
    return this.httpService
      .get(
        `https://api.polygon.io/v3/reference/tickers?market=indices&active=true&apiKey=${this.configService.get('POLYGON_API_KEY')}`,
      )
      .pipe(
        map((resp) => resp.data),
        catchError((error) => this.handleError(error)),
      );
  }
  async getAllIndexData({
    date = getYesterdayDate(),
    multiplier = '5',
    symbol,
    timespan = 'minute',
    limit = 100,
  }: GetIndexDataParams) {
    return this.httpService
      .get(
        `https://api.polygon.io/v2/aggs/ticker/${symbol}/range/${multiplier}/${timespan}/${date}/${date}?sort=asc&apiKey=${this.configService.get('POLYGON_API_KEY')}&limit=${limit}`,
      )
      .pipe(
        map((resp) => resp.data),
        catchError((error) => this.handleError(error)),
      );
  }
  //   can make separate service for exception
  private handleError(error: any): never {
    if (error.response) {
      throw new HttpException(
        {
          status: error.response.status,
          message: error.response.statusText,
          data: error.response.data,
        },
        error.response.status,
      );
    } else if (error.request) {
      throw new HttpException(
        {
          message: 'No response received from the server',
          error: error.message,
        },
        HttpStatus.SERVICE_UNAVAILABLE,
      );
    } else {
      throw new HttpException(
        {
          message: 'Error in making request',
          error: error.message,
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
