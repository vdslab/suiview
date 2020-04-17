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
                finPushed();
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
