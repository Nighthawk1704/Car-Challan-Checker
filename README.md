# 🚗 Car Challan Checker

A modern React + Vite web application to **search, filter, and manage traffic challans**.  
Built as part of the **Anslation Frontend Internship assignment** — designed to feel like a real product, not just a demo.

🔗 **Live Demo:** [https://car-challan-checker-eosin.vercel.app/](https://car-challan-checker-eosin.vercel.app/) 

---

## ✨ Features

- 🔍 **Search challans** by vehicle number (mock challan data provided for demo)
- 🌍 **Location detection** via [ipapi.co](https://ipapi.co) API  
  - Shows detected city & region automatically  
  - If free API quota is exceeded → clean fallback message
- 📊 **Filter & sort challans**
  - By **status** (All / Paid / Unpaid)
  - By **date range**
  - Sort by **date** or **amount**
- 💰 **Total summary**  
  - e.g., *3 challans · Total ₹5,000*
- 📝 **Status history (audit log)**
  - Logs every Paid / Unpaid change with timestamp
  - Export history as **CSV** or **JSON**
- 📤 **Export challans**
  - Export **all visible challans** (after filters) to CSV or JSON
- 📱 **Responsive UI** — clean layouts for desktop & mobile
- 🎨 **Professional theme**
  - Modern cards, chips, buttons, and accessible color palette
- ♿ **Accessible**
  - Semantic HTML, focus styles, aria labels

---

## 🛠️ Tech Stack

- ⚛️ **React 18** (functional components + hooks)
- ⚡ **Vite** (bundler & dev server)
- 🎨 **Plain CSS** (Flexbox + Grid, responsive design)
- 🗄️ **LocalStorage** (persist status history)
- 📊 **Mock JSON** challan dataset
- 🌍 **ipapi.co API** for geolocation
- ☁️ **Vercel** for deployment (CI/CD auto-builds from GitHub)

---

## 🚀 Getting Started

### 1. Clone the repo
```bash
git clone https://github.com/<your-username>/car-challan-checker.git
cd car-challan-checker
```
### 2. 2. Install dependencies
 ```bash
 npm install
```
### 3. Run locally
```bash
npm run dev
# open http://localhost:5173
```
### 4. Build for production
```bash
npm run build
```




