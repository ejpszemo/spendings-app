# 💰 Spendings App Revamped

A modern, responsive expense tracking application built with React and TypeScript. Track spendings across multiple users with an intuitive interface, multi-language support, multi-currency support, and persistent data storage.

## ✨ Features

### Core Functionality

- **Multi-User Support**: Create and manage multiple users with color-coded identification
- **Expense Tracking**: Add, edit, and delete spending entries with amounts and descriptions
- **Smart Filtering**: Filter spendings by user to see individual expense histories
- **Summary Dashboard**: View total spendings per user with automatic calculations
- **Data Persistence**: All data automatically saved to browser's localStorage

### Internationalization & Localization

- **Multi-Language Support**: Switch between English and Polish
- **Multi-Currency Support**: Choose from USD, EUR, GBP, or PLN
- **Localized Formatting**: Date and currency formats adapt to selected settings
- **Independent Settings**: Language and currency can be changed independently
- **Seamless Switching**: Both preferences persist across sessions

### User Experience

- **Color-Coded Users**: Each user has a unique color for easy identification
- **Inline Editing**: Edit expenses directly in the list view with keyboard support
- **Date Display**: Human-readable date formats based on language locale
- **Currency Display**: All amounts formatted according to selected currency
- **Responsive Design**: Modern, clean interface that works on all devices

## 🚀 Tech Stack

- **React 19** - Modern React with hooks
- **TypeScript** - Type-safe development
- **Vite** - Lightning-fast build tool
- **Context API** - State management for language, translations, and currency
- **LocalStorage** - Client-side data persistence
- **CSS3** - Custom styling with modern CSS features
- **Intl API** - Native internationalization and currency formatting

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

- **Edit**: Click the ✏️ button to edit an expense, then 💾 to save (or press Enter)
- **Delete**: Click the ➖ button to remove an expense
- **Filter**: Check "Filter by user" to see only the selected user's expenses

### Changing Settings

- **Language**: Use the language selector at the top to switch between English and Polski (Polish)
- **Currency**: Use the currency selector to choose between USD, EUR, GBP, or PLN
- All preferences are saved automatically and persist across sessions

## 📝 TODO / Future Enhancements

### High Priority

- [ ] **Mixed Currency Support**: Allow each spending entry to have its own currency with automatic conversion rates
- [ ] **Currency Conversion**: Real-time exchange rates and automatic currency conversion in summary view
- [ ] **Export Functionality**: Export data to CSV/PDF formats

### Medium Priority

- [ ] **Charts and Visualizations**: Add pie charts and graphs for spending analysis
- [ ] **Date Range Filtering**: Filter expenses by date range (week, month, year)
- [ ] **Search Functionality**: Search expenses by description, amount, or date

### Low Priority

- [ ] **Dark Mode Theme**: Add dark/light theme toggle
- [ ] **More Languages**: Support for additional languages (Spanish, French, German, etc.)
- [ ] **More Currencies**: Support for cryptocurrency and additional fiat currencies
- [ ] **Cloud Sync**: Backend integration for data synchronization across devices
- [ ] **Mobile App**: Native mobile app version (React Native)

- Use the language selector at the top to switch between English (English) and Polski (Polish)
- Your preference is saved automatically

## 📄 License

This project is open source and available under the [MIT License](LICENSE).

## 👤 Author

ejpszemo - [@ejpszemo](https://github.com/ejpszemo)

---

**Note**: All data is stored locally in your browser. Clearing your browser data will erase all spendings and users.
