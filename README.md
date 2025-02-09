# 📚 Cozy Library - Personal Library Organizer

A minimalist and aesthetically pleasing web application to organize your personal library, track reading progress, and manage your book collection. Built with vanilla JavaScript and Tailwind CSS.

## ✨ Features

- **Book Search**: Search books using the Open Library API
- **Reading Progress**: Track your reading progress for each book
- **Organize Books**: Manage books across different shelves
  - 📖 Reading Now
  - 🌟 Want to Read
  - ✅ Completed
- **Persistent Storage**: All data saved locally in your browser
- **Responsive Design**: Works on desktop and mobile devices

## 🚀 Quick Start

1. **Clone the repository**
```bash
git clone https://github.com/yourusername/cozy-library.git
cd cozy-library
```

2. **Project Structure**
```
cozy-library/
├── index.html
├── css/
│   └── style.css
├── js/
│   ├── main.js
│   ├── api.js
│   ├── storage.js
│   └── ui.js
└── assets/
    └── book-placeholder.png
```

3. **Start the application**
You can use any local server. Here are some options:

Using Python:
```bash
python -m http.server 3000
```

Using Node.js:
```bash
npx live-server
```

Using VS Code:
- Install "Live Server" extension
- Right-click on index.html
- Select "Open with Live Server"

4. **Open in browser**
- Navigate to `http://localhost:3000` (or the port shown in your terminal)

## 🛠️ Technologies Used

- **HTML5**: Structure and semantics
- **Tailwind CSS**: Styling and responsive design
- **JavaScript (ES6+)**: Core functionality
  - Modules for organized code
  - Local Storage for data persistence
  - Fetch API for external requests
- **Open Library API**: Book data and cover images

## 📱 Features Breakdown

### Book Management
- Search and add books from Open Library
- Remove books from your library
- Move books between shelves
- Track reading progress

### UI/UX Features
- Clean, minimalist design
- Smooth animations and transitions
- Responsive layout for all devices
- Loading states and error handling
- Toast notifications for actions

### Data Persistence
- All data saved in browser's Local Storage
- No account required
- Works offline after initial load

## 🔧 Configuration

No API keys or additional configuration required! The application uses the Open Library API which is free and open for public use.

## 💡 Usage Tips

1. **Adding Books**
   - Click "Add Book ✨" button
   - Search by title or author
   - Select book from results
   - Choose shelf and confirm

2. **Track Progress**
   - Click on the progress bar to update
   - Progress is saved automatically
   - Mark books as complete when finished

3. **Managing Books**
   - Use the ✕ button to remove books
   - Click shelf buttons to move books
   - Progress is preserved when moving books

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- [Open Library](https://openlibrary.org/) for their excellent API
- [Tailwind CSS](https://tailwindcss.com/) for the utility-first CSS framework
- Book lovers everywhere for inspiration

---

Made with ❤️ by Ramneek Singh
