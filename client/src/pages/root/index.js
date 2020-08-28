import React, { useEffect, useState } from "react";
import {
  IonHeader,
  IonItem,
  IonList,
  IonToolbar,
  IonTitle,
  IonContent,
  IonPage,
  IonButton,
  IonAlert,
  IonCard,
  IonIcon,
  IonInput,
  IonLabel,
  IonListHeader,
  IonSelect,
  IonSelectOption,
  IonItemDivider,
  IonActionSheet,
} from "@ionic/react";
import { add, chevronForwardOutline } from "ionicons/icons";
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

/////////////////////////////////////////////

const getCreatDate = () => {
  const d = new Date();
  const year = d.getFullYear();
  const month = `${d.getMonth() + 1}`.padStart(2, "0");
  const date = `${d.getDate()}`.padStart(2, "0");
  const hour = `${d.getHours()}`.padStart(2, "0");
  const minute = `${d.getMinutes()}`.padStart(2, "0");
  const createdDay =
    year + "/" + month + "/" + date + "/" + hour + ":" + minute;
  return createdDay;
};

const convertDate = (input) => {
  if (input === null) {
    return "";
  }

  const d = new Date(`${input} UTC`);
  const year = d.getFullYear();
  const month = `${d.getMonth() + 1}`.padStart(2, "0");
  const date = `${d.getDate()}`.padStart(2, "0");
  const hour = `${d.getHours()}`.padStart(2, "0");
  const minute = `${d.getMinutes()}`.padStart(2, "0");
  const createdDay =
    year + "/" + month + "/" + date + "/" + hour + ":" + minute;
  return createdDay;
};

const FolderName = ({ id }) => {
  const [folderName, setFolderName] = useState();
  useEffect(() => {
    window
      .fetch(`${process.env.REACT_APP_API_ENDPOINT}/1/musics/folders/${id}`)
      .then((response) => response.json())
      .then((folderName) => {
        setFolderName(folderName);
      });
  }, []);
  //console.log(id);
  return <div>{folderName}</div>;
};

const addFolder = (name) => {
  console.log(name);
  window.fetch(`${process.env.REACT_APP_API_ENDPOINT}/1/musics/folder_name`, {
    method: "PUT",
    body: name,
  });
};
////////////////////////////////////////

