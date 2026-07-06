// 빌드 브랜치 타임라인 데이터
// 이 파일만 갱신하면 index.html이 규칙에 따라 타임라인을 자동으로 그립니다.
// 편집기(⚙ 편집)에서 수정 후 "data.js 다운로드"로 받은 파일로 이 파일을 교체하세요.
window.TIMELINE_DATA = {
  "title": "붉은사막 빌드 브랜치 타임라인",
  "startDate": "2026-05-11",
  "endDate": "2026-06-15",
  "lanes": [
    { "id": "mainline", "name": "MAINLINE", "labelBg": "#1F4E79" },
    { "id": "beta",     "name": "BETA",     "labelBg": "#1E6B3C" },
    { "id": "alpha",    "name": "ALPHA",    "labelBg": "#795A00" }
  ],
  "patchLaneId": "alpha",
  "initialVersions": {
    "mainline": "1.08.00",
    "beta": "1.08.00",
    "alpha": "1.07.00"
  },
  "branches": [
    { "date": "2026-05-11", "time": "22:00", "from": "mainline", "to": "beta",  "version": "1.08.00", "sourceNext": "1.10.00" },
    { "date": "2026-05-19", "time": "22:00", "from": "beta",     "to": "alpha", "version": "1.08.00" },
    { "date": "2026-05-26", "time": "11:30", "from": "mainline", "to": "beta",  "version": "1.10.00", "sourceNext": "1.12.00" },
    { "date": "2026-06-01", "time": "22:30", "from": "beta",     "to": "alpha", "version": "1.10.00" },
    { "date": "2026-06-14", "time": "16:00", "from": "mainline", "to": "beta",  "version": "1.12.00", "sourceNext": "1.14.00" }
  ],
  "patches": [
    { "date": "2026-05-15", "version": "1.07.00", "type": "patch",  "mode": "regular" },
    { "date": "2026-05-22", "version": "1.08.00", "type": "patch",  "mode": "regular" },
    { "date": "2026-05-29", "version": "1.09.00", "type": "patch",  "mode": "solo" },
    { "date": "2026-06-05", "version": "1.10.00", "type": "patch",  "mode": "regular" },
    { "date": "2026-06-06", "version": "1.10.01", "type": "hotfix" },
    { "date": "2026-06-12", "version": "1.11.00", "type": "patch",  "mode": "solo" }
  ],
  "versionColors": {
    "1.07.00": "#FFECB3",
    "1.08.00": "#FFE0B2",
    "1.09.00": "#C8E6C9",
    "1.10.00": "#BBDEFB",
    "1.10.01": "#D0E8FF",
    "1.11.00": "#F8BBD9",
    "1.12.00": "#EDE7F6",
    "1.14.00": "#DCEDC8"
  }
};
