# Spendings App

A modern, responsive **expense tracking web app** built with **React** and **TypeScript** for managing personal spendings directly in your browser. Data is stored locally — for now.

## 🚀 Key Features

**Multi-User Support**: Track spendings for multiple users, each with their own color code.

**Expense Management**: Add, edit, and delete spendings with amounts, descriptions, and dates.

**Currency & Conversion**: Supports multiple currencies with automatic exchange rate fetching for seamless conversion.

**Filtering & Search**: Filter expenses by user, currency, or search term to quickly find what matters.

**Export / Import JSON**: Save or load your data in JSON format for backup or transfer between devices.

**Internationalization**: Switch between English and Polish UI — plus localized date & currency formatting.

## 🛠 Tech Stack

- React & TypeScript
- Vite (dev/build tooling)
- LocalStorage for persistence
- Intl & Currency APIs for formatting & rates
- Modern CSS + Material UI design cues

## 💱 Exchange Rates

Currency conversion is powered by [UniRateAPI](https://api.unirateapi.com/).

Exchange rates are fetched on demand and cached in the application state.

## 🌍 Live Demo

The application is hosted on GitHub Pages and available here:

👉 https://ejpszemo.github.io/spendings-app/

## 📁 Data Persistence

All data is stored in the browser’s LocalStorage — clearing browser data will remove your spendings and users.

## 🔜 In Progress

- UI Standarization
- Raw text import function
- Cloud storage / synchronization between devices
- Function to download the resulting table as an image ready to send

## 📝 License

This project is licensed under the [MIT License](LICENSE)

## 👤 Author

[@ejpszemo](https://github.com/ejpszemo)
