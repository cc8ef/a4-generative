// function setup() {
//   createCanvas(800, 500);
// }

// function draw() {
//   background(220);
//   // your code here
// }

// by SamuelYAN
// modified to Grayscale & Long Duration

var seed = Math.random() * 2000;
var particles = [];
var mySize;
var parNum;
var color_vision;

function setup() {
	randomSeed(seed);
	mySize = min(windowWidth, windowHeight);
	createCanvas(windowWidth, windowHeight);
	colorMode(RGB, 255, 255, 255, 100);
	// 保持白色背景，或者你可以改成 "#f0f0f0" 稍微灰一点
	background("#000000");
	parNum = 2000;
	for (let i = 0; i < parNum; i++) {
		particles.push(new Particle(random(width),height / 2 - tan(random(1,2) * i + random(50)) * height / 30));
	}
	color_vision = random([1, 2])
}

function draw() {
	blendMode(BLEND);
	// 如果需要残影效果可以取消下面这行的注释
	// background(255, 255, 255, 5); 
	
	for (let i = particles.length - 1; i > 0; i--) {
		if (i < particles.length) {
			if (int(seed) % 2 == 0) {
				particles[i].color_vision = color_vision;
			}
			particles[i].update();
			particles[i].show();
			if (particles[i].alpha2 < 30) {
				particles[i].explode();
			}
			if (particles[i].finished()) {
				particles.splice(i, 1);
				seed = Math.random() * 1000;
				color_vision = random([1, 2, 3, 4, 5])
			}
		}
	}
}

function keyTyped() {
	if (key === "s" || key === "S") {
		saveCanvas("Grayscale_Mood_10s", "png");
	}
}

function Particle(x, y) {

	this.x = x;
	this.y = y;
	this.pos = createVector(this.x, this.y);
	this.vel = createVector(0,random(1, 0.5) * random(-1, 1));
	// 加速度稍微调小一点点，让运动更平滑，配合长时间
	this.acc = createVector(0,random(2.5, 3.5) * random(-0.025, 0.025)/random(3,1));
	this.alpha1 = int(random(100));
	this.alpha2 = 100;
	this.r = random(height / random(800,400)) * random(35, 25);
	this.particles2 = [];
	this.color1 = 0;
	this.color2 = 0;
	this.grad = 0;
	this.offset = 1*random(2.0, 1.0);
	this.color_vision = random([1,2,3,4,5]);

	this.update = function() {
		// --- 修改部分：颜色全部改为黑白灰组合 ---
		if (this.color_vision == 1) {
			// 黑 -> 白
			this.color1 = color(0, 0, 0, this.alpha1);
			this.color2 = color(255, 255, 255, this.alpha2);
		}
		if (this.color_vision == 2) {
			// 深灰 -> 浅灰
			this.color1 = color(50, 50, 50, this.alpha1);
			this.color2 = color(200, 200, 200, this.alpha2);
		}
		if (this.color_vision == 3) {
			// 中灰 -> 黑
			this.color1 = color(120, 120, 120, this.alpha1);
			this.color2 = color(20, 20, 20, this.alpha2);
		}
		if (this.color_vision == 4) {
			// 白 -> 深灰
			this.color1 = color(240, 240, 240, this.alpha1);
			this.color2 = color(80, 80, 80, this.alpha2);
		}
		if (this.color_vision == 5) {
			// 纯黑对比
			this.color1 = color(10, 10, 10, this.alpha1);
			this.color2 = color(150, 150, 150, this.alpha2);
		}
		
		this.vel.add(this.acc);
		this.pos.add(this.vel);
		
		// --- 修改部分：大大减缓透明度衰减，实现约10秒时长 ---
		// 原来是 random(1)，现在改为 0.1~0.2 左右
		this.alpha2 -= random(0.1, 0.2); 
		this.alpha1 += random(0.1, 0.2); // 增加的速度也相应减慢
		
		// 半径减小的速度也需要减慢，否则粒子还没消失就变成0了
		if (this.r > 1) {
			this.r -= 0.005; // 原来是 0.025
		}
	};

	this.show = function() {
		noStroke();
		fill(0);
		
		this.grad = drawingContext.createRadialGradient(this.pos.x + random(-this.offset, this.offset), this.pos.y + random(-this.offset, this.offset), 0,
			this.pos.x + random(-this.offset, this.offset), this.pos.y + random(-this.offset, this.offset), this.r);
		this.grad.addColorStop(0.15, this.color1);
		this.grad.addColorStop(random(0.85,1), this.color2);
		drawingContext.fillStyle = this.grad;
		rectMode(CENTER);
		rect(this.pos.x, this.pos.y, this.r/random(2,5), 4.5*random(0.1, 0.25));
	};

	this.explode = function() {
		this.particles2.push(new Particle2(this.pos.x, this.pos.y));
		for (let i = this.particles2.length - 1; i > 0; i--) {
			this.particles2[i].r = this.r / 10;
			if (this.r < 15) {
				this.r += 0.01; // 稍微减慢这里
			}
			this.particles2[i].color1 = this.color1;
			this.particles2[i].color2 = this.color2;
			this.particles2[i].alpha1 = this.alpha1/20;
			this.particles2[i].alpha2 = this.alpha2/20;
			this.particles2[i].show();
			this.particles2[i].update();

			if (this.particles2[i].finished()) {
				this.particles2.splice(i, 1);
			}
		}
	};

	this.finished = function() {
		return this.alpha2 < 10;
	};
}

function Particle2(x, y) {
	this.x = x;
	this.y = y;
	this.explode = new Particle(this.x, this.y);
	this.pos = createVector(this.x, this.y);
	this.vel = createVector(random(-0.25, 0.25),0);
	this.acc = createVector(-random(-0.025, 0.025), 0);
	this.alpha1 = 0;
	this.alpha2 = 0;
	this.r = 1;
	this.color1 = 0;
	this.color2 = 0;
	this.grad = 0;
	this.offset = 0.5;

	this.update = function() {
		this.vel.add(this.acc);
		this.pos.add(this.vel);
		
		// --- 修改部分：减缓次级粒子的变化速度 ---
		this.alpha1 += random(0.1, 0.2);
		this.alpha2 -= random(0.1, 0.2);
		this.r += 0.002; // 减缓半径增长
	}

	this.show = function() {
		noStroke();
		fill(0);
		this.grad = drawingContext.createRadialGradient(this.pos.x + random(-this.offset,this.offset), this.pos.y + random(-this.offset,this.offset), 0, 
																										this.pos.x + random(-this.offset,this.offset), this.pos.y + random(-this.offset,this.offset), this.r);
		this.grad.addColorStop(0.25, this.color1);
		this.grad.addColorStop(0.95, this.color2);
		drawingContext.fillStyle = this.grad;
		rectMode(CENTER);
		rect(this.pos.x, this.pos.y,  random(1), this.r);
	}

	this.finished = function() {
		return this.alpha2 < 2;
	};
}