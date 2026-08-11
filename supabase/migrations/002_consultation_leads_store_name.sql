-- consultation_leads 테이블에 매장명(store_name) 컬럼 추가
-- 랜딩 상담 신청 폼의 "매장명" 필드를 저장하기 위해 필요합니다.
-- Supabase SQL Editor에서 실행하거나 supabase db push 로 적용하세요.

ALTER TABLE consultation_leads
  ADD COLUMN IF NOT EXISTS store_name TEXT;
