# AWS EC2 단일 서버 배포 가이드

이 문서는 EC2 한 대 기준의 배포 절차를 정리한 운영 문서다.

이 문서는 `Hangang ZIP`을 EC2 한 대에 아래 구성으로 배포하는 기준 문서다.

- 프론트엔드: Vite build 결과물을 `nginx`가 정적 파일로 서빙
- 백엔드: Spring Boot jar를 `systemd`로 실행
- 데이터베이스: EC2 내부 MySQL
- HTTPS: `certbot` + `nginx`

기준 환경:
- OS: Ubuntu 22.04 LTS
- Java: 17
- Nginx
- MySQL 8
- 도메인 예시:
  - 프론트: `https://hangang.jihosong.com`
  - API: 같은 도메인의 `/api`

## 1. 사전 준비

EC2 인스턴스 권장:
- 테스트/소규모 MVP: `t3.small` 이상
- Java + MySQL을 같이 올리므로 `micro`는 비추천

보안 그룹:
- `22` SSH 허용
- `80` HTTP 허용
- `443` HTTPS 허용
- `3306`, `8081`은 외부 비공개

필요한 것:
- 도메인 1개
- EC2 퍼블릭 IP 또는 탄력적 IP
- SSH 접속 키

## 2. EC2 접속

```bash
chmod 600 ~/key/hangang-prod-app.pem
ssh -i ~/key/hangang-prod-app.pem ubuntu@43.201.31.224
```

## 3. 서버 패키지 설치

```bash
sudo apt update
sudo apt install -y openjdk-17-jdk nginx mysql-server git unzip curl
```

버전 확인:

```bash
java -version
nginx -v
mysql --version
```

## 4. 프로젝트 디렉터리 준비

```bash
mkdir -p ~/apps/hangang-zip
mkdir -p ~/apps/hangang-zip/backend
sudo mkdir -p /var/www/hangang-zip
sudo chown -R ubuntu:ubuntu /var/www/hangang-zip
```

## 5. MySQL 초기 설정

MySQL 접속:

```bash
sudo mysql
```

DB/사용자 생성:

```sql
CREATE DATABASE hangang_zip CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
CREATE USER 'hangang_zip'@'localhost' IDENTIFIED BY 'CHANGE_ME_STRONG_PASSWORD';
GRANT ALL PRIVILEGES ON hangang_zip.* TO 'hangang_zip'@'localhost';
FLUSH PRIVILEGES;
EXIT;
```

## 6. 로컬에서 백엔드 jar 빌드

로컬 프로젝트에서:

```bash
cd /Users/jihosong/workspace/hangang-zip/backend-skeleton
./gradlew bootJar
ls build/libs
```

생성된 jar 예시:
- `backend-skeleton-0.0.1-SNAPSHOT.jar`

EC2로 업로드:

```bash
scp -i ~/key/hangang-prod-app.pem /Users/jihosong/workspace/hangang-zip/backend-skeleton/build/libs/*.jar ubuntu@43.201.31.224:/home/ubuntu/apps/hangang-zip/backend/hangang-zip-backend.jar
```

## 7. 로컬에서 프론트 빌드

이 프로젝트는 운영 빌드 시 `VITE_PARK_DATA_SOURCE=api`, `VITE_API_BASE_URL`, `VITE_KAKAO_MAP_JS_KEY`가 필요하다.

같은 도메인에서 `/api` 프록시를 쓸 것이므로:

```bash
cd /Users/jihosong/workspace/hangang-zip
VITE_PARK_DATA_SOURCE=api VITE_API_BASE_URL=https://hangang.jihosong.com VITE_KAKAO_MAP_JS_KEY=YOUR_KAKAO_JAVASCRIPT_KEY npm run build
```

배포 파일 업로드:

```bash
scp -i ~/key/hangang-prod-app.pem -r /Users/jihosong/workspace/hangang-zip/dist/* ubuntu@43.201.31.224:/var/www/hangang-zip/
```

## 8. 백엔드 환경변수 파일 작성

EC2에서:

```bash
cat > ~/apps/hangang-zip/backend/.env <<'EOF'
SPRING_PROFILES_ACTIVE=prod
SERVER_PORT=8081
DB_URL=jdbc:mysql://localhost:3306/hangang_zip?useSSL=false&allowPublicKeyRetrieval=true&serverTimezone=Asia/Seoul&characterEncoding=UTF-8
DB_USERNAME=hangang_zip
DB_PASSWORD=CHANGE_ME_STRONG_PASSWORD
APP_CORS_ALLOWED_ORIGIN=https://hangang.jihosong.com
EOF
```

권한 제한:

```bash
chmod 600 ~/apps/hangang-zip/backend/.env
```

## 9. systemd 서비스 등록

로컬 템플릿 업로드:

```bash
scp -i ~/key/hangang-prod-app.pem /Users/jihosong/workspace/hangang-zip/deploy/systemd/hangang-backend.service ubuntu@43.201.31.224:/tmp/hangang-backend.service
```

EC2에서 서비스 등록:

```bash
sudo mv /tmp/hangang-backend.service /etc/systemd/system/hangang-backend.service
sudo systemctl daemon-reload
sudo systemctl enable hangang-backend
sudo systemctl start hangang-backend
sudo systemctl status hangang-backend --no-pager
```

로그 확인:

```bash
journalctl -u hangang-backend -f
```

API 직접 확인:

```bash
curl http://localhost:8081/api/parks
curl http://localhost:8081/api/parks/yeouido
curl "http://localhost:8081/api/parks?tag=running"
```

