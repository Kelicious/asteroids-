function Asteroid(pos, vel) {
  this.vel = vel;
  this.pos = pos;
  this.r = 10;
}

function Game(ctx) {
  this.ctx = ctx;
  this.asteroids = [];
  for(var i = 0; i < 10; i++) {
    this.asteroids.push(Asteroid.randomAsteroid());
  }

  this.draw = function() {
    this.ctx.clearRect(0, 0, 600, 600);
    for (var i = 0, len = this.asteroids.length; i < len; ++i) {
      this.asteroids[i].draw(ctx);
    }
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

Asteroid.prototype.draw = function(ctx) {
  ctx.beginPath();
  ctx.arc(this.pos.x, this.pos.y, this.r, 0, Math.PI * 2, true);
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
};


Game.prototype.start = function() {
  var that = this;
  setInterval(function() {
    that.update();
    that.draw();
  }, 32);
};