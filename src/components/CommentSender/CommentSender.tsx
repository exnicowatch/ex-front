/**
Copyright (c) 2022 @Negima1072, @eneko0513 and @xpadev-net
Under the MIT license
https://github.com/eneko0513/NicoNicoDansaScriptCustom/blob/main/LICENSE
 */

import { Button, InputBase, Paper, Popper } from "@mui/material";
import React, { useCallback, useContext, useEffect, useRef, useState } from "react";
import { NicoContext } from "../../provider/NicoProvider";
import { Commands } from "./CommandList";
import Styled from "./CommentSender.module.scss";

const getGroupFromItem = (value: string): string | undefined => {
  for (const row of Commands) {
    for (const item of row) {
      if (item.value === value) return item.group;
    }
  }
  return undefined;
};

const getItemsFromGroup = (group: string): string[] => {
  const result: string[] = [];
  for (const row of Commands) {
    for (const item of row) {
      if (item.group === group) result.push(item.value);
    }
  }
  return result;
};

interface CommentSenderProps {
  playedSeconds: number;
  videoId: string;
  thread: WatchCommentThread | undefined;
  onCommentSend: (no: number, id: string, thread: WatchCommentThread) => void;
}

const CommentSender = (props: CommentSenderProps) => {
  const nicoContextValue = useContext(NicoContext);
  const [isCommandSelected, setIsCommandSelected] = useState(false);
  const commandInputElement = useRef<HTMLInputElement>(null);
  const popperElement = useRef<HTMLDivElement>(null);
  const [commands, setCommands] = useState<string[]>([]);
  const [commandsStr, setCommandsStr] = useState<string>("");
  const [comment, setComment] = useState<string>("");
  const postKey = useRef<string | null>(null);
  const handleCommentChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setComment(e.currentTarget.value);
  };
  const handleCommandsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCommandsStr(e.currentTarget.value);
    setCommands(e.currentTarget.value.split(" ").filter((str) => str !== ""));
  };
  const handleCommandAreaClick = () => {
    setIsCommandSelected(true);
  };
  const handleCommentSubmit = async () => {
    let retry = 0;
    async function doComment() {
      if (props.thread && comment.length >= 1) {
        if (postKey.current === null) {
          postKey.current = await nicoContextValue.extension.getVideoCommentPostkey(props.thread.id);
        }
        if (postKey.current !== null) {
          const [_no, _id, errorCode] = await nicoContextValue.extension.postVideoComment(
            props.videoId,
            props.thread.id.toString(),
            postKey.current,
            comment,
            commands,
            Math.floor(props.playedSeconds * 1000)
          );
          if (_no !== null && _id !== null && errorCode === null) {
            setComment("");
            props.onCommentSend(_no, _id, props.thread);
          } else if (errorCode === "EXPIRED_TOKEN" && retry === 0) {
            postKey.current = null;
            retry = 1;
            await doComment();
          }
        }
      }
    }
    await doComment();
  };
  const updateCommand = useCallback(
    (value: string) => {
      let currentCommands = commands;
      if (currentCommands.includes(value)) {
        currentCommands = currentCommands.filter((item) => item !== value);
      } else {
        const group = getGroupFromItem(value);
        if (!group) return;
        const items = getItemsFromGroup(group);
        currentCommands = currentCommands.filter((item) => !items.includes(item));
        currentCommands = [...currentCommands, value];
      }
      setCommands(currentCommands);
      setCommandsStr(currentCommands.join(" "));
    },
    [commands]
  );
  useEffect(() => {
    const handleCommandAreaBlur = (e: MouseEvent) => {
      if (commandInputElement.current && popperElement.current && e.target) {
        if (
          !commandInputElement.current.contains(e.target as Node) &&
          !popperElement.current.contains(e.target as Node)
        ) {
          setIsCommandSelected(false);
        }
      }
    };
    document.addEventListener("click", handleCommandAreaBlur);
    return () => document.removeEventListener("click", handleCommandAreaBlur);
  }, []);
  return (
    <div className={Styled.senderContainer}>
      <InputBase
        onClick={handleCommandAreaClick}
        ref={commandInputElement}
        className={Styled.commandInput}
        placeholder="コマンド"
        type="text"
        value={commandsStr}
        onChange={handleCommandsChange}
        inputProps={{ maxLength: 254 }}
      />
      <InputBase
        multiline
        className={Styled.commentInput}
        placeholder="コメント"
        type="text"
        value={comment}
        onChange={handleCommentChange}
        inputProps={{ maxLength: 75 }}
      />
      <Button
        variant="contained"
        color="primary"
        onClick={handleCommentSubmit}
        disabled={props.thread === undefined || comment.length === 0}
      >
        送信
      </Button>
      <Popper
        placement="top-start"
        ref={popperElement}
        className={Styled.commandSelecter}
        open={isCommandSelected}
        anchorEl={commandInputElement.current}
      >
        <Paper className={Styled.commandButtons}>
          <div className={Styled.sizeCommandSection}>
            {Commands[2].map((c) => (
              <Button
                className={Styled[c.value]}
                variant={commands.includes(c.value) ? "contained" : "outlined"}
                key={c.value}
                onClick={() => updateCommand(c.value)}
              >
                {c.text}
              </Button>
            ))}
          </div>
          <div className={Styled.posCommandSection}>
            {Commands[3].map((c) => (
              <Button
                className={Styled[c.value]}
                variant={commands.includes(c.value) ? "contained" : "outlined"}
                key={c.value}
                onClick={() => updateCommand(c.value)}
              >
                {c.text}
              </Button>
            ))}
          </div>
          <div className={Styled.fontCommandSection}>
            {Commands[4].map((c) => (
              <Button
                className={Styled[c.value]}
                variant={commands.includes(c.value) ? "contained" : "outlined"}
                key={c.value}
                onClick={() => updateCommand(c.value)}
              >
                {c.text}
              </Button>
            ))}
          </div>
        </Paper>
      </Popper>
    </div>
  );
};

export default CommentSender;
