"use client";

import { Chip, Paper, Table, TableBody, TableCell, TableContainer, TableContainerProps, TableHead, TableRow, Theme } from "@mui/material";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import { useAtomValue } from "jotai";
import { useCallback, useMemo } from "react";
import { useSnapshot } from "valtio";

import { Attendance } from "@/api/attendance";
import Loading from "@/app/loading";
import Config from "@/app.config";
import { attendanceKindMapAtom } from "@/composables/attendance-kind";
import { categoryMapAtom } from "@/composables/category";
import { featureState } from "@/composables/feature";
import { labelsAtom } from "@/composables/label";
import { messagesAtom } from "@/composables/message";
import AttendanceViewHelper from "@/utils/attendance-view-helper";

/** 勤怠情報リストプロパティ型 */
export type ListProps = {
  onDoubleClick?: (id: number) => void;
  sx?: TableContainerProps["sx"];
  value: Attendance[] | undefined;
};

/** テーブルヘッダー用部分テーマ */
const tableHeaderTheme = (theme: Theme) =>
  createTheme({
    components: {
      MuiTableHead: {
        styleOverrides: {
          root: {
            background: `${theme.palette.secondary.main}`,
          },
        },
      },
      MuiTableCell: {
        styleOverrides: {
          root: {
            color: `${theme.palette.secondary.contrastText}`,
          },
        },
      },
    },
  });

/** 勤怠情報リスト */
export default function List({ sx, onDoubleClick, value }: ListProps) {
  const labels = useAtomValue(labelsAtom);
  const messages = useAtomValue(messagesAtom);
  const feature = useSnapshot(featureState);
  const categoryMap = useAtomValue(categoryMapAtom);
  const attendanceKindMap = useAtomValue(attendanceKindMapAtom);
  const viewHelper = new AttendanceViewHelper(labels, categoryMap, attendanceKindMap);

  const items = useMemo(() => Config.featureListItemsMap[feature.value], [feature.value]);

  const doublaClickHandler = useCallback(
    (id: number | null) => () => {
      if (id) onDoubleClick?.(id);
    },
    [onDoubleClick]
  );

  return (
    <TableContainer component={Paper} elevation={3} sx={{ ...sx }}>
      <Table>
        <ThemeProvider<Theme> theme={(theme) => tableHeaderTheme(theme)}>
          <TableHead sx={{ position: "sticky", top: 0 }}>
            <TableRow>
              {items.map((item) => (
                <TableCell key={item}>{labels.long[item]}</TableCell>
              ))}
            </TableRow>
          </TableHead>
        </ThemeProvider>
        <TableBody>
          {value && 0 < value.length ? (
            value.map((attendance) => {
              viewHelper.setAttendance(attendance);
              return (
                <TableRow hover key={attendance.id} onDoubleClick={doublaClickHandler(attendance.id)}>
                  {items.map((item) => {
                    if (item === "status") {
                      return (
                        <TableCell key={item}>
                          <Chip color={viewHelper["statusColor"]} label={viewHelper["status"]} />
                        </TableCell>
                      );
                    } else {
                      return <TableCell key={item}>{viewHelper[item]}</TableCell>;
                    }
                  })}
                </TableRow>
              );
            })
          ) : value && value.length === 0 ? (
            <TableRow key="emptyRow">
              <TableCell colSpan={items.length} key="emptyCell" sx={{ textAlign: "center" }}>
                {messages.noAttendance}
              </TableCell>
            </TableRow>
          ) : null}
        </TableBody>
      </Table>
      {!value ? <Loading /> : null}
    </TableContainer>
  );
}
