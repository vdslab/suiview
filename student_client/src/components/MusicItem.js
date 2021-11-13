import {
  IonItem,
  IonLabel,
  IonItemSliding,
  IonItemOption,
  IonItemOptions,
} from "@ionic/react";
import { convertDate } from "../services/date.js";
import { useTranslation } from "react-i18next";

export default function MusicItem({
  trackNum,
  music,
  no,
  routerLink,
  onClickMoveButton,
  onClickDeleteButton,
}) {
  const { t } = useTranslation();
  return (
    <IonItemSliding>
      <IonItem
        routerLink={routerLink}
        class="item md item-lines-full in-list ion-activatable ion-focusable item-label hydrated"
      >
        <IonLabel>
          {no === true ? (
            <div>
              No.{trackNum + 1}&emsp;{convertDate(music.name)}&emsp;
            </div>
          ) : (
            <div> {convertDate(music.name, 1)}&emsp;</div>
          )}
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
          　{t("moveFolder")}
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
          {t("delete")}
        </IonItemOption>
      </IonItemOptions>
    </IonItemSliding>
  );
}
