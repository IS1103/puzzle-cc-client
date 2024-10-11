import { _decorator, Component, log, Node } from 'cc';
const { ccclass, property } = _decorator;

interface PostJsonResult {
  statusCode: number;
  resp: object | null;
  respText: string;
  // cookie: string | null;
}

export interface PostJsonOptions {
  abortController?: AbortController;
  timeout?: number;
}

@ccclass('PuzzleHttpReqRes')
export class PuzzleHttpReqRes {
  public static TOKEN: string = null;
  public static id: number = 0;
  public static postJson(
    url: string,
    data: object | string,
    options: PostJsonOptions = {}
  ): Promise<PostJsonResult> {
    return new Promise((resolve, reject) => {
      let _id = ++PuzzleHttpReqRes.id;
      let date = new Date();
      let time = `${date.getHours()}:${date.getMinutes()}:${date.getSeconds()} ${date.getFullYear()}-${
        date.getMonth() + 1
      }-${date.getDate()}`;
      log(
        `[http][${_id}] ${url} ${time} >>>>> request ${JSON.stringify(data)}`
      );

      let xhr = new XMLHttpRequest();
      xhr.open('GET', url, true);
      xhr.setRequestHeader('Content-Type', 'application/json;charset=utf-8');

      if (this.TOKEN != null) xhr.setRequestHeader('Authorization', this.TOKEN);

      xhr.onreadystatechange = function () {
        let resp = null;
        switch (xhr.readyState) {
          case 4:
            try {
              if (xhr.responseText != '') {
                resp = JSON.parse(xhr.responseText);
              }
            } catch (e) {
              reject(new Error('JSON parsing error'));
              return;
            }
            let s = JSON.stringify(resp);
            let date = new Date();
            let time = `${date.getHours()}:${date.getMinutes()}:${date.getSeconds()} ${date.getFullYear()}-${
              date.getMonth() + 1
            }-${date.getDate()}`;
            log(`[http][${_id}] ${url} ${time} <<<<< response `, s);
            resolve({
              statusCode: xhr.status,
              resp: resp,
              respText: xhr.responseText,
            });
            break;
          default:
            resolve({
              statusCode: xhr.status,
              resp: resp,
              respText: xhr.responseText,
            });
            break;
        }
      };

      xhr.onerror = function (err) {
        reject(err);
      };

      xhr.onabort = function () {
        reject(new Error('Request aborted'));
      };

      const text = typeof data == 'string' ? data : JSON.stringify(data);
      xhr.send(text);

      // 如果提供了 AbortController,設置abort事件監聽器
      if (options.abortController) {
        options.abortController.signal.addEventListener('abort', () => {
          xhr.abort();
        });
      }

      // 設置超時
      xhr.timeout = options.timeout ? options.timeout : 3000;
      xhr.ontimeout = function () {
        reject(new Error('Request timeout'));
      };
    });
  }
}
