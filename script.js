// DOM Elements
document.addEventListener('DOMContentLoaded', function() {
    // Welcome Page Elements
    const welcomePage = document.getElementById('welcome');
    const enterBtn = document.querySelector('.enter-btn');
    const mainContent = document.querySelector('.main-content');
    const welcomeMessages = document.querySelector('.welcome-messages');
    const messages = document.querySelectorAll('.welcome-message');
    const animatedBg = document.querySelector('.animated-bg');

    // Navigation Elements
    const navLinks = document.querySelectorAll('.nav-link');
    const hamburger = document.querySelector('.hamburger');
    const navMenu = document.querySelector('.nav-links');
    const sections = document.querySelectorAll('.section');

    // To-Do List Elements
    const taskInput = document.getElementById('task-input');
    const addTaskBtn = document.getElementById('add-task');
    const taskList = document.getElementById('task-list');

    // Date Scheduler Elements
    const prevMonthBtn = document.getElementById('prev-month');
    const nextMonthBtn = document.getElementById('next-month');
    const monthYearDisplay = document.getElementById('month-year');
    const calendarDays = document.getElementById('calendar-days');
    const eventTitleInput = document.getElementById('event-title');
    const saveEventBtn = document.getElementById('save-event');
    const eventsList = document.getElementById('events');

    // Quote Generator Elements
    const quoteText = document.getElementById('quote-text');
    const quoteAuthor = document.getElementById('quote-author');

    // Global Variables
    let currentDate = new Date();
    let selectedDate = null;
    let tasks = JSON.parse(localStorage.getItem('tasks')) || [];
    let events = JSON.parse(localStorage.getItem('events')) || [];
    let displayedQuotes = [];

    // Romantic Quotes Array
    const romanticQuotes = [
        { text: "I saw that you were perfect, and so I loved you. Then I saw that you were not perfect and I loved you even more.", author: "Angelita Lim" },
        { text: "You know you're in love when you can't fall asleep because reality is finally better than your dreams.", author: "Dr. Seuss" },
        { text: "Love is that condition in which the happiness of another person is essential to your own.", author: "Robert A. Heinlein" },
        { text: "The best love is the kind that awakens the soul; that makes us reach for more, that plants the fire in our hearts and brings peace to our minds.", author: "Nicholas Sparks" },
        { text: "I look at you and see the rest of my life in front of my eyes.", author: "Unknown" },
        { text: "If I know what love is, it is because of you.", author: "Hermann Hesse" },
        { text: "I fell in love with her courage, her sincerity, and her flaming self respect. And it's these things I'd believe in, even if the whole world indulged in wild suspicions that she wasn't all she should be.", author: "F. Scott Fitzgerald" },
        { text: "I love you not because of who you are, but because of who I am when I am with you.", author: "Roy Croft" },
        { text: "If I had a flower for every time I thought of you... I could walk through my garden forever.", author: "Alfred Tennyson" },
        { text: "Take my hand, take my whole life too. For I can't help falling in love with you.", author: "Elvis Presley" },
        { text: "If you live to be a hundred, I want to live to be a hundred minus one day so I never have to live without you.", author: "A. A. Milne" },
        { text: "You are the finest, loveliest, tenderest, and most beautiful person I have ever known—and even that is an understatement.", author: "F. Scott Fitzgerald" }
    ];

    // ===== WELCOME PAGE FUNCTIONALITY =====
    // Cycle through welcome messages
    let currentMessageIndex = 0;
    
    function cycleWelcomeMessages() {
        messages.forEach((message, index) => {
            message.classList.remove('active');
            if (index === currentMessageIndex) {
                message.classList.add('active');
            }
        });
        
        currentMessageIndex = (currentMessageIndex + 1) % messages.length;
    }
    
    // Initialize first message
    cycleWelcomeMessages();
    
    // Set interval to cycle messages
    setInterval(cycleWelcomeMessages, 3000);
    
    // Enter button click event
    enterBtn.addEventListener('click', function() {
        welcomePage.style.opacity = '0';
        setTimeout(() => {
            welcomePage.classList.add('hidden');
            mainContent.classList.remove('hidden');
            setTimeout(() => {
                mainContent.style.opacity = '1';
                // Create particles for main content
                createMainContentParticles();
            }, 50);
        }, 500);
    });

    // ===== NAVIGATION FUNCTIONALITY =====
    // Mobile menu toggle
    hamburger.addEventListener('click', function() {
        hamburger.classList.toggle('active');
        navMenu.classList.toggle('active');
    });

    // Close mobile menu when a link is clicked
    navLinks.forEach(link => {
        link.addEventListener('click', function() {
            hamburger.classList.remove('active');
            navMenu.classList.remove('active');
        });
    });

    // Highlight active section on scroll
    window.addEventListener('scroll', function() {
        let current = '';
        
        sections.forEach(section => {
            const sectionTop = section.offsetTop - 100;
            const sectionHeight = section.clientHeight;
            if (pageYOffset >= sectionTop) {
                current = section.getAttribute('id');
            }
        });

        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href').substring(1) === current) {
                link.classList.add('active');
            }
        });
    });

    // ===== TO-DO LIST FUNCTIONALITY =====
    // Render tasks from localStorage
    function renderTasks() {
        taskList.innerHTML = '';
        tasks.forEach((task, index) => {
            const taskItem = document.createElement('li');
            taskItem.classList.add('task-item');
            if (task.completed) {
                taskItem.classList.add('completed');
            }

            taskItem.innerHTML = `
                <span class="task-text">${task.text}</span>
                <div class="task-actions">
                    <button class="complete-btn" data-index="${index}">✓</button>
                    <button class="edit-btn" data-index="${index}">✎</button>
                    <button class="delete-btn" data-index="${index}">✕</button>
                </div>
            `;

            taskList.appendChild(taskItem);
        });

        // Add event listeners to task buttons
        document.querySelectorAll('.complete-btn').forEach(btn => {
            btn.addEventListener('click', completeTask);
        });

        document.querySelectorAll('.edit-btn').forEach(btn => {
            btn.addEventListener('click', editTask);
        });

        document.querySelectorAll('.delete-btn').forEach(btn => {
            btn.addEventListener('click', deleteTask);
        });

        // Save to localStorage
        localStorage.setItem('tasks', JSON.stringify(tasks));
    }

    // Add new task
    function addTask() {
        const taskText = taskInput.value.trim();
        if (taskText) {
            tasks.push({
                text: taskText,
                completed: false
            });
            taskInput.value = '';
            renderTasks();
        }
    }

    // Complete task
    function completeTask(e) {
        const index = e.target.dataset.index;
        tasks[index].completed = !tasks[index].completed;
        renderTasks();
    }

    // Edit task
    function editTask(e) {
        const index = e.target.dataset.index;
        const newText = prompt('Edit task:', tasks[index].text);
        if (newText !== null && newText.trim() !== '') {
            tasks[index].text = newText.trim();
            renderTasks();
        }
    }

    // Delete task
    function deleteTask(e) {
        const index = e.target.dataset.index;
        tasks.splice(index, 1);
        renderTasks();
    }

    // Event listeners for to-do list
    addTaskBtn.addEventListener('click', addTask);
    taskInput.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            addTask();
        }
    });

    // ===== DATE SCHEDULER FUNCTIONALITY =====
    // Generate calendar
    function generateCalendar() {
        const year = currentDate.getFullYear();
        const month = currentDate.getMonth();
        
        // Update month and year display
        const monthNames = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
        monthYearDisplay.textContent = `${monthNames[month]} ${year}`;
        
        // Clear calendar days
        calendarDays.innerHTML = '';
        
        // Get first day of month and total days in month
        const firstDay = new Date(year, month, 1).getDay();
        const daysInMonth = new Date(year, month + 1, 0).getDate();
        
        // Add empty cells for days before first day of month
        for (let i = 0; i < firstDay; i++) {
            const emptyDay = document.createElement('div');
            calendarDays.appendChild(emptyDay);
        }
        
        // Add days of the month
        for (let day = 1; day <= daysInMonth; day++) {
            const dayElement = document.createElement('div');
            dayElement.classList.add('calendar-day');
            dayElement.textContent = day;
            
            // Check if this day has events
            const dateString = `${year}-${month + 1}-${day}`;
            if (events.some(event => event.date === dateString)) {
                dayElement.classList.add('has-event');
            }
            
            // Check if this is the selected date
            if (selectedDate && selectedDate.getDate() === day && 
                selectedDate.getMonth() === month && 
                selectedDate.getFullYear() === year) {
                dayElement.classList.add('selected');
            }
            
            // Add click event to select date
            dayElement.addEventListener('click', function() {
                // Remove selected class from all days
                document.querySelectorAll('.calendar-day').forEach(day => {
                    day.classList.remove('selected');
                });
                
                // Add selected class to clicked day
                dayElement.classList.add('selected');
                
                // Update selected date
                selectedDate = new Date(year, month, day);
                
                // Update events list for selected date
                renderEvents();
            });
            
            calendarDays.appendChild(dayElement);
        }
    }

    // Render events for selected date
    function renderEvents() {
        if (!selectedDate) return;
        
        // Clear events list
        eventsList.innerHTML = '';
        
        // Format selected date as string
        const dateString = `${selectedDate.getFullYear()}-${selectedDate.getMonth() + 1}-${selectedDate.getDate()}`;
        
        // Filter events for selected date
        const dateEvents = events.filter(event => event.date === dateString);
        
        // Add events to list
        dateEvents.forEach((event, index) => {
            const eventItem = document.createElement('li');
            eventItem.classList.add('event-item');
            
            eventItem.innerHTML = `
                <div>
                    <div>${event.title}</div>
                    <div class="event-date">${formatDate(selectedDate)}</div>
                </div>
                <button class="delete-event" data-index="${index}" data-date="${dateString}">✕</button>
            `;
            
            eventsList.appendChild(eventItem);
        });
        
        // Add event listeners to delete buttons
        document.querySelectorAll('.delete-event').forEach(btn => {
            btn.addEventListener('click', deleteEvent);
        });
    }

    // Format date as string
    function formatDate(date) {
        const options = { weekday: 'short', month: 'short', day: 'numeric' };
        return date.toLocaleDateString('en-US', options);
    }

    // Save event
    function saveEvent() {
        if (!selectedDate) {
            alert('Please select a date first');
            return;
        }
        
        const eventTitle = eventTitleInput.value.trim();
        if (!eventTitle) {
            alert('Please enter an event title');
            return;
        }
        
        // Format date as string
        const dateString = `${selectedDate.getFullYear()}-${selectedDate.getMonth() + 1}-${selectedDate.getDate()}`;
        
        // Add event to events array
        events.push({
            date: dateString,
            title: eventTitle
        });
        
        // Clear input
        eventTitleInput.value = '';
        
        // Save to localStorage
        localStorage.setItem('events', JSON.stringify(events));
        
        // Update calendar and events list
        generateCalendar();
        renderEvents();
    }

    // Delete event
    function deleteEvent(e) {
        const index = parseInt(e.target.dataset.index);
        const dateString = e.target.dataset.date;
        
        // Filter events for selected date
        const dateEvents = events.filter(event => event.date === dateString);
        
        // Remove event from events array
        events = events.filter(event => !(event.date === dateString && event.title === dateEvents[index].title));
        
        // Save to localStorage
        localStorage.setItem('events', JSON.stringify(events));
        
        // Update calendar and events list
        generateCalendar();
        renderEvents();
    }

    // Event listeners for calendar navigation
    prevMonthBtn.addEventListener('click', function() {
        currentDate.setMonth(currentDate.getMonth() - 1);
        generateCalendar();
    });
    
    nextMonthBtn.addEventListener('click', function() {
        currentDate.setMonth(currentDate.getMonth() + 1);
        generateCalendar();
    });
    
    // Event listener for save event button
    saveEventBtn.addEventListener('click', saveEvent);
    eventTitleInput.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            saveEvent();
        }
    });

    // ===== QUOTE GENERATOR FUNCTIONALITY =====
    // Display a random quote
    function displayRandomQuote() {
        // Fade out current quote
        quoteText.classList.add('fade-out');
        quoteAuthor.classList.add('fade-out');
        
        setTimeout(() => {
            // Get a random quote that hasn't been displayed yet
            let availableQuotes = romanticQuotes.filter(quote => !displayedQuotes.includes(quote));
            
            // If all quotes have been displayed, reset the displayed quotes array
            if (availableQuotes.length === 0) {
                displayedQuotes = [];
                availableQuotes = romanticQuotes;
            }
            
            // Select a random quote from available quotes
            const randomIndex = Math.floor(Math.random() * availableQuotes.length);
            const randomQuote = availableQuotes[randomIndex];
            
            // Add quote to displayed quotes array
            displayedQuotes.push(randomQuote);
            
            // Update quote text and author
            quoteText.textContent = randomQuote.text;
            quoteAuthor.textContent = `— ${randomQuote.author}`;
            
            // Fade in new quote
            quoteText.classList.remove('fade-out');
            quoteAuthor.classList.remove('fade-out');
        }, 500);
    }

    // Display initial quote and set interval for quote rotation
    displayRandomQuote();
    setInterval(displayRandomQuote, 10000); // Change quote every 10 seconds

    // ===== CURSOR ANIMATION FUNCTIONALITY =====
    // Create cursor elements
    const cursor = document.createElement('div');
    cursor.classList.add('cursor');
    document.body.appendChild(cursor);
    
    const cursorTrail = document.createElement('div');
    cursorTrail.classList.add('cursor-trail');
    document.body.appendChild(cursorTrail);
    
    // Create multiple trail elements for enhanced effect
    const trailCount = 5;
    const trailElements = [];
    
    for (let i = 0; i < trailCount; i++) {
        const trail = document.createElement('div');
        trail.classList.add('cursor-trail');
        trail.style.opacity = 1 - (i * 0.15);
        trail.style.width = 40 - (i * 5) + 'px';
        trail.style.height = 40 - (i * 5) + 'px';
        document.body.appendChild(trail);
        trailElements.push(trail);
    }
    
    // Store mouse position history
    const mouseHistory = [];
    const historySize = 10;
    
    // Update cursor position on mouse move
    document.addEventListener('mousemove', (e) => {
        // Add current position to history
        mouseHistory.unshift({ x: e.clientX, y: e.clientY });
        
        // Limit history size
        if (mouseHistory.length > historySize) {
            mouseHistory.pop();
        }
        
        // Update main cursor
        cursor.style.left = e.clientX + 'px';
        cursor.style.top = e.clientY + 'px';
        
        // Update trail elements with positions from history
        trailElements.forEach((trail, index) => {
            const historyIndex = Math.min(index + 1, mouseHistory.length - 1);
            if (mouseHistory[historyIndex]) {
                setTimeout(() => {
                    trail.style.left = mouseHistory[historyIndex].x + 'px';
                    trail.style.top = mouseHistory[historyIndex].y + 'px';
                }, index * 40);
            }
        });
        
        // Update original trail with slight delay
        setTimeout(() => {
            cursorTrail.style.left = e.clientX + 'px';
            cursorTrail.style.top = e.clientY + 'px';
        }, 50);
    });
    
    // Add active class to cursor when clicking
    document.addEventListener('mousedown', () => {
        cursor.classList.add('clicking');
        trailElements.forEach(trail => {
            trail.classList.add('clicking');
        });
    });
    
    document.addEventListener('mouseup', () => {
        cursor.classList.remove('clicking');
        trailElements.forEach(trail => {
            trail.classList.remove('clicking');
        });
    });
    
    // Add hover effect when hovering over clickable elements
    const clickableElements = document.querySelectorAll('button, a, .task-item, .calendar-day, .event-item');
    
    clickableElements.forEach(element => {
        element.addEventListener('mouseenter', () => {
            cursor.classList.add('hover');
            trailElements.forEach(trail => {
                trail.classList.add('hover');
            });
        });
        
        element.addEventListener('mouseleave', () => {
            cursor.classList.remove('hover');
            trailElements.forEach(trail => {
                trail.classList.remove('hover');
            });
        });
    });
    
    // Animated background particles
    function createParticles() {
        const particleCount = 50;
        
        for (let i = 0; i < particleCount; i++) {
            const particle = document.createElement('div');
            particle.classList.add('particle');
            
            // Random position
            const posX = Math.random() * 100;
            const posY = Math.random() * 100;
            
            // Random size
            const size = Math.random() * 10 + 5;
            
            // Random animation duration
            const duration = Math.random() * 20 + 10;
            
            // Set styles
            particle.style.left = posX + '%';
            particle.style.top = posY + '%';
            particle.style.width = size + 'px';
            particle.style.height = size + 'px';
            particle.style.animationDuration = duration + 's';
            
            // Add to animated background
            animatedBg.appendChild(particle);
        }
    }
    
    // Create particles for animated background
