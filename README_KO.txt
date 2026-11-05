AVORY 업무 앱 (AVORY TRADE DESK) · 최종본 2026.11.05
====================================================

이 폴더가 앱 전체예요. Claude 없이, 서버 없이 돌아가요.
데이터는 각 기기(폰·PC) 브라우저 안에만 저장되고, 이 폴더에는 회사 데이터가 없어요.

[파일]
  index.html            앱 전체 (화면·기능·서류 서식이 모두 이 한 파일에 있어요)
  sw.js                 오프라인용 (한 번 연 뒤 인터넷 없이 열리게 해 줘요)
  manifest.webmanifest  홈 화면 앱 이름·아이콘 정보
  icon-*.png            AVORY 아이콘
  README_KO.txt         이 안내

[인터넷 주소]  https://avory0127.github.io/avory/
  GitHub 저장소 avory0127/avory 에 이 파일들을 올리면 그 주소로 열려요.

[새 버전 올리기]
  1) 이 zip을 새 폴더에 풀기 (예전 파일과 섞이면 이름이 index (1).html 로 바뀔 수 있어요)
  2) github.com/avory0127/avory → Add file → Upload files → 파일 전부 끌어다 놓기 → Commit changes
  3) 1~2분 뒤 폰에서 앱을 완전히 닫았다가 다시 열기

[매주 백업]
  앱 → 톱니(설정) → 앱 설정 → 백업 파일 받기 → 두 곳 이상에 보관 (iCloud·메일·위챗·PC)
  백업 파일에는 계좌·거래 내역이 있어요. GitHub에 올리지 마세요.

[폰을 바꿀 때]
  예전 폰: 백업 파일 받기 → 새 폰으로 보내기
  새 폰: 사파리로 주소 열기 → 공유 → 홈 화면에 추가 → AVORY 아이콘으로 열기
         → 설정 → 앱 설정 → 백업 불러오기 → '이 백업으로 바꾸기'

[PC와 같이 쓰기]
  데이터는 기기마다 따로예요. 한쪽 백업을 다른 쪽에서 '합치기'로 불러오면 합쳐져요.
  주소 없이 index.html 을 크롬으로 바로 열어도 PC에서는 써져요.

[하지 말 것]
  - 홈 화면 앱 아이콘 지우기 (데이터도 같이 지워져요. 지우기 전에 꼭 백업)
  - 사파리 탭이나 시크릿 창에서만 쓰기

[아이콘을 AVORY 로 바꾸기 (이미 AV 아이콘을 쓰는 아이폰)]
  아이폰은 추가해 둔 아이콘을 바꾸지 않아요.
  1) 예전 앱에서 백업 받기  2) 사파리로 주소 열고 홈 화면에 다시 추가
  3) 새 AVORY 아이콘에서 백업 불러오기 → 이 백업으로 바꾸기
  4) 확인 후 예전 AV 아이콘 지우기  5) AVORY 앱을 다시 열어 내용 확인 (비어 있으면 3번 다시)

----------------------------------------------------
[개발 참고 — 나중에 고칠 사람에게]
  - 단일 파일 앱: index.html 안에 HTML·CSS·JavaScript 가 모두 있어요. 빌드 과정 없음.
  - 저장소: 브라우저 IndexedDB 'avory-desk' (저장소: partners, pos, ships, txns, docs, kv, files, gone).
      pos 에는 PO와 청구서(kind:'bill')가 함께 들어가요. dir: export=받을 돈 / import=줄 돈.
      files 에는 첨부 원본(PDF·사진)이 Blob 으로 저장돼요.
      gone 은 지운 기록(합치기 때 삭제를 다른 기기에 전하기 위함).
  - 백업 형식: JSON { app:'avory-desk', format:2, company, partners, pos, ships, txns, docs, gone, files[base64] }
      불러오기 '합치기' = 항목별 updatedAt 이 더 늦은 쪽이 이김.
  - 외부 라이브러리(필요할 때만 로드, cdnjs → jsDelivr → unpkg 순서로 시도, sw.js 가 캐시):
      html2canvas 1.4.1, jsPDF 2.5.1 (PDF 저장) · SheetJS xlsx 0.18.5 (엑셀) · pdf.js 3.11.174 (PDF 읽기) · JSZip 3.10.1
  - 서류 서식: 회사 표준 서식(docAvory, 中·EN) / 기본 서식(docEn·docKo). 회사 정보·계좌·로고·도장은 앱 설정에서.
  - 글자 인식: 은행 문자·은행 앱 화면·주문서·청구서·명함은 앱 안의 규칙(parse…Text 함수들)으로 읽어요.
