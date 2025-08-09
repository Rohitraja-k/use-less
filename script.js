document.addEventListener('DOMContentLoaded', () => {
    // DOM Elements
    const welcomeScreen = document.getElementById('welcome-screen');
    const gameScreen = document.getElementById('game-screen');
    const startButton = document.getElementById('start-button');
    const resetButton = document.getElementById('reset-button');
    const bubbleContainer = document.getElementById('bubble-container');
    const popTextContainer = document.getElementById('pop-text-container');
    const popCountElement = document.getElementById('pop-count');
    const floatingBubblesContainer = document.querySelector('.floating-bubbles');
    
    // Audio Elements
    const popSounds = [
        document.getElementById('pop-sound-1'),
        document.getElementById('pop-sound-2'),
        document.getElementById('pop-sound-3')
    ];
    
    // Preload audio files
    popSounds.forEach(sound => {
        sound.load();
    });
    
    // Fix for audio autoplay policy
    function unlockAudio() {
        popSounds.forEach(sound => {
            sound.play().then(() => {
                sound.pause();
                sound.currentTime = 0;
            }).catch(error => {
                console.log('Audio play failed:', error);
            });
        });
        document.removeEventListener('click', unlockAudio);
    }
    document.addEventListener('click', unlockAudio);
    
    // Game State
    let popCount = 0;
    let bubbleCount = 0;
    const maxBubbles = 100; // Prevent too many bubbles for performance
    
    // Pop Text Options
    const popTexts = ['POP!', 'BAP!', 'BOOM!', 'BANG!', 'SNAP!', 'POW!', 'BOOP!', 'SPLAT!'];
    const popColors = ['#FF6B6B', '#4ECDC4', '#FFD166', '#06D6A0', '#118AB2', '#EF476F', '#FFC43D', '#1B9AAA'];
    
    // Initialize
    createFloatingBubbles();
    
    // Event Listeners
    startButton.addEventListener('click', startGame);
    resetButton.addEventListener('click', resetGame);
    
    // Create decorative floating bubbles for welcome screen
    function createFloatingBubbles() {
        for (let i = 0; i < 20; i++) {
            const bubble = document.createElement('div');
            bubble.classList.add('floating-bubble');
            
            // Random properties
            const size = Math.random() * 60 + 20; // 20-80px
            const startPosition = Math.random() * 100; // 0-100%
            const floatDuration = Math.random() * 10 + 10; // 10-20s
            const floatDistance = (Math.random() * 200 - 100) + 'px'; // -100px to 100px
            const hue = Math.floor(Math.random() * 360);
            
            // Apply styles
            bubble.style.width = `${size}px`;
            bubble.style.height = `${size}px`;
            bubble.style.left = `${startPosition}%`;
            bubble.style.bottom = `-${size}px`;
            bubble.style.setProperty('--float-duration', `${floatDuration}s`);
            bubble.style.setProperty('--float-distance', floatDistance);
            bubble.style.backgroundColor = `hsla(${hue}, 100%, 75%, 0.6)`;
            
            floatingBubblesContainer.appendChild(bubble);
        }
    }
    
    // Start the game
    function startGame() {
        welcomeScreen.classList.remove('active');
        gameScreen.classList.add('active');
        
        // Create initial bubbles
        for (let i = 0; i < 20; i++) {
            createBubble();
        }
    }
    
    // Reset the game
    function resetGame() {
        // Clear all bubbles
        bubbleContainer.innerHTML = '';
        bubbleCount = 0;
        
        // Reset pop count
        popCount = 0;
        popCountElement.textContent = popCount;
        
        // Create new initial bubbles
        for (let i = 0; i < 20; i++) {
            createBubble();
        }
    }
    
    // Create a new bubble
    function createBubble() {
        if (bubbleCount >= maxBubbles) return;
        
        const bubble = document.createElement('div');
        bubble.classList.add('bubble');
        bubble.classList.add('bubble-appear'); // Add appearance animation class
        
        // Random properties
        const size = Math.random() * 40 + 40; // 40-80px
        const posX = Math.random() * (window.innerWidth - size);
        const posY = Math.random() * (window.innerHeight - size - 60) + 60; // Account for header
        const hue = Math.floor(Math.random() * 360);
        
        // Random movement properties
        const moveX = Math.random() * 40 - 20; // -20px to 20px
        const moveY = Math.random() * 40 - 20; // -20px to 20px
        const moveDuration = Math.random() * 3 + 4; // 4-7s for medium pace
        
        // Apply styles
        bubble.style.width = `${size}px`;
        bubble.style.height = `${size}px`;
        bubble.style.left = `${posX}px`;
        bubble.style.top = `${posY}px`;
        bubble.style.backgroundColor = `hsla(${hue}, 100%, 75%, 0.6)`;
        bubble.style.setProperty('--move-x', `${moveX}px`);
        bubble.style.setProperty('--move-y', `${moveY}px`);
        bubble.style.setProperty('--move-duration', `${moveDuration}s`);
        
        // Add event listener
        bubble.addEventListener('click', () => popBubble(bubble, posX, posY));
        
        bubbleContainer.appendChild(bubble);
        bubbleCount++;
        
        // Remove the appearance animation class after animation completes
        setTimeout(() => {
            bubble.classList.remove('bubble-appear');
        }, 500);
    }
    
    // Pop a bubble
    function popBubble(bubble, x, y) {
        // Play random pop sound
        const randomSound = popSounds[Math.floor(Math.random() * popSounds.length)];
        const soundClone = randomSound.cloneNode();
        soundClone.volume = 1.0;
        
        // Play sound with error handling
        soundClone.play().catch(error => {
            console.log('Sound play failed:', error);
        });
        
        // Show pop text
        showPopText(x, y);
        
        // Add popping animation class
        bubble.classList.add('popping');
        
        // Remove bubble after animation
        setTimeout(() => {
            bubble.remove();
            bubbleCount--;
            
            // Create two new bubbles
            createBubble();
            createBubble();
        }, 300);
        
        // Update pop count
        popCount++;
        popCountElement.textContent = popCount;
    }
    
    // Show pop text
    function showPopText(x, y) {
        const popText = document.createElement('div');
        popText.classList.add('pop-text');
        
        // Random properties
        const randomText = popTexts[Math.floor(Math.random() * popTexts.length)];
        const randomColor = popColors[Math.floor(Math.random() * popColors.length)];
        const randomRotation = Math.random() * 20 - 10; // -10 to 10 degrees
        
        // Apply styles
        popText.textContent = randomText;
        popText.style.color = randomColor;
        popText.style.left = `${x}px`;
        popText.style.top = `${y}px`;
        popText.style.transform = `rotate(${randomRotation}deg)`;
        
        popTextContainer.appendChild(popText);
        
        // Remove after animation
        setTimeout(() => {
            popText.remove();
        }, 800);
    }
    
    // Handle window resize
    window.addEventListener('resize', () => {
        // Adjust bubble positions if needed
        const bubbles = document.querySelectorAll('.bubble');
        bubbles.forEach(bubble => {
            const size = parseInt(bubble.style.width);
            const posX = Math.min(parseInt(bubble.style.left), window.innerWidth - size);
            const posY = Math.min(parseInt(bubble.style.top), window.innerHeight - size);
            
            bubble.style.left = `${posX}px`;
            bubble.style.top = `${posY}px`;
        });
    });
});