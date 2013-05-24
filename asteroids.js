function Asteroid(pos, vel, game) {
  this.game = game;
  this.vel = vel;
  this.pos = pos;
  this.r = 10;
}

function Game(ctx) {
  this.ctx = ctx;
  this.ctx.fillStyle = 'black';
  this.ctx.fillRect(0,0,600,600);
  this.ctx.fill();
  this.asteroids = [];
  for(var i = 0; i < 10; i++) {
    this.asteroids.push(Asteroid.randomAsteroid(this));
  }
  this.ship = new Ship({x: 300, y: 300}, this);
  this.bullets = [];
}

Asteroid.randomAsteroid = function(game) {
  var x = Math.floor(Math.random()*600);
  var y = Math.floor(Math.random()*600);
  var dx = randomNum(-5,5);
  var dy = randomNum(-5,5);
  return new Asteroid({ x: x, y: y }, {dx: dx, dy: dy}, game);
};

var randomNum = function(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
};

var distance_squared = function(pos1, pos2) {
  var dx = pos1.x - pos2.x
  var dy = pos1.y - pos2.y

  return dx * dx + dy * dy;
};

var getSpeed = function(vel) {
  return Math.sqrt(vel.dx * vel.dx + vel.dy * vel.dy);
};

var getVelocity = function(dir, speed) {
  return {
    dx: dir.x * speed,
    dy: dir.y * speed
  }
};

var normalize = function(vel) {
  var speed = getSpeed(vel);
  return {
    x: vel.dx / speed,
    y: vel.dy / speed
  };
};

var rotate = function(dir, angle) {
  var theta = Math.atan2(dir.y, dir.x)
  var r = Math.sqrt(dir.x * dir.x + dir.y * dir.y);

  theta += angle;

  return {
    x: r * Math.cos(theta),
    y: r * Math.sin(theta)
  }
};

Asteroid.prototype.draw = function(ctx) {
  ctx.beginPath();
  ctx.arc(this.pos.x, this.pos.y, this.r, 0, Math.PI * 2, true);
  ctx.fillStyle = "white";
  ctx.fill();
};

Asteroid.prototype.update = function() {
  this.pos.x = (this.pos.x + this.vel.dx + 600) % 600;
  this.pos.y = (this.pos.y + this.vel.dy + 600) % 600;
};


Asteroid.prototype.isHit = function() {
  var asteroids = this.game.asteroids;
  for (var i = 0; i < asteroids.length; ++i) {
    var ast = asteroids[i];
    if (ast === this) {
      continue;
    }
    if (distance_squared(this.pos, ast.pos) < Math.pow(this.r + ast.r, 2)) {
      return true;
    }
  }

  var bullets = this.game.bullets;
  for (var i = 0; i < bullets.length; ++i) {
    var bullet = bullets[i];
    if (bullet === this) {
      continue;
    }
    if (distance_squared(this.pos, bullet.pos) < Math.pow(this.r + bullet.r, 2)) {
      return true;
    }
  }

  return false;
};



Game.prototype.draw = function() {
  this.ctx.clearRect(0, 0, 600, 600);
  for (var i = 0, len = this.asteroids.length; i < len; ++i) {
    this.asteroids[i].draw(this.ctx);
  }
  for (var i = 0, len = this.bullets.length; i < len; ++i) {
    this.bullets[i].draw(this.ctx);
  }
  this.ship.draw(this.ctx);
};

Game.prototype.update = function() {
  this.ship.update();

  for (var i = 0; i < this.asteroids.length; ++i) {
    var ast = this.asteroids[i];
    ast.update();
    // if ((ast.pos.x > 600 || ast.pos.x < 0) ||
    // (ast.pos.y > 600 || ast.pos.y < 0)) {
    //   this.asteroids.splice(i--, 1);
    // }
  }

  for (var i = 0; i < this.bullets.length; ++i) {
    var bullet = this.bullets[i];
    bullet.update();
    if ((bullet.pos.x > 600 || bullet.pos.x < 0) ||
    (bullet.pos.y > 600 || bullet.pos.y < 0)) {
      this.bullets.splice(i--, 1);
    }
  }

  if (this.ship.isHit()) {
    alert("Game over");
    clearInterval(this.interval);
  }

  var asteroids = _.reject(this.asteroids, function(asteroid){
    return asteroid.isHit();
  });

  var bullets = _.reject(this.bullets, function(bullet){
    return bullet.isHit();
  });

  this.asteroids = asteroids;
  this.bullets = bullets;
};

