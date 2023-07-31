import AddIcon from "@mui/icons-material/Add";
import { Fab } from "@mui/material";

export type NewFabProps = {
  onClick: () => void;
};

/** 新規作成フローティングアクションボタン */
export default function NewFab({ onClick }: NewFabProps) {
  return (
    <Fab color="secondary" onClick={onClick} sx={{ position: "absolute", bottom: "90px", right: "24px" }}>
      <AddIcon />
    </Fab>
  );
}
