class ReadingSessionTracker {
    constructor() {
        this.isRunning = false;
        this.startTime = null;
        this.timerInterval = null;
        this.sessions = this.loadSessions();
        this.currentSession = null;
        
        this.initializeElements();
        this.initializeEventListeners();
        this.updateChart();
        this.updateStats();
    }

    initializeElements() {
        this.timerElement = document.getElementById('timer');
        this.sessionInfoElement = document.getElementById('sessionInfo');
        this.startStopBtn = document.getElementById('startStopBtn');
        this.btnText = document.getElementById('btnText');
        this.resetBtn = document.getElementById('resetBtn');
        this.chartCanvas = document.getElementById('readingChart');
        this.totalSessionsElement = document.getElementById('totalSessions');
        this.totalTimeElement = document.getElementById('totalTime');
        this.avgSessionElement = document.getElementById('avgSession');
    }

    initializeEventListeners() {
        this.startStopBtn.addEventListener('click', () => this.toggleSession());
        this.resetBtn.addEventListener('click', () => this.resetAllData());
    }

    toggleSession() {
        if (this.isRunning) {
            this.stopSession();
        } else {
            this.startSession();
        }
    }

    startSession() {
        this.isRunning = true;
        this.startTime = new Date();
        this.currentSession = {
            startTime: this.startTime,
            page: this.getCurrentPage()
        };
        
        this.btnText.textContent = 'Stop Reading';
        this.startStopBtn.classList.add('active');
        this.timerElement.classList.add('active');
        this.sessionInfoElement.textContent = `Reading page ${this.currentSession.page}`;
        
        this.timerInterval = setInterval(() => {
            this.updateTimer();
        }, 1000);
    }

    stopSession() {
        if (!this.currentSession) return;
        
        this.isRunning = false;
        const endTime = new Date();
        const duration = Math.floor((endTime - this.currentSession.startTime) / 1000);
        
        // Save the session
        const sessionData = {
            page: this.currentSession.page,
            duration: duration,
            startTime: this.currentSession.startTime,
            endTime: endTime,
            date: this.currentSession.startTime.toLocaleDateString()
        };
        
        this.sessions.push(sessionData);
        this.saveSessions();
        
        // Reset UI
        this.btnText.textContent = 'Start Reading';
        this.startStopBtn.classList.remove('active');
        this.timerElement.classList.remove('active');
        this.sessionInfoElement.textContent = `Session completed: ${this.formatTime(duration)} on page ${this.currentSession.page}`;
        
        clearInterval(this.timerInterval);
        this.timerElement.textContent = '00:00:00';
        this.currentSession = null;
        
        // Update chart and stats
        this.updateChart();
        this.updateStats();
    }

    updateTimer() {
        if (!this.startTime) return;
        
        const now = new Date();
        const elapsed = Math.floor((now - this.startTime) / 1000);
        this.timerElement.textContent = this.formatTime(elapsed);
    }

    formatTime(seconds) {
        const hours = Math.floor(seconds / 3600);
        const minutes = Math.floor((seconds % 3600) / 60);
        const secs = seconds % 60;
        
        return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    }

    getCurrentPage() {
        // For now, we'll use a simple counter based on sessions
        // In a real app, you might want to manually input the page number
        const todaySessions = this.sessions.filter(session => 
            session.date === new Date().toLocaleDateString()
        );
        return todaySessions.length + 1;
    }

    loadSessions() {
        const saved = localStorage.getItem('readingSessions');
        return saved ? JSON.parse(saved) : [];
    }

    saveSessions() {
        localStorage.setItem('readingSessions', JSON.stringify(this.sessions));
    }

    resetAllData() {
        if (confirm('Are you sure you want to reset all reading session data? This cannot be undone.')) {
            this.sessions = [];
            this.saveSessions();
            this.updateChart();
            this.updateStats();
            this.sessionInfoElement.textContent = 'All data reset';
        }
    }

    updateChart() {
        // Group sessions by page
        const pageData = {};
        this.sessions.forEach(session => {
            if (!pageData[session.page]) {
                pageData[session.page] = 0;
            }
            pageData[session.page] += session.duration;
        });

        const pages = Object.keys(pageData).sort((a, b) => parseInt(a) - parseInt(b));
        const durations = pages.map(page => pageData[page]);
        const labels = pages.map(page => `Page ${page}`);

        if (this.chart) {
            // Only update data and labels
            this.chart.data.labels = labels;
            this.chart.data.datasets[0].data = durations;
            this.chart.update();
            return;
        }

        if (this.chart) {
            this.chart.destroy();
        }

        const ctx = this.chartCanvas.getContext('2d');
        this.chart = new Chart(ctx, {
            type: 'bar',
            data: {
                labels: labels,
                datasets: [{
                    label: 'Reading Time (seconds)',
                    data: durations,
                    backgroundColor: 'rgba(255, 214, 165, 0.9)',
                    borderColor: 'rgba(255, 184, 107, 1)',
                    borderWidth: 2,
                    borderRadius: 8,
                    borderSkipped: false,
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        display: false
                    },
                    tooltip: {
                        callbacks: {
                            label: function(context) {
                                const seconds = context.parsed.y;
                                const minutes = Math.floor(seconds / 60);
                                const remainingSeconds = seconds % 60;
                                return `Time: ${minutes}m ${remainingSeconds}s`;
                            }
                        }
                    }
                },
                scales: {
                    y: {
                        beginAtZero: true,
                        title: {
                            display: true,
                            text: 'Time (seconds)'
                        },
                        ticks: {
                            callback: function(value) {
                                const minutes = Math.floor(value / 60);
                                const seconds = value % 60;
                                return `${minutes}m ${seconds}s`;
                            }
                        }
                    },
                    x: {
                        title: {
                            display: true,
                            text: 'Page Number'
                        }
                    }
                }
            }
        });
    }

    updateStats() {
        const totalSessions = this.sessions.length;
        const totalSeconds = this.sessions.reduce((sum, session) => sum + session.duration, 0);
        const avgSeconds = totalSessions > 0 ? Math.floor(totalSeconds / totalSessions) : 0;

        this.totalSessionsElement.textContent = totalSessions;
        this.totalTimeElement.textContent = this.formatTimeForDisplay(totalSeconds);
        this.avgSessionElement.textContent = this.formatTimeForDisplay(avgSeconds);
    }

    formatTimeForDisplay(seconds) {
        const hours = Math.floor(seconds / 3600);
        const minutes = Math.floor((seconds % 3600) / 60);
        
        if (hours > 0) {
            return `${hours}h ${minutes}m`;
        } else {
            return `${minutes}m ${seconds % 60}s`;
        }
    }
}

// Initialize the app when the page loads
document.addEventListener('DOMContentLoaded', () => {
    new ReadingSessionTracker();
}); 