import { useAtomValue } from "jotai";
import { useCallback, useMemo } from "react";
import useSWR, { Fetcher } from "swr";
import { useSnapshot } from "valtio";

import { Attendance, create as createOfApi, find as findOfApi, findById as findByIdOfApi, save as saveOfApi, FindType } from "@/api/attendance";
import Config from "@/app.config";
import { Criteria, criteriaMapState } from "@/composables/criteria";
import { csrfTokenState } from "@/composables/csrf-token";
import { featureState } from "@/composables/feature";
import { languageAtom } from "@/composables/language";

type FetcerArgs = {
  language: string;
  resource: string;
  criteria: Criteria;
};

/** 勤怠情報（作成、指定ID検索、保存） */
export const useAttendance = () => {
  const language = useAtomValue(languageAtom);
  const feature = useSnapshot(featureState);
  const csrfToken = useSnapshot(csrfTokenState);

  const resource = useMemo(() => Config.resources[feature.value], [feature.value]);

  const create = useCallback(
    () =>
      createOfApi(language, csrfToken.value, resource).then<Attendance>(
        (it) => {
          csrfTokenState.value = it.response.headers.get("x-csrf-token") ?? "";
          return it.data;
        },
        (error) => {
          csrfTokenState.value = "";
          throw error;
        }
      ),
    [csrfToken.value, language, resource]
  );

  const findById = useCallback(
    (id: number, findType: FindType) =>
      findByIdOfApi(language, csrfToken.value, resource, id, findType).then<Attendance>(
        (it) => {
          csrfTokenState.value = it.response.headers.get("x-csrf-token") ?? "";
          return it.data;
        },
        (error) => {
          csrfTokenState.value = "";
          throw error;
        }
      ),
    [csrfToken.value, language, resource]
  );

  const save = useCallback(
    (attendance: Attendance) =>
      saveOfApi(language, csrfToken.value, resource, attendance).then<Attendance>(
        (it) => {
          csrfTokenState.value = it.response.headers.get("x-csrf-token") ?? "";
          return it.data;
        },
        (error) => {
          csrfTokenState.value = "";
          throw error;
        }
      ),
    [csrfToken.value, language, resource]
  );

  return {
    create,
    findById,
    save,
  };
};

/** 勤怠情報一覧を取得 */
export const useAttendances = () => {
  const language = useAtomValue(languageAtom);
  const feature = useSnapshot(featureState);
  const csrfToken = useSnapshot(csrfTokenState);
  const criteriaMap = useSnapshot(criteriaMapState);

  const resource = useMemo(() => Config.resources[feature.value], [feature.value]);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const criteria = useMemo(() => criteriaMap[feature.value], [JSON.stringify(criteriaMap), feature.value]);

  const fetcher: Fetcher<Attendance[], FetcerArgs> = ({ language, resource, criteria }) => {
    if (feature.value === Config.features.masterMaintain) return Promise.resolve([]);
    return findOfApi(language, csrfToken.value, resource, criteria).then<Attendance[]>(
      (it) => {
        csrfTokenState.value = it.response.headers.get("x-csrf-token") ?? "";
        return it.data;
      },
      (error) => {
        csrfTokenState.value = "";
        throw error;
      }
    );
  };

  const { data, error } = useSWR<Attendance[], Error>({ language, resource, criteria }, fetcher, { revalidateOnFocus: false });

  return {
    data,
    error,
  };
};
