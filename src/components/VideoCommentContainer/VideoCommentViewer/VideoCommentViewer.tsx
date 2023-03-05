import { Box, IconButton } from "@mui/material";
import React, { useEffect, useMemo, useState } from "react";
import DataGrid, { Column, SortColumn } from 'react-data-grid';
import dayjs from 'dayjs';
import MoodIcon from '@mui/icons-material/Mood';
import 'react-data-grid/lib/styles.css';
import Styled from "./VideoCommentViewer.module.scss";

interface VideoCommentViewerProps{
  thread: NvThread;
}

interface Row{
  no: number
  body: string
  nicoru: number
  playAt: number
  postAt: string
}

function rowKeyGetter(row: Row){
  return row.no;
}

function vposMs2time(vposMs: number){
  const seconds = Math.floor(vposMs / 1000);
  const minutes = Math.floor(seconds / 60);
  return `${minutes.toString().padStart(2, '0')}:${(seconds % 60).toString().padStart(2, '0')}.${(vposMs / 10 % 100).toString().padStart(2, '0')}`;
}

const columns: readonly Column<Row>[] = [
  {
    key: "no",
    name: "コメ番",
    width: 75,
    resizable: true,
    minWidth: 30
  },
  {
    key: "body",
    name: "コメント",
    width: 240,
    resizable: true,
    formatter(props) {
      return <span title={props.row.body}>{props.row.body}</span>
    },
  },
  {
    key: "nicoru",
    name: "ニコる",
    width: 55,
    resizable: true,
    minWidth: 30,
    formatter(props) {
      return (
        <div className={Styled.nicoruContainer}>
          <IconButton size="small">
            <MoodIcon fontSize="small" />
          </IconButton>
          <span>{props.row.nicoru}</span>
        </div>
      )
    }
  },
  {
    key: "playAt",
    name: "再生時間",
    width: 80,
    resizable: true,
    formatter(props) {
      return <>{vposMs2time(props.row.playAt)}</>
    },
    minWidth: 30
  },
  {
    key: "postAt",
    name: "書込時間",
    width: 150,
    resizable: true,
    formatter(props) {
      return <>{dayjs(props.row.postAt).format('YYYY/MM/DD HH:mm:ss')}</>
    },
    minWidth: 30
  },
]

function comment2row(c: NvComment): Row{
  return {
    no: c.no,
    body: c.body,
    nicoru: c.nicoruCount,
    playAt: c.vposMs,
    postAt: c.postedAt
  }
}

type Comparator = (a: Row, b: Row) => number;
function getComparator(sortColumn: string): Comparator{
  switch (sortColumn) {
    case "no":
    case "nicoru":
    case "playAt":
      return (a, b) => {
        return a[sortColumn] - b[sortColumn];
      };
    case "body":
      return (a, b) => {
        return a[sortColumn].localeCompare(b[sortColumn]);
      };
    case "postAt":
      return (a, b) => {
        return a[sortColumn].localeCompare(b[sortColumn]);
      };
    default:
      throw new Error(`unsupported sortColumn: "${sortColumn}"`);
  }
}

const VideoCommentViewer = (props: VideoCommentViewerProps) => {
  const [rows, setRows] = useState<Row[]>([]);
  const [sortColumns, setSortColumns] = useState<readonly SortColumn[]>([{columnKey: "playAt", direction: "ASC"}]);
  const sortedRows = useMemo((): readonly Row[] => {
    if (sortColumns.length === 0) return rows;
    return [...rows].sort((a, b) => {
      for (const sort of sortColumns) {
        const comparator = getComparator(sort.columnKey);
        const compResult = comparator(a, b);
        if (compResult !== 0) {
          return sort.direction === 'ASC' ? compResult : -compResult;
        }
      }
      return 0;
    });
  }, [rows, sortColumns]);
  useEffect(() => {
    setRows(props.thread.comments.map((c) => comment2row(c)));
  }, [props.thread]);
  return (
    <Box className={Styled.commentViewer}>
      <DataGrid
        className={Styled.commentGrid}
        defaultColumnOptions={{
          sortable: true,
          resizable: true
        }}
        rowHeight={22}
        columns={columns}
        rows={sortedRows}
        sortColumns={sortColumns}
        onSortColumnsChange={setSortColumns}
        rowKeyGetter={rowKeyGetter}
      />
    </Box>
  )
};

export default VideoCommentViewer;
