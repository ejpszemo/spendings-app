# 💰 Spendings App Revamped

A modern, responsive expense tracking application built with React and TypeScript. Track spendings across multiple users with an intuitive Material UI-inspired interface, multi-language support, multi-currency support, data export/import capabilities, and persistent storage.

## ✨ Features

### Core Functionality

- **Multi-User Support**: Create and manage multiple users with color-coded identification
- **Expense Tracking**: Add, edit, and delete spending entries with amounts and descriptions
- **Mixed Currency Support**: Each spending entry can have its own currency
- **Real-Time Currency Conversion**: Automatic exchange rate fetching and conversion via API
- **Smart Filtering**: Filter spendings by user and currency to see specific expense histories
- **Summary Dashboard**: View total spendings per user with automatic currency conversions
- **Data Persistence**: All data automatically saved to browser's localStorage
- **Export/Import**: Export and import both spendings and users data in JSON format

### Internationalization & Localization

- **Multi-Language Support**: Switch between English and Polish
- **Multi-Currency Support**: Choose from USD, EUR, GBP, or PLN
- **Dual Currency System**:
  - Global display currency for viewing totals
  - Individual spending currency for each entry
- **Live Exchange Rates**: Automatic fetching of current exchange rates from external API
- **Localized Formatting**: Date and currency formats adapt to selected settings
- **Independent Settings**: Language and currency can be changed independently
- **Seamless Switching**: All preferences persist across sessions

### Design & Styling

- **Material UI-Inspired Design**: Unified, professional design system inspired by Material UI
- **Custom Color Palette**: Carefully crafted color scheme with primary, secondary, and elevated states
- **SVG Icon System**: Clean, scalable vector icons loaded as React components via vite-plugin-svgr

### User Experience

- **Color-Coded Users**: Each user has a unique color for easy identification
- **Inline Editing**: Edit expenses directly in the list view with keyboard support
- **Date Display**: Human-readable date formats based on language locale
- **Dual Currency Display**: See both original and converted amounts (hover tooltip)
- **Currency Filtering**: Filter view by specific currency
- **Smart Error Handling**: Graceful handling of API failures with user feedback
- **Responsive Design**: Modern, clean interface that works on all devices
- **Mobile-Optimized**: Flex-direction adjustments, collapsible spendings list, and optimized layouts for mobile devices

## 🚀 Tech Stack

- **React 19** - Modern React with hooks
- **TypeScript** - Type-safe development
- **Vite** - Lightning-fast build tool
- **vite-plugin-svgr** - SVG imports as React components
- **Context API** - State management for language, translations, and currency
- **LocalStorage** - Client-side data persistence
- **CSS3** - Custom styling with modern CSS features (Material UI-inspired design)
- **Intl API** - Native internationalization and currency formatting
- **Currency API** - Real-time exchange rates from Vercel-hosted API

## 🎯 Usage

### Adding Users

1. Enter a user name in the "User Name" field
2. Click "Add User" or press Enter
3. Select the user from the dropdown to track their expenses

### Adding Expenses

1. Select a user from the dropdown
2. Choose the currency for this specific expense
3. Enter the amount and description
4. Click "Add Spending" or press Enter
5. The app automatically fetches exchange rates and converts to your display currency

### Managing Expenses

- **Edit**: Click the edit icon button to edit an expense, then save icon to save (or press Enter)
- **Delete**: Click the delete icon button to remove an expense
- **Filter by User**: Check "Filter by user" to see only the selected user's expenses
- **Filter by Currency**: Check "Filter by currency" to see only expenses in a specific currency
- **View Conversions**: Hover over any amount to see the converted value in your display currency
- **Expand/Collapse List**: Use the expand/collapse button to show or hide the spendings list

### Changing Settings

- **Language**: Use the language selector at the top to switch between English and Polski (Polish)
- **Display Currency**: Use the global currency selector to set your preferred viewing currency
  - All spending totals automatically convert to this currency
  - Individual spending amounts show in their original currency
- **Spending Currency**: Each expense can be added in any currency independently
- All preferences are saved automatically and persist across sessions

### Managing Data

- **Export Data**: Export both spendings and users to a JSON file for backup or transfer
- **Import Data**: Import previously exported data back into the app
  - Automatically fetches missing exchange rates upon import
  - Seamlessly restores all your spendings and users
- **Clear All Data**: Click the clear icon button in the top right to clear all local data
  - This removes all spendings, users, settings, and cached exchange rates
  - A confirmation dialog will appear before clearing
  - It may come in handy if I mess things up between commits
  - This action cannot be undone

## 📝 TODO / Future Enhancements

### High Priority

- [x] **Mixed Currency Support**: Allow each spending entry to have its own currency with automatic conversion rates ✅
- [x] **Currency Conversion**: Real-time exchange rates and automatic currency conversion in summary view ✅
- [x] **Export/Import Functionality**: Export and import data in JSON format with automatic exchange rate fetching ✅

### Medium Priority

- [ ] **Charts and Visualizations**: Add pie charts and graphs for spending analysis
- [ ] **Date Range Filtering**: Filter expenses by date range (week, month, year)
- [ ] **Search Functionality**: Search expenses by description, amount, or date
- [x] **UI Enhancements**: Improved accessibility and unified Material UI-inspired design with SVG icons ✅

### Low Priority

- [ ] **Dark Mode Theme**: Add dark/light theme toggle
- [ ] **More Languages**: Support for additional languages (Spanish, French, German, etc.)
- [ ] **More Currencies**: Support for cryptocurrency and additional fiat currencies
- [ ] **Cloud Sync**: Backend integration for data synchronization across devices
- [ ] **Mobile App**: Native mobile app version (React Native)

## 📄 License

This project is open source and available under the [MIT License](LICENSE).

## 👤 Author

ejpszemo - [@ejpszemo](https://github.com/ejpszemo)

---

**Note**: All data is stored locally in your browser using localStorage. Use the 🚫 button to clear app data, or clearing your browser data will also erase all spendings and users.
