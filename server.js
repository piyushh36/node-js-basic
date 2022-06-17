//creating a server
const express = require('express');
const bodyParser = require("body-parser");
const app = express();
const PORT = 3000;
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
const fs = require('fs');
const path = require('path');
var data = require('./data.json');
if(data.length)



app.get('/', function (req, res) {
  res.send('Hello Shivani!');
});

app.get('/users', (req, res) => {
  let {data} = JSON.parse(loadData())

  if(data.length === 0) {
    res.status(404).send('Not Found');
  }

  res.send({
    status: 200,
    data: data
  })
});

app.get('/user/:id', (req, res) => {
  let {data} = JSON.parse(loadData())
  const {id} = req.params;
  const filterData = data.filter(val => val.id === Number(id))


  if(filterData.length === 0) {
    res.status(404).send('Data Not Found');
  }

  res.send({
    status: 200,
    data: filterData
  })

})

app.delete('/user/:id', (req, res) => {
  const {id} = req.params;
  data = data.filter(val => val.id != Number(id))

  res.send({
    status: 200,
    data: data
  })
})

app.post('/user', (req, res) => {
  let {data} = JSON.parse(loadData())

  const payload = req.body

  if (payload.id === '' || payload.name === '') {
    res.status(400).send('Data invalid');
  }
  if (data.length > 0) {
    const checkExisting = data.find(val => val.id === Number(payload.id))
    if(checkExisting) {
      res.status(400).send('Data already exists');
    } else {
      data.push(payload);
      storeData(data)
      res.send({
        status: 200,
        data: data
      })
    }
  } else {
    data.push(payload);
    storeData(data)
    res.send({
      status: 200,
      data: data
    })
  
  }
 
  
})

app.put('/user/:id', (req, res) => {
  const {id} = req.params
  const payload = req.body

  if (payload.name === '') {
    res.status(400).send('Data invalid');
  }

  data.map(val => {
    if(val.id === Number(id)) {
      val.name = payload.name
    }
  })
  res.send({
    status: 200,
    data: data
  })
  
})


app.listen(PORT, function () {
  console.log(`app listening on port ${PORT}!`);
});


const storeData = (data) => {
  try {
    const path = './data.json'
    if(data.length > 0) {
      const writeData = {
        "data": data
      }
      fs.writeFileSync(path, JSON.stringify(writeData))
    }
   
  } catch (err) {
    console.error(err)
  }
}

const loadData = () => {
  try {
    return fs.readFileSync('./data.json', 'utf8')
  } catch (err) {
    console.error(err)
    return false
  }
}

