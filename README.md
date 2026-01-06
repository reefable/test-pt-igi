# Kata Sambutan

Selamat datang di project **Simple Order**.
Project ini dibuat sebagai bagian dari proses penyelesaian test **“Simple Order”** di **PT. IGI**.

Aplikasi ini dikembangkan dengan menerapkan arsitektur **MVC (Model–View–Controller)** untuk memisahkan logika bisnis, tampilan, dan pengelolaan data, sehingga kode lebih terstruktur, mudah dipahami, dan mudah dikembangkan.

- For Development Test
	> npm install && npm run dev

- Production
	> docker-compose up

- Login Information
	> user : admin
	> pass : password123

Terima kasih telah meluangkan waktu untuk meninjau project ini. Semoga dapat memberikan gambaran yang jelas mengenai implementasi dan alur kerja aplikasi.

---

### Directory Structure:

>simple-orders-app/
├── backend/
│   ├── server/
│   │   ├── config/         # DB config, environment variables
│   │   ├── controllers/    # Request logic
│   │   ├── middlewares/    # Auth, Validation logic
│   │   ├── routes/         # API Routes definitions
│   │   ├── utils/       # Business logic (interacting with DB)
│   │   └── index.js        # Entry point
│   ├── Dockerfile
│   └── package.json
├── frontend/
│   ├── src/
│   │   ├── components/     # Reusable UI components
│   │   ├── views/          # Page views (Login, Orders, etc.)
│   │   ├── router/         # Vue Router
│   │   └── services/       # API integration (Axios)
│   ├── Dockerfile
│   └── package.json
├── database/
│   └── init.sql            # SQL schema initialization
└── docker-compose.yml
