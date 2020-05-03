import React, { useState } from "react";
import {
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent,
  IonPage,
  IonButton,
  IonAlert,
} from "@ionic/react";

/*--------webmの場合-------------------------
//録音した日付の入力
//コメント(日付も)
//録音した物の再生
let recorder = null;
const musicRecord = () => {
  console.log("recoding");
  navigator.getUserMedia =
    navigator.getUserMedia || navigator.webkitGetUserMedia;
  const constraints = { audio: true, video: false };
  const chunks = [];
  navigator.getUserMedia(constraints, successFunc, errorFunc);
  function successFunc(stream) {
    recorder = new MediaRecorder(stream, {
      mimeType: "video/webm;codecs=vp9", //ここは何にするのがベスト?
      //mimeType: "audio/wav;MPEG-4 AVC",
      //mimeType: "video/avi;codecs=dv",
    });
    //録音
    recorder.addEventListener("dataavailable", function (ele) {
      if (ele.data.size > 0) {
        chunks.push(ele.data);
      }
    });
    // recorder.stopが実行された時のイベント
    recorder.addEventListener("stop", function () {
      const dl = document.querySelector("#dl");
      //データの送信
      window.fetch(`${process.env.REACT_APP_API_ENDPOINT}/1/musics`, {
        method: "PUT",
        body: new Blob(chunks),
      });
      //集音したものから音声データを作成する
      dl.href = URL.createObjectURL(new Blob(chunks));
      dl.download = "sample.wav";
      console.log("you can download");
      alert("音声のダウンロードが可能です");
    });
    recorder.start();
    console.log("start");
  }
  // Web Audio APIが使えなかった時
  function errorFunc(error) {
    //これは機能するの?
    alert("error");
  }
};
const finPushed = () => {
  recorder.stop();
  console.log("button stop");
};
*/

//wavの場合-------------------------------------------------
// for audio
let audio_sample_rate = null;
let audioContext = null;
// audio data
let audioData = [];

const musicRecord = () => {
  const bufferSize = 1024;
  let scriptProcessor = null;
  const handleSuccess = (stream) => {
    audioContext = new AudioContext();
    audio_sample_rate = audioContext.sampleRate;
    console.log(audio_sample_rate);
    scriptProcessor = audioContext.createScriptProcessor(bufferSize, 1, 1);
    const mediastreamsource = audioContext.createMediaStreamSource(stream);
    mediastreamsource.connect(scriptProcessor);
    scriptProcessor.onaudioprocess = onAudioProcess;
    scriptProcessor.connect(audioContext.destination);

    console.log("record start?");
  };

  //save audio data
  const onAudioProcess = (e) => {
    const input = e.inputBuffer.getChannelData(0);
    const bufferData = new Float32Array(bufferSize);
    for (let i = 0; i < bufferSize; i++) {
      bufferData[i] = input[i];
    }
    audioData.push(bufferData);
  };

  // getUserMedia
  navigator.mediaDevices
    .getUserMedia({ audio: true, video: false })
    .then(handleSuccess);
};

const saveAudio = () => {
  // export WAV from audio float data
  const exportWAV = (audioData) => {
    const encodeWAV = (samples, sampleRate) => {
      const buffer = new ArrayBuffer(44 + samples.length * 2);
      const view = new DataView(buffer);

      const writeString = (view, offset, string) => {
        for (let i = 0; i < string.length; i++) {
          view.setUint8(offset + i, string.charCodeAt(i));
        }
      };

      const floatTo16BitPCM = (output, offset, input) => {
        for (let i = 0; i < input.length; i++, offset += 2) {
          let s = Math.max(-1, Math.min(1, input[i]));
          output.setInt16(offset, s < 0 ? s * 0x8000 : s * 0x7fff, true);
        }
      };

      writeString(view, 0, "RIFF"); // RIFFヘッダ
      view.setUint32(4, 32 + samples.length * 2, true); // これ以降のファイルサイズ
      writeString(view, 8, "WAVE"); // WAVEヘッダ
      writeString(view, 12, "fmt "); // fmtチャンク
      view.setUint32(16, 16, true); // fmtチャンクのバイト数
      view.setUint16(20, 1, true); // フォーマットID
      view.setUint16(22, 1, true); // チャンネル数
      view.setUint32(24, sampleRate, true); // サンプリングレート
      view.setUint32(28, sampleRate * 2, true); // データ速度
      view.setUint16(32, 2, true); // ブロックサイズ
      view.setUint16(34, 16, true); // サンプルあたりのビット数
      writeString(view, 36, "data"); // dataチャンク
      view.setUint32(40, samples.length * 2, true); // 波形データのバイト数
      floatTo16BitPCM(view, 44, samples); // 波形データ

      return view;
    };

    const mergeBuffers = (audioData) => {
      let sampleLength = 0;
      for (let i = 0; i < audioData.length; i++) {
        sampleLength += audioData[i].length;
      }
      const samples = new Float32Array(sampleLength);
      let sampleIdx = 0;
      for (let i = 0; i < audioData.length; i++) {
        for (let j = 0; j < audioData[i].length; j++) {
          samples[sampleIdx] = audioData[i][j];
          sampleIdx++;
        }
      }
      return samples;
    };

    const dataview = encodeWAV(mergeBuffers(audioData), audio_sample_rate);
    const audioBlob = new Blob([dataview], { type: "audio/wav" });
    console.log(dataview);

    //データの送信をしたい
    window.fetch(`${process.env.REACT_APP_API_ENDPOINT}/1/musics`, {
      method: "PUT",
      body: audioBlob,
    });

    const myURL = window.URL || window.webkitURL;
    const url = myURL.createObjectURL(audioBlob);
    return url;
  };

  const dl = document.querySelector("#dl");
  dl.href = exportWAV(audioData);
  dl.download = "test.wav";
  alert("音声のダウンロードが可能です");

  //必要そう↓多分これがないと二回目以降がおかしくなりそう
  audioContext.close().then(function () {
    audioData = [];
    audio_sample_rate = null;
    audioContext = null;
  });
};

/////////////////////////////////////////////////////
const Root = () => {
  const [showAlert, setShowAlert] = useState(false);
  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>recoding</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent>
        <IonButton
          onClick={() => {
            musicRecord();
            setShowAlert(true);
          }}
        >
          録音開始
        </IonButton>
        <IonAlert
          isOpen={showAlert}
          onDidDismiss={() => setShowAlert(false)}
          header={"録音中..."}
          message={""}
          buttons={[
            {
              text: "終了",
              handler: () => {
                //finPushed();
                saveAudio();
              },
            },
          ]}
        />

        <IonButton id="dl">ダウンロード</IonButton>
      </IonContent>
    </IonPage>
  );
};

export default Root;
