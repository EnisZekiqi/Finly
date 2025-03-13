# **Finly - Your Smart Financial Tracker**  

📊 **Track. Manage. Achieve.**  

**Finly** is a powerful finance tracker designed to help you maintain your balance, monitor expenses, and achieve financial goals with ease.  

🚀 **Get started today and take control of your finances!**  

---

## **🔹 Features**  

✅ **Easy Setup** – Just enter your name, income, currency (€, $, £), and agree to local storage usage.  
✅ **Real-Time Dashboard** – View your **total income, balance, and expenses** at a glance.  
✅ **Visual Insights** – Analyze your finances with **interactive charts and progress bars**.  
✅ **Expense & Goal Tracking** – Categorize, set amounts, and track daily, monthly, or yearly expenses.  
✅ **Analytics** – Get insights into spending habits and how long until you reach financial goals.  
✅ **Cashflow Management** – Track income sources, whether you're an **employee or a business**.  
✅ **Customizable UI** – Personalize your experience with different chart styles and themes.  

---

## **🚀 How to Get Started**  

1️⃣ Click the **"Get Started"** button on the hero section.  
2️⃣ Enter your **name, income, preferred currency**, and agree to local storage usage.  
3️⃣ Explore your **dashboard**, set **goals and expenses**, and track progress effortlessly!  

---

## **📌 Refreshing the Page Causes a 404 Error (GitHub Pages & HashRouter Issue)**  

While navigating back and forth within the app works smoothly, **refreshing the page** on any route other than the homepage (e.g., `/dashboard`) will result in a **404 error**.  

### ❓ Why does this happen?  
- GitHub Pages doesn’t support **client-side routing**, so when you refresh a page, it tries to load a **physical file** like `/dashboard`, which doesn’t exist.  
- Since Finly is a **Single Page Application (SPA)** using React’s `HashRouter`, all routes are handled dynamically by JavaScript.  

### ✅ Workaround  
- The app uses **HashRouter (`/#/`)** to prevent this issue, so all URLs will have a `#` in them (e.g., `yourwebsite.com/#/dashboard`).  
- If you still face a refresh issue, a **custom redirect script** has been added to the project to ensure proper routing.  

> **Tip:** If you’re hosting elsewhere (like Vercel or Netlify), you can configure proper redirects to avoid this issue completely.  

---

## **💻 Installation & Running Locally**  

```bash
git clone https://github.com/your-username/finly.git  
cd finly  
npm install  
npm start  
