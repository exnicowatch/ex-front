/**
Copyright (c) 2022 @Negima1072, @eneko0513 and @xpadev-net
Under the MIT license
https://github.com/eneko0513/NicoNicoDansaScriptCustom/blob/main/LICENSE
 */

type command = {
  text: string;
  value: string;
  group: string;
};
type commandList = command[][];

const Commands: commandList = [
  [
    {
      text: "#FFFFFF",
      value: "white",
      group: "color",
    },
    {
      text: "#FF0000",
      value: "red",
      group: "color",
    },
    {
      text: "#FF8080",
      value: "pink",
      group: "color",
    },
    {
      text: "#FFC000",
      value: "orange",
      group: "color",
    },
    {
      text: "#FFFF00",
      value: "yellow",
      group: "color",
    },
    {
      text: "#00FF00",
      value: "green",
      group: "color",
    },
    {
      text: "#00FFFF",
      value: "cyan",
      group: "color",
    },
    {
      text: "#0000FF",
      value: "blue",
      group: "color",
    },
    {
      text: "#C000FF",
      value: "purple",
      group: "color",
    },
    {
      text: "#000000",
      value: "black",
      group: "color",
    },
  ],
  [
    {
      text: "#CCCC99",
      value: "white2",
      group: "color",
    },
    {
      text: "#CC0033",
      value: "red2",
      group: "color",
    },
    {
      text: "#FF33CC",
      value: "pink2",
      group: "color",
    },
    {
      text: "#FF6600",
      value: "orange2",
      group: "color",
    },
    {
      text: "#999900",
      value: "yellow2",
      group: "color",
    },
    {
      text: "#00CC66",
      value: "green2",
      group: "color",
    },
    {
      text: "#00CCCC",
      value: "cyan2",
      group: "color",
    },
    {
      text: "#3399FF",
      value: "blue2",
      group: "color",
    },
    {
      text: "#6633CC",
      value: "purple2",
      group: "color",
    },
    {
      text: "#666666",
      value: "black2",
      group: "color",
    },
  ],
  [
    {
      text: "大",
      value: "big",
      group: "size",
    },
    {
      text: "中",
      value: "medium",
      group: "size",
    },
    {
      text: "小",
      value: "small",
      group: "size",
    },
  ],
  [
    {
      text: "上",
      value: "ue",
      group: "pos",
    },
    {
      text: "流",
      value: "naka",
      group: "pos",
    },
    {
      text: "下",
      value: "shita",
      group: "pos",
    },
  ],
  [
    {
      text: "デ",
      value: "defont",
      group: "font",
    },
    {
      text: "ゴ",
      value: "gothic",
      group: "font",
    },
    {
      text: "明",
      value: "mincho",
      group: "font",
    },
  ],
  [
    {
      text: "end",
      value: "ender",
      group: "ender",
    },
  ],
  [
    {
      text: "full",
      value: "full",
      group: "full",
    },
  ],
  [
    {
      text: "pts",
      value: "patissier",
      group: "patissier",
    },
  ],
  [
    {
      text: "184",
      value: "184",
      group: "184",
    },
  ],
  [
    {
      text: "Inv",
      value: "invisible",
      group: "invisible",
    },
  ]
];
export { Commands };
