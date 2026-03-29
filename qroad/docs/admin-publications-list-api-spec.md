# Admin Publications List API Spec

## Endpoint

- `GET /api/admin/publications`

## Purpose

- Admin 기사 목록 조회
- 발행월 필터(드롭다운)
- 통합 검색(호수 문자열 + 기사 제목)
- 페이징

## Query Parameters

- `page` (optional, number, default: `1`)
- `limit` (optional, number, default: `10`)
- `month` (optional, string, format: `YYYY-MM`)
  - 예: `2026-03`
  - 발행일 기준 월 필터
- `q` (optional, string)
  - 통합 검색 키워드
  - 호수(예: `2026-03`) 또는 기사 제목 검색어

## Request Example

```http
GET /api/admin/publications?page=1&limit=10&month=2026-03&q=청년
```

## Response Example

```json
{
  "total_count": 24,
  "papers": [
    {
      "id": 101,
      "title": "청년 주거지원 예산 확대",
      "body": "...",
      "published_date": "2026-03-12",
      "admin": "관리자"
    }
  ]
}
```

## Filter Rules

- `month` 미전달 시 전체 월 조회
- `q` 미전달/공백 시 검색 미적용
- `month` + `q` 동시 전달 시 AND 조건

## Validation / Errors

- `month` 형식이 `YYYY-MM`이 아니면 `400 Bad Request`

```json
{
  "message": "month must be YYYY-MM"
}
```

## Frontend Mapping

- 월 드롭다운 선택값 -> `month`
- 검색창 입력값 -> `q`
- 필터/검색 변경 시 `page`는 1로 리셋