## 10. nginx 정적 파일 + API 프록시 설정

로컬 템플릿 업로드:

```bash
scp -i ~/key/hangang-prod-app.pem /Users/jihosong/workspace/hangang-zip/deploy/nginx/hangang-zip.conf ubuntu@43.201.31.224:/tmp/hangang-zip.conf
```

EC2에서 설정 적용:

```bash
sudo mv /tmp/hangang-zip.conf /etc/nginx/sites-available/hangang-zip
sudo ln -sf /etc/nginx/sites-available/hangang-zip /etc/nginx/sites-enabled/hangang-zip
sudo rm -f /etc/nginx/sites-enabled/default
sudo nginx -t
sudo systemctl reload nginx
```

설정 반영 직후 확인:

```bash
ls -ld /var/www/hangang-zip
ls -l /var/www/hangang-zip
curl -I http://localhost
```

## 11. 도메인 연결

DNS에서 아래처럼 연결:
- `hangang.jihosong.com` -> EC2 퍼블릭 IP

DNS 전파 후 확인:

```bash
curl -I http://hangang.jihosong.com
```

## 12. HTTPS 적용

Certbot 설치:

```bash
sudo apt install -y certbot python3-certbot-nginx
```

인증서 발급:

```bash
sudo certbot --nginx -d hangang.jihosong.com
```

자동 갱신 점검:

```bash
sudo systemctl status certbot.timer
sudo certbot renew --dry-run
```

## 13. 최종 확인

브라우저 확인:
- `https://hangang.jihosong.com`
- 지도 로드
- 마커 클릭
- 배달존 클릭
- 근처 맛집 검색 결과 표시
- 상세 바텀시트
- 필터 동작

API 확인:

```bash
curl https://hangang.jihosong.com/api/parks
curl https://hangang.jihosong.com/api/parks/yeouido
curl "https://hangang.jihosong.com/api/parks?tag=running"
```

문제가 있으면 확인:

```bash
sudo tail -n 50 /var/log/nginx/error.log
journalctl -u hangang-backend -n 100 --no-pager
```

## 14. 업데이트 배포 절차

### 프론트 수정 배포

로컬:

```bash
cd /Users/jihosong/workspace/hangang-zip
VITE_PARK_DATA_SOURCE=api VITE_API_BASE_URL=https://hangang.jihosong.com VITE_KAKAO_MAP_JS_KEY=YOUR_KAKAO_JAVASCRIPT_KEY npm run build
scp -i ~/key/hangang-prod-app.pem -r /Users/jihosong/workspace/hangang-zip/dist/* ubuntu@43.201.31.224:/var/www/hangang-zip/
```

EC2:

```bash
sudo systemctl reload nginx
```

### 백엔드 수정 배포

로컬:

```bash
cd /Users/jihosong/workspace/hangang-zip/backend-skeleton
./gradlew bootJar
scp -i ~/key/hangang-prod-app.pem /Users/jihosong/workspace/hangang-zip/backend-skeleton/build/libs/*.jar ubuntu@43.201.31.224:/home/ubuntu/apps/hangang-zip/backend/hangang-zip-backend.jar
```

EC2:

```bash
sudo systemctl restart hangang-backend
sudo systemctl status hangang-backend
```

## 15. 운영 최소 체크리스트

- `SPRING_PROFILES_ACTIVE=prod` 확인
- `APP_CORS_ALLOWED_ORIGIN`이 실제 도메인인지 확인
- MySQL 비밀번호가 `.env`에만 있는지 확인
- `3306`, `8081` 외부 포트 비공개 확인
- `journalctl -u hangang-backend -f`로 에러 확인
- MySQL 백업 전략 준비

간단 백업 예시:

```bash
mysqldump -u hangang_zip -p hangang_zip > ~/hangang_zip_backup.sql
```

## 16. 현재 프로젝트 기준 주의점

- 현재 데이터는 실제 한강공원 기준의 서비스용 초안 데이터다.
- Flyway가 첫 기동 시 테이블과 초기 데이터를 함께 적재한다.
- 운영 빌드에서는 `npm run build` 전에 반드시 `VITE_PARK_DATA_SOURCE=api`, 실제 `VITE_API_BASE_URL`, `VITE_KAKAO_MAP_JS_KEY`를 지정해야 한다.
- 같은 도메인에서 `/api` 프록시를 쓸 경우 프론트의 `VITE_API_BASE_URL`은 `https://hangang.jihosong.com`처럼 도메인 루트 기준으로 주는 편이 단순하다.
- Kakao Developers에서 `localhost`와 운영 도메인을 각각 JavaScript 허용 도메인으로 등록해야 한다.
- 정적 파일은 `/home/ubuntu/...` 대신 `/var/www/hangang-zip`에 두는 편이 nginx 권한 문제를 줄이기 쉽다.
- `/var/www/hangang-zip`에 새 빌드 파일을 올린 뒤에는 브라우저 강력 새로고침으로 이전 캐시 영향을 줄이는 편이 안전하다.

scp -i ~/key/hangang-prod-app.pem /Users/jihosong/workspace/hangang-zip/deploy/nginx/hangang-zip.conf ubuntu@43.201.31.224:/tmp/hangang-zip.conf
sudo mv /tmp/hangang-zip.conf /etc/nginx/sites-available/hangang-zip
sudo ln -sf /etc/nginx/sites-available/hangang-zip /etc/nginx/sites-enabled/hangang-zip
