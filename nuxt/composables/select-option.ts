import { DeepReadonly } from "vue";

/** 選択肢型 */
export type Option = {
  title: string;
  value: string;
};

/** 空白選択肢 */
const blankOption: Option = {
  title: "",
  value: "",
};

/** 選択肢の生成に使用するデータの型 */
type Data = Record<any, any>[] | DeepReadonly<Record<any, any>[]>;

/** 選択肢生成 */
const createSelectOption = (data: Data, title: string, value: string, needBlank = false) => {
  const options: Option[] = [...data.map((it) => ({ title: it?.[title]?.toString() ?? "", value: it?.[value]?.toString() ?? "" }))];
  if (needBlank) {
    options.unshift(blankOption);
  }
  return options;
};

export const useSelectOption = () => ({ createSelectOption });