Game.prototype.start = function() {
  var that = this;
  // key('down', this.ship.power.bind(this.ship,{ ddx:0, ddy:1 }));
  // key('up', this.ship.power.bind(this.ship, { ddx:0, ddy:-1 }));
  // key('left', this.ship.power.bind(this.ship, { ddx:-1, ddy:0 }));
  // key('right', this.ship.power.bind(this.ship, { ddx:1, ddy:0 }));
  key('down', this.ship.powerDown.bind(this.ship));
  key('up', this.ship.powerUp.bind(this.ship));
  key('left', this.ship.turnLeft.bind(this.ship));
  key('right', this.ship.turnRight.bind(this.ship));

  key('space', this.ship.fireBullet.bind(this.ship));
  this.interval = setInterval(function() {
    that.update();
    that.draw();
  }, 32);
};

function Ship(pos, game) {
  this.pos = pos;
  this.r = 10;
  this.game = game;
  this.vel = { dx:1, dy:1 };
  this.speed = 0;
  this.turretDir = { x: 0, y: -1 };
  this.dir = { x: 0, y: -1 };
}

Ship.prototype.velocity = function() {
  return getVelocity(this.dir, this.speed);
};

Ship.prototype.draw = function(ctx) {
  //var dir = normalize(this.vel);
  var dir = this.turretDir;
  ctx.beginPath();
  ctx.arc(this.pos.x, this.pos.y, this.r, 0, Math.PI*2,true);
  ctx.fillStyle = "red";
  ctx.fill();
  ctx.beginPath();
  ctx.lineWidth = 3;
  ctx.moveTo(this.pos.x, this.pos.y);
  ctx.lineTo(this.pos.x + 2 * this.r * dir.x, this.pos.y + 2 * this.r * dir.y);
  ctx.strokeStyle = "white";
  ctx.stroke();
  ctx.beginPath();
  ctx.arc(this.pos.x, this.pos.y, this.r / 2, 0, Math.PI*2,true);
  ctx.fillStyle = "white";
  ctx.fill();
};

Ship.prototype.isHit = function() {
  var asteroids = this.game.asteroids;
  for (var i = 0; i < asteroids.length; ++i) {
    var ast = asteroids[i];
    if (distance_squared(this.pos, ast.pos) < Math.pow(this.r + ast.r, 2)) {
      return true;
    }
  }

  return false;
};

Ship.prototype.update = function() {
  this.pos.x = (this.pos.x + this.velocity().dx + 600) % 600;
  this.pos.y = (this.pos.y + this.velocity().dy + 600) % 600;
};

Ship.prototype.power = function(dir) {
  var newVelX = this.vel.dx + dir.ddx;
  var newVelY = this.vel.dy + dir.ddy;
  if (getSpeed({dx: newVelX, dy: newVelY}) < 9) {
    this.vel.dx += dir.ddx;
    this.vel.dy += dir.ddy;
  }
};

Ship.prototype.powerUp = function() {
  var vx = this.velocity().dx;
  var vy = this.velocity().dy;
  var vel = {dx: vx + this.turretDir.x, dy: vy + this.turretDir.y};
  var speed = getSpeed(vel);
  if (speed > 9) {
    speed -= 1;
  }
  this.speed = speed;
  var dir = normalize(vel);
  if (!isNaN(dir.x)) {
    this.dir = dir;
  }
};

Ship.prototype.powerDown = function() {
  if (this.speed > 0) {
    this.speed -= .5;
  }
};

Ship.prototype.turnLeft = function() {
  this.turretDir = rotate(this.turretDir, -Math.PI / 12);
};

Ship.prototype.turnRight = function() {
  this.turretDir = rotate(this.turretDir, Math.PI / 12);
};

Ship.prototype.fireBullet = function() {
  var pos = {
    x: this.pos.x,
    y: this.pos.y
  };
  return new Bullet(pos, this.turretDir, this.game);
};

function Bullet(pos, dir, game) {
  this.pos = pos;
  this.dir = dir;
  this.speed = 10;
  this.r = 2;
  this.game = game;
  this.game.bullets.push(this);
};

Bullet.prototype.vel = function() {
  return {
    dx: this.speed * this.dir.x,
    dy: this.speed * this.dir.y
  };
};

Bullet.prototype.draw = function(ctx) {
  ctx.beginPath();
  ctx.arc(this.pos.x, this.pos.y, this.r, 0, Math.PI*2,true);
  ctx.fillStyle = "yellow";
  ctx.fill();
};

Bullet.prototype.update = function() {
  this.pos.x += this.vel().dx;
  this.pos.y += this.vel().dy;
};


Bullet.prototype.isHit = function() {
  var asteroids = this.game.asteroids;
  for (var i = 0; i < asteroids.length; ++i) {
    var ast = asteroids[i];
    if (distance_squared(this.pos, ast.pos) < Math.pow(this.r + ast.r, 2)) {
      return true;
    }
  }

  return false;
}