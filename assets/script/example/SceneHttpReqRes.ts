import { _decorator, Component, log, Node } from 'cc';
import { PuzzleHttpReqRes } from '../puzzle/protocol/PuzzleHttpReqRes';
const { ccclass, property } = _decorator;

@ccclass('SceneHttpReqRes')
export class SceneHttpReqRes extends Component {
  async start() {
    // await PuzzleHttpReqRes.postJson(
    //   'http://localhost:8080/events',
    //   'data',
    //   null
    // );

    const eventSource = new EventSource('http://localhost:8080/events');

    eventSource.addEventListener(
      'open',
      function (e) {
        // 連線已建立
        log('Connection opened');
      },
      false
    );

    eventSource.addEventListener(
      'error',
      function (e) {
        log('Connection error:', e);
      },
      false
    );

    eventSource.addEventListener(
      'message',
      function (e) {
        log(e.data);
        eventSource.close();
      },
      false
    );

    eventSource.addEventListener(
      'close',
      function (e) {
        log(e.data);
      },
      false
    );

    // eventSource.onmessage = (event) => {
    //   log('Received message:', event.data);
    // };

    // eventSource.onerror = (ev) => {
    //   log('EventSource error:', eventSource, ev);
    // };

    log('Waiting for messages...');
  }

  update(deltaTime: number) {}
}
