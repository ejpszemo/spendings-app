# 💰 Spendings App Revamped

A modern, responsive expense tracking application built with React and TypeScript. Track spendings across multiple users with an intuitive interface, multi-language support, and persistent data storage.

## ✨ Features

### Core Functionality

- **Multi-User Support**: Create and manage multiple users with color-coded identification
- **Expense Tracking**: Add, edit, and delete spending entries with amounts and descriptions
- **Smart Filtering**: Filter spendings by user to see individual expense histories
- **Summary Dashboard**: View total spendings per user at a glance
- **Data Persistence**: All data automatically saved to browser's localStorage

### Internationalization

- **Multi-Language Support**: Switch between English and Polish
- **Localized Formatting**: Date and currency formats adapt to selected language
- **Seamless Switching**: Language preference persists across sessions

### User Experience

- **Color-Coded Users**: Each user has a unique color for easy identification
- **Inline Editing**: Edit expenses directly in the list view
- **Date Display**: Human-readable date formats based on locale
- **Responsive Design**: Modern, clean interface that works on all devices

## 🚀 Tech Stack

- **React 19** - Modern React with hooks
- **TypeScript** - Type-safe development
- **Vite** - Lightning-fast build tool
- **Context API** - State management for language/translations
- **LocalStorage** - Client-side data persistence
- **CSS3** - Custom styling with modern CSS features
- **Intl API** - Native internationalization support

## 🎯 Usage

### Adding Users

1. Enter a user name in the "User Name" field
2. Click "Add User" or press Enter
3. Select the user from the dropdown to track their expenses

### Adding Expenses

1. Select a user from the dropdown
2. Enter the amount and description
3. Click "Add Spending" or press Enter

### Managing Expenses

- **Edit**: Click the ✏️ button to edit an expense, then 💾 to save
- **Delete**: Click the ➖ button to remove an expense
- **Filter**: Check "Filter by user" to see only the selected user's expenses

### Changing Language

- Use the language selector at the top to switch between English (English) and Polski (Polish)
- Your preference is saved automatically

## 📄 License

This project is open source and available under the [MIT License](LICENSE).

## 👤 Author

ejpszemo - [@ejpszemo](https://github.com/ejpszemo)

---

**Note**: All data is stored locally in your browser. Clear your browser data will erase all spendings and users.
