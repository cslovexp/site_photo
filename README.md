# 개인정보처리방침 페이지

공사현장 사진보고서 앱 **현장사진대지**의 개인정보처리방침을 GitHub Pages로 공개하기 위한 저장소입니다.

## 파일 구성

```text
privacy-policy/
├── README.md
└── privacy-policy.html
```

## 개인정보처리방침 페이지

개인정보처리방침 본문은 아래 파일에 작성되어 있습니다.

```text
privacy-policy.html
```

GitHub Pages를 활성화하면 다음 형식의 URL로 접속할 수 있습니다.

```text
https://깃허브아이디.github.io/저장소이름/privacy-policy.html
```

예시:

```text
https://your-github-id.github.io/privacy-policy/privacy-policy.html
```

## GitHub Pages 설정 방법

1. GitHub 저장소에 `privacy-policy.html` 파일을 업로드합니다.
2. 저장소의 **Settings** 메뉴로 이동합니다.
3. 왼쪽 메뉴에서 **Pages**를 선택합니다.
4. **Build and deployment** 항목에서 아래와 같이 설정합니다.

```text
Source: Deploy from a branch
Branch: main
Folder: /root
```

5. **Save**를 클릭합니다.
6. 잠시 후 GitHub Pages 주소가 생성됩니다.

## 앱 심사용 URL 사용 방법

Google Play Console 또는 App Store Connect의 개인정보처리방침 URL에는 아래 형식의 주소를 입력합니다.

```text
https://깃허브아이디.github.io/저장소이름/privacy-policy.html
```

## 주의사항

- 저장소가 비공개인 경우 GitHub Pages 공개가 제한될 수 있으므로, 앱 심사용 개인정보처리방침은 Public 저장소 사용을 권장합니다.
- `privacy-policy.html` 파일명을 사용하는 경우 URL 끝에 반드시 `/privacy-policy.html`을 포함해야 합니다.
- 루트 주소만 사용하려면 파일명을 `index.html`로 변경해야 합니다.
- 개인정보처리방침 내용이 변경되면 `privacy-policy.html` 파일을 수정한 뒤 다시 commit/push 하면 됩니다.

## 시행일

2026년 5월 27일
