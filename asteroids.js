function Asteroid(pos) {
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
    for (var i = 0, len = this.asteroids.length; i < len; ++i) {
      this.asteroids[i].draw(ctx);
    }
  };
}

Asteroid.randomAsteroid = function() {
  var x = Math.floor(Math.random()*600);
  var y = Math.floor(Math.random()*600);
  return new Asteroid([x,y]);
};

Asteroid.prototype.x = function() {
  return this.pos[0];
};

Asteroid.prototype.y = function() {
  return this.pos[1];
};

Asteroid.prototype.draw = function(ctx) {
  ctx.beginPath();
  ctx.arc(this.x(), this.y(), this.r, 0, Math.PI * 2, true);
  ctx.fill();
};
