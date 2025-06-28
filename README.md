# 📚 Reading Session Visualizer

A beautiful web application to track and visualize reading sessions with your child. Perfect for monitoring reading progress and building a reading habit together.

## Features

- **Timer Tracking**: Start and stop reading sessions with a simple button click
- **Visual Charts**: Bar chart showing reading time per page using Chart.js
- **Statistics**: Track total sessions, total time, and average session duration
- **Data Persistence**: All data is saved locally in your browser
- **Responsive Design**: Works great on desktop, tablet, and mobile devices
- **Modern UI**: Clean, intuitive interface with smooth animations

## How to Use

1. **Open the App**: Simply open `index.html` in your web browser
2. **Start Reading**: Click the "Start Reading" button when you begin reading a page
3. **Stop Reading**: Click the "Stop Reading" button when you finish the page
4. **View Progress**: The bar chart will automatically update to show reading time per page
5. **Check Stats**: View your total sessions, total time, and average session duration

## How It Works

- Each time you start a session, it automatically assigns a page number (incrementing from your previous sessions)
- The timer tracks exactly how long you spend reading each page
- Data is automatically saved to your browser's local storage
- The bar chart shows the total time spent reading each page
- Statistics are calculated and updated in real-time

## File Structure

```
reading-session-visualizer/
├── index.html          # Main HTML file
├── styles.css          # CSS styles and responsive design
├── script.js           # JavaScript functionality
└── README.md           # This file
```

## Technical Details

- **Frontend**: Pure HTML, CSS, and JavaScript
- **Chart Library**: Chart.js (loaded via CDN)
- **Data Storage**: Browser localStorage
- **No Dependencies**: No build process required - just open and use!

## Customization

You can easily customize the app by:

- Changing colors in `styles.css`
- Modifying chart options in `script.js`
- Adding new features like manual page number input
- Exporting data to CSV or other formats

## Browser Compatibility

Works in all modern browsers including:
- Chrome
- Firefox
- Safari
- Edge

## Getting Started

1. Download or clone this repository
2. Open `index.html` in your web browser
3. Start tracking your reading sessions!

No installation or setup required - it's ready to use immediately.

## Future Enhancements

Potential features you could add:
- Manual page number input
- Book selection/tracking
- Reading goals and milestones
- Data export functionality
- Multiple child profiles
- Reading streak tracking

Enjoy reading with your child! 📖✨ 