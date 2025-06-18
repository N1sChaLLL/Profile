const canvas = document.getElementById("particle-canvas");
  const ctx = canvas.getContext("2d");

  let width = canvas.width = window.innerWidth;
  let height = canvas.height = window.innerHeight;

  let mouse = {
    x: null,
    y: null,
    radius: 100
  };

  function updateMousePosition(e) {
  let clientX = e.clientX || (e.touches && e.touches[0].clientX);
  let clientY = e.clientY || (e.touches && e.touches[0].clientY);
  mouse.x = clientX;
  mouse.y = clientY;
}

window.addEventListener("mousemove", updateMousePosition);
window.addEventListener("touchmove", updateMousePosition);

window.addEventListener("orientationchange", () => {
  setTimeout(() => {
    width = canvas.width = window.innerWidth;
    height = canvas.height = window.innerHeight;
    initParticles();
  }, 300);
});




  window.addEventListener("resize", function () {
    width = canvas.width = window.innerWidth;
    height = canvas.height = window.innerHeight;
    initParticles();
  });

  function Particle(x, y, dx, dy, size, color) {
    this.x = x;
    this.y = y;
    this.dx = dx;
    this.dy = dy;
    this.size = size;
    this.color = color;

    this.draw = () => {
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
      ctx.fillStyle = this.color;
      ctx.fill();
    };

    this.update = () => {
      // Interaction with mouse
      let dxMouse = mouse.x - this.x;
      let dyMouse = mouse.y - this.y;
      let distance = Math.sqrt(dxMouse * dxMouse + dyMouse * dyMouse);

      if (distance < mouse.radius) {
        let angle = Math.atan2(dyMouse, dxMouse);
        let force = (mouse.radius - distance) / mouse.radius;
        let forceX = Math.cos(angle) * force * -5;
        let forceY = Math.sin(angle) * force * -5;

        this.dx += forceX;
        this.dy += forceY;
      }

      // Bounce back and damping
      this.x += this.dx;
      this.y += this.dy;

      this.dx *= 0.95;
      this.dy *= 0.95;

      // Contain within canvas
      if (this.x < 0 || this.x > width) this.dx *= -1;
      if (this.y < 0 || this.y > height) this.dy *= -1;

      this.draw();
    };
  }

  const particlesArray = [];
  const particleCount = 100;

  function initParticles() {
    particlesArray.length = 0;
    for (let i = 0; i < particleCount; i++) {
      const size = Math.random() * 2 + 1;
      const x = Math.random() * width;
      const y = Math.random() * height;
      const dx = (Math.random() - 0.5) * 1;
      const dy = (Math.random() - 0.5) * 1;
      const color = "#00ffff";
      particlesArray.push(new Particle(x, y, dx, dy, size, color));
    }
  }

  function connectParticles() {
    for (let a = 0; a < particlesArray.length; a++) {
      for (let b = a + 1; b < particlesArray.length; b++) {
        const dx = particlesArray[a].x - particlesArray[b].x;
        const dy = particlesArray[a].y - particlesArray[b].y;
        const distance = dx * dx + dy * dy;

        if (distance < 9000) {
          const opacity = 1 - distance / 9000;
          ctx.beginPath();
          ctx.strokeStyle = `rgba(0,255,255,${opacity})`;
          ctx.lineWidth = 0.5;
          ctx.moveTo(particlesArray[a].x, particlesArray[a].y);
          ctx.lineTo(particlesArray[b].x, particlesArray[b].y);
          ctx.stroke();
        }
      }
    }
  }

 function animate() {
  ctx.clearRect(0, 0, width, height);
  particlesArray.forEach(p => p.update());

  // Skip connections on small screens
  if (window.innerWidth > 768) {
    connectParticles();
  }

  requestAnimationFrame(animate);
}


  initParticles();
  animate();