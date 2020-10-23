import 'source-map-support/register'

import dotenv from 'dotenv';
dotenv.config();

import express from 'express';

import connectDB from './connect';
import { Customer, CustomerType } from './mongoose';

const app = express();

connectDB();
const customerModel = new Customer();

// middlewares
app.use(express.json());
app.use((err: Error, req: express.Request, res: express.Response, next: express.NextFunction) => {
  res.status(500).json({
    success: false,
    message: err.message
  })
})

// routes
//@route    POST /customers
//@desc     Create customers
app.post('/customers', async (req, res, next) => {
  try {
    if(req.body instanceof Array) {
      await customerModel.createMany(req.body)
    } else {
      await customerModel.create(req.body)
    }
  } catch (error) {
    next(error)
  }
  return res.send({success: true})
})

// @route GET


//@routes   GET /customers
//@desc     Fetch all customers
app.get('/customers', async (req, res, next) => {
  let customers: CustomerType[];
  const limit = Number(req.query.limit) || 10;
  try {
    customers = await customerModel.getAll(limit)
  } catch (error) {
    return next(error)
  }

  return res.send(customers)
  
}); 

//GET customer/search?keyword
app.get('/customers/search', async (req, res, next) => {
  let customers: CustomerType[];
  const keyword = req.query.keyword ? {
    first_name: {
      $regex: req.query.keyword as string,
      $options: 'i' //unsensitiv case caps or uncaps
    }
  } : {};
  
  try {
    customers = await customerModel.getByName(keyword)
  } catch (error) {
    return next(error)
  }

  return res.send(customers)
})


//get customer by type
app.get('/customers/type/:type', async (req, res, next) => {
  let customers: CustomerType[];
  const type = req.params.type as string;

  try {
    customers = await customerModel.getByType(type)
  } catch (error) {
    return next(error)
  }

  return res.send(customers)
})

//@route GET /customers/state/:state
app.get('/customers/state/:state', async (req, res, next)=>{
  let customers: CustomerType[]
  const state = req.params.state as string

  try {
    customers = await customerModel.getByState(state)
    console.log('Success')
  } catch (error) {
    throw error
  }

  return res.send(customers)
})

//@route GET /customers/age/:age
app.get('/customers/age/:age', async(req, res, next)=>{
  let customers: CustomerType[]
  const age = Number(req.params.age)
  try {
    customers = await customerModel.getByAges(age)
    console.log('Get Data Success!')
  } catch (error) {
    throw error
  }

  return res.send(customers)
})

app.listen(3000, () => {
  console.log('App listen to port 3000');
});
