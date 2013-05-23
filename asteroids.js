function Asteroid(pos, vel) {
  this.vel = vel;
  this.pos = pos;
  this.r = 10;
}

function Game(ctx) {
  this.ctx = ctx;
  this.asteroids = [];
  for(var i = 0; i < 50; i++) {
    this.asteroids.push(Asteroid.randomAsteroid());
  }
  this.ship = new Ship({x: 300, y: 300}, this);

  this.draw = function() {
    this.ctx.clearRect(0, 0, 600, 600);
    for (var i = 0, len = this.asteroids.length; i < len; ++i) {
      this.asteroids[i].draw(this.ctx);
    }
    this.ship.draw(this.ctx);
  };
}

Asteroid.randomAsteroid = function() {
  var x = Math.floor(Math.random()*600);
  var y = Math.floor(Math.random()*600);
  var dx = randomNum(-10,10);
  var dy = randomNum(-10,10);
  return new Asteroid({ x: x, y: y }, {dx: dx, dy: dy});
};

var randomNum = function(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
};

var distance_squared = function(pos1, pos2) {
  var dx = pos1.x - pos2.x
  var dy = pos1.y - pos2.y

  return dx * dx + dy * dy;
};

Asteroid.prototype.draw = function(ctx) {
  ctx.beginPath();
  ctx.arc(this.pos.x, this.pos.y, this.r, 0, Math.PI * 2, true);
  ctx.fillStyle = "black";
  ctx.fill();
};

Asteroid.prototype.update = function() {
  this.pos.x += this.vel.dx;
  this.pos.y += this.vel.dy;
};

Game.prototype.update = function() {
  for (var i = 0; i < this.asteroids.length; ++i) {
    var ast = this.asteroids[i];
    ast.update();
    if ((ast.pos.x > 600 || ast.pos.x < 0) ||
    (ast.pos.y > 600 || ast.pos.y < 0)) {
      this.asteroids.splice(i--, 1);
    }
  }

  if (this.ship.isHit()) {
    alert("Game over");
    clearInterval(this.interval);
  }
};

Game.prototype.start = function() {
  var that = this;
  this.interval = setInterval(function() {
    that.update();
    that.draw();
  }, 32);
};

function Ship(pos, game) {
  this.pos = pos;
  this.r = 10;
  this.game = game;
}

Ship.prototype.draw = function(ctx) {
  ctx.beginPath();
  ctx.arc(this.pos.x, this.pos.y, this.r, 0, Math.PI*2,true);
  ctx.fillStyle = "red";
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