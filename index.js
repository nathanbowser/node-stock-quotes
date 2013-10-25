var http = require('http')
  , url = require('url')
  , util = require('util')
  , request = require('request')
  , stream = require('stream')

var T = function () {
  stream.Transform.apply(this, arguments)
}

util.inherits(T, stream.Transform)

T.prototype._transform = function (chunk, encoding, next) {
  if (!this.called) {
    this.push('Name,Ticker,Price,Change,Change %\n')
    this.called = true
  }
  this.push(chunk.toString().replace(/\"/g,''))
  next()
}

var header =
http.createServer(function (req, res) {
  var u = url.parse(req.url, true)
  if (u.pathname === '/table') {
    request('http://download.finance.yahoo.com/d/quotes.csv?s=' + u.query.tickers + '&f=nsl1c6p2&e=.csv').pipe(new T).pipe(res)
  } else {
    res.writeHead(404)
    res.end('Not found')
  }
}).listen(process.env.PORT || 9000, 'localhost')
