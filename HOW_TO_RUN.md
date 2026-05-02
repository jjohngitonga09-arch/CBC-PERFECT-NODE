# How to Run This Project (PowerShell)

## 1. Generate the scaffold (one-time)
```powershell
python scaffold_eduapp.py
```

## 2. Start infrastructure
```powershell
docker-compose up -d db redis
```

## 3. Backend setup
```powershell
cd eduapp/backend
npm install
Copy-Item .env.example .env   # then edit .env with your secrets
node src/db/migrate.js        # run migrations
node src/db/seed.js           # seed admin user
npm run dev
```

## 4. Frontend setup (new terminal)
```powershell
cd eduapp/frontend
npm install
npm run dev
```

## 5. Open browser
Frontend: http://localhost:3000
API:      http://localhost:4000/health

## Default admin credentials (after seed)
Email:    admin@eduapp.dev
Password: Admin1234!

## Common PowerShell snippets
```powershell
# Re-run migrations after schema changes
cd eduapp/backend && node src/db/migrate.js

# View API logs
docker-compose logs -f backend

# Connect to DB
docker exec -it eduapp_db_1 psql -U eduapp -d eduapp_dev
```
