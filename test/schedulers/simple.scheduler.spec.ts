import * as sinon from 'sinon';
import * as chai from 'chai';
const sinonChai = require("sinon-chai");
chai.use(sinonChai);
const expect = chai.expect;

import { SimpleScheduler  } from '../../src/app/schedulers/simple.scheduler';

describe.only('SimpleScheduler', () => {
  let scheduler = new SimpleScheduler();

  describe('start', () => {

    it('should call begin', () => {
      let spy = sinon.spy();    
      scheduler.on('begin', spy);
      expect(spy.called).to.be.false;  
  
      scheduler.start({});    
      expect(spy.calledOnce).to.be.true;
      expect(spy.callCount).to.equal(1);
    })
  
    it('should not call end before waiting delay', (done) => {
      let spy = sinon.spy();    
      scheduler.on('end', spy);
      
      scheduler.start({
        whenToExecute: 15        
      });    
      setTimeout(() => {
        expect(spy.called).to.be.false;          
        done();
      }, 5);
    })

    it('should call end after waiting delay', (done) => {
      let spy = sinon.spy();    
      scheduler.on('end', spy);
  
      scheduler.start({
        whenToExecute: 5      
      });    
      setTimeout(() => {
        expect(spy.called).to.be.true;          
        done();
      }, 10);
    });

    it('should not call end before executing task', (done) => {
      let spy = sinon.spy();    
      scheduler.on('end', spy);
  
      scheduler.start({
        whenToExecute: 5,                
        task: () => { 
          return new Promise((resolve, reject) => {
            setTimeout(() => {
              let res = 'result';
              resolve(res);
            }, 15);
          })
        }
      });    

      setTimeout(() => {
        expect(spy.called).to.be.false;          
        done();
      }, 10);
    })

    it('should call end after executing task', (done) => {
      let spy = sinon.spy();    
      scheduler.on('end', spy);
  
      scheduler.start({
        whenToExecute: 5,                
        task: () => { 
          return new Promise((resolve, reject) => {
            setTimeout(() => {
            }, 5);
          })
        }
      });    

      setTimeout(() => {
        expect(spy.called).to.be.true;          
        done();
      }, 20);
    })

    it('should call data after taskExecution', (done) => {
      let spy = sinon.spy();    
      scheduler.on('data', spy);

      scheduler.start({
        whenToExecute: 5,                
        task: () => { 
          return new Promise((resolve, reject) => {
            setTimeout(() => {
              let res = 'result';
              resolve(res);
            }, 5);
          })
        }
      });    

      setTimeout(() => {
        expect(spy.called).to.be.true; 
        expect(spy.calledWith('result')).to.be.true;         
        done();
      }, 15);
    })
  })
})