createParticles();

// Create particles for main content
function createMainContentParticles() {
    const particleCount = 25;
    const colors = ['#FF6B9D', '#9D4EDD', '#F2CC8F', '#6BB9FF'];
    
    // Create particles continuously
    setInterval(() => {
        const particle = document.createElement('div');
        particle.classList.add('main-content-particle');
        
        // Random starting position (bottom of screen)
        const posX = Math.random() * 100;
        const size = Math.random() * 6 + 2;
        const color = colors[Math.floor(Math.random() * colors.length)];
        const opacity = Math.random() * 0.4 + 0.2;
        
        // Set styles
        particle.style.left = posX + '%';
        particle.style.bottom = '-10px';
        particle.style.width = size + 'px';
        particle.style.height = size + 'px';
        particle.style.backgroundColor = color;
        particle.style.opacity = opacity;
        particle.style.boxShadow = `0 0 ${size * 2}px ${color}`;
        
        // Add to body for full screen effect
        document.body.appendChild(particle);
        
        // Remove particle after animation completes
        setTimeout(() => {
            if (particle.parentNode) {
                particle.parentNode.removeChild(particle);
            }
        }, 8000);
        
    }, 300); // Create new particle every 300ms
    
    // Create some static floating elements
    for (let i = 0; i < 15; i++) {
        const floater = document.createElement('div');
        floater.style.position = 'fixed';
        floater.style.borderRadius = '50%';
        floater.style.pointerEvents = 'none';
        floater.style.zIndex = '0';
        
        const size = Math.random() * 4 + 1;
        const posX = Math.random() * 100;
        const posY = Math.random() * 100;
        const color = colors[Math.floor(Math.random() * colors.length)];
        
        floater.style.left = posX + '%';
        floater.style.top = posY + '%';
        floater.style.width = size + 'px';
        floater.style.height = size + 'px';
        floater.style.backgroundColor = color;
        floater.style.opacity = '0.3';
        floater.style.animation = `floatingOrbs ${8 + Math.random() * 4}s ease-in-out infinite`;
        floater.style.animationDelay = Math.random() * 2 + 's';
        
        document.body.appendChild(floater);
    }
}

    // ===== INITIALIZE COMPONENTS =====
    // Render initial tasks
    renderTasks();
    
    // Generate initial calendar
    generateCalendar();
    
    // Add particles to main content when it becomes visible
    enterBtn.addEventListener('click', () => {
        setTimeout(createMainContentParticles, 500);
    });
});