const Root = () => {
  const [showAlert, setShowAlert] = useState(false);
  const [showAlert2, setShowAlert2] = useState(false);
  //const [showActionSheet, setShowActionSheet] = useState(false);
  const [musics, setMusics] = useState([]);
  const [trackNo, setTrackNo] = useState(1);
  //const [comp1, setComp1] = useState(21);
  //const [comp2, setComp2] = useState(22);
  const [folderData, setFolderData] = useState([]);
  const [folderId, setFolderId] = useState();
  const [text, setText] = useState();
  const [addFol, setAddFol] = useState();
  useEffect(() => {
    window
      .fetch(`${process.env.REACT_APP_API_ENDPOINT}/1/musics`)
      .then((response) => response.json())
      .then((musics) => {
        setMusics(musics);
      });
  }, []);
  //console.log(musics);

  useEffect(() => {
    window
      .fetch(`${process.env.REACT_APP_API_ENDPOINT}/1/musics/folders2`)
      .then((response) => response.json())
      .then((folderData) => {
        setFolderData(folderData);
      });
  }, []);
  //console.log(folderData);

  const folder_ids = Array.from(
    new Set(
      folderData.map((input) => {
        return input.id;
      })
    )
  );

  musics.sort((a, b) => {
    if (a.id > b.id) {
      return 1;
    } else {
      return -1;
    }
  });

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>musicvis</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent>
        <IonCard>
          <IonList>
            <IonItem>
              <IonButton
                size="default"
                onClick={() => {
                  musicRecord();
                  setShowAlert(true);
                }}
              >
                録音開始
              </IonButton>
              <IonButton size="default" id="dl">
                ダウンロード
              </IonButton>
            </IonItem>

            <IonItem lines="none">
              <IonLabel>trackNo.</IonLabel>
              <IonInput
                color="medium"
                value={trackNo}
                onIonChange={(e) => setTrackNo(e.target.value)}
              />
            </IonItem>
            <IonItem>
              <audio
                controls
                src={`${process.env.REACT_APP_API_ENDPOINT}/1/musics/${trackNo}/content`}
              />
            </IonItem>
          </IonList>
        </IonCard>

        <IonCard>
          <IonItem fill="medium">フォルダごと見る</IonItem>
          <IonItem>
            {/*<IonButton
              size="default"
              onClick={() => {
                setShowAlert2(true);
              }}
            >
              ファイルの追加
            </IonButton>*/}
            　　&emsp;
            <IonSelect
              value={folderId}
              placeholder="フォルダを選んでください"
              onIonChange={(e) => setFolderId(e.detail.value)}
              buttons={["Cancel", "Open Modal", "Delete"]}
            >
              {folder_ids.map((id) => {
                return (
                  <IonSelectOption value={id}>
                    No.{id} <FolderName id={id} />
                  </IonSelectOption>
                );
              })}
            </IonSelect>
            <IonButton
              slot="end"
              color="dark"
              size="big"
              key={folderId}
              routerLink={`/folder/${folderId}`}
            >
              Go
            </IonButton>{" "}
            　　　　
          </IonItem>

          {/*<ionItem>フォルダの追加</ionItem>*/}
          <ionItem>
            <IonInput
              value={addFol}
              placeholder="追加するファイル名を記入してください"
              onIonChange={(e) => {
                setAddFol(e.detail.value);
              }}
            ></IonInput>
            <IonButton
              slot="end"
              onClick={() => {
                console.log(addFol);
                addFolder(addFol);
              }}
            >
              【add】
            </IonButton>
          </ionItem>
        </IonCard>
        <IonAlert
          isOpen={showAlert}
          onDidDismiss={() => setShowAlert(false)}
          header={"録音中..."}
          message={""}
          buttons={[
            {
              text: "終了",
              handler: () => {
                saveAudio();
              },
            },
          ]}
        />

        <IonAlert
          isOpen={showAlert2}
          onDidDismiss={() => setShowAlert2(false)}
          cssClass="my-custom-class"
          header={"ファイルの追加"}
          inputs={[
            {
              name: "name1",
              type: "text",
              value: "hi",
              placeholder: "ファイル名を記入してください",
            },
          ]}
          onIonChange={(e) => {
            setText(e.detail.value);
            console.log(text);
          }}
          buttons={[
            {
              text: "Cancel",
              role: "cancel",
              cssClass: "secondary",
              handler: () => {
                console.log("Confirm Cancel");
              },
            },
            {
              text: "Add",
              handler: () => {
                console.log("Confirm Ok");
              },
            },
          ]}
        />

        {/*<IonCard>
          <IonItem lines="none">
            <IonLabel>比較したいトラック番号を入力してください</IonLabel>
          </IonItem>
          <IonItem lines="none">
            trackNo.
            <IonInput
              color="medium"
              value={comp1}
              onIonChange={(e) => setComp1(e.target.value)}
            />
            trackNo.
            <IonInput
              color="medium"
              value={comp2}
              onIonChange={(e) => setComp2(e.target.value)}
            />
            <IonButton
              size="big"
              color="dark"
              key={comp1}
              routerLink={`/comp_chart/${comp1}/${comp2}`}
            >
              show
            </IonButton>
          </IonItem>
        </IonCard>*/}

        <IonList>
          {musics.map(({ created, id, name }) => {
            return (
              <IonCard>
                <IonItem>
                  No.{id}: {name} &emsp;{convertDate(created)}
                  <IonButton
                    slot="end"
                    fill="clear"
                    key={id}
                    routerLink={`/detail/${id}`}
                  >
                    <IonIcon icon={chevronForwardOutline} color="primary" />
                  </IonButton>
                </IonItem>
              </IonCard>
            );
          })}
        </IonList>
      </IonContent>
    </IonPage>
  );
};

export default Root;
