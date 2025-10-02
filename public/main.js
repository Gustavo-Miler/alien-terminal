document.addEventListener('DOMContentLoaded', function () {
    // --- LÓGICA DO CANVAS (sem alterações) ---
    const canvas = document.getElementById('starfield');
    const ctx = canvas.getContext('2d');
    function resizeCanvas() { canvas.width = window.innerWidth; canvas.height = window.innerHeight; }
    window.addEventListener('resize', resizeCanvas); resizeCanvas();
    const numStars = 200; const stars = [];
    for (let i = 0; i < numStars; i++) { stars.push({ x: Math.random() * canvas.width, y: Math.random() * canvas.height, size: Math.random() * 1.5, speed: Math.random() * 0.3 + 0.1 }); }
    function drawStars() {
        ctx.clearRect(0, 0, canvas.width, canvas.height); ctx.fillStyle = '#0f0';
        stars.forEach(star => {
            ctx.beginPath(); ctx.arc(star.x, star.y, star.size, 0, Math.PI * 2); ctx.fill();
            star.y += star.speed;
            if (star.y > canvas.height) { star.y = 0; star.x = Math.random() * canvas.width; }
        });
    }
    function animate() { drawStars(); requestAnimationFrame(animate); }
    animate();

    // --- LÓGICA DO FIREBASE ---
    const firebaseConfig = {
        apiKey: "AIzaSyDWQydohtIvlVZq0sNoXgNEhob8D4TwZBA",
        authDomain: "alien-terminal.firebaseapp.com",
        projectId: "alien-terminal",
        storageBucket: "alien-terminal.firebasestorage.app",
        messagingSenderId: "484368179427",
        appId: "1:484368179427:web:f19d379b634d0bcd7025d6",
        measurementId: "G-XHLNKZC48J",
    };
    firebase.initializeApp(firebaseConfig);
    
    const database = firebase.database();
    const alertsRef = database.ref("alertas");
    const alertsContainer = document.getElementById("alertsContainer");

    alertsRef.on("child_added", (snapshot) => {
        const newAlert = snapshot.val();
        if (!newAlert || !newAlert.texto) return;

        const alertColor = newAlert.cor || '#0f0';
        
        const alertWrapper = document.createElement('div');
        alertWrapper.style.marginBottom = '0.5em';

        const textElement = document.createElement('p');
        textElement.style.margin = '0';
        textElement.style.color = alertColor;
        textElement.style.textShadow = `0 0 7px ${alertColor}`;
        
        const typedTarget = document.createElement('span');
        const typedId = `alert-${snapshot.key}`;
        typedTarget.id = typedId;
        textElement.appendChild(typedTarget);
        
        alertWrapper.appendChild(textElement);

        if (newAlert.imagemURL) {
            const imgElement = document.createElement('img');
            imgElement.src = newAlert.imagemURL;
            imgElement.className = 'terminal-image';
            imgElement.style.borderColor = alertColor;
            imgElement.style.setProperty('--image-glow-color', alertColor);
            alertWrapper.appendChild(imgElement);
        }

        alertsContainer.prepend(alertWrapper);

        new Typed(`#${typedId}`, {
            strings: [`> ${newAlert.texto}`],
            typeSpeed: 20,
            cursorChar: '█',
            onComplete: (self) => self.cursor.remove(),
        });
    });
});