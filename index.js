const express = require('express');
const bodyParser = require('body-parser');
const methodOverride = require('method-override');
const pg = require('pg');

// Initialise postgres client
const configs = {
  user: 'sabrinachow',
  host: '127.0.0.1',
  database: 'pokemons',
  port: 5432,
};

const pool = new pg.Pool(configs);

pool.on('error', function (err) {
  console.log('idle client error', err.message, err.stack);
});

/**
 * ===================================
 * Configurations and set up
 * ===================================
 */

// Init express app
const app = express();

app.use(bodyParser.urlencoded({ extended: true }));
app.use(methodOverride('_method'));


// Set react-views to be the default view engine
const reactEngine = require('express-react-views').createEngine();
app.engine('jsx', reactEngine);
app.set('views', __dirname + '/views');
app.set('view engine', 'jsx');


/**
 * ===================================
 * Routes
 * ===================================
 */

app.get('/', (req, res) => {
  // query database for all pokemon

  // respond with HTML page displaying all pokemon
  const queryString = 'SELECT * from pokemon'


  pool.query(queryString, (err, result) => {
    if (err) {
      console.error('query error:', err.stack);
    } else {
      console.log('query result:', result);

      // redirect to home page
      // response.send( result.rows );
      let pokeAll = {pokemon : result.rows}
      res.render('Home',pokeAll);
      // response.render('Home', {'pokemon': {'id': '20192', 'name': 'yay'}});
      // result.rows
    }
  });

});

app.get('/pokemon/new', (req, res) => {
  // respond with HTML page with form to create new pokemon
  res.render('new');
});

app.get('/pokemon/:id', (req, res) => {
  let id = req.params.id;

  const queryString = 'SELECT * from pokemon WHERE id = ' + id;

  pool.query(queryString, (err, result) => {
    if (err) {
      console.error('query error:', err.stack);
    } else {
      // console.log('query result:', result.rows[0]);

      // redirect to home page
      // response.send( result.rows );
      let pokeAll = {pokemon : result.rows[0]}
      res.render('Pokemon',pokeAll);
    }
  });
})


app.post('/pokemons', (req, res) => {
  let params = req.body;
  console.log(params);

  const queryString = 'INSERT INTO pokemon(name, height, weight) VALUES($1, $2, $3)'
  const values = [params.name, params.height, params.weight];

  pool.query(queryString, values, (err, result) => {
    if (err) {
      console.log('query error:', err.stack);
    } else {
      console.log('query result:', result);

      // redirect to home page
      res.redirect('/');
    }
  });
});


app.get('/pokemon/:id/edit', (req, res) => {
  let id = req.params.id;

  const queryString = 'SELECT * from pokemon WHERE id = ' + id;

  pool.query(queryString, (err, result) => {
    if (err) {
      console.error('query error:', err.stack);
    } else {
      // console.log('query result:', result.rows[0]);

      // redirect to home page
      // response.send( result.rows );
      let pokeAll = {pokemon : result.rows[0]}
      res.render('Edit',pokeAll);
    }
  });
})


app.put('/pokemon/edit/:id', (req, res) => {
  console.log('params: ' + req.params.id);
  console.log(req.body);
  const queryString = 'UPDATE pokemon SET num = $1, name = $2, img = $3, height = $4, weight = $5 WHERE id = $6';
  const values = [req.body.num, req.body.name, req.body.img, req.body.height, req.body.weight, req.params.id];

  pool.query(queryString, values, (err, result) => {
    if (err) {
      console.error('query error:', err.stack);
    } else {
      console.log('query result:', result.rows[0]);





      const queryString2 = 'SELECT * from pokemon ORDER BY id ASC'


      pool.query(queryString2, (err, result) => {
        if (err) {
          console.error('query error:', err.stack);
        } else {
          console.log('query result:', result);
    
          // redirect to home page
          let pokeAll = {pokemon : result.rows}
          res.redirect('/pokemon/' + req.params.id);
        }
      });
    
    }
  });
})






app.delete('/pokemon/delete/:id', (req, res) => {
  console.log('params: ' + req.params.id);
  const queryString = 'DELETE FROM pokemon WHERE id = $1 RETURNING *';
  const values = [parseInt(req.params.id)];

  pool.query(queryString, values, (err, result) => {
    if (err) {
      console.error('query error:', err.stack);
    } else {
      // console.log('query result:', result.rows[0]);





      const queryString2 = 'SELECT * from pokemon ORDER BY id ASC'


      pool.query(queryString2, (err, result) => {
        if (err) {
          console.error('query error:', err.stack);
        } else {
          // console.log('query result:', result);
    
          // redirect to home page
          let pokeAll = {pokemon : result.rows}
          res.render('Home',pokeAll);
        }
      });
    
    }
  });
})


/**
 * ===================================
 * Listen to requests on port 3000
 * ===================================
 */
app.listen(3000, () => console.log('~~~ Tuning in to the waves of port 3000 ~~~'));
