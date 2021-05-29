import argImg from "../images/arpeggio.png";
import longtoneImg from "../images/longtone.png";
import scaleImg from "../images/scale.png";
import noImage from "../images/gray.png";

const folderImages = {
  ロングトーン: longtoneImg,
  スケール: scaleImg,
  アルペジオ: argImg,
};

export function folderImage(type) {
  return folderImages[type] || noImage;
}
