import {
  IonItem,
  IonLabel,
  IonItemSliding,
  IonItemOption,
  IonItemOptions,
} from "@ionic/react";
import { convertDate } from "../services/date.js";

export default function MusicItem({
  music,
  routerLink,
  onClickMoveButton,
  onClickDeleteButton,
}) {
  return (
    <IonItemSliding>
      <IonItem
        routerLink={routerLink}
        class="item md item-lines-full in-list ion-activatable ion-focusable item-label hydrated"
      >
        <IonLabel>
          No.{music.id}&emsp;{convertDate(music.created)}&emsp;
          {music.name}&emsp;
        </IonLabel>
      </IonItem>

      <IonItemOptions>
        <IonItemOption
          color="primary"
          expandable
          onClick={(event) => {
            if (onClickMoveButton) {
              onClickMoveButton(event);
            }
          }}
        >
          　フォルダ移動
        </IonItemOption>

        <IonItemOption
          color="danger"
          expandable
          onClick={(event) => {
            if (onClickDeleteButton) {
              onClickDeleteButton(event);
            }
          }}
        >
          削除
        </IonItemOption>
      </IonItemOptions>
    </IonItemSliding>
  );
}
